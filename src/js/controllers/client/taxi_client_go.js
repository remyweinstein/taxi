/* global map, User, google, SafeWin, Event, MyOrder, default_vehicle, driver_icon, MapElements, Conn, MyOffer */

define(['Dom', 'Dates', 'Chat', 'Geo', 'Maps', 'HideForms', 'GetPositions', 'Destinations'], 
function (Dom, Dates, Chat, Geo, Maps, HideForms, GetPositions, Destinations) {
    
  var show_route = false,
      fromCoords, toCoords, fromAddress, toAddress, waypoints,
      price, dr_model, dr_name, dr_color, dr_number, dr_photo, dr_vehicle, dr_time, duration_time;

  function cbFinishOrder() {
    localStorage.setItem('_rating_order', MyOrder.id);
    localStorage.removeItem('_enable_safe_zone');
    localStorage.removeItem('_enable_safe_route');
    window.location.hash = '#client_drivers_rating';
  }
  
  function cbCancelOrder() {
    window.location.hash = '#client_city';
  }

  function cbGetOrderById(response) {
    var ords = response.order;
    
    if (!ords) {
      stop();
      alert('К сожалению, заказ не найден.');
      window.location.hash = '#client_city';
    }
    
    if (ords.finished) {
      cbFinishOrder();
    }

    var offer = ords.bids[0].offer,
        agnt = offer.agent,
        toLoc = ords.toLocation,
        loc = agnt.location.split(','),
        lost_diff = Dates.diffTime(ords.bids[0].approved, ords.travelTime),
        VLatLng = new google.maps.LatLng(loc[0], loc[1]),
        incar_but = Dom.sel('button[data-click="client-incar"]'),
        but = Dom.sel('[data-click="client-came"]'),
        field_distance_to_car = Dom.sel('[data-view="distance_to_car"]'),
        field_while_car = Dom.sel('[data-view="while_car"]'),
        field_duration = Dom.sel('[data-view="duration"]');
      
    if (ords.id) {
      MyOrder.id = ords.id;
    }
    dr_model = agnt.brand + ' ' + agnt.model;
    dr_name = agnt.name;
    dr_color = agnt.color;
    dr_number = agnt.number;
    dr_distanse = ords.agent.distance.toFixed(1);

    if (lost_diff >= 0) {
      dr_time = lost_diff;
    } else {
      dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
      if (lost_diff < -10) {
        but = Dom.sel('[data-click="cancel-order"]');

        if (!ords.arrived) {
          if (but && but.classList.contains('button_rounded--red')) {
            but.classList.remove('button_rounded--red');
            but.classList.add('button_rounded--green');
          }
        } else {
          if (but && but.classList.contains('button_rounded--green')) {
            but.classList.remove('button_rounded--green');
            but.classList.add('button_rounded--red');
          }
        }
      }
    }
    if (ords.arrived) {
      dr_time = 'На месте';
    }
    dr_photo = agnt.photo || User.avatar;
    dr_vehicle = agnt.vehicle || default_vehicle;
    fromCoords = ords.fromLocation.split(",");
    toCoords = ords.toLocation.split(",");
    fromAddress = ords.fromAddress;
    toAddress = ords.toAddress;
    price = Math.round(ords.price);
    duration_time = Dates.minToHours(ords.duration);
    MyOrder.fromCoords = ords.fromLocation;
    MyOrder.toCoords = ords.toLocation;
    MyOrder.toAddresses = ords.toAddresses;
    MyOrder.toCoordses = ords.toLocationes;
    MyOrder.fromAddress = ords.fromAddress;
    MyOrder.toAddress = ords.toAddress;
    MyOrder.times = ords.toTimes;
    if (field_distance_to_car) {
      field_distance_to_car.innerHTML = dr_distanse;
    }
    if (field_while_car) {
      field_while_car.innerHTML = dr_time;
    }
    if (field_duration) {
      field_duration.innerHTML = duration_time;
    }
    waypoints = [];
    if (ords.toAddresses) {
      for (var i = 0; i < ords.toAddresses.length; i++) {
        var _to = ords.toLocationes[i].split(",");

        waypoints.push({location: new google.maps.LatLng(_to[0], _to[1]), stopover: true});
        Maps.addMarker(new google.maps.LatLng(_to[0], _to[1]), ords.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png',
          function (mark) {
            Maps.addInfoForMarker(ords.toTimes[i] + 'мин.', true, mark);
            MapElements.points.push(mark);
          });
      }
    }
    Maps.addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), MyOrder.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png',
      function (mark) {
        MapElements.marker_from = mark;
      });
    Maps.addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), MyOrder.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png',
      function (mark) {
        MapElements.marker_to = mark;
      });
    if (!show_route) {
      setRoute();
    }
    if (ords.arrived) {
      if (incar_but) {
        incar_but.disabled = false;
      }
    }
    toLoc = toLoc.split(',');
    var dist = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]);

    if (dist < 1) {
      if (but) {
        but.disabled = false;
      }
    }
    if (ords.canceledByDriver || ords.canceledByClient) {
      stop();
      alert('К сожалению, заказ отменен.');
      window.location.hash = '#client_city';
    }
    if (ords.inCar) {
      if (incar_but) {
        incar_but.parentNode.innerHTML = '<button data-click="client-came" class="button_wide--green" disabled>Приехали</button>';
      }
    }        
    if (!MapElements.marker_client) {          
      MapElements.marker_client = new google.maps.Marker({
        position: VLatLng,
        map: map,
        icon: driver_icon,
        title: 'Водитель'
      });
    } else {
      MapElements.marker_client.setPosition(new google.maps.LatLng(loc[0], loc[1]));
    }
  }
  
  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    
    map.setCenter(MyLatLng);
    map.setZoom(12);
  }

  function setRoute() {
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
                        '</div>' +
                      '</div>' +
                    '</div>';
    Maps.drawRoute('order', true, function () {
      addEvents();
    });
    show_route = true;
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
        if (target.dataset.click === "client-came") {
          Conn.request('finishOrder', MyOrder.id, cbFinishOrder);
        }
        if (target.dataset.click === 'client-incar') {
          console.log('try click client-incar');
          Conn.request('inCarClient', MyOrder.id);
        }
        if (target.dataset.click === 'cancel-order') {
          if (confirm('Отменить заказ?')) {
            Conn.request('cancelOrder', MyOrder.id, cbCancelOrder);
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
  
  function stop() {
    GetPositions.clear();
    Destinations.clear();
    Conn.clearCb('cbGetOrderById');
    Conn.request('stopGetOrder');
    Chat.exit();
  }
  
  function start() {
    Maps.mapOn();
    initMap();
    SafeWin.overviewPath = [];
    MyOrder.id = localStorage.getItem('_active_order_id');
    GetPositions.my();
    //Conn.request('startOrdersByOffer', MyOrder.id, cbGetOrderById);
    Conn.request('getOrderById', MyOrder.id, cbGetOrderById);
    Chat.start('order', MyOrder.id);
    HideForms.init();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});