/* global User, google, Settings, Conn */

define(['jsts'], function (jsts) {

    var old_lat, old_lng;


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
        var latitude  = position.coords.latitude,
            longitude = position.coords.longitude;
          
        old_lat = User.lat;
        old_lng = User.lng;
        User.lat = latitude;
        User.lng = longitude;
        
        localStorage.setItem('_my_pos_lat', latitude);
        localStorage.setItem('_my_pos_lon', longitude);
        
        Conn.request('updateUserLocation');

        if (!User.city || User.city === null || User.city === "null") {
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
      
      return watchID;
    }

  var Geo = {

      init: function(app) {
        geoFindMe(app);
      },

      distance: function(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1/180,
            radlat2 = Math.PI * lat2/180,
            theta = lon1-lon2,
            radtheta = Math.PI * theta/180,
            dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
          
        return dist;
      },

      drawPoly: function(Coords, map) {
        var polygon = false;
        
        if (Coords) {
          polygon = new google.maps.Polygon({
            paths: Coords
            //strokeColor: '#FF0000',
            //strokeOpacity: 0.8,
            //strokeWeight: 2,
            //draggable: true,
            //fillColor: '#FF0000',
            //fillOpacity: 0.35
          });
          polygon.setMap(map);
        }
        
        return polygon;
      },

      showPoly: function(overviewPath, map) {
        var overviewPathGeo = [];
          
        for (var i = 0; i < overviewPath.length; i++) {
          overviewPathGeo[i] = [];
          for (var z = 0; z < overviewPath[i].length; z++) {
            overviewPathGeo[i].push([overviewPath[i][z].lng(), overviewPath[i][z].lat()]);
          }
        }

        var distance = Settings.safeRadius / 500 / 111.12,
        geoInput = {
          type: "MultiLineString",
          coordinates: overviewPathGeo
          };
        var geoReader = new jsts.io.GeoJSONReader(),
            geoWriter = new jsts.io.GeoJSONWriter();
        var geometry = geoReader.read(geoInput).buffer(distance, 2);
        var polygon = geoWriter.write(geometry);

        var oLanLng = [],
            oCoordinates = polygon.coordinates[0];
        
        for (i = 0; i < oCoordinates.length; i++) {
          var oItem = oCoordinates[i];
          
          oLanLng.push(new google.maps.LatLng(oItem[1], oItem[0]));
        }
        
        var polygone = new google.maps.Polygon({
          paths: oLanLng,
          //strokeWeight: 0,
          map: map
        });
        
        return polygone;
        
      }
      
  };
  
  return Geo;

});
