    var from = Dom.sel('input[name="from"]');
    var to = Dom.sel('input[name="to"]');
    var marker_a, marker_b;
    var distanse;

    from.value = localStorage.getItem('_address_from');
    to.value = localStorage.getItem('_address_to');

    from.addEventListener('click', function() {
      //var target = event.target;
      localStorage.setItem('_address_temp', 'from');
      document.location = '#client__choose_address';
    });
    
    to.addEventListener('click', function() {
      //var target = event.target;
      localStorage.setItem('_address_temp', 'to');
      document.location = '#client__choose_address';
    });

    initialize_iam();        


    // Google maps TAXY CLIENT CITY ORDER 
    function initialize_iam() {
      var zoom = 15;
      //var LatLng = new google.maps.LatLng(48.49, 135.07);
      var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
      var mapCanvas = document.getElementById('map_canvas_iam');
      var mapOptions = {
        center: MyLatLng,
        zoom: zoom,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map_choice = new google.maps.Map(mapCanvas, mapOptions);
      var marker_mine = new google.maps.Marker({
        position: MyLatLng,
        map: map_choice,
        icon: 'http://labs.google.com/ridefinder/images/mm_20_orange.png',
        title: 'Я здесь!'
      });
      
      var addr_from = Dom.sel('.adress_from').value;
      var addr_to = Dom.sel('.adress_to').value;
      
      if (addr_from !== '' && addr_to === '') {
        var addr_from = localStorage.getItem('_address_coord_from').split("-");
        marker_a = addMarker(new google.maps.LatLng(addr_from[0], addr_from[1]), Dom.sel('.adress_from').value, '//www.google.com/mapfiles/markerA.png', map_choice);
      }
      
      if (addr_to !== '' && addr_from === '') {
        var addr_to = localStorage.getItem('_address_coord_to').split("-");
        marker_b = addMarker(new google.maps.LatLng(addr_to[0], addr_to[1]), Dom.sel('.adress_to').value, '//www.google.com/mapfiles/markerB.png', map_choice);
      }
      
      if (addr_from !== '' && addr_to !== '') drawLine();
      
      function drawLine() {
        var directionsService = new google.maps.DirectionsService();
        //if (marker_b && marker_a) {
          marker_b = null;
          marker_a = null;
          var addr_from = localStorage.getItem('_address_coord_from').split("-");
          var addr_to = localStorage.getItem('_address_coord_to').split("-");
          var request = {
            origin: new google.maps.LatLng(addr_from[0], addr_from[1]), 
            destination: new google.maps.LatLng(addr_to[0], addr_to[1]),
            //waypoints: waypoints,
            provideRouteAlternatives: false,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };

          directionsService.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              distanse = response.routes[0].legs[0].distance.value;
              new google.maps.DirectionsRenderer({
                map: map_choice,
                directions: response,
                routeIndex: 0
              });
            }
          });
          
          /*
          var findPathCoordinates = [
            {lat: marker_b.getPosition().lat(), lng: marker_b.getPosition().lng()},
            {lat: marker_a.getPosition().lat(), lng: marker_a.getPosition().lng()}
          ];
          var findPath = new google.maps.Polyline({
            path: findPathCoordinates,
            geodesic: true,
            strokeColor: '#FF0000',
            strokeOpacity: 1.0,
            strokeWeight: 1
          });
          findPath.setMap(map_choice);
          */
        //}
      }

      function addMarker(location, title, icon, map) {
        var marker = new google.maps.Marker({
          position: location,
          animation: google.maps.Animation.DROP,
          icon: icon,
          title: title,
          map: map
        });
        
        return marker;
      }
      
      google.maps.event.addListener(map_choice, 'drag', function() {
        //var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
        //localStorage.setItem('_choice_coords', coords);
      }); 
    }

    content.addEventListener('click', function(event) {
      var target = event.target;
      
      while (target !== this) {
            // = Click choose location =
        if (target.dataset.click === 'choice_location') {
          localStorage.setItem('_address_temp', target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
          document.location = '#client__choice_location_map';
          
          return;
        }
            // = Form add new point order =
        if (target.dataset.click === 'field_add') {
          var just_add = Dom.selAll('.icon-record').length;

          if (just_add < 3) {
            var el = Dom.sel('.order-city-to');                       
            var new_field = document.createElement('div');
             new_field.className += 'form-order-city__field order-city-from';
             new_field.innerHTML = '<i class="icon-record form-order-city__label"></i><span class="form-order-city__wrap"><input type="text" name="to_plus'+(just_add+1)+'" value="" placeholder="Заезд"/></span><span data-click="field_delete" class="form-order-city__field_delete"><i class="icon-trash"></i></span>';
             
            var parentDiv = el.parentNode;
             parentDiv.insertBefore(new_field, el);
          }
          
          return;
        }
            // = Form delete point order =
        if (target.dataset.click === 'field_delete') {
          var be_dead = target.parentNode;
           be_dead.parentNode.removeChild(be_dead);
           
          return;
        }
        
        target = target.parentNode;
      }
    });

    
    content.addEventListener('submit', function(event) {
      var target = event.target;
      
      while (target !== this) {
            // = Click choose location =
        if (target.dataset.submit === "taxy_client_city") {
            Dom.sel('[data-click="order-taxi"]').disabled = true;
            var from_address = Dom.sel('.adress_from').value;
            var to_address = Dom.sel('.adress_to').value;
            var price = Dom.sel('[name="cost"]').value;
            var comment = Dom.sel('[name="description"]').value;
            var to1 = "", to2 = "", to3 = "";
            var data = new FormData();

            event.preventDefault();

            Address.saveAddress(from_address, to_address);

            if (Dom.sel('[name="to_plus1"]')) {
              to1 = Dom.sel('[name="to_plus1"]').value;
              data.append('toAddress1', to1);
              data.append('toLocation1', localStorage.getItem('_address_coord_to1'));
            }

            if (Dom.sel('[name="to_plus2"]')) {
              to2 = Dom.sel('[name="to_plus2"]').value;
              data.append('toAddress2', to2);
              data.append('toLocation2', localStorage.getItem('_address_coord_to2'));
            }

            if (Dom.sel('[name="to_plus3"]')) {
              to3 = Dom.sel('[name="to_plus3"]').value;
              data.append('toAddress3', to3);
              data.append('toLocation3', localStorage.getItem('_address_coord_to3'));
            }

            Address.saveWaypoints(to1, to2, to3);

            data.append('fromCity', User.city);
            data.append('fromAddress', from_address);
            data.append('fromLocation', localStorage.getItem('_address_coord_from'));
            data.append('toCity0', User.city);
            data.append('toAddress0', to_address);
            data.append('toLocation0', localStorage.getItem('_address_coord_to'));
            data.append('isIntercity', 0);
            //data.append('bidId', '');
            data.append('price', price);
            data.append('comment', comment);
            data.append('minibus', 0);
            data.append('babyChair', 0);
            data.append('distance', distanse);

            Ajax.request(server_uri, 'POST', 'order', User.token, '', data, function(response) {
              //console.log(response);
              if (response && response.ok) {
                localStorage.setItem('_id_current_taxy_order', response.id);
                localStorage.setItem('_current_price_order', price);
                localStorage.setItem('_current_comment_order', comment);
                document.location= '#client__map';
              } else alert('Укажите в профиле ваш город');
            });
      
          return;
        }
        
        target = target.parentNode;
      }
    });
