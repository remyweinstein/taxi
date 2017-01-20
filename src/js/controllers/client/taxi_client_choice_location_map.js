/* global MyOrder, User, google, map, Event */

define(['Dom', 'Maps'], function (Dom, Maps) {
  
  function initMap() {
    var x, y, zoom = 18;
    var _route = localStorage.getItem('_address_temp');
    var _temp_coords = "";
    
    if (_route === "from") {
      _temp_coords = MyOrder.fromCoords;
    }

    if (_route === "to") {
      _temp_coords = MyOrder.toCoords;
    }
    
    if (!User.lat || !User.lng) {
      x = 48.4;
      y = 135.07;
      zoom = 12;
    } else {
      x = User.lat;
      y = User.lng;
    }
    
    if (_temp_coords) {
      x = _temp_coords.split(',');
      y = x[1];
      x = x[0];
    }
    
    var LatLng = new google.maps.LatLng(x, y);
    
    map.setCenter(LatLng);
    map.setZoom(zoom);

    map.getDiv().insertAdjacentHTML('beforeend', '<div class="centerMarker"></div>');
    var center_marker = Dom.sel('.centerMarker');

    google.maps.event.addListener(map, 'drag', function() {
        var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map);
        localStorage.setItem('_choice_coords', coords);
    });
    
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
            // = I choose location =
        if (target.dataset.click === 'i_choice_location') {
          var _route = localStorage.getItem('_address_temp');
          geocoder = new google.maps.Geocoder();

          var latl = localStorage.getItem('_choice_coords');
           latl = latl.replace("(","");
           latl = latl.replace(")","");
           latl = latl.replace(" ","");
           latl = latl.split(",");
          var latlng = latl[0] + ',' + latl[1];

          if (_route === "from") {
            MyOrder.fromCoords = latlng;
          }

          if (_route === "to") {
            MyOrder.toCoords = latlng;
          }

          var substr = _route.substring(0, 7);
          if (substr === "to_plus") {
            var _index = _route.replace("to_plus", "");

            MyOrder.toCoordses[_index] = latlng;
          }

          var latlng = new google.maps.LatLng(latl[0], latl[1]);

          geocoder.geocode ({
            'latLng': latlng
          }, function (results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                var _address = Maps.getStreetFromGoogle(results);

                if (_route === "from") {
                  MyOrder.fromAddress = _address;
                }

                if (_route === "to") {
                  MyOrder.toAddress = _address;
                }

                var substr = _route.substring(0, 7);
                if (substr === "to_plus") {
                  var _index = _route.replace("to_plus", "");
                  MyOrder.toAddresses[_index] = _address;
                }
                
                window.location.hash = '#client_city';
              }
            });

          return;
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }

    };

    content.addEventListener('click', Event.click);
  }
  
  function stop() {
    var center_marker = Dom.sel('.centerMarker');
    
    center_marker.parentNode.removeChild(center_marker);
  }
  
  function start() {
    Maps.mapOn();
    initMap();
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
    
});