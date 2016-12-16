define(['Ajax', 'Dom', 'Chat', 'Dates'], function (Ajax, Dom, Chat, Dates) {

  var mapCanvas = document.getElementById('map_canvas_go_driver');
  var mapOptions = {
    center: new google.maps.LatLng(User.lat, User.lng),
    zoom: 12,
    streetViewControl: false,
    mapTypeControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(mapCanvas, mapOptions);
  var markers = [], marker_client, active_bid = false;
  var fromAddress, toAddress, fromCoords, toCoords, waypoints, points = [], price, order_id, distanse, ag_distanse, duration;
  var name_client, photo_client, travelTime;

  function setRoute() {
    var _active_bid = "";

    if (active_bid) {
      _active_bid = ' active';
    }
    var price_minus = !active_bid ? '<i class="icon-minus-circled for-click" data-click="price_minus"></i>' : '';
    var price_plus  = !active_bid ? '<i class="icon-plus-circle for-click" data-click="price_plus"></i>' : '';
    var time_minus  = !active_bid ? '<i class="icon-minus-circled for-click" data-click="time_minus"></i>' : '';
    var time_plus   = !active_bid ? '<i class="icon-plus-circle for-click" data-click="time_plus"></i>' : '';
    
    var add_button = '<i data-click="taxi_bid" class="font4 icon-ok-circled' + _active_bid + '"></i>';
    Dom.selAll('.wait-order-approve__route-info__cancel')[0].innerHTML = add_button;
    
    var el_route = Dom.sel('.wait-order-approve__route-info__route');
      el_route.children[0].innerHTML = fromAddress;
      el_route.children[2].innerHTML = toAddress;
      var _addrPoints = "";
      for (var i = 0; i < points.length; i++) {
        _addrPoints += '<p>' + points[i].address + ', ' + points[i].time + ' мин.</p>';
      }
      if (_addrPoints === "") {
        _addrPoints = "Заездов нет";
      }
      el_route.children[1].innerHTML = _addrPoints;
    var el_price = Dom.sel('.wait-order-approve__route-info__price');
      el_price.innerHTML = price_minus + '<span>' + price + '</span> руб.' + price_plus;

    var el = Dom.sel('.wait-bids-approve');
    
      el.innerHTML = '<div class="wait-bids-approve__item">\n\
                        <div class="wait-bids-approve__item__distance">\n\
                          <p>До клиента: <span data-view="distance_to_car">' + ag_distanse + '</span> км.</p>\n\
                          <p>Буду через: ' + time_minus + '<span data-view="while_car">' + travelTime + '</span> мин.' + time_plus + '</p>\n\
                          <p>По маршруту: <span>' + distanse + '</span> км.</p>\n\
                          <p>Время по маршруту: <span>' + Dates.minToHours(duration) + '</span></p>\n\
                        </div>\n\
                        <div class="wait-bids-approve__item__driver">\n\
                          <div>\n\
                            <img src="' + photo_client + '" alt="" />\n\
                          </div>\n\
                          <div>\n\
                            ' + name_client + '\
                          </div>\n\
                        </div>\n\
                        <div class="wait-bids-approve__item__approve">\n\
                        </div>\n\
                      </div>';
  }

  function drawMap() {
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

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {

            // Click taxi_bid
        if (target.dataset.click === "taxi_bid") {
          var el = target;

          if (el.classList.contains('active')) {
            Ajax.request('POST', 'delete-bid', User.token, '&id=' + order_id, '', function(response) {
              if (response && response.ok) {
                active_bid = false;
                setRoute();
              }
            }, function() {});
          } else {
            if (!User.is_auth) {
              Modal.show('<p>Для совершения заказов необходимо авторизоваться</p>\n\
                        <p><button class="button_rounded--yellow" data-response="no">Отмена</button>\n\
                        <button class="button_rounded--green" data-response="yes">Войти</button></p>', 
                        function (response) {
                          if (response === "yes") {
                            window.location.hash = '#login';
                          }
                      });
            } else if (!Car.brand || !Car.model || !Car.number) {
              Modal.show('<p>Для совершения заказов необходимо заполнить информацию о автомобиле (Марка, модель, госномер)</p>\n\
                        <p><button class="button_rounded--yellow" data-response="no">Отмена</button>\n\
                        <button class="button_rounded--green" data-response="yes">Перейти</button></p>',
                        function (response) {
                          if (response === "yes") {
                            window.location.hash = '#driver_my_auto';
                          }
                      });
            } else {
              Ajax.request('POST', 'bid', User.token, '&id=' + order_id + '&price=' + price + '&travelTime=' + travelTime, '', function(response) {
                if (response && response.ok) {
                  active_bid = true;
                  setRoute();
                }  
              }, function() {});
            }
          }
        }
        
        if (target.dataset.click === "time_minus") {
          var el = target;

          var time_el = el.parentNode.children[1];
          var time = time_el.innerHTML;
            time = time.split(" ");
            time = parseInt(time[0]) - 5;
            if (time < 5) time = 5;
            travelTime = time;
            time_el.innerHTML = time;
        }

        if (target.dataset.click === "time_plus") {
          var el = target;

          var time_el = el.parentNode.children[1];
          var time = time_el.innerHTML;
            time = time.split(" ");
            time = parseInt(time[0]) + 5;
            if (time < 0) time = 0;
            travelTime = time;
            time_el.innerHTML = time;
        }

        if (target.dataset.click === "price_minus") {
          var el = target;

          var price_el = el.parentNode.children[1];
          var _price = price_el.innerHTML;
            _price = _price.split(" ");
            _price = parseInt(_price[0]) - 10;
            if (_price < 0) _price = 0;
            price = _price;
            price_el.innerHTML = _price;
        }

        if (target.dataset.click === "price_plus") {
          var el = target;

          var price_el = el.parentNode.children[1];
          var _price = price_el.innerHTML;
            _price = _price.split(" ");
            _price = parseInt(_price[0]) + 10;
            price = _price;
            price_el.innerHTML = _price;
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };

    content.addEventListener('click', Event.click);
  }
  
  function start() {
    var _id = localStorage.getItem('_open_order_id');
    
    Ajax.request('GET', 'order', User.token, '&id=' + _id, '', function(response) {
      if (response.ok) {
        var ords = response.order;

        order_id = ords.id;
        fromAddress = ords.fromAddress;
        toAddress = ords.toAddress;
        fromCoords = ords.fromLocation.split(",");
        toCoords = ords.toLocation.split(",");
        price = Math.round(ords.price);
        name_client = ords.agent.name ? ords.agent.name : User.default_name;
        photo_client = ords.agent.photo ? ords.agent.photo : User.default_avatar;
        distanse = (ords.length / 1000).toFixed(1);
        duration = ords.duration;
        for (var y = 0; y < ords.bids.length; y++) {
          var agid = ords.bids[y].agentId;                  
          if (agid === User.id) {
            active_bid = true;
            break;
          }
        }
        ag_distanse = ords.agent.distance.toFixed(1);
        travelTime = ((ag_distanse / average_speed) * 60).toFixed(0);
        if (travelTime < 5) {
          travelTime = 5;
        } else {
          travelTime = 5 * Math.ceil( travelTime / 5 );
        }
        waypoints = [];
        
        if (ords.points) {
          for (var i = 0; i < ords.points.length; i++) {
            var _wp = ords.points[i].location.split(",");
            waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover:true});
            points.push({address: ords.points[i].address, time: ords.points[i].stopTime});
            addInfoForMarker(ords.points[i].stopTime, addMarker(new google.maps.LatLng(_wp[0], _wp[1]), ords.points[i].address, '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map));
          }
        }

        addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
        addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

        setRoute();
        drawMap();

      } else {
        window.location.hash = '#driver_city';
      }
    }, function() {
      window.location.hash = '#driver_city';
    });
    

    addEvents();
  }
  
  return {
    start: start
  };
  
});
