    bid_id = localStorage.getItem('_current_id_bid');
    MyOrder.bid_id = bid_id;
    
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
    var fromCoords, toCoords, fromAddress, toAddress, waypoints;
    var price, dr_model, dr_name, dr_color, dr_number, dr_photo, dr_vehicle;
    
    var marker_mine = new google.maps.Marker({
      position: MyLatLng,
      map: map,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
      title: 'Я здесь!'
    });

    function setRoute() {
      
      var el_route = Dom.sel('.wait-order-approve__route-info__route');
       el_route.children[0].innerHTML = fromAddress;
       el_route.children[2].innerHTML = toAddress;
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
        origin: new google.maps.LatLng(fromCoords[0], fromCoords[1]),
        destination: new google.maps.LatLng(toCoords[0], toCoords[1]),
        waypoints: waypoints,
        provideRouteAlternatives: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          
          for (var i = 0, len = response.routes.length; i < len; i++) {
            new google.maps.DirectionsRenderer({
              map: map,
              suppressMarkers: true,
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
    
    function get_pos_mine() {
      marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
    }
    
    timerGetMyPos = setInterval(get_pos_mine, 1000);
    
    get_pos_driver();
    
    function get_pos_driver() {
      Ajax.request(server_uri, 'GET', 'bid', User.token, '&id=' + MyOrder.bid_id, '', function(response) {
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
          fromCoords = ords.fromLocation.split(",");
          toCoords = ords.toLocation0.split(",");
          fromAddress = ords.fromAddress;
          toAddress = ords.toAddress0;
          price = Math.round(response.bid.price);
          
          waypoints = [];
          
          if (ords.toAddress1) {
            var _to1 = ords.toLocation1.split(",");
            waypoints.push({location: new google.maps.LatLng(_to1[0], _to1[1]), stopover: true});
            addMarker(new google.maps.LatLng(_to1[0], _to1[1]), MyOrder.toAddress1, '//maps.google.com/mapfiles/kml/paddle/1.png', map);
          }
          
          if (ords.toAddress2) {
            var _to2 = ords.toLocation2.split(",");
            waypoints.push({location: new google.maps.LatLng(_to2[0], _to2[1]), stopover: true});
            addMarker(new google.maps.LatLng(_to2[0], _to2[1]), MyOrder.toAddress2, '//maps.google.com/mapfiles/kml/paddle/2.png', map);
          }
          
          if (ords.toAddress3) {
            var _to3 = ords.toLocation3.split(",");
            waypoints.push({location: new google.maps.LatLng(_to3[0], _to3[1]), stopover: true});
            addMarker(new google.maps.LatLng(_to3[0], _to3[1]), MyOrder.toAddress3, '//maps.google.com/mapfiles/kml/paddle/3.png', map);
          }

          addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), MyOrder.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
          addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), MyOrder.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

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
        Ajax.request(server_uri, 'POST', 'in-car-bid', User.token, '&id=' + MyOrder.bid_id, '', function() {
            Ajax.request(server_uri, 'GET', 'bid', User.token, '&id=' + MyOrder.bid_id, '');
        });
    });
