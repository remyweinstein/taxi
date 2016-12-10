define(function() {  // Google

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
