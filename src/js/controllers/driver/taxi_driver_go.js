/* global User, SafeWin, Event, MapElements, Conn, Maps */

define(['Dom', 'Chat', 'Dates', 'Geo', 'HideForms', 'GetPositions', 'Destinations', 'DriverOffer', 'ClientOrder', 'Storage'],
  function (Dom, Chat, Dates, Geo, HideForms, GetPositions, Destinations, clDriverOffer, clClientOrder, Storage) {
  
  var order_id, fromAddress, toAddress, fromCoords, toCoords, 
      waypoints, price, name_client, photo_client, first_time = true, agIndexes,
      MyOrder, MyOffer;
  
  function cbOnFinish() { 
    localStorage.setItem('_rating_offer', MyOffer.id);
    localStorage.removeItem('_enable_safe_zone');
    localStorage.removeItem('_enable_safe_route');
    localStorage.removeItem('_active_offer_id');
    Conn.clearCb('cbOnFinish');
    window.location.hash = '#driver_clients_rating';
  }

  function getAgentIndexes(agent) {
    return {'Точности':agent.accuracyIndex, 'Отмены':agent.cancelIndex, 'Успеха':agent.delayIndex, 'Задержек':agent.finishIndex};
  }
  
  function parseObj(obj) {
    var content = '';
    
    for (var key in obj) {
      content += '<p>' + key + ': ' + obj[key] + '</p>';
    }
    
    return content;
  }

  function startOffer(response) {
    if (response.orders.length === 0) {
      stop();
      localStorage.removeItem('_active_offer_id');
      alert('К сожалению, заказ отменен.');
      window.location.hash = '#driver_city';
      return;
    }

    var ords = response.orders[0];
    
    if (!ords) {
      localStorage.removeItem('_active_offer_id');
      window.location.hash = '#driver_city';
    }
    order_id = ords.id;
    MyOrder.id = ords.id;
    fromAddress = ords.fromAddress;
    toAddress = ords.toAddress;
    fromCoords = ords.fromLocation.split(",");
    toCoords = ords.toLocation.split(",");
    price = Math.round(ords.price);
    name_client = ords.agent.name || User.default_name;
    photo_client = ords.agent.photo || User.default_avatar;
    MyOffer.fromCoords = ords.fromLocation;
    MyOffer.toCoords = ords.toLocation;
    MyOffer.toAddresses = ords.toAddresses;
    MyOffer.toCoordses = ords.toLocationes;
    MyOffer.fromAddress = ords.fromAddress;
    MyOffer.toAddress = ords.toAddress;
    MyOffer.times = ords.toTimes;
    agIndexes = parseObj(getAgentIndexes(ords.agent));
    waypoints = [];

    if (ords.toAddresses) {
      for (var i = 0; i < ords.toAddresses.length; i++) {
        var _wp = ords.toLocations[i].split(",");
        
        waypoints.push(Maps.convertWayPointsForRoutes(_wp[0], _wp[1]));
        Maps.addMarker(_wp[0], _wp[1], ords.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', [32,32],
          function (mark) {
            Maps.addInfoForMarker(ords.times[i] + 'мин.', true, mark);
            MapElements.points.push(mark);
          });
      }
    }

    Maps.addMarker(fromCoords[0], fromCoords[1], fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', [32,32],
      function (mark) {
        MapElements.marker_from = mark;
      });
    Maps.addMarker(toCoords[0], toCoords[1], toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', [32,32],
      function (mark) {
        MapElements.marker_to = mark;
      });

    render();
    Maps.drawRoute('offer', true, function(){});
    addEvents();
    HideForms.init();
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
  }

  function cbGetOrdersByOffer(response) {
    if (first_time) {
      startOffer(response.result);
      first_time = false;
    }
    
    if (response.result.orders.length === 0) {
      stop();
      localStorage.removeItem('_active_offer_id');
      alert('К сожалению, заказ не найден.');
      window.location.hash = '#driver_city';
      return;
    }

    var ords = response.result.orders[0],
        agnt = response.result.orders[0].agent,
        radius = agnt.distance,
        lost_diff = Dates.diffTime(ords.bids[0].approved, ords.travelTime),
        toLoc = ords.toLocation.split(','),
        arrived_but = Dom.sel('button[data-click="driver-arrived"]'),
        loc = agnt.location,
        dist = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]),
        dr_time, but;
      
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
    if (dist < 1) {
      but = Dom.sel('[data-click="driver-came"]');

      if (but) {
        but.disabled = false;
      }
    }
    if (radius < 1) {
      if (arrived_but) {
        var kuda = arrived_but.parentNode;
        
        arrived_but.disabled = false;
      }
    }
    if (ords.canceledByDriver || ords.canceledByClient) {
      stop();
      localStorage.removeItem('_active_offer_id');
      alert('К сожалению, заказ отменен.');
      window.location.hash = '#client_city';
    }
    if (ords.arrived) {
      if (arrived_but) {
        kuda.innerHTML = '<button data-click="driver-came" class="button_wide--green" disabled>Приехали</button>';
      }
    }
    Dom.sel('[data-view="distance_to_car"]').innerHTML = ords.agent.distance.toFixed(1);
    Dom.sel('[data-view="while_car"]').innerHTML = dr_time;
    Dom.sel('[data-view="duration"]').innerHTML = Dates.minToHours(ords.duration);
    
    if (!MapElements.marker_client) {
      MapElements.marker_client = Maps.addMarker(loc[0], loc[1], 'Клиент', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',  [10,10], function(){});
    } else {
      Maps.markerSetPosition(loc[0], loc[1], MapElements.marker_client);
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
            window.location.hash = '#driver_city';
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
    var el_route = Dom.sel('.wait-order-approve__route-info__route'),
        el_price = Dom.sel('.wait-order-approve__route-info__price'),
        el_cancel = Dom.sel('.wait-order-approve__route-info__cancel'),
        el = Dom.sel('.wait-bids-approve');
    
    el_route.children[0].innerHTML = fromAddress;
    el_route.children[2].innerHTML = toAddress;
    el_price.innerHTML = price + ' руб.';
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
    MyOrder.activateCurrent();
    MyOffer = new clDriverOffer();
    MyOffer.activateCurrent();
    Maps.mapOn();
    initMap();
    MyOffer.id = localStorage.getItem('_active_offer_id');
    SafeWin.overviewPath = [];
    Conn.request('startOrdersByOffer', MyOffer.id, cbGetOrdersByOffer);
    GetPositions.my();
    Chat.start('offer', MyOffer.id);
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
