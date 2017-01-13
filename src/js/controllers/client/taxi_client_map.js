define(['Ajax', 'Dom', 'Geo', 'Dates'], function (Ajax, Dom, Geo, Dates) {
  
  var driver_marker = [];
  var marker_mine, marker_from, marker_to, route = [], points = [];
  
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

    var _coord_from = MyOrder.fromCoords.split(",");
    var _coord_to = MyOrder.toCoords.split(",");
    var waypoints = [];

    for (var i = 0; i < MyOrder.toAddresses.length; i++) {
      var _to_coord = MyOrder.toCoordses[i].split(",");
      waypoints.push({location: new google.maps.LatLng(_to_coord[0], _to_coord[1]), stopover: true});
      points.push(addInfoForMarker(MyOrder.times[i], addMarker(new google.maps.LatLng(_to_coord[0], _to_coord[1]), MyOrder.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map)));
    }

    marker_from = addMarker(new google.maps.LatLng(_coord_from[0], _coord_from[1]), MyOrder.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
    marker_to = addMarker(new google.maps.LatLng(_coord_to[0], _coord_to[1]), MyOrder.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var request = {
      origin: new google.maps.LatLng(_coord_from[0], _coord_from[1]),
      destination: new google.maps.LatLng(_coord_to[0], _coord_to[1]),
      waypoints: waypoints,
      provideRouteAlternatives: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    
    var requestBackTrip = {
      destination: new google.maps.LatLng(_coord_from[0], _coord_from[1]),
      origin: new google.maps.LatLng(_coord_to[0], _coord_to[1]),
      waypoints: waypoints,
      provideRouteAlternatives: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    
    SafeWin.overviewPath = [];
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {            
        for (var i = 0; i < response.routes.length; i++) {
          route.push(new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            directions: response,
            routeIndex: i
          }));
        }
        for (var i = 0; i < response.routes.length; i++) {
          var temp = response.routes[i].overview_path;
          SafeWin.overviewPath.push(temp);
        }
        directionsService.route(requestBackTrip, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {            
            for (var i = 0; i < response.routes.length; i++) {
              route.push(new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true,
                directions: response,
                routeIndex: i
              }));
            }
            for (var i = 0; i < response.routes.length; i++) {
              var temp = response.routes[i].overview_path;
              SafeWin.overviewPath.push(temp);
            }
          }
        });

      }
    });

  }
  
  function addInfoForMarker(min, marker) {
    if (min && min > 0) {
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
  
  function get_bids_driver() {
    marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
    
    Ajax.request('GET', 'bids', User.token, '&id=' + MyOrder.id, '', function(response) {
      if (response && response.ok) {
        var el = Dom.sel('.wait-bids-approve');
          el.innerHTML = "";
        var bids = response.bids;
        var innText = '';
        for (var i = 0; i < bids.length; i++) {

          var photo, vehicle;
            photo = bids[i].agent.photo ? bids[i].agent.photo : User.avatar;
            vehicle = bids[i].agent.vehicle ? bids[i].agent.vehicle : default_vehicle;

          var loc = bids[i].agent.location;
          var DrLatLng = new google.maps.LatLng(loc[0], loc[1]);
          if (driver_marker[bids[i].agent.id]) {
            driver_marker[bids[i].agent.id].setPosition(DrLatLng);
          } else {
            driver_marker[bids[i].agent.id] = addMarker(DrLatLng, bids[i].agent.name, driver_icon, map);
          }

          var dist =  bids[i].agent.distance ? (bids[i].agent.distance).toFixed(1) : 0;
          innText += '<div class="wait-bids-approve__item">\n\
                            <div class="wait-bids-approve__item__distance">\n\
                              Растояние до водителя, <span>' + dist + ' км</span>\n\
                            </div>\n\
                            <div class="wait-bids-approve__item__driver">\n\
                              <div>\n\
                                <img src="' + photo + '" alt="" />\n\
                              </div>\n\
                              <div>' + bids[i].agent.name + '</div>\n\
                            </div>\n\
                            <div class="wait-bids-approve__item__car">\n\
                              <div>\n\
                                <img src="' + vehicle + '" alt="" />\n\
                              </div>\n\
                              <div>\n\
                                ' + bids[i].agent.brand + ' ' + bids[i].agent.model + '\
                              </div>\n\
                            </div>\n\
                            <div class="wait-bids-approve__item__approve">\n\
                              <i data-click="taxi_client_bid" data-id="' + bids[i].id + '" class="icon-ok-circled"></i>\n\
                            </div>\n\
                            <div class="wait-bids-approve__item__bid-time">\n\
                              Время подъезда: <span>' + bids[i].travelTime + ' мин</span>\n\
                            </div>\n\
                            <div class="wait-bids-approve__item__bid-price">\n\
                              Предложенная цена: <span>' + Math.round(bids[i].price) + ' руб</span>\n\
                            </div>\n\
                          </div>';
        }
        el.innerHTML = innText;
      }

    }, function() {});
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target && target.dataset.click === "taxi_client_bid") {
          var el = target;

          Ajax.request('POST', 'approve-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
            if (response && response.ok) {
              MyOrder.bid_id = el.dataset.id;
              localStorage.setItem('_current_id_bid', MyOrder.bid_id);
              window.location.hash = "#client_go";
            }
          }, function() {});
        }
        
        if (target && target.dataset.click === "cancel-order") {
          var el = target;
          
          Ajax.request('POST', 'cancel-order', User.token, '&id=' + MyOrder.id, '', function(response) {
            if (response && response.ok) {
              window.location.hash = '#client_city';
            }
          }, function() {});
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
    for (var i = 0; i < points.length; i++) {
      points[i].setMap(null);
    }
  }
  
  function start() {
    if (MyOrder.id > 0) {
      Dom.mapOn();
      SafeWin.overviewPath = [];
      initMap();

      timerGetBidsTaxy = setInterval(get_bids_driver, 3000);

      Dom.selAll('.wait-order-approve__route-info__route')[0].children[0].innerHTML = MyOrder.fromAddress;
      Dom.selAll('.wait-order-approve__route-info__route')[0].children[2].innerHTML = MyOrder.toAddress;
      Dom.selAll('.wait-order-approve__route-info__route')[0].children[3].innerHTML = 'Время в пути: ' + (MyOrder.length / 1000).toFixed(1) + ' км / ' + Dates.minToHours(MyOrder.duration);

      var _count_waypoint = MyOrder.toAddresses.length;

      if (_count_waypoint > 0) {
        Dom.selAll('.wait-order-approve__route-info__route')[0].children[1].innerHTML = 'Заездов ' + _count_waypoint;
      } else {
        Dom.selAll('.wait-order-approve__route-info__route')[0].children[1].style.display = 'none';
      }

      var el_price = Dom.sel('.wait-order-approve__route-info__price');
        el_price.innerHTML = Math.round(MyOrder.price) + ' руб';

      var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
        el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--green">Отмена</button>';

    } else {
      window.location.hash = "#client_my_orders";
    }
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});