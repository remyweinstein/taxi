/* global map, User, google, MyOrder, SafeWin, default_vehicle, driver_icon, Event, MyOffer, MapElements */

define(['Ajax', 'Dom', 'Dates', 'Maps', 'HideForms', 'Destinations', 'GetPositions', 'Lists'], function (Ajax, Dom, Dates, Maps, HideForms, Destinations, GetPositions, Lists) {
  
  var model, Model;
  
  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng), i,
        _coord_from = Model.fromCoords.split(","),
        _coord_to = Model.toCoords.split(","),
        waypoints = [];
    
    map.setCenter(MyLatLng);
    map.setZoom(12);

    for (i = 0; i < Model.toAddresses.length; i++) {
      var _to_coord = Model.toCoordses[i].split(",");
      
      waypoints.push({location: new google.maps.LatLng(_to_coord[0], _to_coord[1]), stopover: true});
      MapElements.points.push(addInfoForMarker(Model.times[i], addMarker(new google.maps.LatLng(_to_coord[0], _to_coord[1]), Model.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map)));
    }

    MapElements.marker_from = addMarker(new google.maps.LatLng(_coord_from[0], _coord_from[1]), Model.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
    MapElements.marker_to = addMarker(new google.maps.LatLng(_coord_to[0], _coord_to[1]), Model.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

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
          MapElements.routes.push(new google.maps.DirectionsRenderer({
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
              MapElements.routes.push(new google.maps.DirectionsRenderer({
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
    
    return marker;
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
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target, el;

      while (target !== this) {
        if (target && target.dataset.click === "taxi_client_bid") {
          el = target;

          Ajax.request('POST', 'approve-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
            if (response && response.ok) {
              MyOrder.bid_id = el.dataset.id;
              localStorage.setItem('_current_id_bid', MyOrder.bid_id);
              localStorage.setItem('_current_id_order', MyOrder.id);
              
                window.location.hash = "#client_go";
            }
          }, Ajax.error);
        }
        
        if (target && target.dataset.click === "cancel-order") {
          el = target;
          
          Ajax.request('POST', 'cancel-order', User.token, '&id=' + MyOrder.id, '', function(response) {
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
    if (model === 'order') {
      MyOrder = Model;
    } else {
      MyOffer = Model;
    }
        
    Destinations.clear();
    GetPositions.clear();
    Lists.clear();
    
    localStorage.removeItem('_active_model');
  }
  
  function start() {
    
    model = localStorage.getItem('_active_model');
    
    if (model === 'order') {
      Model = MyOrder;
    } else {
      Model = MyOffer;
    }
    
    if (Model.id > 0) {
      Maps.mapOn();
      SafeWin.overviewPath = [];
      initMap();
      
      GetPositions.my();
      
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
      Lists.getBidsDriver();

    } else {
      if (model === "order") {
        window.location.hash = "#client_city";
      }
      if (model === "offer") {
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