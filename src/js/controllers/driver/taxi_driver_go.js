/* global User, SafeWin, Event, MapElements, Conn, Maps, Settings */

define(['Dom', 'Chat', 'Dates', 'Geo', 'HideForms', 'GetPositions', 'Destinations', 'DriverOffer', 'ClientOrder', 'Storage'],
  function (Dom, Chat, Dates, Geo, HideForms, GetPositions, Destinations, clDriverOffer, clClientOrder, Storage) {
  
  var order_id, fromAddress, toAddress, fromCoords, toCoords, 
      price, name_client, photo_client, first_time = true, agIndexes,
      MyOrder, MyOffer, orderIds = [];
  
  function cbOnFinish() { 
    Conn.clearCb('cbOnFinish');
    localStorage.setItem('_rating_offer', orderIds[0]);
    Storage.removeActiveZones();
    Storage.removeActiveRoute();
    Storage.removeTripDriver();
    goToPage = '#agent_rating';
  }

  function getAgentIndexes(agent) {
    return {'flag-checkered':agent.accuracyIndex, 'block':agent.cancelIndex, 'thumbs-up':agent.delayIndex, 'clock':agent.finishIndex};
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
    
    order_id            = ords.id;
    MyOrder.id          = ords.id;
    fromAddress         = ords.fromAddress;
    toAddress           = ords.toAddress;
    fromCoords          = ords.fromLocation.split(",");
    toCoords            = ords.toLocation.split(",");
    price               = Math.round(ords.price);
    name_client         = ords.agent.name || User.default_name;
    photo_client        = ords.agent.photo || User.default_avatar;
    MyOffer.fromCoords  = ords.fromLocation;
    MyOffer.toCoords    = ords.toLocation;
    MyOffer.toAddresses = ords.toAddresses;
    MyOffer.toCoordses  = ords.toLocationes;
    MyOffer.fromAddress = ords.fromAddress;
    MyOffer.toAddress   = ords.toAddress;
    MyOffer.times       = ords.toTimes;
    agIndexes           = parseObj(getAgentIndexes(ords.agent));

    render();
    Maps.drawRoute(MyOffer, true, function(){});
    addEvents();
    HideForms.init();
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
  }

  function cbGetOrdersByOffer(response) {
    if (!response.error || response.result.orders.length === 0) {
      if (first_time) {
        first_time = false;
        startOffer(response.result);
      }

      if (response.result.orders.length === 0) {
        stop();
        Storage.removeTripDriver();
        alert('К сожалению, заказ не найден.');
        goToPage = '#driver_city';
        return;
      }
      
      orderIds = [];
      
      for (var i = 0; i < response.result.orders.length; i++) {
        var ords        = response.result.orders[i],
            agnt        = response.result.orders[i].agent,
            radius      = agnt.distance,
            lost_diff   = Dates.diffTime(ords.bids[i].approved, ords.travelTime),
            toLoc       = ords.toLocation.split(','),
            arrived_but = Dom.sel('button[data-click="driver-arrived"]'),
            loc         = agnt.location,
            dist        = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]),
            dr_time, but;

        orderIds[i] = ords.id;

        if (ords.finishedByClient) { //Add check safe zones
          Conn.request('finishOrder', MyOrder.id, cbOnFinish);
          return;
        } 

        if (lost_diff >= 0) {
          dr_time = lost_diff;
        } else {
          dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
        }

        if (ords.arrived && !ords.inCar) {
          dr_time = 'На месте';
          lost_diff = Dates.diffTime(ords.updated, 20);

          if (lost_diff < 0) {
            but = Dom.sel('[data-click="cancel-order"]');

            if (but && but.classList.contains('button_rounded--red')) {
              but.classList.remove('button_rounded--red');
              but.classList.add('button_rounded--green');
            }
          }
        }

        if (dist < Settings.distanceToPoint) {
          but = Dom.sel('[data-click="driver-came"]');

          if (but) {
            but.disabled = false;
          }
        }

        if (radius < Settings.distanceToPoint) {
          if (arrived_but) {
            var kuda = arrived_but.parentNode;

            arrived_but.disabled = false;
          }
        }

        if (ords.canceledByDriver) {
          stop();
          Storage.removeTripDriver();
          alert('Заказ отменен.');
          goToPage = '#driver_city';
        }

        if (ords.canceledByClient) {
          stop();
          Storage.removeTripDriver();
          alert('К сожалению, клиент отменил заказ.');
          goToPage = '#driver_city';
        }

        if (ords.arrived) {
          if (arrived_but) {
            kuda.innerHTML = '<button data-click="driver-came" class="button_wide--green" disabled>Приехали</button>';
          }
        }

        Dom.sel('[data-view="distance_to_car"]').innerHTML = ords.agent.distance.toFixed(1);
        Dom.sel('[data-view="while_car"]').innerHTML = dr_time;
        Dom.sel('[data-view="duration"]').innerHTML = Dates.minToHours(ords.duration);

        if (!MapElements.marker_clients[i]) {
          MapElements.marker_clients[i] = Maps.addMarker(loc[0], loc[1], 'Клиент', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',  [10,10], function(){});
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.marker_clients[i]);
        }
      }
    } else {
      Storage.removeTripDriver();
      goToPage = '#driver_city';
    }
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === "driver-came") {
          Conn.request('finishOrder', MyOrder.id, cbOnFinish);
        }
        
        if (target.dataset.click === "driver-arrived") {
          Conn.request('arrivedDriver', MyOrder.id);
        }
        
        if (target.dataset.click === "cancel-order") {
          if (confirm('Отменить заказ?')) {
            Conn.request('cancelOrder', MyOrder.id);
            Storage.removeTripDriver();
            goToPage = '#driver_city';
          }
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
  
  function render() {
    var el_route       = Dom.sel('.wait-order-approve__route-info__route'),
        el_price       = Dom.sel('.wait-order-approve__route-info__price'),
        el_cancel      = Dom.sel('.wait-order-approve__route-info__cancel'),
        el             = Dom.sel('.wait-bids-approve'),
        addCityFrom    = '',
        addCityTo      = '',
        activeTypeTaxi = Storage.getActiveTypeTaxi();

    if (activeTypeTaxi === "intercity" || activeTypeTaxi === "tourism") {
      addCityFrom = MyOrder.fromCity + ', ',
      addCityTo   = MyOrder.toCity + ', ';
    }
      
    el_route.children[0].innerHTML = addCityFrom + fromAddress;
    el_route.children[2].innerHTML = addCityTo + toAddress;
    el_price.innerHTML  = price + ' руб.';
    el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--red">Отмена</button>';
    el.innerHTML = '<div class="wait-bids-approve__item">' +
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
                     '</div>';
  }
  
  function stop() {
    GetPositions.clear();
    Destinations.clear();
    Conn.request('stopOrdersByOffer');
    Conn.clearCb('cbGetOrdersByOffer');
    Chat.exit();
    first_time = true;
    Storage.lullModel(MyOrder);
    Storage.lullModel(MyOffer);
  }
  
  function start() {
    MyOrder = new clClientOrder();
    MyOffer = new clDriverOffer();
    MyOrder.activateCurrent();
    MyOffer.activateCurrent();
    
    if (MyOffer.id === Storage.getTripDriver()) {
      Maps.mapOn();
      initMap();
      SafeWin.overviewPath = [];
      Conn.request('startOrdersByOffer', MyOffer.id, cbGetOrdersByOffer);
      GetPositions.my();
      Chat.start('offer', MyOffer.id);
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
