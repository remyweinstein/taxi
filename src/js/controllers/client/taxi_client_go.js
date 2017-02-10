/* global map, User, google, SafeWin, Event, MyOrder, default_vehicle, driver_icon, MapElements */

define(['Ajax', 'Dom', 'Dates', 'Chat', 'Geo', 'Maps', 'HideForms', 'GetPositions', 'Destinations'], function (Ajax, Dom, Dates, Chat, Geo, Maps, HideForms, GetPositions, Destinations) {
    
  var show_route = false,
      fromCoords, toCoords, fromAddress, toAddress, waypoints,
      price, dr_model, dr_name, dr_color, dr_number, dr_photo, dr_vehicle, dr_time, duration_time;

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
          Ajax.request('POST', 'finish-order', User.token, '&id=' + MyOrder.id, '', function() {
            localStorage.setItem('_rating_bid', bid_id);
            localStorage.removeItem('_enable_safe_zone');
            localStorage.removeItem('_enable_safe_route');
            
            window.location.hash = '#client_drivers_rating';
          }, Ajax.error);
        }
        
        if (target.dataset.click === 'client-incar') {          
          Ajax.request('POST', 'in-car-bid', User.token, '&id=' + MyOrder.bid_id, '', function() {}, Ajax.error);
        }

        if (target.dataset.click === 'cancel-order') {
          if (confirm('Отменить заказ?')) {
            Ajax.request('POST', 'cancel-order', User.token, '&id=' + MyOrder.id, '', function(response) {
              if (response && response.ok) {
                window.location.hash = '#client_city';
              }
            }, Ajax.error);
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

  function get_pos_driver() {
    Ajax.request('GET', 'bid', User.token, '&id=' + MyOrder.bid_id, '', function(response) {
      if (response && response.ok) {

        var ords = response.bid.order,
            agnt = response.bid.agent;
        
        MyOrder.id = ords.id;
        dr_model = agnt.brand + ' ' + agnt.model;
        dr_name = agnt.name;
        dr_color = agnt.color;
        dr_number = agnt.number;
        dr_distanse = agnt.distance.toFixed(1);
        var lost_diff = Dates.diffTime(ords.updated, response.bid.travelTime);
        if (lost_diff >= 0) {
          dr_time = lost_diff;
        } else {
          dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
          if (lost_diff < -10) {
            var but = Dom.sel('[data-click="cancel-order"]');
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
        price = Math.round(response.bid.price);
        duration_time = Dates.minToHours(ords.duration);
        
        MyOrder.fromCoords = ords.fromLocation;
        MyOrder.toCoords = ords.toLocation;
        MyOrder.toAddresses = ords.toAddresses;
        MyOrder.toCoordses = ords.toLocationes;
        MyOrder.fromAddress = ords.fromAddress;
        MyOrder.toAddress = ords.toAddress;
        MyOrder.times = ords.toTimes;
       
        Dom.sel('[data-view="distance_to_car"]').innerHTML = dr_distanse;
        Dom.sel('[data-view="while_car"]').innerHTML = dr_time;
        Dom.sel('[data-view="duration"]').innerHTML = duration_time;
        
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
          var incar_but = Dom.sel('button[data-click="client-incar"]');
          if (incar_but) {
            incar_but.disabled = false;
          }
        }
        
        var toLoc = ords.toLocation;
          toLoc = toLoc.split(',');
        var dist = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]);
        
        if (dist < 1) {
          var but = Dom.sel('[data-click="client-came"]');
          
          if (but) {
            but.disabled = false;
          }
        }
       
        if (ords.canceled) {
          alert('К сожалению, заказ отменен.');
          window.location.hash = '#client_city';
        }
        
        if (ords.inCar) {
          var incar_but = Dom.sel('button[data-click="client-incar"]');
          
          if (incar_but) {
            var kuda = incar_but.parentNode;
            
            kuda.innerHTML = '<button data-click="client-came" class="button_wide--green" disabled>Приехали</button>';
          }
        }

        var loc = agnt.location.split(',');
        
        if (!MapElements.marker_client) {
          var VLatLng = new google.maps.LatLng(loc[0], loc[1]);
          
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

    }, Ajax.error);
  }
  
  function stop() {
    GetPositions.clear();
    Destinations.clear();
  }
  
  function start() {
    Maps.mapOn();
    initMap();
    SafeWin.overviewPath = [];
    
    bid_id = localStorage.getItem('_current_id_bid');
    global_order_id = localStorage.getItem('_current_id_order');
    MyOrder.bid_id = bid_id;
    MyOrder.id = global_order_id;

    GetPositions.my();
    
    get_pos_driver();
    timerGetBidGo = setInterval(get_pos_driver, 1000);

    Chat.start('driver');
    
    HideForms.init();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});