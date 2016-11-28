    var from = Dom.sel('input[name="from"]');
    var to = Dom.sel('input[name="to"]');

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
      var x,y,zoom = 15;
       x = User.lat;
       y = User.lng;
      var MyLatLng = new google.maps.LatLng(x,y);
      var mapCanvas = document.getElementById('map_canvas_iam');
      var mapOptions = {
        center: MyLatLng,
        zoom: zoom,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      var map_choice = new google.maps.Map(mapCanvas, mapOptions);
      var marker = new google.maps.Marker({
        position: MyLatLng,
        map: map_choice,
        title: 'Я здесь!'
      });

      if (Dom.sel('.adress_from').value !== '') {
        Maps.addressToLatLng(Dom.sel('.adress_from').value + ',' + User.city, function(latlng) {
          addMarker(latlng, Dom.sel('.adress_from').value, 'https://yastatic.net/doccenter/images/tech-ru/maps/doc/freeze/s-eX54MUgq4nSFXzzxVYZ7SfVis.png', map_choice);
        });
      }
      
      if (Dom.sel('.adress_to').value !== '') {
        Maps.addressToLatLng(Dom.sel('.adress_to').value + ',' + User.city, function(latlng) {
          addMarker(latlng, Dom.sel('.adress_to').value, 'https://yastatic.net/doccenter/images/tech-ru/maps/doc/freeze/Lg_lnltSypbyZteO0rX5V4E9Nzk.png', map_choice);
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
      }
      
      google.maps.event.addListener(map_choice, 'drag', function() {
        //var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
        //localStorage.setItem('_choice_coords', coords);
      }); 
    }

    var content = Dom.sel('.content');
    content.addEventListener('click', function(event) {
      var target = event.target;
      
      while (target !== this) {
            // = Click choose location =
        if (target.dataset.click === 'choice_location') {
          document.location = '#client__choice_location_map';
          Funcs.setTempRequestLS(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
          
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
        
        // = Form Taxy Client City =
    Dom.sel('[data-submit="taxy_client_city"]').addEventListener('submit', function(event) {
      var from_address = Dom.sel('.adress_from').value;
      var to_address = Dom.sel('.adress_to').value;
      var price = Dom.sel('[name="cost"]').value;
      var comment = Dom.sel('[name="description"]').value;
      var to1="",to2="",to3="";
      var data = new FormData();
      
      event.preventDefault();
      
      Address.saveAddress(from_address, to_address);

      if (Dom.sel('[name="to_plus1"]')) {
        to1 = Dom.sel('[name="to_plus1"]').value;
        data.append('toAddress1', to1);
      }
      
      if (Dom.sel('[name="to_plus2"]')) {
        to2 = Dom.sel('[name="to_plus2"]').value;
        data.append('toAddress2', to2);
      }
      
      if (Dom.sel('[name="to_plus3"]')) {
        to3 = Dom.sel('[name="to_plus3"]').value;
        data.append('toAddress3', to3);
      }
      
      Address.saveWaypoints(to1,to2,to3);

      data.append('fromCity', User.city);
      data.append('fromAddress', from_address);
      data.append('toCity0', User.city);
      data.append('toAddress0', to_address);
      data.append('isIntercity', 0);
      //data.append('bidId', '');
      data.append('price', price);
      data.append('comment', comment);
      data.append('minibus', 0);
      data.append('babyChair', 0);

      Ajax.request(server_uri, 'POST', 'order', User.token, '', data, function(response) {
        //console.log(response);
        if (response && response.ok) {
          localStorage.setItem('_id_current_taxy_order', response.id);
          localStorage.setItem('_current_price_order', price);
          localStorage.setItem('_current_comment_order', comment);
          document.location= '#client__map';
        } else alert('Укажите в профиле ваш город');
      });
      
      return false;
    });
