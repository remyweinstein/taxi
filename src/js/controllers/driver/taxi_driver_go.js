/* global User, google, map, SafeWin, driver_icon, Event */

define(['Ajax', 'Dom', 'Chat', 'Dates', 'Geo', 'Maps', 'HideForms'], function (Ajax, Dom, Chat, Dates, Geo, Maps, HideForms) {
  
  var order_id;
  var markers = [], marker_client, marker_from, marker_to, route = [], points = [];
  var fromAddress, toAddress, fromCoords, toCoords, waypoints, price;
  var name_client, photo_client;

  function initMap() {
    var LatLng = new google.maps.LatLng(User.lat, User.lng);
      map.setCenter(LatLng);
      map.setZoom(12);
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
                          Клиент:\n\
                        </div>\n\
                        <div class="wait-bids-approve__item__driver">\n\
                          <div>\n\
                            <img src="' + photo_client + '" alt="" />\n\
                          </div>\n\
                          <div>\n\
                            ' + name_client + '\
                          </div>\n\
                        </div>\n\
                      </div>';

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var request = {
      origin: new google.maps.LatLng(fromCoords[0], fromCoords[1]),
      destination: new google.maps.LatLng(toCoords[0], toCoords[1]),
      waypoints: waypoints,
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
            for(var i = 0; i < response.routes.length; i++){
              var temp = response.routes[i].overview_path;
              SafeWin.overviewPath.push(temp);
            }
          }
        });
      }
    });

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

  function get_pos_driver() {
    if (!markers[0]) {
      var VLatLng = new google.maps.LatLng(User.lat, User.lng);
      markers[0] = new google.maps.Marker({
        position: VLatLng,
        map: map,
        icon: driver_icon,
        title: 'Я'
      });
    } else {
      markers[0].setPosition(new google.maps.LatLng(User.lat, User.lng));
    }
    
    Ajax.request('GET', 'bid', User.token, '&id=' + bid_id, '', function(response) {
      if (response && response.ok) {
        var ords = response.bid.order;
        var agnt = response.bid.agent;
        var radius = agnt.distance;

        var lost_diff = Dates.diffTime(ords.updated, response.bid.travelTime);
        if (lost_diff >= 0) {
          var dr_time = lost_diff;
        } else {
          var dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
        }
        
        if (ords.arrived && !ords.inCar) {
          var dr_time = 'На месте';
          var loft_diff = Dates.diffTime(ords.updated, 20);

          if (loft_diff < 0) {
            var but = Dom.sel('[data-click="cancel-order"]');
            
            if (but && but.classList.contains('button_rounded--red')) {
              but.classList.remove('button_rounded--red');
              but.classList.add('button_rounded--green');
            }
          }
        }
        
        var toLoc = ords.toLocation;
          toLoc = toLoc.split(',');
        var dist = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]);
        
        if (dist < 1) {
          var but = Dom.sel('[data-click="driver-came"]');
          
          if (but) {
            but.disabled = false;
          }
        }
       
        if (radius < 1) {
          var arrived_but = Dom.sel('button[data-click="driver-arrived"]');
          if (arrived_but) {
            arrived_but.disabled = false;
          }
        }
        
        if (ords.canceled) {
          alert('К сожалению, заказ отменен.');
          window.location.hash = '#driver_city';
        }
        
        if (ords.arrived) {
          var arrived_but = Dom.sel('button[data-click="driver-arrived"]');
          if (arrived_but) {
            var kuda = arrived_but.parentNode;
            kuda.innerHTML = '<button data-click="driver-came" class="button_wide--green" disabled>Приехали</button>';
          }
        }

        Dom.sel('[data-view="distance_to_car"]').innerHTML = ords.agent.distance.toFixed(1);
        Dom.sel('[data-view="while_car"]').innerHTML = dr_time;
        Dom.sel('[data-view="duration"]').innerHTML = Dates.minToHours(ords.duration);

        var loc = response.bid.order.agent.location;
        if (!marker_client) {
          marker_client = new google.maps.Marker({
            position: new google.maps.LatLng(loc[0], loc[1]),
            map: map,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
            title: 'Клиент'
          });
        } else {
          marker_client.setPosition(new google.maps.LatLng(loc[0], loc[1]));
        }
      }
    }, function() {});

  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        
        if (target.dataset.click === "driver-came") {
          Ajax.request('POST', 'finish-order', User.token, '&id=' + order_id, '', function() {
            localStorage.setItem('_rating_bid', bid_id);
            localStorage.removeItem('_enable_safe_zone');
            localStorage.removeItem('_enable_safe_route');
            
            window.location.hash = '#driver_clients_rating';
          }, function() {});
        }
        
        if (target.dataset.click === "driver-arrived") {
          Ajax.request('POST', 'arrived-bid', User.token, '&id=' + bid_id, '', function() {}, function() {});
        }
        
        if (target.dataset.click === "cancel-order") {
          if (confirm('Отменить заказ?')) {
            Ajax.request('POST', 'cancel-order', User.token, '&id=' + order_id, '', function(response) {
              if (response && response.ok) {
                window.location.hash = '#driver_city';
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
  
  function stop() {
    if (marker_client) {
      marker_client.setMap(null);
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
    Maps.mapOn();
    initMap();
    
    bid_id = localStorage.getItem('_current_id_bid');
    global_order_id = localStorage.getItem('_current_id_order');
    
    SafeWin.map = map;
    SafeWin.overviewPath = [];
    
    Ajax.request('GET', 'bid', User.token, '&id=' + bid_id, '', function(response) {
      if (response && response.ok) {
        var ords = response.bid.order;
        order_id = ords.id;
        fromAddress = ords.fromAddress;
        toAddress = ords.toAddress;
        fromCoords = ords.fromLocation.split(",");
        toCoords = ords.toLocation.split(",");
        price = Math.round(response.bid.price);
        name_client = response.bid.order.agent.name ? response.bid.order.agent.name : User.default_name;
        photo_client = response.bid.order.agent.photo ? response.bid.order.agent.photo : User.default_avatar;

        waypoints = [];
        
        if (ords.toAddresses) {
          for (var i = 0; i < ords.toAddresses.length; i++) {
            var _wp = ords.toLocations[i].split(",");
            waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover:true});
            points.push(addInfoForMarker(ords.times[i], addMarker(new google.maps.LatLng(_wp[0], _wp[1]), ords.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map)));
          }
        }

        marker_from = addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
        marker_to = addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

        setRoute();
        addEvents();
        HideForms.init();
      } else {
        window.location.hash = '#driver_city';
      }
    }, function() {window.location.hash = '#driver_city';});

    timerGetBidGo = setInterval(get_pos_driver, 3000);//get_bids_driver

    Chat.start('client');
    
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
