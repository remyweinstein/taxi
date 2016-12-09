define('Geo', ['App', 'Ajax', 'Uries', 'jsts', 'Settings'], function (App, Ajax, Uries, jsts, Settings) {

    var old_lat, old_lng;

    function updateUserCoord() {
      if(App.user.lat !== old_lat || App.user.lng !== old_lng) {
        Ajax.request(Uries.server_uri, 'POST', 'location', App.user.token, '&latitude=' + App.user.lat + '&longitude=' + App.user.lng, '', function(response) {
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
        old_lat = App.user.lat;
        old_lng = App.user.lng;
        App.user.lat = latitude;
        App.user.lng = longitude;
        
        localStorage.setItem('_my_pos_lat', latitude);
        localStorage.setItem('_my_pos_lon', longitude);
        
        updateUserCoord();

        if (!App.user.city || App.user.city === null || App.user.city === "null") {
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(latitude,longitude);
          geocoder.geocode({
            'latLng': latlng
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  var obj = results[0].address_components,key;
                  
                  for (key in obj) {
                    if(obj[key].types[0] === "locality") {
                      App.user.city = obj[key].long_name;
                      //App.user.city = 'Хабаровск';
                      localStorage.setItem('_my_city', App.user.city);
                      
                      var data = new FormData();
                       data.append('city', App.user.city);
                       
                      Ajax.request(Uries.server_uri, 'POST', 'profile', App.user.token, '', data, function(response) {
                        //console.log('after geofind = ' + response.ok);
                        if (response && response.ok) {
                          init();
                        }
                      });
                    }
                    
                    if (obj[key].types[0] === "country") App.user.country = obj[key].long_name;
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
  
  var Geo = {

      init: function() {
        timerUpdateCoords = setInterval(geoFindMe, 5000);
        
        geoFindMe();
      },
      
      showPoly: function(overviewPath, map) {
        var overviewPathGeo = [];

        for (var i = 0; i < overviewPath.length; i++) {
          overviewPathGeo.push(
            [overviewPath[i].lng(), overviewPath[i].lat()]
          );
        }

        var distance = Settings.safeRadius / 500 / 111.12, // Roughly x km / 111.12
        geoInput = {
          type: "LineString",
          coordinates: overviewPathGeo
        };
        var geoReader = new jsts.io.GeoJSONReader(),
         geoWriter = new jsts.io.GeoJSONWriter();
        var geometry = geoReader.read(geoInput).buffer(distance);
        var polygon = geoWriter.write(geometry);

        var oLanLng = [];
        var oCoordinates;
        oCoordinates = polygon.coordinates[0];

        for (i = 0; i < oCoordinates.length; i++) {
          var oItem;
          oItem = oCoordinates[i];
          oLanLng.push(new google.maps.LatLng(oItem[1], oItem[0]));
        }

        var polygone = new google.maps.Polygon({
          paths: oLanLng,
          map:map
        });
      }
      
  };
  
  return Geo;

});
