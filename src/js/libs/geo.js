/* global User, Settings, Conn, Maps, google */

define(function () {

    var old_lat, old_lng, timerGetLocation = false;

    function success(position) {
      var latitude  = position.coords.latitude,
          longitude = position.coords.longitude;
        
      if (timerGetLocation) {
        clearInterval(timerGetLocation);
      }
      
      isGeolocation = true;
      
      if (old_lat !== latitude  || old_lng !== longitude) {
        User.lat = latitude;
        User.lng = longitude;
        User.save();
        Conn.request('updateUserLocation');
        Conn.request('getProfile');
        old_lat = User.lat;
        old_lng = User.lng;
      }

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
                      var name = User.name || 'Гость',
                          data = new FormData();
                          data.append('city', User.city);
                          data.append('name', name);

                      MayLoading = true;
                      Conn.request('updateProfile', data);
                      User.save();
                    }
                  }

                  if (obj[key].types[0] === "country") {
                    User.country = obj[key].long_name;
                    User.save();
                  }
                }

              }
          });
      }
    }

    function error(resp) {
      var xhr = new XMLHttpRequest;

      xhr.onreadystatechange = function() {
          if (xhr.readyState === 4 && xhr.status === 200) {

            var position = {},
                str = xhr.responseText,
                xmlDoc;
                //ipinfo = JSON.parse(xhr.responseText);

            str = str.replace('</table> -->', '');

            var first_find = str.indexOf('<table class="table table-striped">'),
                last_find  = str.indexOf('</table>') + 8;

            str = str.substring(first_find, last_find);

            if (window.DOMParser) {
              parser = new DOMParser();
              xmlDoc = parser.parseFromString(str, "text/xml");
            } else {
              xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
              xmlDoc.async = false;
              xmlDoc.loadXML(str);
            }
            
            //data-loc="43.1281,131.9010"
            //.querySelector('[data-loc]')
            
            var location = xmlDoc.querySelector('[data-loc]').innerHTML,
                latLong = location.split(",");

            position.coords = {};
            position.coords.latitude = latLong[0];
            position.coords.longitude = latLong[1];
            success(position);                
          }
      };
      xhr.open("GET", "https://ipinfo.io", true);
      xhr.setRequestHeader('Content-Type', 'application/json');        
      xhr.send();

      console.log('geo location error: ', resp);
    }

    function geoFindMe() {
      if (!navigator.geolocation) {
        alert("Необходимо разрешить доступ к местоположению");
        return false;
      }

      //navigator.geolocation.getCurrentPosition(success, error);
      return navigator.geolocation.watchPosition(success, error, {
        enableHighAccuracy : false,
        maximumAge         : 0,
        timeout            : 27000
      });
    }

  var Geo = {

      init: function() {
        //setInterval(geoFindMe, 1000);
        if (!geoFindMe() && !MayLoading) {
          timerGetLocation = setInterval(geoFindMe, 5000);
        }
      },
      
      roundCoords: function(coord) {
        return Math.round(coord * 1000000)/1000000;
      },

      distance: function(lat1, long1, lat2, long2) {
        var R = 6372795;

        lat1 *= Math.PI / 180;
        lat2 *= Math.PI / 180;
        long1 *= Math.PI / 180;
        long2 *= Math.PI / 180;

        var cl1 = Math.cos(lat1);
        var cl2 = Math.cos(lat2);
        var sl1 = Math.sin(lat1);
        var sl2 = Math.sin(lat2);
        var delta = long2 - long1;
        var cdelta = Math.cos(delta);
        var sdelta = Math.sin(delta);
        var y = Math.sqrt(Math.pow(cl2 * sdelta, 2) + Math.pow(cl1 * sl2 - sl1 * cl2 * cdelta, 2));
        var x = sl1 * sl2 + cl1 * cl2 * cdelta;
        var ad = Math.atan2(y, x);
        var dist = ad * R;

        return (dist/1000).toFixed(2);
      }
      
  };
  
  return Geo;

});
