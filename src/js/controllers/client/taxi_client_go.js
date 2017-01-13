define(['Ajax', 'Dom', 'Dates', 'Chat', 'Geo'], function (Ajax, Dom, Dates, Chat, Geo) {
    
  var markers = new Array;              
  var marker_mine, marker_from, marker_to, route = [], points = [];
  var show_route = false;
  var fromCoords, toCoords, fromAddress, toAddress, waypoints;
  var price, dr_model, dr_name, dr_color, dr_number, dr_photo, dr_vehicle, dr_time, duration_time;

  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
      map.setCenter(MyLatLng);
      map.setZoom(12);
      
    marker_mine = new google.maps.Marker({
      position: MyLatLng,
      map: map,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
      title: 'Я здесь!'
    });

  }

  function setRoute() {

    var el_route = Dom.sel('.wait-order-approve__route-info__route');
     el_route.children[0].innerHTML = fromAddress;
     el_route.children[2].innerHTML = toAddress;
    var el_price = Dom.sel('.wait-order-approve__route-info__price');
     el_price.innerHTML = price + ' руб.';
    var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
     el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--red">Отмена</button>';
    var el = Dom.sel('.wait-bids-approve');
     el.innerHTML = '<div class="wait-bids-approve__item">\n\
                        <div class="wait-bids-approve__item__distance">\n\
                          Автомобиль:<br/>\n\
                          Цвет: ' + dr_color + '<br/>\n\
                          Рег.номер: ' + dr_number + '\
                        </div>\n\
                        <div class="wait-bids-approve__item__car">\n\
                          <div>\n\
                            <img src="' + dr_vehicle + '" alt="" />\n\
                          </div>\n\
                          <div>\n\
                            ' + dr_model + '\
                          </div>\n\
                        </div>\n\
                        <div class="wait-bids-approve__item__driver">\n\
                          <div>\n\
                            <img src="' + dr_photo + '" alt="" />\n\
                          </div>\n\
                          <div>\n\
                            ' + dr_name + '\
                          </div>\n\
                        </div>\n\
                      </div>';

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var request = {
      origin: new google.maps.LatLng(fromCoords[0], fromCoords[1]),
      destination: new google.maps.LatLng(toCoords[0], toCoords[1]),
      waypoints: waypoints,
      provideRouteAlternatives: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    var requestBack = {
      destination: new google.maps.LatLng(fromCoords[0], fromCoords[1]),
      origin: new google.maps.LatLng(toCoords[0], toCoords[1]),
      waypoints: waypoints,
      provideRouteAlternatives: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {

        for (var i = 0, len = response.routes.length; i < len; i++) {
          route.push(new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            directions: response,
            routeIndex: i
          }));
        }
        for(var i = 0; i < response.routes.length; i++){
          var temp = response.routes[i].overview_path;
          SafeWin.overviewPath.push(temp);
        }
        directionsService.route(requestBack, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            for (var i = 0, len = response.routes.length; i < len; i++) {
              route.push(new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true,
                directions: response,
                routeIndex: i
              }));
            }
            for(var i = 0; i < response.routes.length; i++){
              var temp = response.routes[i].overview_path;
              SafeWin.overviewPath.push(temp);
            }
          }
          addEvents();
        });
      }
    });

    show_route = true;
  }

  function addEvents() {
    
    
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
        
        if (target.dataset.click === 'drop-down') {
          var _el = target;
          var _top = Dom.selAll('.go-order__top')[0];
          var _bottom = Dom.selAll('.go-order__down')[0];

          if (_top.style.top === '0em' || _top.style.top === '') {
            _el.classList.remove('drop-down');
            _el.classList.add('drop-up');
            _top.style.top = '-15em';
            _bottom.style.bottom = '-13em';
            _el.style.opacity = 1;
            _el.style.top = '-2.5em';
          } else {
            _el.classList.remove('drop-up');
            _el.classList.add('drop-down');
            _top.style.top = '0em';
            _bottom.style.bottom = '1em';
            _el.style.top = '0';
          }
          
        }
        
        if (target.dataset.click === "client-came") {
          Ajax.request('POST', 'finish-order', User.token, '&id=' + MyOrder.id, '', function() {
            localStorage.setItem('_rating_bid', bid_id);
            localStorage.removeItem('_enable_safe_zone');
            localStorage.removeItem('_enable_safe_route');
            
            window.location.hash = '#client_drivers_rating';
          }, function() {});          
        }
        
        if (target.dataset.click === 'client-incar') {          
          Ajax.request('POST', 'in-car-bid', User.token, '&id=' + MyOrder.bid_id, '', function() {}, function() {});
        }

        if (target.dataset.click === 'cancel-order') {
          if (confirm('Отменить заказ?')) {
            Ajax.request('POST', 'cancel-order', User.token, '&id=' + MyOrder.id, '', function(response) {
              if (response && response.ok) {
                window.location.hash = '#client_city';
              }
            }, function() {});
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
  
  function addInfoForMarker(min, marker) {
    if(min && min > 0) {
      var infowindow = new google.maps.InfoWindow({
        content: min + ' мин.'
      });
      infowindow.open(map, marker);
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
    }
  }

  function addMarker(location, title, icon, map) {
    var marker = new google.maps.Marker({
      position: location,
      //animation: google.maps.Animation.DROP,
      icon: icon,
      title: title,
      map: map
    });

    return marker;
  }

  function get_pos_mine() {
    marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
  }

  function get_pos_driver() {
    Ajax.request('GET', 'bid', User.token, '&id=' + MyOrder.bid_id, '', function(response) {
      if (response && response.ok) {

        var ords = response.bid.order;
        var agnt = response.bid.agent;
        
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

        Dom.sel('[data-view="distance_to_car"]').innerHTML = dr_distanse;
        Dom.sel('[data-view="while_car"]').innerHTML = dr_time;
        Dom.sel('[data-view="duration"]').innerHTML = duration_time;
        
        waypoints = [];
        
        if (ords.toAddresses) {
          for (var i = 0; i < ords.toAddresses.length; i++) {
            var _to = ords.toLocationes[i].split(",");
            waypoints.push({location: new google.maps.LatLng(_to[0], _to[1]), stopover: true});
            points.push(addInfoForMarker(ords.toTimes[i], addMarker(new google.maps.LatLng(_to[0], _to[1]), ords.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map)));
          }
        }

        marker_from = addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), MyOrder.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
        marker_to = addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), MyOrder.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

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
        if (!markers[0]) {
          var VLatLng = new google.maps.LatLng(loc[0], loc[1]);
          markers[0] = new google.maps.Marker({
            position: VLatLng,
            map: map,
            icon: driver_icon,
            title: 'Водитель'
          });
        } else {
          markers[0].setPosition(new google.maps.LatLng(loc[0], loc[1]));
        }
      }

    }, function() {});
  }
  
  function stop() {
    if (marker_mine) {
      marker_mine.setMap(null);
    }
    if (marker_from) {
      marker_from.setMap(null);
    }
    if (marker_to) {
      marker_to.setMap(null);
    }
    for (var i = 0; i < route.length; i++) {
      route[i].setMap(null);
    }
    if (markers[0]) {
      markers[0].setMap(null);
    }
    for (var i = 0; i < points.length; i++) {
      points[i].setMap(null);
    }
  }
  
  function start() {
    Dom.mapOn();
    initMap();
    SafeWin.overviewPath = [];
    
    bid_id = localStorage.getItem('_current_id_bid');
    MyOrder.bid_id = bid_id;

    timerGetMyPos = setInterval(get_pos_mine, 1000);

    get_pos_driver();

    timerGetBidGo = setInterval(get_pos_driver, 1000);//get_bids_driver

    Chat.start('driver');
  }
  
  return {
    start: start,
    clear: stop
  };
  
});