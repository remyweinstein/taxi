/* global map, User, google, MyOrder, SafeWin, default_vehicle, driver_icon, Event, MyOffer */

define(['Ajax', 'Dom', 'Dates', 'Maps', 'HideForms'], function (Ajax, Dom, Dates, Maps, HideForms) {
  
  var driver_marker = [],
      marker_mine, marker_from, marker_to, route = [], points = [],
      model, Model;
  
  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng),
        i,
        _coord_from = Model.fromCoords.split(","),
        _coord_to = Model.toCoords.split(","),
        waypoints = [];
    
    map.setCenter(MyLatLng);
    map.setZoom(12);

    marker_mine = new google.maps.Marker({
      position: MyLatLng,
      map: map,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
      title: 'Я здесь!'
    });

    for (i = 0; i < Model.toAddresses.length; i++) {
      var _to_coord = Model.toCoordses[i].split(",");
      
      waypoints.push({location: new google.maps.LatLng(_to_coord[0], _to_coord[1]), stopover: true});
      points.push(addInfoForMarker(Model.times[i], addMarker(new google.maps.LatLng(_to_coord[0], _to_coord[1]), Model.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map)));
    }

    marker_from = addMarker(new google.maps.LatLng(_coord_from[0], _coord_from[1]), Model.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
    marker_to = addMarker(new google.maps.LatLng(_coord_to[0], _coord_to[1]), Model.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

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
        for (i = 0; i < response.routes.length; i++) {
          route.push(new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            directions: response,
            routeIndex: i
          }));
        }
        for (i = 0; i < response.routes.length; i++) {
          var temp = response.routes[i].overview_path;
          
          SafeWin.overviewPath.push(temp);
        }
        directionsService.route(requestBackTrip, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {            
            for (i = 0; i < response.routes.length; i++) {
              route.push(new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: true,
                directions: response,
                routeIndex: i
              }));
            }
            for (i = 0; i < response.routes.length; i++) {
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
    
    Ajax.request('GET', 'bids', User.token, '&id=' + Model.id, '', function(response) {
      if (response && response.ok) {
        var el = Dom.sel('.wait-bids-approve'),
            bids = response.bids,
            innText = '';
            
        el.innerHTML = "";

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
          innText +=  '<div class="wait-bids-approve__item">' +
                        '<div class="wait-bids-approve__item__distance">' +
                          'Растояние до водителя, <span>' + dist + ' км</span>' +
                        '</div>' +
                        '<div class="wait-bids-approve__item__driver">' +
                          '<div>' +
                            '<img src="' + photo + '" alt="" />' +
                          '</div>' +
                          '<div>' + bids[i].agent.name + '</div>' +
                        '</div>' +
                        '<div class="wait-bids-approve__item__car">' +
                          '<div>' +
                            '<img src="' + vehicle + '" alt="" />' +
                          '</div>' +
                          '<div>' +
                            bids[i].agent.brand + ' ' + bids[i].agent.model +
                          '</div>' +
                        '</div>' +
                        '<div class="wait-bids-approve__item__approve">' +
                          '<i data-click="taxi_client_bid" data-id="' + bids[i].id + '" class="icon-ok-circled"></i>' +
                        '</div>' +
                        '<div class="wait-bids-approve__item__bid-time">' +
                          'Время подъезда: <span>' + bids[i].travelTime + ' мин</span>' +
                        '</div>' +
                        '<div class="wait-bids-approve__item__bid-price">' +
                          'Предложенная цена: <span>' + Math.round(bids[i].price) + ' руб</span>' +
                        '</div>' +
                      '</div>';
        }
        el.innerHTML = innText;
      }

    }, Ajax.error);
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target,
          el;

      while (target !== this) {
        if (target && target.dataset.click === "taxi_client_bid") {
          el = target;

          Ajax.request('POST', 'approve-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
            if (response && response.ok) {
              Model.bid_id = el.dataset.id;
              localStorage.setItem('_current_id_bid', Model.bid_id);
              localStorage.setItem('_current_id_order', Model.id);
              
              if (model === "clDriverOffer") {
                window.location.hash = '#driver_go';
              }
              if (model === "clClientOrder") {
                window.location.hash = "#client_go";
              }
            }
          }, Ajax.error);
        }
        
        if (target && target.dataset.click === "cancel-order") {
          el = target;
          
          Ajax.request('POST', 'cancel-order', User.token, '&id=' + Model.id, '', function(response) {
            if (response && response.ok) {
              window.location.hash = '#client_city';
            }
          }, Ajax.error);
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
    var i;
    
    if (model === "clClientOrder") {
      MyOrder = Model;
    }
    if (model === "clDriverOffer") {
      MyOffer = Model;
    }
    if (marker_mine) {
      marker_mine.setMap(null);
    }
    if (marker_from) {
      marker_from.setMap(null);
    }
    if (marker_to) {
      marker_to.setMap(null);
    }
    for (i = 0; i < route.length; i++) {
      route[i].setMap(null);
    }
    for (i = 0; i < points.length; i++) {
      points[i].setMap(null);
    }
  }
  
  function start(modelka) {
    model = modelka;
    
    if (model === "clClientOrder") {
      Model = MyOrder;
    }
    if (model === "clDriverOffer") {
      Model = MyOffer;
    }
    
    if (Model.id > 0) {
      Maps.mapOn();
      SafeWin.overviewPath = [];
      initMap();

      timerGetBidsTaxy = setInterval(get_bids_driver, 3000);

      Dom.selAll('.wait-order-approve__route-info__route')[0].children[0].innerHTML = Model.fromAddress;
      Dom.selAll('.wait-order-approve__route-info__route')[0].children[2].innerHTML = Model.toAddress;
      Dom.selAll('.wait-order-approve__route-info__route')[0].children[3].innerHTML = 'В пути: ' + (Model.length / 1000).toFixed(1) + ' км / ' + Dates.minToHours(Model.duration);

      var _count_waypoint = Model.toAddresses.length;

      if (_count_waypoint > 0) {
        Dom.selAll('.wait-order-approve__route-info__route')[0].children[1].innerHTML = 'Заездов ' + _count_waypoint;
      } else {
        Dom.selAll('.wait-order-approve__route-info__route')[0].children[1].style.display = 'none';
      }

      var el_price = Dom.sel('.wait-order-approve__route-info__price');
        el_price.innerHTML = Math.round(Model.price) + ' руб';

      var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
        el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--green">Отмена</button>';
        
      HideForms.init();

    } else {
      if (model === "clClientOrder") {
        window.location.hash = "#client_city";
      }
      if (model === "clDriverOffer") {
        window.location.hash = "#driver_city";
      }

    }
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});