/* global User, SafeWin, Event, MapElements, Conn, Maps, Parameters */

define(['Dom', 'Chat', 'Dates', 'Geo', 'HideForms', 'GetPositions', 'Destinations', 'DriverOffer', 'ClientOrder', 'Storage', 'ModalWindows'],
  function (Dom, Chat, Dates, Geo, HideForms, GetPositions, Destinations, clDriverOffer, clClientOrder, Storage, Modal) {
  
  var order_id, fromAddress, toAddress, fromCoords, toCoords, 
      price, name_client, photo_client, first_time = true, agIndexes,
      MyOffer, orderIds = [], global_el,
      countOrders, countFinishedOrders, countCanceledOrders,
      finish = {}, arrFinished = [];
  
  function cbAddFavorites() {
    Conn.clearCb('cbAddFavorites');
    
    var stars = Dom.selAll('[data-view="star"]');
    
    for (var i = 0; i < stars.length; i++) {
      stars[i].classList.add('active');
    }
    
    inActive(global_el);
  }
  
  function cbAddToBlackList() {
    Conn.clearCb('cbAddToBlackList');
    
    var stars = Dom.selAll('[data-view="star"]');
    
    for (var i = 0; i < stars.length; i++) {
      stars[i].classList.remove('active');
    }
    
    inActive(global_el);
  }
  
  function cbAddRating() {
    Conn.clearCb('cbAddRating');
    
    if ((countFinishedOrders + countCanceledOrders) === countOrders) {
      var type = Storage.getActiveTypeTaxi();

      if (type === "taxi") {
        type = "city";
      }
      
      MyOffer.clear();
      goToPage = '#driver_' + type;
    }
  }
  
  function cbOnFinish() {
    Conn.clearCb('cbOnFinish');
    Storage.removeActiveZones();
    Storage.removeActiveRoute();
    Storage.removeTripDriver();
    ratingOrder(finish.orderId, finish.agentId, 'driver');
  }
  
  function inActive(el) {
    el.classList.add('inactive');
    el.dataset.click = '';
  }
  
  function ratingOrder(id, agentId, role) {
    Modal.ratingOrder(id, agentId, role, function(){});
  }

  function getAgentIndexes(agent) {
    return {'flag-checkered': agent.accuracyIndex, 'block': agent.cancelIndex, 'thumbs-up': agent.delayIndex, 'clock': agent.finishIndex};
  }
  
  function parseObj(obj) {
    var content = '';
    
    for (var key in obj) {
      content += '<span><i class="icon-' + key + '"></i> ' + obj[key] + ' </span>';
    }
    
    return content;
  }

  function startOffer(response) {
    if (response.orders.length === 0) {
      stop();
      Storage.removeTripDriver();
      alert('К сожалению, заказ отменен.');
      goToPage = '#driver_city';
      
      return;
    }

    var ords = response.orders[0];
    
    if (!ords) {
      Storage.removeTripDriver();
      goToPage = '#driver_city';
    }
    
    fromAddress         = ords.fromAddress;
    fromCoords          = ords.fromLocation.split(",");
    toAddress           = ords.toAddress;
    order_id            = ords.id;
    toCoords            = ords.toLocation.split(",");
    
    MyOffer.addPointsClients(response.orders);
    
    /*
    MyOffer.fromAddress = ords.fromAddress;
    MyOffer.toAddresses = ords.toAddresses;
    MyOffer.fromCoords  = ords.fromLocation;
    MyOffer.toCoordses  = ords.toLocationes;
    MyOffer.toAddress   = ords.toAddress;
    MyOffer.toCoords    = ords.toLocation;
    MyOffer.times       = ords.toTimes;
    */
    
    render(response.orders);
    Maps.drawRoute(MyOffer, true, true, false, function(price, arrRoi){});
    addEvents();
    HideForms.init();
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
  }

  function cbGetOrdersByOffer(response) {
    var orders = response.result.orders;
    
    countOrders = orders.length;
    countFinishedOrders = 0;
    countCanceledOrders = 0;
    
    for (var i = 0; i < countOrders; i++) {
      if (orders[i].finished) {
        countFinishedOrders++;
      }
    }
    
    for (var i = 0; i < countOrders; i++) {
      if (orders[i].canceled) {
        countCanceledOrders++;
      }
    }
      
    if (!response.error || countOrders === 0) {
      if (countOrders === 0) { // Check exist order
        stop();
        Storage.removeTripDriver();
        alert('К сожалению, заказ не найден.');
        goToPage = '#driver_city';
        
        return;
      }
      
      if (first_time) { // check start render

        if (countOrders === 1 && response.result.orders[0].zone) {
          var poly = Maps.drawPoly(response.result.orders[0].zone.polygon, '#ccffff');
          
          SafeWin.polyRoute.push(poly);
          Maps.addElOnMap(poly);
        }
        
        first_time = false;
        startOffer(response.result);
      }
      
      orderIds = [];
      
      var ordersFinished = 0,
          ordersCanceled = 0,
          actionElement = Dom.sel('div[data-button="action"]');

      actionElement.innerHTML = '';
      
      for (var i = 0; i < countOrders; i++) {
        var order         = orders[i],
            agnt          = orders[i].agent,
            radius        = agnt.distance,
            lost_diff     = Dates.diffTime(order.bids[0].approved, order.travelTime),
            toLoc         = order.toLocation.split(','),
            loc           = agnt.location.split(','),
            dist          = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]),
            dr_time, but;

        orderIds[i] = order.id;

        if (!MapElements.marker_clients[i]) {
          MapElements.marker_clients[i] = Maps.addMarker(loc[0], loc[1], 'Клиент', '//maps.google.com/mapfiles/kml/shapes/man.png',  [16, 16], function(){});
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.marker_clients[i]);
        }
        
        if (order.finished) {
          if (arrFinished.indexOf(order.id) === -1) {
            finish.orderId = order.id;
            finish.agentId = agnt.id;
            arrFinished.push(order.id);

            Conn.request('finishOrder', order.id, cbOnFinish);
          }
        }
          
        if (countOrders === 1) { // Logic for ONE Client
          if (lost_diff >= 0) {
            dr_time = lost_diff;
          } else {
            dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
          }

          Dom.sel('[data-view="distance_to_car"]').innerHTML = order.agent.distance.toFixed(1);
          Dom.sel('[data-view="while_car"]').innerHTML       = dr_time;
          Dom.sel('[data-view="duration"]').innerHTML        = Dates.minToHours(order.duration);
        
          if (order.arrived && !order.inCar) {
            dr_time = 'На месте';
            lost_diff = Dates.diffTime(order.updated, 20);

            if (lost_diff < 0) {
              but = Dom.sel('div[data-order-id="' + order.id + '"]').sel('[data-click="cancel-order"]');

              if (but && but.classList.contains('button_rounded--red')) {
                but.classList.remove('button_rounded--red');
                but.classList.add('button_rounded--green');
              }
            }
          }

        }
        
        var toLoc = order.fromLocation.split(','),
            numberClient = countOrders===1 ? '' : ' ' + (i + 1);
        
        if (!order.inCar && !order.arrived && Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]) < Parameters.distanceToPoint) {
          actionElement.innerHTML = '<button data-click="driver-arrived" data-order_id="' + order.id + '" class="button_wide--green">Ожидаю клиента' + numberClient + '</button>';
        }
        
        toLoc = order.toLocation.split(',');

        if (order.inCar && order.arrived && Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]) < Parameters.distanceToPoint) {
          actionElement.innerHTML = '<button data-click="driver-came" data-agent_id="' + agnt.id + '" data-order_id="' + order.id + '" class="button_wide--green">Доставил клиента' + numberClient + '</button>';
        }

        if (order.finishedByClient) {
          makeHiddenItem(order.id);
          ordersFinished++;
        } 
        
        if (order.canceledByClient || order.canceledByDriver) {
          makeHiddenItem(order.id);
          ordersCanceled++;
        } 

      }
      
    } else {
      Storage.removeTripDriver();
      goToPage = '#driver_city';
    }
  }
  
  function makeHiddenItem(id) {
    var itemDiv = Dom.sel('[data-order-id="' + id + '"]');
    
    if (itemDiv && !itemDiv.classList.contains('hidden')) {
      itemDiv.classList.add('hidden');
    }
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target,
          el;

      while (target !== this) {
        if (target.dataset.click === "driver-came") {
          el = target;
          
          if (arrFinished.indexOf(el.dataset.order_id) === -1) {
            finish.orderId = el.dataset.order_id;
            finish.agentId = el.dataset.agent_id;
            arrFinished.push(el.dataset.order_id);
            
            Conn.request('finishOrder', el.dataset.order_id, cbOnFinish);
          }
        }
        
        if (target.dataset.click === "driver-arrived") {
          el = target;
          
          Conn.request('arrivedDriver', el.dataset.order_id);
        }
        
        if (target.dataset.click === "cancel-order") {
          el = target;
          
          if (confirm('Отменить заказ?')) {
            Conn.request('cancelOrder', el.dataset.order_id);
            //Storage.removeTripDriver();
            //goToPage = '#driver_city';
          }
        }

        if (target && target.dataset.click === "tofavorites") {
          global_el = target;
          
          if (confirm('Добавить в Избранные?')) {
            Conn.request('addFavorites', global_el.dataset.agent_id, cbAddFavorites);
          }
          break;
        }
        
        if (target && target.dataset.click === "toblacklist") {
          global_el = target;
          
          if (confirm('Добавить в Черный список?')) {
            Conn.request('addBlackList', global_el.dataset.agent_id, cbAddToBlackList);
          }
          break;
        }
        
        if (target && target.dataset.click === "sharecard") {
          el = target;
          
          if (confirm('Поделиться контактами?')) {
            
          }
          break;
        }

        if (target && target.dataset.click === "tofeedback") {
          el = target;
          
          if (confirm('Хотите пожаловаться?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "peoplescontrol") {
          el = target;
          
          if (confirm('Перейти в Народный контроль?')) {
            
          }
          
          break;
        }
        
        if (target && target.dataset.click === "claimcheck") {
          el = target;
          
          if (confirm('Нужен чек?')) {
            
          }
          
          break;
        }
        
        if (target && target.dataset.click === "save_rating") {
          var data = {},
              bl = Dom.sel('div.score-agent__stars'),
              stars = bl.querySelectorAll('.active');

          el = target;
          data.rating = {};
          data.rating.value = stars.length;
          data.rating.comment = Dom.sel('.score-agent__text').value;
          data.orderId = order_id;
          
          Conn.request('addRating', data, cbAddRating);
          Modal.close();
          
          break;
        }
        
        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    
    content.addEventListener('click', Event.click);
  }
  
  function render(orders) {
    var el_route       = Dom.sel('.wait-order-approve__route-info__route'),
        el_price       = Dom.sel('.wait-order-approve__route-info__price'),
        el             = Dom.sel('.wait-bids-approve'),
        activeTypeTaxi = Storage.getActiveTypeTaxi(),
        addCityFrom    = '',
        addCityTo      = '',
        temp_inner     = '';

    if (activeTypeTaxi === "intercity" || activeTypeTaxi === "tourism") {
      addCityFrom = MyOffer.fromCity + ', ',
      addCityTo   = MyOffer.toCity + ', ';
    }
    
    el_route.children[0].innerHTML = addCityFrom + MyOffer.fromAddress;
    el_route.children[2].innerHTML = addCityTo + MyOffer.toAddress;
    el_price.innerHTML             = MyOffer.price + ' руб.';
    
    for (var i = 0; i < orders.length; i++) {
      photo_client = orders[i].agent.photo || User.default_avatar;
      name_client  = orders[i].agent.name || User.default_name;
      agIndexes    = parseObj(getAgentIndexes(orders[i].agent));
    
      temp_inner += '<div class="wait-bids-approve__item" data-order-id="' + orders[i].id + '">' +
                        '<div class="wait-bids-approve__item__distance">' +
                          'Клиент:' +
                        '</div>' +
                        '<div class="wait-bids-approve__item__driver">' +
                          '<div>' +
                            '<img src="' + photo_client + '" alt="" />' +
                          '</div>' +
                          '<div>' +
                            name_client +
                          '</div>' +
                          '<div>' + agIndexes + '</div>' +
                        '</div>' +
                        '<div class="wait-bids-approve__item__cancel">' +
                         '<button data-order_id="' + orders[i].id + '" data-click="cancel-order" class="button_rounded--red">Отмена</button>' +
                        '</div>' +
                      '</div>';
    }
    
    el.innerHTML = temp_inner;
  }
  
  function stop() {
    GetPositions.clear();
    Destinations.clear();
    Conn.request('stopOrdersByOffer');
    Conn.clearCb('cbGetOrdersByOffer');
    Chat.exit();
    first_time = true;
    Storage.lullModel(MyOffer);
    SafeWin.disableZoneForRoute();
  }
  
  function start() {
    var offerId = Storage.getTripDriver();
        
    if (offerId) {
      MyOffer = new clDriverOffer();
      MyOffer.getByID(offerId, function () {
        Maps.mapOn();
        initMap();
        SafeWin.overviewPath = [];
        Conn.request('startOrdersByOffer', MyOffer.id, cbGetOrdersByOffer);
        GetPositions.my();
        Chat.start('offer', MyOffer.id);
      });
    } else {
      Storage.removeTripDriver();
      goToPage = '#driver_city';
    }
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
