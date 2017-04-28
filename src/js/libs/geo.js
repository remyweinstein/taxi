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

            var location = xmlDoc.getElementsByTagName("tr")[3].childNodes[3].innerHTML,
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
