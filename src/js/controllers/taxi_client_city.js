    var from = Dom.sel('input[name="from"]');
    var to = Dom.sel('input[name="to"]');
    var to_plus1 = Dom.sel('input[name="to_plus1"]');
    var to_plus2 = Dom.sel('input[name="to_plus2"]');
    var to_plus3 = Dom.sel('input[name="to_plus3"]');
    
    var marker_a, marker_b;
    var price = Dom.sel('[name="cost"]').value;
    var comment = Dom.sel('[name="description"]').value;

    if (MyOrder.toAddress1 !== "") {
      AddNewZaezd(1);
      Dom.sel('input[name="to_plus1"]').value = MyOrder.toAddress1;
    }
    if (MyOrder.toAddress2 !== "") {
      AddNewZaezd(2);
      Dom.sel('input[name="to_plus2"]').value = MyOrder.toAddress2;
    }
    if (MyOrder.toAddress3 !== "") {
      AddNewZaezd(3);
      Dom.sel('input[name="to_plus3"]').value = MyOrder.toAddress3;
    }
    
    
    price.value = MyOrder.price;
    comment.value = MyOrder.comment;


    //from.value = localStorage.getItem('_address_from');
    //to.value = localStorage.getItem('_address_to');
    from.value = MyOrder.fromAddress;
    to.value = MyOrder.toAddress;

    function addEventChooseAddress(el) {
      Dom.sel('input[name="' + el + '"]').addEventListener('click', function() {
        localStorage.setItem('_address_temp', el);
        document.location = '#client__choose_address';
      });
    }

      addEventChooseAddress('from');    
      addEventChooseAddress('to');
    
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
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
        title: 'Я здесь!'
      });
      
      var from_value = from.value;
      var to_value = to.value;
      
      if (from_value !== '' && to_value === '') {
        var _addr_from = MyOrder.fromCoords.split(",");
        marker_a = addMarker(new google.maps.LatLng(_addr_from[0], _addr_from[1]), from_value, '//www.google.com/mapfiles/markerA.png', map_choice);
      }
      
      if (to_value !== '' && from_value === '') {
        var _addr_to = MyOrder.toCoords.split(",");
        marker_b = addMarker(new google.maps.LatLng(_addr_to[0], _addr_to[1]), to_value, '//www.google.com/mapfiles/markerB.png', map_choice);
      }
      
      if (from_value !== '' && to_value !== '') drawLine();
      
      function drawLine() {
        var directionsService = new google.maps.DirectionsService();
        //if (marker_b && marker_a) {
          marker_b = null;
          marker_a = null;
          var _addr_from = MyOrder.fromCoords.split(",");
          var _addr_to = MyOrder.toCoords.split(",");
          
          var waypoints = [];
          if (MyOrder.toAddress1 !== "") {
            var _wp = MyOrder.toCoords1.split(",");
            waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover: true});
          }
          if (MyOrder.toAddress2 !== "") {
            var _wp = MyOrder.toCoords2.split(",");
            waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover: true});
          }
          if (MyOrder.toAddress3 !== "") {
            var _wp = MyOrder.toCoords3.split(",");
            waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover: true});
          }

          var request = {
            origin: new google.maps.LatLng(_addr_from[0], _addr_from[1]), 
            destination: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
            waypoints: waypoints,
            provideRouteAlternatives: false,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };

          directionsService.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {
              MyOrder.distance = response.routes[0].legs[0].distance.value;
              new google.maps.DirectionsRenderer({
                map: map_choice,
                directions: response,
                routeIndex: 0
              });
            }
          });
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

    function AddNewZaezd(just_add) {
      var el = Dom.sel('.order-city-to');
      var new_field = document.createElement('div');
       new_field.className += 'form-order-city__field order-city-from';
       new_field.innerHTML = '<i class="icon-record form-order-city__label"></i>\n\
                              <span class="form-order-city__wrap">\n\
                                <input type="text" name="to_plus' + just_add + '" value="" placeholder="Заезд"/>\n\
                              </span>\n\
                              <span data-click="field_delete" data-id="' + just_add + '" class="form-order-city__field_delete">\n\
                                <i class="icon-trash"></i>\n\
                              </span>\n\
                              <i data-click="choice_location" class="icon-street-view form-order-city__add-button"></i>';

      var parentDiv = el.parentNode;
        parentDiv.insertBefore(new_field, el);
      addEventChooseAddress('to_plus' + just_add);
    }

    Event.click = function (event) {
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
            AddNewZaezd(just_add + 1);
          }
          
          return;
        }
            // = Form delete point order =
        if (target.dataset.click === 'field_delete') {
          var _id = target.dataset.id;
          
          if (_id === "1") {
            MyOrder.toAddress1 = "";
            MyOrder.toCoords1 = "";
          }
            
          if (_id === "2") {
            MyOrder.toAddress2 = "";
            MyOrder.toCoords2 = "";
          }
            
          if (_id === "3") {
            MyOrder.toAddress3 = "";
            MyOrder.toCoords3 = "";
          }
            
          var be_dead = target.parentNode;
           be_dead.parentNode.removeChild(be_dead);
           
          return;
        }
        
        target = target.parentNode;
      }
    };

    content.addEventListener('click', Event.click);

    Event.submit = function (event) {
      var target = event.target;
      
      while (target !== this) {
            // = Click choose location =
        if (target.dataset.submit === "taxy_client_city") {
            Dom.sel('[data-click="order-taxi"]').disabled = true;
            
            var to_plus1 = Dom.sel('[name="to_plus1"]');
            var to_plus2 = Dom.sel('[name="to_plus2"]');
            var to_plus3 = Dom.sel('[name="to_plus3"]');
            
            MyOrder.price = Dom.sel('[name="cost"]').value;
            MyOrder.comment = Dom.sel('[name="description"]').value;
            
            var from_address = MyOrder.fromAddress;
            var to_address = MyOrder.toAddress;
            var price = MyOrder.price;
            var comment = MyOrder.comment;
            var to1 = "", to2 = "", to3 = "";
            var data = new FormData();

            event.preventDefault();

            Address.saveAddress(from_address, to_address);

            if (to_plus1) {
              to1 = to_plus1.value;
              MyOrder.toAddress1 = to1;
              data.append('toAddress1', to1);
              data.append('toLocation1', MyOrder.toCoords1);
            }

            if (to_plus2) {
              to2 = to_plus2.value;
              MyOrder.toAddress2 = to2;
              data.append('toAddress2', to2);
              data.append('toLocation2', MyOrder.toCoords2);
            }

            if (to_plus3) {
              to3 = to_plus3.value;
              MyOrder.toAddress3 = to3;
              data.append('toAddress3', to3);
              data.append('toLocation3', MyOrder.toCoords3);
            }

            Address.saveWaypoints(to1, to2, to3);

            data.append('fromCity', User.city);
            data.append('fromAddress', MyOrder.fromAddress);
            data.append('fromLocation', MyOrder.fromCoords);
            data.append('toCity0', User.city);
            data.append('toAddress0', MyOrder.toAddress);
            data.append('toLocation0', MyOrder.toCoords);
            data.append('isIntercity', 0);
            //data.append('bidId', '');
            data.append('price', MyOrder.price);
            data.append('comment', MyOrder.comment);
            data.append('minibus', 0);
            data.append('babyChair', 0);
            data.append('distance', MyOrder.distance);

            Ajax.request(server_uri, 'POST', 'order', User.token, '', data, function(response) {
              //console.log(response);
              if (response && response.ok) {
                MyOrder.id = response.id;
                document.location= '#client__map';
              } else alert('Укажите в профиле ваш город');
            });
      
          return;
        }
        
        target = target.parentNode;
      }
    };
    
    content.addEventListener('submit', Event.submit);