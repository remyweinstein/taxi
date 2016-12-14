define(['Ajax', 'jsts'], function (Ajax, jsts) {

    var old_lat, old_lng;
    
    function updateUserCoord() {
      
      if(User.lat !== old_lat || User.lng !== old_lng) {
        Ajax.request('POST', 'location', User.token, '&latitude=' + User.lat + '&longitude=' + User.lng, '', function(response) {
          if (response && response.ok) {
            //console.log('change your coord');
          }
        }, function() {});
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

        if (!User.city || User.city === null || User.city === "null") {
          geocoder = new google.maps.Geocoder();
          var latlng = new google.maps.LatLng(latitude,longitude);
          geocoder.geocode({
            'latLng': latlng
            }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {
                  var obj = results[0].address_components,key;
                  
                  for (key in obj) {
                    if(obj[key].types[0] === "locality") {
                      User.city = obj[key].long_name;
                      //User.city = 'Хабаровск';
                      localStorage.setItem('_my_city', User.city);
                      var name = User.name ? User.name : 'Гость';
                      var data = new FormData();
                        data.append('city', User.city);
                        data.append('name', name);
                       
                      Ajax.request('POST', 'profile', User.token, '', data, function(response) {
                        console.log(response);
                        if (response && response.ok) {
                          init();
                        }
                      }, function() {});
                    }
                    
                    if (obj[key].types[0] === "country") User.country = obj[key].long_name;
                  }
                  
                }
            });
        }
      };
      
      function error() {

      };
      
      //navigator.geolocation.getCurrentPosition(success, error);
      var watchID = navigator.geolocation.watchPosition(success, error, options);
    }
  
  var Geo = {

      init: function() {
        geoFindMe();
      },
      
      showPoly: function(overviewPath, map) {
        var overviewPathGeo = [];

        for (var i = 0; i < overviewPath.length; i++) {
          overviewPathGeo[i] = [];
          for (var z = 0; z < overviewPath[i].length; z++) {
            overviewPathGeo[i].push([overviewPath[i][z].lng(), overviewPath[i][z].lat()]);
          }
        }

        var distance = Settings.safeRadius / 500 / 111.12, // Roughly x km / 111.12
        geoInput = {
          type: "MultiLineString",
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
          //strokeWeight: 0,
          map:map
        });
      }
      
  };
  
  return Geo;

});
