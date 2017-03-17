/* global User, Settings, Conn, Maps */

define(function () {

    var old_lat, old_lng;


    function geoFindMe() {
      if (!navigator.geolocation) {
        alert("К сожалению, геолокация не поддерживается в вашем браузере");
        
        return;
      }
      
      var options = {
        enableHighAccuracy: true,
        maximumAge        : 0,
        timeout           : 27000
      };
      
      function success(position) {
        var latitude  = position.coords.latitude,
            longitude = position.coords.longitude;
          
        old_lat = User.lat;
        old_lng = User.lng;
        User.lat = latitude;
        User.lng = longitude;
        
        localStorage.setItem('_my_pos_lat', latitude);
        localStorage.setItem('_my_pos_lon', longitude);
        
        Conn.request('updateUserLocation');
        
        if (!User.city) {
          var latlng = new google.maps.LatLng(latitude,longitude);
          
          geocoder = new google.maps.Geocoder();// .setLanguage('ru');//Cyrl
          geocoder.geocode({
            'latLng': latlng
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  var obj = results[0].address_components,key;
                  
                  for (key in obj) {
                    if(obj[key].types[0] === "locality") {
                      if (obj[key].long_name) {
                        User.city = obj[key].long_name;
                        localStorage.setItem('_my_city', User.city);
                        var name = User.name || 'Гость',
                            data = new FormData();
                            data.append('city', User.city);
                            data.append('name', name);
                            
                        MayLoading = true;
                        Conn.request('updateProfile', data);
                        //App.init();
                      }
                    }
                    
                    if (obj[key].types[0] === "country") {
                      User.country = obj[key].long_name;
                    }
                  }
                  
                }
            });
        }
      }
      
      function error() {}
      
      //navigator.geolocation.getCurrentPosition(success, error);
      var watchID = navigator.geolocation.watchPosition(success, error, options);
      
      return;
    }

  var Geo = {

      init: function() {
        //setInterval(geoFindMe, 1000);
        geoFindMe();
      },

      distance: function(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1 / 180,
            radlat2 = Math.PI * lat2 / 180,
            theta = lon1 - lon2,
            radtheta = Math.PI * theta/180,
            dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        
        dist = Math.acos(dist);
        dist = dist * 180 / Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
          
        return dist;
      }
      
  };
  
  return Geo;

});
