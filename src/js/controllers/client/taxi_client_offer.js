/* global User, map, google, Car, average_speed, Event, MapElements, Conn */

define(['Dom', 'Dates', 'Maps', 'HideForms'], function (Dom, Dates, Maps, HideForms) {

  var active_bid = false, route, marker_to, marker_from, points = [], name_points =[],
      fromAddress, toAddress, fromCoords, toCoords, waypoints, price, order_id, distanse, ag_distanse, duration,
      name_client, photo_client, travelTime;
  
  function cbGetOfferById(response) {
    var ords = response.order;

    order_id = ords.id;
    fromAddress = ords.fromAddress;
    toAddress = ords.toAddress;
    fromCoords = ords.fromLocation.split(",");
    toCoords = ords.toLocation.split(",");
    price = Math.round(ords.price);
    name_client = ords.agent.name || User.default_name;
    photo_client = ords.agent.photo || User.default_avatar;
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
    points = [];
    name_points = [];

    if (ords.points) {
      for (var i = 0; i < ords.points.length; i++) {
        var _wp = ords.points[i].location.split(",");

        waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover:true});
        name_points.push({address: ords.points[i].address, time: ords.points[i].stopTime});
        Maps.addMarker(new google.maps.LatLng(_wp[0], _wp[1]), ords.points[i].address, '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png',
          function (mark) {
            Maps.addInfoForMarker(ords.points[i].stopTime + 'мин.', true, mark);
            MapElements.points.push(mark);
          });
      }
    }

    Maps.addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png',
      function (mark) {
        MapElements.marker_to = mark;
      });
    Maps.addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png',
      function (mark) {
        MapElements.marker_from = mark;
      });

    setRoute();
    Maps.drawRoute('order', false, function(){});
    HideForms.init();
    Conn.clearCb('cbGetOfferById');
  }
  
  function initMap() {
    var LatLng = new google.maps.LatLng(User.lat, User.lng);
      map.setCenter(LatLng);
      map.setZoom(12);
  }

  function setRoute() {
    var _active_bid = active_bid ? ' active' : '',
        price_minus = !active_bid ? '<i class="icon-minus-circled for-click" data-click="price_minus"></i>' : '',
        price_plus  = !active_bid ? '<i class="icon-plus-circle for-click" data-click="price_plus"></i>' : '',
        time_minus  = !active_bid ? '<i class="icon-minus-circled for-click" data-click="time_minus"></i>' : '',
        time_plus   = !active_bid ? '<i class="icon-plus-circle for-click" data-click="time_plus"></i>' : '',
        add_button = '<i data-click="taxi_bid" class="font4 icon-ok-circled' + _active_bid + '"></i>',
        intt = Dom.selAll('.wait-order-approve__route-info__cancel')[0],
        el_route = Dom.sel('.wait-order-approve__route-info__route'),
        _addrPoints = "",
        el_price = Dom.sel('.wait-order-approve__route-info__price'),
        el = Dom.sel('.wait-bids-approve');
      
    if (intt) {
      intt.innerHTML = add_button;
    }
    
    el_route.children[0].innerHTML = fromAddress;
    el_route.children[2].innerHTML = toAddress;
    
    for (var i = 0; i < name_points.length; i++) {
      _addrPoints += '<p>' + name_points[i].address + ', ' + name_points[i].time + ' мин.</p>';
    }
    
    if (_addrPoints === "") {
      _addrPoints = "Заездов нет";
    }
    
    el_route.children[1].innerHTML = _addrPoints;
      
    el_price.innerHTML = price_minus + '<span>' + price + '</span> руб.' + price_plus;
    el.innerHTML = '<div class="wait-bids-approve__item">' +
                      '<div class="wait-bids-approve__item__distance">' +
                        '<p>До: <span data-view="distance_to_car">' + ag_distanse + '</span> км.</p>' +
                        '<p>Буду: ' + time_minus + '<span data-view="while_car">' + travelTime + '</span> мин.' + time_plus + '</p>' +
                        '<p>Маршрут: <span>' + distanse + ' км.</span> / <span>' + Dates.minToHours(duration) + '</span></p>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__driver">' +
                        '<div>' +
                          '<img src="' + photo_client + '" alt="" />' +
                        '</div>' +
                        '<div>' +
                          name_client +
                        '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__approve"></div>' +
                    '</div>';
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target, el;

      while (target !== this) {

            // Click taxi_bid
        if (target.dataset.click === "taxi_bid") {
          el = target;

          if (el.classList.contains('active')) {
            Conn.request('disagreeOrder', order_id);
            el.classList.remove('active');
            active_bid = false;
            setRoute();
          } else {
            Conn.request('agreeOrder', order_id);
            active_bid = true;
            setRoute();
          }
        }
          
        if (target.dataset.click === "time_minus") {
          el = target;

          var time_el = el.parentNode.children[1],
              time = time_el.innerHTML;
          
          time = time.split(" ");
          time = parseInt(time[0]) - 5;
          
          if (time < 5) {
            time = 5;
          }
          travelTime = time;
          time_el.innerHTML = time;
        }

        if (target.dataset.click === "time_plus") {
          el = target;

          var time_el = el.parentNode.children[1],
              time = time_el.innerHTML;
            
          time = time.split(" ");
          time = parseInt(time[0]) + 5;

          travelTime = time < 0 ? 0 : time;
          time_el.innerHTML = travelTime;
        }

        if (target.dataset.click === "price_minus") {
          el = target;

          var price_el = el.parentNode.children[1];
          var _price = price_el.innerHTML;
          
          _price = _price.split(" ");
          _price = parseInt(_price[0]) - 10;
          if (_price < 0) {
            _price = 0;
          }
          price = _price;
          price_el.innerHTML = _price;
        }

        if (target.dataset.click === "price_plus") {
          el = target;

          var price_el = el.parentNode.children[1],
              _price = price_el.innerHTML;
            
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
  
  function stop() {
    if (marker_from) {
      marker_from.setMap(null);
    }
    if (marker_to) {
      marker_to.setMap(null);
    }
    if (route) {
      route.setMap(null);
    }
    if (points) {
      for (var i = 0; i < points.length; i++) {
        points[i].setMap(null);
      }
    }
  }
  
  function start() {
    var _id = localStorage.getItem('_open_offer_id');
    
    Maps.mapOn();
    initMap();
    Conn.request('getOfferById', _id, cbGetOfferById);
    Conn.request('stopGetOffer');
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});