  var Geo = (function() { //Ajax
    var old_lat, old_lng;

    function updateUserCoord() {
      if(User.lat !== old_lat || User.lng !== old_lng) {
        Ajax.request(server_uri, 'POST', 'location', User.token, '&latitude=' + User.lat + '&longitude=' + User.lng, '', function(response) {
          if (response && response.ok) {
            //console.log('change your coord');
          }
        });
      }
    }

    function geoFindMe() {
      if (!navigator.geolocation) {
        alert("К сожалению, геолокация не поддерживается в вашем браузере");
        
        return;
      }
      
      var options = {
        enableHighAccuracy: true, 
        maximumAge        : 30000, 
        timeout           : 27000
      };
      
      function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        old_lat = User.lat;
        old_lng = User.lng;
        User.lat = latitude;
        User.lng = longitude;
        
        localStorage.setItem('_my_pos_lat', latitude);
        localStorage.setItem('_my_pos_lon', longitude);
        
        updateUserCoord();

        if (!User.city) {
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(latitude,longitude);
          geocoder.geocode({
            'latLng': latlng
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  var obj = results[0].address_components,key;
                  
                  for (key in obj) {
                    if(obj[key].types[0] === "locality" && !User.city) {
                      User.city = obj[key].long_name;
                      localStorage.setItem('_my_city', User.city);
                      
                      var data = new FormData();
                       data.append('city', User.city);
                       
                      Ajax.request(server_uri, 'POST', 'profile', User.token, '', data, function(response) {
                        console.log('after geofind = ' + response.ok);
                        if (response && response.ok) {
                          init();
                        }
                      });
                    }
                    
                    if (obj[key].types[0] === "country") User.country = obj[key].long_name;
                  }
                  
                }
            });
        }
      };
      
      function error() {
        alert("На вашем устройстве не разрешен доступ к местоположению.");
      };
      
      navigator.geolocation.getCurrentPosition(success, error);
      //navigator.geolocation.watchPosition(success, error, options);
    }

    return {
      init: function() {
        timerUpdateCoords = setInterval(geoFindMe, 5000);
        
        geoFindMe();
      }
    };
  })();
