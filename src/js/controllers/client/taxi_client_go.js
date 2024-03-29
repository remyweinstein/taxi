/* global User, SafeWin, Event, driver_icon, MapElements, Conn, Maps, Zones, Car, Parameters, SharingOrder, cargo_icon */

define(['Dom', 'Dates', 'Chat', 'Geo', 'HideForms', 'GetPositions', 'Destinations', 'ClientOrder', 'Storage', 'ModalWindows', 'Sip'], 
function (Dom, Dates, Chat, Geo, HideForms, GetPositions, Destinations, clClientOrder, Storage, Modal, Sip) {
    
  var show_route   = false,
      isFollow     = Storage.getFollowOrder(),
      color_follow = isFollow ? 'green' : 'red',
      inCar        = false,
      fromCoords, toCoords, fromAddress, toAddress,
      price, 
      dr_model, dr_name, dr_color, dr_number, dr_distanse,
      dr_photo, dr_vehicle, car_brand, car_model, dr_time, duration_time,
      MyOrder, global_el, finish = {}, arrFinished = [],
      offerId, offerHash, agIndexes, agRating, 
      btTransferOrder, btWatchingOrder, btTransferCargo;

  function cbTransferOrder(response) {
    Conn.clearCb('cbTransferOrder');
    
    if (!response.error) {
      Storage.removeFollowOrder();
      Storage.removeTripClient();
      Storage.setWatchingHash(offerHash);
      Storage.setWatchingTrip(offerId);
      MyOrder.clear();
      goToPage = "#watching";
    }
  }
  
  function cbGetSosAgents(response) {
    Conn.clearCb('cbGetSosAgents');
    
    if (!response.error) {
      var agents = response.result.sosAgents,
          innerBl = '';
      
      for (var i = 0; i < agents.length; i++) {
        innerBl += '<p data-click="option-contact" data-agent_id="' + agents[i].id + '">' + agents[i].name + '</p>';
      }
      
      if (innerBl === "") {
        innerBl = '<p>Список доверенных контактов пуст</p>';
      }
      
      Modal.show(innerBl);
    } 
  }
  
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

    var type = Storage.getActiveTypeTaxi();

    if (type === "taxi") {
      type = "city";
    }
    
    MyOrder.clear();
    goToPage = '#client_' + type;
  }
  
  function cbFinishOrder() {
    Conn.clearCb('cbFinishOrder');
    Conn.clearCb('cbGetOrderById');
    Conn.request('stopGetOrder');

    var active_zones = Storage.getActiveZones();
    
    color_follow = isFollow ? 'green' : 'red';
    
    if (active_zones) {
      var list_active_zone = active_zones.split(',');
      
      for (var i = 0; i < list_active_zone.length; i++) {
        Zones.inactive(list_active_zone[i]);
      }
      
      SafeWin.toggleButton();
      Storage.removeActiveZones();
    }
    
    MyOrder.clear();
    Storage.removeTripClient();
    Storage.removeActiveRoute();
    Storage.removeFollowOrder();
    ratingOrder(finish.orderId, finish.agentId, 'client');
  }
  
  function cbCancelOrder() {
    Conn.clearCb('cbCancelOrder');
    
    MyOrder.clear();
    Storage.removeFollowOrder();
    Storage.removeTripClient();
    goToPage = '#client_city';
  }

  function cbGetOrderById(response) {
    var ords = response.result.order;
    
    if (!response.error && ords.bids) {
      if (!ords) {
        stop();
        Storage.removeTripClient();
        goToPage = '#client_city';
        alert('К сожалению, заказ не найден.');
      }
      
      if (ords.inCar) {
        inCar = true;
        color_follow = 'grey';
      }
      
      color_follow = isFollow ? 'green' : color_follow;
      
      btTransferCargo.classList.remove('button_short--green');
      btTransferCargo.classList.remove('button_short--grey');
      btTransferCargo.classList.remove('button_short--red');
      btTransferCargo.classList.add('button_short--' + color_follow);

      if (ords.finished) {
        if (arrFinished.indexOf(MyOrder.id) === -1) {
          finish.orderId = MyOrder.id;
          finish.agentId = ords.bids[0].offer.agent.id;
          arrFinished.push(MyOrder.id);
          cbFinishOrder();
        }
      }

      var but,
          offer                 = ords.bids[0].offer,
          agnt                  = offer.agent,
          car                   = agnt.cars ? agnt.cars[0] : null,
          toLoc                 = ords.toLocation,
          loc                   = agnt.location.split(','),
          lost_diff             = Dates.diffTime(ords.bids[0].approved, offer.travelTime),
          field_distance_to_car = Dom.sel('[data-view="distance_to_car"]'),
          field_while_car       = Dom.sel('[data-view="while_car"]'),
          field_duration        = Dom.sel('[data-view="duration"]'),
          incar_but             = Dom.sel('button[data-click="client-incar"]'),
          but_came              = Dom.sel('[data-click="client-came"]');
        
      offerId = offer.id;
      offerHash = offer.hash;
      
      if (ords.finishedByDriver) { //Add check safe zones
        if (arrFinished.indexOf(MyOrder.id) === -1) {
          finish.orderId = MyOrder.id;
          finish.agentId = agnt.id;
          arrFinished.push(MyOrder.id);
          Conn.request('finishOrder', MyOrder.id, cbFinishOrder);
        }
        
        return;
      } 
      
      if (ords.id) {
        MyOrder.id = ords.id;
      }
      
      dr_model    = car ? car.brand + ' ' + car.model : '';
      dr_name     = agnt.name;
      dr_color    = car ? car.color: '';
      dr_number   = car ? car.number : '';
      dr_distanse = ords.bids[0].offer.agent.distance && ords.bids[0].offer.agent.distance!=="undefined" ? ords.bids[0].offer.agent.distance.toFixed(1) : 'не опр.';

      if (lost_diff >= 0) {
        dr_time = lost_diff;
      } else {
        dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
        if (lost_diff < -1 * (Parameters.t2)) {
          var but_cancel = Dom.sel('[data-click="cancel-order"]');

          if (!ords.arrived) {
            if (but_cancel && but_cancel.classList.contains('button_rounded--red')) {
              but_cancel.classList.remove('button_rounded--red');
              but_cancel.classList.add('button_rounded--green');
            }
          } else {
            if (but_cancel && but_cancel.classList.contains('button_rounded--green')) {
              but_cancel.classList.remove('button_rounded--green');
              but_cancel.classList.add('button_rounded--red');
            }
          }
        }
      }
      
      if (ords.arrived) {
        dr_time = 'На месте';
      }
      
      dr_photo            = agnt.photo || User.avatar;
      dr_vehicle          = car ? car.photo || Car.default_vehicle : '';
      car_brand           = car ? car.brand : '';
      car_model           = car ? car.model : '';
      agIndexes           = parseObj(getAgentIndexes(ords.agent));
      agRating            = ords.agent.rating;
      fromCoords          = ords.fromLocation.split(",");
      toCoords            = ords.toLocation.split(",");
      fromAddress         = ords.fromAddress;
      toAddress           = ords.toAddress;
      price               = Math.round(ords.price);
      duration_time       = Dates.minToHours(ords.duration);
      MyOrder.fromCoords  = ords.fromLocation;
      MyOrder.toCoords    = ords.toLocation;
      MyOrder.points      = ords.points;
      MyOrder.fromAddress = ords.fromAddress;
      MyOrder.toAddress   = ords.toAddress;
      
      if (field_distance_to_car) {
        field_distance_to_car.innerHTML = dr_distanse;
      }
      
      if (field_while_car) {
        field_while_car.innerHTML = dr_time;
      }
      
      if (field_duration) {
        field_duration.innerHTML = duration_time;
      }

      if (!show_route) {
        setRoute();
      }
      
      if (ords.arrived) {
        if (incar_but) {
          incar_but.disabled = false;
          if (!isFollow) {
            var el = Dom.sel('button[data-click="transfer-cargo"]');
            
            el.classList.remove('button_short--red');
            el.classList.add('button_short--grey');
          }
        }
      }
      
      toLoc = toLoc.split(',');
      var dist = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]);

      if (but_came) {
        if(isFollow) {
          but_came.disabled = false;
        } else {
          if (dist < Parameters.orderRadius) {
            but_came.disabled = false;
          }
        }
      }
      
      if (ords.canceledByDriver || ords.canceledByClient) {
        stop();
        Storage.removeTripClient();
        goToPage = '#client_city';
        alert('К сожалению, заказ отменен.');
      }
      
      if (ords.inCar) {
        if (incar_but) {
          var disabla = isFollow ? '' : ' disabled',
              clientName = 'Приехали';
            
          if (ords.transferred) {
            clientName = 'Груз получил';
          }
          
          incar_but.parentNode.innerHTML = '<button data-click="client-came" data-agent_id="' + agnt.id + '" class="button_wide--green"' + disabla + '>' + clientName + '</button>';
        }
      }    

      if (!MapElements.driver_marker) {
        var favorite = !agnt.isFavorite ? '<button data-id="' + agnt.id + '" data-click="addtofav">Избранное</button>' : '<button data-id="' + agnt.id + '" data-click="deltofav">Удалить из Избранного</button>',
            info     = '<div style="text-align:center;">' +
                         '<div style="width:50%;display:inline-block;float: left;">' +
                           '<p>id' + agnt.id + '<br>' + dr_name + '</p>' +
                           '<p><img class="avatar" src="' + dr_photo + '" alt=""/></p>' +
                           '<p>' + favorite + '</p>' +
                         '</div>' +
                         '<div style="width:50%;display:inline-block">' +
                           '<p>' + car_brand + '<br>' + car_model + '</p>' +
                           '<p><img class="avatar" src="' + dr_vehicle + '" alt=""/></p>' +
                           '<p><button data-id="' + agnt.id + '" data-click="addtoblack">Черный список</button></p>' +
                         '</div>' +
                       '</div>';

        Maps.addMarker(loc[0], loc[1], 'Водитель', driver_icon, [32,32], function(mark) {
          Maps.addInfoForMarker(info, false, mark);
          MapElements.driver_marker = mark;
        });
      } else {
        Maps.markerSetPosition(loc[0], loc[1], MapElements.driver_marker);
      }
      
      var findDriverEl = Dom.sel('.find-driver');
      
      if (findDriverEl) {
        findDriverEl.dataset.location = agnt.location;
      }
      
      if (ords.transferred) {
        if (!MapElements.cargo_marker) {
          MapElements.cargo_marker = Maps.addMarker(loc[0], loc[1], 'Груз', cargo_icon, [16,16], function(){});
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.cargo_marker);
        }
      }
      
    } else {
      Storage.removeTripClient();
    }
  }
  
  function getAgentIndexes(agent) {
    return {'flag-checkered': agent.driverAccuracyIndex, 'block': agent.driverCancelIndex, 'thumbs-up': agent.driverDelayIndex, 'clock': agent.driverFinishIndex};
  }
  
  function parseObj(obj) {
    var content = '';
    
    for (var key in obj) {
      content += '<span><i class="icon-' + key + '"></i> ' + obj[key] + ' </span>';
    }
    
    return content;
  }

  function ratingOrder(id, agentId, role) {
    Modal.ratingOrder(id, agentId, role, function(){});
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
  }

  function setRoute() {
    var el_route    = Dom.sel('.wait-order-approve__route-info__route'),
        el_price    = Dom.sel('.wait-order-approve__route-info__price'),
        el_cancel   = Dom.sel('.wait-order-approve__route-info__cancel'),
        el          = Dom.sel('.wait-bids-approve'),
        addCityFrom = '',
        addCityTo   = '',
        activeTypeTaxi = Storage.getActiveTypeTaxi();

      if (activeTypeTaxi === "intercity" || activeTypeTaxi === "tourism") {
        addCityFrom = MyOrder.fromCity + ', ',
        addCityTo = MyOrder.toCity + ', ';
      }
    
    el_route.children[0].innerHTML = addCityFrom + fromAddress;
    el_route.children[2].innerHTML = addCityTo + toAddress;
    el_price.innerHTML  = price + ' руб.';
    el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--red">Отмена</button>';
    el.innerHTML        = '<div class="wait-bids-approve__item">' +
                            '<div class="wait-bids-approve__item__distance">' +
                              'Автомобиль:<br/>' +
                              'Цвет: ' + dr_color + '<br/>' +
                              'Рег.номер: ' + dr_number +
                            '</div>' +
                            '<div class="wait-bids-approve__item__car">' +
                              '<div>' +
                                '<img src="' + dr_vehicle + '" alt="" />' +
                              '</div>' +
                              '<div>' +
                                dr_model +
                              '</div>' +
                            '</div>' +
                            '<div class="wait-bids-approve__item__driver">' +
                              '<div>' +
                                '<img src="' + dr_photo + '" alt="" />' +
                              '</div>' +
                              '<div>' +
                                dr_name +
                              '<div>Рейтинг: ' + agRating + '</div>' +
                              '<div>' + agIndexes + '</div>' +
                              '</div>' +
                            '</div>' +
                          '</div>';
    Maps.drawRoute(MyOrder, true, false, false, function (price, arrRoi) {
      addEvents();
    });
    show_route = true;
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target && target !== this) {
        if (target.dataset.click === "client-came") {
          if (arrFinished.indexOf(MyOrder.id) === -1) {
            finish.orderId = MyOrder.id;
            finish.agentId = target.dataset.agent_id;
            arrFinished.push(MyOrder.id);
            Conn.request('finishOrder', MyOrder.id, cbFinishOrder);
          }
          
          break;
        }
        
        if (target.dataset.click === 'client-incar') {
          btTransferCargo.classList.remove('button_rounded--red');
          btTransferCargo.classList.add('button_rounded--grey');
          Conn.request('inCarClient', MyOrder.id);
          break;
        }
        
        if (target.dataset.click === 'cancel-order') {
          if (confirm('Отменить заказ?')) {
            Conn.request('cancelOrder', MyOrder.id, cbCancelOrder);
          }
          
          break;
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
          data.orderId = MyOrder.id;
          
          Conn.request('addRating', data, cbAddRating);
          Modal.close();
          
          break;
        }
        
        if (target && target.dataset.click === "option-contact") {
          var el = target,
              data = {};
          
          data.orderId   = MyOrder.id;
          data.toAgentId = el.dataset.agent_id;
          Conn.request('transferOrder', data, cbTransferOrder);
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
  
  function runTransferOrder() {
    Conn.request('getSosAgents', '', cbGetSosAgents);
    Conn.request('stopGetSosAgents');
  }
  
  function runWatchingOrder() {
    Modal.show('https://inll.ru/watching.html?offer=' + offerId + '&hash=' + offerHash);
  }
  
  function runTransferCargo(e) {
    var el = e.srcElement,
        stat = el.classList[0],
        status = stat.replace("button_short--", "");

    if (status === "red") {
      alert('Машина не подъехала еще!');
      return;
    }

    if (!isFollow) {
      el.classList.add('button_short--green');
      el.classList.remove('button_short--grey');
      isFollow = true;
      Storage.setFollowOrder();
      Conn.request('inCarClient', MyOrder.id);
      Conn.request('transferedOrder', MyOrder.id);
    }
  }
  
  function stop() {
    Maps.removeFindDriver();
    //Sip.stop();
    SharingOrder.disableTransfer();
    btTransferOrder.removeEventListener('click', runTransferOrder);
    SharingOrder.disableWatching();
    btWatchingOrder.removeEventListener('click', runWatchingOrder);
    SharingOrder.disableTransferCargo();
    btTransferCargo.removeEventListener('click', runTransferCargo);
          
    GetPositions.clear();
    Destinations.clear();
    Conn.clearCb('cbGetOrderById');
    Conn.request('stopGetOrder');
    Chat.exit();
    Storage.lullModel(MyOrder);
    SafeWin.disableZoneForRoute();
  }
  
  function start() {
    var orderId = Storage.getTripClient();

    if (orderId) {
      MyOrder = new clClientOrder();
      MyOrder.getByID(orderId, function () {
        if (orderId) {
          Maps.addFindDriver();
          //Sip.register('Client', 'indrivercopy@intt.onsip.com', 'vywnpDXMc6nhzpUH');
          SharingOrder.enableTransfer();
          btTransferOrder = Dom.sel('[data-click="transfer-order"]');
          btTransferOrder.addEventListener('click', runTransferOrder);
          SharingOrder.enableWatching();
          btWatchingOrder = Dom.sel('[data-click="watching-order"]');
          btWatchingOrder.addEventListener('click', runWatchingOrder);
          SharingOrder.enableTransferCargo();
          btTransferCargo = Dom.sel('[data-click="transfer-cargo"]');
          btTransferCargo.addEventListener('click', runTransferCargo);
          
          show_route = false;
          isFollow = Storage.getFollowOrder();
          Maps.mapOn();
          initMap();
          SafeWin.overviewPath = [];
          GetPositions.my();
          //Conn.request('startOrdersByOffer', MyOrder.id, cbGetOrderById);
          Conn.request('getOrderById', MyOrder.id, cbGetOrderById);
          Chat.start('order', MyOrder.id);
          HideForms.init();

          if (MyOrder.zone) {
            var poly = Maps.drawPoly(MyOrder.zone.polygon);

            SafeWin.polyRoute.push(poly);
            SafeWin.enableButtonRoute();
            Maps.addElOnMap(poly);
          }

        } else {
          Storage.removeTripClient();
          goToPage = "#client_city";
        }
      });
    } else {
      Storage.removeTripClient();
      goToPage = "#client_city";
    }
  }
  
  return {
    start: start,
    clear: stop
  };
  
});