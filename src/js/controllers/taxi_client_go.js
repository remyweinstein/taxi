define(['Ajax', 'Dom', 'Dates', 'Chat'], function (Ajax, Dom, Dates, Chat) {
  
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
  var price, dr_model, dr_name, dr_color, dr_number, dr_photo, dr_vehicle, dr_time;

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

  function addInfoForMarker(min, marker) {
    if(min && min > 0) {
      var infowindow = new google.maps.InfoWindow({
        content: min + ' мин.'
      });
      infowindow.open(map, marker);
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
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

  function get_pos_mine() {
    marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
  }

  function get_pos_driver() {
    Ajax.request('GET', 'bid', User.token, '&id=' + MyOrder.bid_id, '', function(response) {
      if (response && response.ok) {

        var ords = response.bid.order;
        var agnt = response.bid.agent;

        dr_model = agnt.brand + ' ' + agnt.model;
        dr_name = agnt.name;
        dr_color = agnt.color;
        dr_number = agnt.number;
        dr_distanse = agnt.distance.toFixed(1);
        var lost_diff = Dates.diffTime(ords.updated, response.bid.travelTime);
        dr_time = lost_diff > 0 ? lost_diff : 0;
        dr_photo = agnt.photo ? agnt.photo : User.avatar;
        dr_vehicle = agnt.vehicle ? agnt.vehicle : default_vehicle;
        fromCoords = ords.fromLocation.split(",");
        toCoords = ords.toLocation.split(",");
        fromAddress = ords.fromAddress;
        toAddress = ords.toAddress;
        price = Math.round(response.bid.price);

        Dom.sel('[data-view="distance_to_car"]').innerHTML = dr_distanse;
        Dom.sel('[data-view="while_car"]').innerHTML = dr_time;
        waypoints = [];

        for (var i = 0; i < ords.toAddresses.length; i++) {
          var _to = ords.toLocationes[i].split(",");
          waypoints.push({location: new google.maps.LatLng(_to[0], _to[1]), stopover: true});
          addInfoForMarker(ords.toTimes[i], addMarker(new google.maps.LatLng(_to[0], _to[1]), ords.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map));
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
            icon: driver_icon,
            title: 'Водитель'
          });
        } else {
          markers[0].setPosition(new google.maps.LatLng(agnt.latitude, agnt.longitude));
        }
      }

    });
  }
  
  function start() {
    bid_id = localStorage.getItem('_current_id_bid');
    MyOrder.bid_id = bid_id;

    Dom.selAll('.find-me')[0].addEventListener('click', function() {
      map.setCenter( new google.maps.LatLng(User.lat, User.lng) );
    });

    timerGetMyPos = setInterval(get_pos_mine, 1000);

    get_pos_driver();

    timerGetBidGo = setInterval(get_pos_driver, 1000);//get_bids_driver

    Chat.start('driver');

    Dom.sel('[data-click="client-incar"]').addEventListener('click', function() {
      Ajax.request('POST', 'in-car-bid', User.token, '&id=' + MyOrder.bid_id, '', function() {
        Ajax.request('GET', 'bid', User.token, '&id=' + MyOrder.bid_id, '');
      });
    });
  }
  
  return {
    start: start
  };
  
});