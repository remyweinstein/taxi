/* global google, SafeWin, User, safe_zone_polygons, MapElements, cost_of_km, MyOrder, MyOffer */

define(['Dom'], function(Dom) {

  function renderDirections(map, result, polylineOpts) {
    var directionsRenderer = new google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    if (polylineOpts) {
      directionsRenderer.setOptions({
        polylineOptions: polylineOpts
      });
    }

    directionsRenderer.setDirections(result);
  }
  
  function addInfoForMarker(text, open, marker) {    
    if (text && text !== "") {
      var infowindow = new google.maps.InfoWindow({
        content: text
      });
      if (open) {
        infowindow.open(map, marker);
      }
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
    }
  }

  function addMarker(location, title, icon, callback) {
    var marker = new google.maps.Marker({
      position: location,
      //animation: google.maps.Animation.DROP,
      icon: icon,
      title: title,
      map: map
    });
    callback(marker);
    
    return marker;
  }
  
  function drawRoute(type, back, callback) {
    var directionsService = new google.maps.DirectionsService(),
        _addr_from, _addr_to,
        waypoints = [],
        recommended_cost = 0,
        Model;
    
    if (type === "order") {
      Model = MyOrder;
    } else {
      Model = MyOffer;
    }
    
    _addr_from = Model.fromCoords.split(",");
    _addr_to = Model.toCoords.split(",");

    MapElements.marker_b = null;
    MapElements.marker_a = null;

    for (var i = 0; i < Model.toAddresses.length; i++) {
      if (Model.toAddresses[i] && Model.toAddresses[i] !== "") {
        var _wp = Model.toCoordses[i].split(","),
            time = "";

        waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover: true});
        if (Model.times[i]) {
          time = Model.times[i] + ' мин.';
        }
        Maps.addMarker(new google.maps.LatLng(_wp[0], _wp[1]), Model.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', function(mark){
          Maps.addInfoForMarker(time, true, mark);
          MapElements.points.push(mark);
        });
      }
    }

    MapElements.marker_from = Maps.addMarker(new google.maps.LatLng(_addr_from[0], _addr_from[1]), Model.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', function(){});
    MapElements.marker_to = Maps.addMarker(new google.maps.LatLng(_addr_to[0], _addr_to[1]), Model.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', function(){});

    var request = {
      origin: new google.maps.LatLng(_addr_from[0], _addr_from[1]),
      destination: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
      waypoints: waypoints,
      provideRouteAlternatives: false,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    var requestBackTrip = {
      destination: new google.maps.LatLng(_addr_from[0], _addr_from[1]),
      origin: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
      waypoints: waypoints,
      provideRouteAlternatives: true,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    
    SafeWin.overviewPath = [];
    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
        var routes_dist = response.routes[0].legs,
            dura = 0, dist = 0;

        for (var i = 0; i < routes_dist.length; i++) {
          dura += routes_dist[i].duration.value;
          dist += routes_dist[i].distance.value;
        }

        Model.duration = Math.round(dura / 60);
        Model.length = dist;
        recommended_cost = 10 * Math.ceil( ((Model.length / 1000) * cost_of_km) / 10 );
        recommended_cost = recommended_cost < 50 ? 50 : recommended_cost;

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
            callback(recommended_cost);
            if (type === "order") {
              MyOrder = Model;
            } else {
              MyOffer = Model;
            }
          }
        });

      }
    });

    
  }

  
  var Maps = {
      addInfoForMarker: function (text, open, marker) {
        addInfoForMarker(text, open, marker);
      },

      addMarker: function (location, title, icon, callback) {
        addMarker(location, title, icon, function (mark) {
          callback(mark);
        });
      },
      
      drawRoute: function (type, back, callback) {
        drawRoute(type, back, callback);
      },
      
      init: function() {
        var MyLatLng = new google.maps.LatLng(User.lat, User.lng),
            mapCanvas = document.getElementById('map_canvas'),
            mapOptions = {
              center: MyLatLng,
              zoom: 12,
              streetViewControl: false,
              mapTypeControl: false,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };

        map = new google.maps.Map(mapCanvas, mapOptions);
        map.getDiv().insertAdjacentHTML('beforeend', '<i class="icon-target find-me" data-click="find-me"></i>');
        
        var find_me = Dom.sel('.find-me');
        
        find_me.addEventListener('click', function() {
          map.setCenter( new google.maps.LatLng(User.lat, User.lng) );
        });

        SafeWin.map = map;

      },
      
      mapOff: function () {
        document.getElementById('map_canvas').classList.add("hidden");
        for (var i = 0; i < safe_zone_polygons.length; i++) {
          safe_zone_polygons[i].setMap(null);
        }
      },
      
      mapOn: function (disable_safe_zone) {
        document.getElementById('map_canvas').classList.remove("hidden");
        google.maps.event.trigger(map, 'resize'); 
        if (disable_safe_zone) {
          for (var i = 0; i < safe_zone_polygons.length; i++) {
            safe_zone_polygons[i].setMap(SafeWin.map);
          }
        }
      },
      
      mapMoveTab: function (parent) {
        var map_block = document.getElementById('map_canvas');
        
        parent.insertBefore(map_block, parent.children[0]);
      },
      
      mapBackTab: function () {
        var map_block = document.getElementById('map_canvas');
        document.querySelector('main.content').appendChild(map_block);
      },
      
      point2LatLng: function (x, y, map) {
        var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast()),
            bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest()),
            scale = Math.pow(2, map.getZoom()),
            worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);
        
        return map.getProjection().fromPointToLatLng(worldPoint);
      },

      getStreetFromGoogle: function (results) {
        var obj = results[0].address_components, key, address;

        for(key in obj) {
          if(obj[key].types[0] === "street_number") {
            address = obj[key].long_name;
          }
          if(obj[key].types[0] === "route") {
            address = obj[key].long_name + ',' + address;
          }
        }
        
        return address;
      },

      addressToLatLng: function(address, success) {
        var geocoder = new google.maps.Geocoder();
        
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            success(results[0].geometry.location);
          }
        });
      }

    };
    
    return Maps;
    
  });
