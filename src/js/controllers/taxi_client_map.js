    initialize();

    function initialize() {
      var LatLng = new google.maps.LatLng(48.49, 135.07);
      var mapCanvas = document.getElementById('map_canvas');
      var mapOptions = {
        center: LatLng,
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      map = new google.maps.Map(mapCanvas, mapOptions);

      var address = Address.loadAddress(User.city);
      var waypoints = Address.loadWaypoints(User.city);
      
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
          mapCanvas.insertAdjacentHTML('beforebegin', '<div class="map_order_info"><p>Расстояние: '+response.routes[0].legs[0].distance.text+'</p></div>');
        }
      });

      directionsDisplay.setMap(map);
    
    }
    
    function get_bids_driver() {
      Ajax.request(server_uri, 'GET', 'bids', User.token, '&id='+localStorage.getItem('_id_current_taxy_order'), '', function(response) {
            //console.log('try get bids... order '+localStorage.getItem('_id_current_taxy_order'));
        if (response && response.ok) {
          var el = Dom.sel('.wait-bids-approve');
           el.innerHTML = "";
          var bids = response.bids;
          //console.log(JSON.stringify(bids));
          
          for (var i=0; i<bids.length; i++) {
            var photo, vehicle;
             photo = bids[i].agent.photo ? bids[i].agent.photo : User.avatar;
             vehicle = bids[i].agent.vehicle ? bids[i].agent.vehicle : default_vehicle;
             
            el.innerHTML += '<div class="wait-bids-approve__item"><div class="wait-bids-approve__item__distance">Растояние до водителя, <span>' + bids[i].agent.distance.toFixed(1) + ' км</span></div><div class="wait-bids-approve__item__driver"><div><img src="' + photo + '" alt="" /></div><div>' + bids[i].agent.name + '</div></div><div class="wait-bids-approve__item__car"><div><img src="'+vehicle+'" alt="" /></div><div>' + bids[i].agent.brand + ' ' + bids[i].agent.model + '</div></div><div class="wait-bids-approve__item__approve"><i data-click="taxi_client_bid" data-id="' + bids[i].id + '" class="icon-ok-circled"></i></div></div>';
          }
          
        }
        
      });
    }

    timerGetBidsTaxy = setInterval(get_bids_driver, 3000);
    var route = Address.loadAddress();
    var el_route = Dom.sel('.wait-order-approve__route-info__route');
     el_route.children[0].innerHTML = route[0];
     el_route.children[2].innerHTML = route[1];
     
    var el_price = Dom.sel('.wait-order-approve__route-info__price');
     el_price.innerHTML = localStorage.getItem('_current_price_order')+' руб';
     
    var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
     el_cancel.innerHTML = '<button class="button_rounded--red">Отмена</button>';

// Click Client BID
    var content = Dom.sel('.content');
      content.addEventListener('click', function(event) {
        var target = event.target;
        while (target !== this) {
          if (target.dataset.click === "taxi_client_bid") {
            var el = target;
            Ajax.request(server_uri, 'POST', 'approve-bid', User.token, '&id='+el.dataset.id, '', function(response) {
              //console.log(response);
              if (response && response.ok) {
                localStorage.setItem('_current_id_bid',el.dataset.id);
                document.location = "#client__go";
              }
            });
          }
          
          target = target.parentNode;
        }
        
      });
