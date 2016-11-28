    bid_id = localStorage.getItem('_current_id_bid');
    var LatLng = new google.maps.LatLng(48.49, 135.07);
    var mapCanvas = document.getElementById('map_canvas_go');
    var mapOptions = {
      center: LatLng,
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(mapCanvas, mapOptions);
    var markers = new Array;              
    var show_route = false;
    var address, address_clear, waypoints;
    var price, dr_model, dr_name, dr_color, dr_number, dr_photo, dr_vehicle;

    function setRoute() {
      var el_route = Dom.sel('.wait-order-approve__route-info__route');
       el_route.children[0].innerHTML = address_clear[0];
       el_route.children[2].innerHTML = address_clear[1];
      var el_price = Dom.sel('.wait-order-approve__route-info__price');
       el_price.innerHTML = price+' руб.';
      var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
       el_cancel.innerHTML = '<button class="button_rounded--red">Отмена</button>';
      var el = Dom.sel('.wait-bids-approve');
       el.innerHTML += '<div class="wait-bids-approve__item"><div class="wait-bids-approve__item__distance">Автомобиль:<br/>Цвет: ' + dr_color + '<br/>Рег.номер: ' + dr_number + '</div><div class="wait-bids-approve__item__car"><div><img src="'+dr_vehicle+'" alt="" /></div><div>' + dr_model + '</div></div><div class="wait-bids-approve__item__driver"><div><img src="' + dr_photo + '" alt="" /></div><div>' + dr_name + '</div></div></div>';

      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();

      var request = {
        origin: address[0],
        destination: address[1],
        waypoints: waypoints,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          directionsDisplay.setDirections(response);
          //mapCanvas.insertAdjacentHTML('beforebegin', '<div class="map_order_info"><p>Расстояние: '+response.routes[0].legs[0].distance.text+'</p></div>');
        }
      });

      directionsDisplay.setMap(map);
      show_route = true;
    }

    get_pos_driver();

    function get_pos_driver() {
      Ajax.request(server_uri, 'GET', 'bid', User.token, '&id=' + bid_id, '', function(response) {
        if (response && response.ok) {
          var ords = response.bid.order;
          var agnt = response.bid.agent;

          //console.log('ords='+JSON.stringify(response.bid.agent));
          dr_model = agnt.brand + ' ' + agnt.model;
          dr_name = agnt.name;
          dr_color = agnt.color;
          dr_number = agnt.number;
          dr_photo = agnt.photo ? agnt.photo : User.avatar;
          dr_vehicle = agnt.vehicle ? agnt.vehicle : default_vehicle;
          address = [ords.toCity0 + ', ' + ords.fromAddress, ords.toCity0 + ', ' + ords.toAddress0];
          address_clear = [ords.fromAddress, ords.toAddress0];
          price = Math.round(ords.price);
          
          var waypoints = [];
          
          if (ords.toAddress1) {
            waypoints.push({location:ords.toCity0 + ', ' + ords.toAddress1, stopover:true});
          }
          
          if (ords.toAddress2) {
            waypoints.push({location:ords.toCity0 + ', ' + ords.toAddress2, stopover:true});
          }
          
          if (ords.toAddress3) {
            waypoints.push({location:ords.toCity0 + ', ' + ords.toAddress3, stopover:true});
          }

          if (!show_route) setRoute();

          if (response.bid.arrived) {
            Dom.sel('button[data-click="client-incar"]').disabled = false;
          }
          
          if (!markers[0]) {
            var VLatLng = new google.maps.LatLng(agnt.latitude, agnt.longitude);
            markers[0] = new google.maps.Marker({
              position: VLatLng,
              map: map,
              icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png',
              title: 'Водитель'
            });
          } else {
            markers[0].setPosition(new google.maps.LatLng(agnt.latitude, agnt.longitude));
          }
        }
        
      });
    }

    timerGetBidGo = setInterval(get_pos_driver, 3000);//get_bids_driver

        // Click taxi_client in car
    Dom.sel('[data-click="client-incar"]').addEventListener('click', function() {
        Ajax.request(server_uri, 'POST', 'in-car-bid', User.token, '&id=' + bid_id, '', function() {
            Ajax.request(server_uri, 'GET', 'bid', User.token, '&id=' + bid_id, '', function() {
                //console.log('click client incar = '+JSON.stringify(response));
            });
        });
    });