define(['Ajax', 'Dom', 'Chat'], function (Ajax, Dom, Chat) {
  
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
  var markers = new Array, marker_client;
  var fromAddress, toAddress, fromCoords, toCoords, waypoints, price;
  var name_client, photo_client;

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
                          Клиент:\n\
                        </div>\n\
                        <div class="wait-bids-approve__item__driver">\n\
                          <div>\n\
                            <img src="' + photo_client + '" alt="" />\n\
                          </div>\n\
                          <div>\n\
                            ' + name_client + '\
                          </div>\n\
                        </div>\n\
                      </div>';

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var request = {
      origin: new google.maps.LatLng(fromCoords[0], fromCoords[1]),
      destination: new google.maps.LatLng(toCoords[0], toCoords[1]),
      waypoints: waypoints,
      travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
      if (status === google.maps.DirectionsStatus.OK) {
          new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            directions: response
          });
      }
    });

  }

  function addInfoForMarker(min, marker) {
    if(min && min > 0) {
      var infowindow = new google.maps.InfoWindow({
        content: min + ' мин.'
      });
      infowindow.open(map_choice, marker);
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map_choice, marker);
      });
    }
  }

  function addMarker(location, title, icon, map) {
    var marker = new google.maps.Marker({
      position: location,
      //animation: google.maps.Animation.DROP,
      icon: icon,
      title: title,
      map: map
    });

    return marker;
  }

  function get_pos_driver() {
    if (!markers[0]) {
      var VLatLng = new google.maps.LatLng(User.lat, User.lng);
      markers[0] = new google.maps.Marker({
        position: VLatLng,
        map: map,
        icon: driver_icon,
        title: 'Я'
      });
    } else {
      markers[0].setPosition(new google.maps.LatLng(User.lat, User.lng));
    }
    
    Ajax.request('GET', 'bid', User.token, '&id=' + bid_id, '', function(response) {
      if (response && response.ok) {
        var ords = response.bid.order;
        var agnt = response.bid.agent;

        dr_distanse = ords.agent.distance.toFixed(1);
        var lost_diff = Dates.diffTime(ords.updated, response.bid.travelTime);
        dr_time = lost_diff > 0 ? lost_diff : 0;

        Dom.sel('[data-view="distance_to_car"]').innerHTML = dr_distanse;
        Dom.sel('[data-view="while_car"]').innerHTML = dr_time;

        if (!marker_client) {
          marker_client = new google.maps.Marker({
            position: new google.maps.LatLng(response.bid.order.agent.latitude, response.bid.order.agent.longitude),
            map: map,
            icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
            title: 'Клиент'
          });
        } else {
          marker_client.setPosition(new google.maps.LatLng(response.bid.order.agent.latitude, response.bid.order.agent.longitude));
        }
      }
    });

  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
            // Click taxi_driver arrived
        if (target.dataset.click === "driver-arrived") {
          Ajax.request('POST', 'arrived-bid', User.token, '&id=' + bid_id, '', function() {
            Ajax.request('GET', 'bid', User.token, '&id=' + bid_id, '', function () {});
          });
        }

        target = target.parentNode;
      }
    };

    content.addEventListener('click', Event.click);
  }
  
  function start() {
    bid_id = localStorage.getItem('_current_id_bid');

    Ajax.request('GET', 'bid', User.token, '&id=' + bid_id, '', function(response) {
      //console.log(JSON.stringify(response.bid.agent));
      if (response && response.ok) {
        var ords = response.bid.order;
        fromAddress = ords.fromAddress;
        toAddress = ords.toAddress;
        fromCoords = ords.fromLocation.split(",");
        toCoords = ords.toLocation.split(",");
        price = Math.round(response.bid.price);
        name_client = response.bid.order.agent.name ? response.bid.order.agent.name : User.default_name;
        photo_client = response.bid.order.agent.photo ? response.bid.order.agent.photo : User.default_avatar;

        waypoints = [];

        for (var i = 0; i < ords.toAddresses.length; i++) {
          var _wp = ords.toLocations[i].split(",");
          waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover:true});
          addInfoForMarker(ords.times[i], addMarker(new google.maps.LatLng(_wp[0], _wp[1]), ords.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map));
        }

        addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
        addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

        setRoute();
      }

    });

    timerGetBidGo = setInterval(get_pos_driver, 3000);//get_bids_driver

    Chat.start('client');

    addEvents();
  }
  
  return {
    start: start
  };
  
});
