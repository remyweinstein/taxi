    bid_id = localStorage.getItem('_current_id_bid');
    //var LatLng = new google.maps.LatLng(48.49, 135.07);
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    var mapCanvas = document.getElementById('map_canvas_go');
    var mapOptions = {
      center: MyLatLng,
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
    
    var marker_mine = new google.maps.Marker({
      position: MyLatLng,
      map: map,
      icon: 'http://labs.google.com/ridefinder/images/mm_20_orange.png',
      title: 'Я здесь!'
    });

    function setRoute() {
      var el_route = Dom.sel('.wait-order-approve__route-info__route');
       el_route.children[0].innerHTML = address_clear[0];
       el_route.children[2].innerHTML = address_clear[1];
      var el_price = Dom.sel('.wait-order-approve__route-info__price');
       el_price.innerHTML = price + ' руб.';
      var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
       el_cancel.innerHTML = '<button class="button_rounded--red">Отмена</button>';
      var el = Dom.sel('.wait-bids-approve');
       el.innerHTML = '<div class="wait-bids-approve__item">\n\
                          <div class="wait-bids-approve__item__distance">\n\
                            Автомобиль:<br/>\n\
                            Цвет: ' + dr_color + '<br/>\n\
                            Рег.номер: ' + dr_number + '\
                          </div>\n\
                          <div class="wait-bids-approve__item__car">\n\
                            <div>\n\
                              <img src="' + dr_vehicle + '" alt="" />\n\
                            </div>\n\
                            <div>\n\
                              ' + dr_model + '\
                            </div>\n\
                          </div>\n\
                          <div class="wait-bids-approve__item__driver">\n\
                            <div>\n\
                              <img src="' + dr_photo + '" alt="" />\n\
                            </div>\n\
                            <div>\n\
                              ' + dr_name + '\
                            </div>\n\
                          </div>\n\
                        </div>';

      directionsService = new google.maps.DirectionsService();
      directionsDisplay = new google.maps.DirectionsRenderer();

      var request = {
        origin: address[0],
        destination: address[1],
        waypoints: waypoints,
        provideRouteAlternatives: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          
          for (var i = 0, len = response.routes.length; i < len; i++) {
            new google.maps.DirectionsRenderer({
              map: map,
              directions: response,
              routeIndex: i
            });
          }
          
          var overviewPath = [];
          
          for(var i = 0; i < response.routes.length; i++){
            var temp = response.routes[i].overview_path;
            overviewPath = overviewPath.concat( temp );
          }
          
          Geo.showPoly(overviewPath, map);
        }
      });

      show_route = true;
    }
    
    function get_pos_mine() {
      marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
    }
    timerGetMyPos = setInterval(get_pos_mine, 1000);
    
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
          price = Math.round(response.bid.price);
          
          var waypoints = [];
          
          if (ords.toAddress1) {
            waypoints.push({location: ords.toCity0 + ', ' + ords.toAddress1, stopover: true});
          }
          
          if (ords.toAddress2) {
            waypoints.push({location: ords.toCity0 + ', ' + ords.toAddress2, stopover: true});
          }
          
          if (ords.toAddress3) {
            waypoints.push({location: ords.toCity0 + ', ' + ords.toAddress3, stopover: true});
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
    timerGetBidGo = setInterval(get_pos_driver, 1000);//get_bids_driver
    
    Chat.start('driver');

        // Click taxi_client in car
    Dom.sel('[data-click="client-incar"]').addEventListener('click', function() {
        Ajax.request(server_uri, 'POST', 'in-car-bid', User.token, '&id=' + bid_id, '', function() {
            Ajax.request(server_uri, 'GET', 'bid', User.token, '&id=' + bid_id, '');
        });
    });
