/* global google, SafeWin, User, safe_zone_polygons */

define(['Dom'], function(Dom) {  // Google

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
  
  var Maps = {
    
      requestDirections: function (directionsService, start, end, polylineOpts) {
        directionsService.route({
          origin: start,
          destination: end,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        }, function(result) {
          renderDirections(result, polylineOpts);
        });
      },
      
      init: function() {
        var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
        var mapCanvas = document.getElementById('map_canvas');
        var mapOptions = {
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
      
      mapOn: function (enable_safe_zone = true) {
        document.getElementById('map_canvas').classList.remove("hidden");
        google.maps.event.trigger(map, 'resize'); 
        if (enable_safe_zone) {
          for (var i = 0; i < safe_zone_polygons.length; i++) {
            safe_zone_polygons[i].setMap(SafeWin.map);
          }
        }
      },
      
      point2LatLng: function (x, y, map) {
        var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
        var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
        var scale = Math.pow(2, map.getZoom());
        var worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);
        
        return map.getProjection().fromPointToLatLng(worldPoint);
      },

      getStreetFromGoogle: function (results) {
        var obj = results[0].address_components, key, address;

        for(key in obj) {
          if(obj[key].types[0] === "street_number") address = obj[key].long_name;
          if(obj[key].types[0] === "route") address = obj[key].long_name + ',' + address;
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
