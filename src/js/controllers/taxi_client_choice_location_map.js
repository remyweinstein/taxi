  initialize_choice();

  function initialize_choice() {
    var x,y,zoom = 18;
    
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

    content.addEventListener('click', function(event) {
      var target = event.target;
      
      while (target !== this) {
            // = I choose location =
        if (target.dataset.click === 'i_choice_location') {
          var name = localStorage.getItem('_address_temp');
          geocoder = new google.maps.Geocoder();
          
          var latl = localStorage.getItem('_choice_coords');
           latl = latl.replace("(","");
           latl = latl.replace(")","");
           latl = latl.replace(" ","");
           latl = latl.split(",");
           
          localStorage.setItem('_address_coord_' + name, latl[0] + '-' + latl[1]);
          var latlng = new google.maps.LatLng(latl[0], latl[1]);

          geocoder.geocode ({
            'latLng': latlng
          }, function (results, status) {
               if (status === google.maps.GeocoderStatus.OK) {
                 localStorage.setItem('_address_' + name, Maps.getStreetFromGoogle(results));
                 Dom.sel('input[name="' + name + '"]').value = localStorage.getItem('_address_' + name);
              }
            });
          document.location = '#client__city';

          return;
        }
        
        target = target.parentNode;
      }
      
    });
