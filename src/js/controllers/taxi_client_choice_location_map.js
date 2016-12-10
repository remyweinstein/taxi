define(['Dom', 'Maps'], function (Dom, Maps) {
  
  function initialize_choice() {
    var x, y, zoom = 18;
    
    if (!User.lat || !User.lng) {
      x = 48.4;
      y = 135.07;
      zoom = 12;
    } else {
      x = User.lat;
      y = User.lng;
    }
    
    var LatLng = new google.maps.LatLng(x,y);
    var mapCanvas = document.getElementById('map_canvas_choice');
    var mapOptions = {
        center: LatLng,
        zoom: zoom, 
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    map_choice = new google.maps.Map(mapCanvas, mapOptions);
    map_choice.getDiv().insertAdjacentHTML('beforeend', '<div class="centerMarker"></div>');
    var center_marker = Dom.sel('.centerMarker');

    google.maps.event.addListener(map_choice, 'drag', function() {
        var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
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

        target = target.parentNode;
      }

    };

    content.addEventListener('click', Event.click);
  }
  
  function start() {
    initialize_choice();
    addEvents();
  }
  
  return {
    start: start
  };
    
});