            bid_id = localStorage.getItem('_current_id_bid');

        var LatLng = new google.maps.LatLng(48.49, 135.07);
        var mapCanvas = document.getElementById('map_canvas_go_driver');
        var mapOptions = {
            center: LatLng,
            zoom: 12,
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var markers = new Array;
        var address,address_clear,waypoints,price;
        var name_client,photo_client;

            Ajax.request(server_uri, 'GET', 'bid', my_token, '&id='+bid_id, '', function(response){
                console.log(JSON.stringify(response.bid.agent));
                if(response && response.ok){
                    var ords = response.bid.order;

                    address = [ords.toCity0+', '+ords.fromAddress, ords.toCity0+', '+ords.toAddress0];
                    address_clear = [ords.fromAddress, ords.toAddress0];
                    price = Math.round(ords.price);
                    name_client = response.bid.order.agent.name;
                    photo_client = response.bid.order.agent.photo;
                    var waypoints = [];
                    if(ords.toAddress1){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress1, stopover:true});
                    }
                    if(ords.toAddress2){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress2, stopover:true});
                    }
                    if(ords.toAddress3){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress3, stopover:true});
                    }
                    setRoute();
                }
            });


            function setRoute(){
                    
                    var el_route = Dom.sel('.wait-order-approve__route-info__route');
                        el_route.children[0].innerHTML = address_clear[0];
                        el_route.children[2].innerHTML = address_clear[1];
                    var el_price = Dom.sel('.wait-order-approve__route-info__price');
                        el_price.innerHTML = price+' руб.';
                    var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
                        el_cancel.innerHTML = '<button class="button_rounded--red">Отмена</button>';
                    var el = Dom.sel('.wait-bids-approve');
                    el.innerHTML += '<div class="wait-bids-approve__item"><div class="wait-bids-approve__item__distance">Клиент:</div><div class="wait-bids-approve__item__driver"><div><img src="' + photo_client + '" alt="" /></div><div>' + name_client + '</div></div></div>';

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
            }
        
        function get_pos_driver(){
            if(!markers[0]){
                var VLatLng = new google.maps.LatLng(my_position.x, my_position.y);
                markers[0] = new google.maps.Marker({
                        position: VLatLng,
                        map: map,
                        icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png',
                        title: 'Я'
                      });
            } else {
                markers[0].setPosition(new google.maps.LatLng(my_position.x, my_position.y));
            }
        }
        
        timerGetBidGo=setInterval(get_pos_driver,3000);//get_bids_driver


    var content = Dom.sel('.content');
        content.addEventListener('click', function(event){
            var target = event.target;
            while(target !== this){
                    // Click taxi_driver arrived
                if(target.dataset.click==="driver-arrived"){
                    Ajax.request(server_uri, 'POST', 'arrived-bid', my_token, '&id='+bid_id, '', function(){
                        Ajax.request(server_uri, 'GET', 'bid', my_token, '&id='+bid_id, '', function(response){
                            //console.log('click driver arrived = '+JSON.stringify(response));
                        });
                    });

                }
                target = target.parentNode;
            }
        });
