    if (MyOrder.id > 0) {
      
          initialize();

          timerGetBidsTaxy = setInterval(get_bids_driver, 3000);

          var el_route = Dom.sel('.wait-order-approve__route-info__route');
           el_route.children[0].innerHTML = MyOrder.fromAddress;
           el_route.children[2].innerHTML = MyOrder.toAddress;
           el_route.children[1].innerHTML = 'Заездов ';

          var _count_waypoint = 0;

          if (MyOrder.toAddress1  && MyOrder.toAddress1 !== "") {
            _count_waypoint++;
          }

          if (MyOrder.toAddress2  && MyOrder.toAddress2 !== "") {
            _count_waypoint++;
          }

          if (MyOrder.toAddress3  && MyOrder.toAddress3 !== "") {
            _count_waypoint++;
          }

           if (_count_waypoint > 0) {
             el_route.children[1].innerHTML += _count_waypoint;
           } else {
             el_route.children[1].innerHTML += 'нет';
           }

          var el_price = Dom.sel('.wait-order-approve__route-info__price');
           el_price.innerHTML = MyOrder.price + ' руб';

          var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
           el_cancel.innerHTML = '<button class="button_rounded--red">Отмена</button>';

          Event.click = function (event) {
              var target = event.target;

              while (target !== this) {
                if (target.dataset.click === "taxi_client_bid") {
                  var el = target;

                  Ajax.request(server_uri, 'POST', 'approve-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
                    //console.log(response);
                    if (response && response.ok) {
                      MyOrder.bid_id = el.dataset.id;
                      localStorage.setItem('_current_id_bid', MyOrder.bid_id);
                      document.location = "#client__go";
                    }
                  });
                }

                target = target.parentNode;
              }

            };
            content.addEventListener('click', Event.click);
      
      function initialize() {
        //var LatLng = new google.maps.LatLng(48.49, 135.07);
        var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
        var mapCanvas = document.getElementById('map_canvas');
        var mapOptions = {
          center: MyLatLng,
          zoom: 12,
          streetViewControl: false,
          mapTypeControl: false,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(mapCanvas, mapOptions);

        var marker_mine = new google.maps.Marker({
          position: MyLatLng,
          map: map,
          icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
          title: 'Я здесь!'
        });

        var _coord_from = MyOrder.fromCoords.split(",");
        var _coord_to = MyOrder.toCoords.split(",");
        var waypoints = [];
        
        console.log('MyOrder.toAddress1 = ' + MyOrder.toAddress1);
        
          if (MyOrder.toAddress1 && MyOrder.toAddress1 !== "") {
            var _to_coord_1 = MyOrder.toCoords1.split(",");
            waypoints.push({location: new google.maps.LatLng(_to_coord_1[0], _to_coord_1[1]), stopover: true});
          }

          if (MyOrder.toAddress2 && MyOrder.toAddress2 !== "") {
            var _to_coord_2 = MyOrder.toCoords2.split(",");
            waypoints.push({location: new google.maps.LatLng(_to_coord_2[0], _to_coord_2[1]), stopover: true});
          }

          if (MyOrder.toAddress3 && MyOrder.toAddress3 !== "") {
            var _to_coord_3 = MyOrder.toCoords3.split(",");
            waypoints.push({location: new google.maps.LatLng(_to_coord_3[0], _to_coord_3[1]), stopover: true});
          }


        directionsService = new google.maps.DirectionsService();
        directionsDisplay = new google.maps.DirectionsRenderer();

        var request = {
          origin: new google.maps.LatLng(_coord_from[0], _coord_from[1]),
          destination: new google.maps.LatLng(_coord_to[0], _coord_to[1]),
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

      }

      function get_bids_driver() {
        Ajax.request(server_uri, 'GET', 'bids', User.token, '&id=' + MyOrder.id, '', function(response) {
              //console.log('try get bids... order '+localStorage.getItem('_id_current_taxy_order'));
          if (response && response.ok) {
            var el = Dom.sel('.wait-bids-approve');
             el.innerHTML = "";
            var bids = response.bids;
            var innText = '';
            for (var i = 0; i < bids.length; i++) {
              console.log(JSON.stringify(bids[i]));

              var photo, vehicle;
               photo = bids[i].agent.photo ? bids[i].agent.photo : User.avatar;
               vehicle = bids[i].agent.vehicle ? bids[i].agent.vehicle : default_vehicle;


              innText += '<div class="wait-bids-approve__item">\n\
                                <div class="wait-bids-approve__item__distance">\n\
                                  Растояние до водителя, <span>' + bids[i].agent.distance.toFixed(1) + ' км</span>\n\
                                </div>\n\
                                <div class="wait-bids-approve__item__driver">\n\
                                  <div>\n\
                                    <img src="' + photo + '" alt="" />\n\
                                  </div>\n\
                                  <div>' + bids[i].agent.name + '</div>\n\
                                </div>\n\
                                <div class="wait-bids-approve__item__car">\n\
                                  <div>\n\
                                    <img src="' + vehicle + '" alt="" />\n\
                                  </div>\n\
                                  <div>\n\
                                    ' + bids[i].agent.brand + ' ' + bids[i].agent.model + '\
                                  </div>\n\
                                </div>\n\
                                <div class="wait-bids-approve__item__approve">\n\
                                  <i data-click="taxi_client_bid" data-id="' + bids[i].id + '" class="icon-ok-circled"></i>\n\
                                </div>\n\
                                <div class="wait-bids-approve__item__bid-price">\n\
                                  Предложенная цена: <span>' + Math.round(bids[i].price) + ' руб</span>\n\
                                </div>\n\
                              </div>';
            }
            el.innerHTML = innText;
          }

        });
      }
      
    } else {
      document.location = "#client__my_orders";
    }