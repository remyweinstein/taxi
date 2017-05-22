/* global User, SafeWin, Event, MapElements, Conn, Maps, Parameters, driver_icon, men_icon */

define(['Dom', 'Dates', 'HideForms', 'DriverOffer', 'Storage'],
  function (Dom, Dates, HideForms, clDriverOffer, Storage) {
  
  var order_id, fromAddress, toAddress, fromCoords, toCoords, 
      name_client, photo_client, first_time = true, agIndexes, agRating,
      MyOffer, orderIds = [],
      countOrders, activeTypeTaxi;

  function getAgentIndexes(agent) {
    return {'flag-checkered': agent.clientAccuracyIndex, 'block': agent.clientCancelIndex, 'thumbs-up': agent.clientDelayIndex, 'clock': agent.clientFinishIndex};
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
      Storage.removeWatchingHash();
      Storage.removeWatchingTrip();
      alert('К сожалению, заказ отменен.');
      goToPage = '#client_city';
      
      return;
    }

    var ords = response.orders[0];
    
    if (!ords) {
      Storage.removeWatchingHash();
      Storage.removeWatchingTrip();
      goToPage = '#client_city';
    }
    
    fromAddress         = ords.fromAddress;
    fromCoords          = ords.fromLocation.split(",");
    toAddress           = ords.toAddress;
    order_id            = ords.id;
    toCoords            = ords.toLocation.split(",");
    
    MyOffer.addPointsClients(response.orders);
    
    render(response.orders);
    Maps.drawRoute(MyOffer, true, true, false, function(){});
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
      
    if (!response.error || countOrders === 0) {
      if (countOrders === 0) { // Check exist order
        stop();
        Storage.removeWatchingHash();
        Storage.removeWatchingTrip();
        alert('К сожалению, заказ не найден.');
        goToPage = '#client_city';
        
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
      
      var actionElement = Dom.sel('div[data-button="action"]');

      actionElement.innerHTML = '';
      
      for (var i = 0; i < countOrders; i++) {
        var order         = orders[i],
            agnt          = orders[i].agent,
            lost_diff     = order.bids[0] ? Dates.diffTime(order.bids[0].approved, order.bids[0].offer.travelTime) : 0,
            loc           = agnt.location.split(','),
            dr_time;

        orderIds[i] = order.id;
        
        if (!MapElements.driver_marker) {
          MapElements.driver_marker = Maps.addMarker(loc[0], loc[1], 'Водитель', driver_icon,  [16, 16], function(){});
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.driver_marker);
        }
        
        if (!MapElements.marker_clients[i]) {
          MapElements.marker_clients[i] = Maps.addMarker(loc[0], loc[1], 'Клиент', men_icon,  [16, 16], function(){});
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.marker_clients[i]);
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
          }

        }
      }
      
    } else {
      Storage.removeWatchingHash();
      Storage.removeWatchingTrip();
      goToPage = '#client_city';
    }
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        
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
      agRating     = orders[i].agent.rating;

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
                        '<div>Рейтинг: ' + agRating + '</div>' +
                        '<div>' + agIndexes + '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__cancel">' +
                      '</div>' +
                    '</div>';
    }
    
    el.innerHTML = temp_inner;
  }
  
  function stop() {
    Conn.request('stopOrdersByOffer');
    Conn.clearCb('cbGetOrdersByOffer');
    first_time = true;
  }
  
  function start() {    
    var offerId = Storage.getWatchingTrip(),
        hash    = Storage.getWatchingHash();
        
    if (offerId) {
      MyOffer = new clDriverOffer();
      MyOffer.getByHash(offerId, hash, function () {
        activeTypeTaxi = MyOffer.type;
        Maps.mapOn();
        initMap();
        Conn.request('startOrdersByOffer', MyOffer.id, cbGetOrdersByOffer);
      });
    } else {
      Storage.removeWatchingHash();
      Storage.removeWatchingTrip();
      goToPage = '#client_city';
    }
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
