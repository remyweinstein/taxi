/* global User, google, map, MyOrder, MyOffer, cost_of_km, Car, driver_icon, men_icon, Event */

define(['Ajax', 'Dom', 'ModalWindows', 'Maps', 'HideForms', 'GetPositions', 'Order'], function (Ajax, Dom, Modal, Maps, HideForms, GetPositions, Order) {
  
  var points = [],
      recommended_cost = 0,
      zoom, route,
      marker_a, marker_b, marker_from, marker_to,
      price = Dom.sel('[name="cost"]').value,
      comment = Dom.sel('[name="description"]').value,
      content = Dom.sel('.content'),
      model,
      Model;

  function addEventChooseAddress(el) {
    Dom.sel('input[name="' + el + '"]').addEventListener('click', function(event) {
      localStorage.setItem('_address_temp', el);
      localStorage.setItem('_address_string_temp', event.target.value);

      window.location.hash = '#client_choose_address';
    });
  }

  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    
    zoom = 15;
    map.setCenter(MyLatLng);
    map.setZoom(zoom);

    var from_value = Dom.selAll('input[name="from"]')[0].value,
        to_value = Dom.selAll('input[name="to"]')[0].value;

    if (from_value !== '' && to_value === '') {
      var _addr_from = Model.fromCoords.split(",");
      
      marker_a = addMarker(new google.maps.LatLng(_addr_from[0], _addr_from[1]), from_value, '//www.google.com/mapfiles/markerA.png', map);
    }

    if (to_value !== '' && from_value === '') {
      var _addr_to = Model.toCoords.split(",");
      
      marker_b = addMarker(new google.maps.LatLng(_addr_to[0], _addr_to[1]), to_value, '//www.google.com/mapfiles/markerB.png', map);
    }

    if (from_value !== '' && to_value !== '') {
      drawRoute();
    }

    function drawRoute() {
      var directionsService = new google.maps.DirectionsService(),
          _addr_from = Model.fromCoords.split(","),
          _addr_to = Model.toCoords.split(","),
          waypoints = [];
        
      marker_b = null;
      marker_a = null;

      for (var i = 0; i < Model.toAddresses.length; i++) {
        if (Model.toAddresses[i] && Model.toAddresses[i] !== "") {
          var _wp = Model.toCoordses[i].split(","),
              time = "";
          
          waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover: true});
          if (Model.times[i]) {
            time = Model.times[i] + ' мин.';
          }
          points.push(addInfoForMarker(time, true, addMarker(new google.maps.LatLng(_wp[0], _wp[1]), Model.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map)));
        }
      }

      marker_from = addMarker(new google.maps.LatLng(_addr_from[0], _addr_from[1]), Model.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map);
      marker_to = addMarker(new google.maps.LatLng(_addr_to[0], _addr_to[1]), Model.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map);

      var request = {
        origin: new google.maps.LatLng(_addr_from[0], _addr_from[1]),
        destination: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
        waypoints: waypoints,
        provideRouteAlternatives: false,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {

          var routes_dist = response.routes[0].legs,
              dura = 0, dist = 0;
          
          for (var i = 0; i < routes_dist.length; i++) {
            dura += routes_dist[i].duration.value;
            dist += routes_dist[i].distance.value;
          }

          Model.duration = Math.round(dura / 60);
          Model.length = dist;
          recommended_cost = 10 * Math.ceil( ((Model.length / 1000) * cost_of_km) / 10 );
          recommended_cost = recommended_cost < 50 ? 50 : recommended_cost;
          Dom.selAll('[name="cost"]')[0].placeholder = 'Рекомендуемая цена ' + recommended_cost + ' руб.';

          route = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true,
            directions: response,
            routeIndex: 0
          });
        }
      });
    }

    google.maps.event.addListener(map, 'drag', function() {
      //var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
      //localStorage.setItem('_choice_coords', coords);
    }); 
  }
    
  function addInfoForMarker(text, open, marker) {
    if (text && text !== "") {
      var infowindow = new google.maps.InfoWindow({
        content: text
      });
      if (open) {
        infowindow.open(map, marker);
      }
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
    }
    
    return marker;
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

  function AddNewZaezd(just_add) {
    var time = Model.times[just_add] ? Model.times[just_add] + " мин" : "",
        addr = Model.toAddresses[just_add] ? Model.toAddresses[just_add] : "",
        el = Dom.sel('.order-city-to'),
        new_field = document.createElement('div'),
        parentDiv = el.parentNode;
      
    new_field.className += 'form-order-city__field order-city-to_z';
    new_field.innerHTML = '<i class="icon-record form-order-city__label"></i>' + 
                           '<span class="form-order-city__wrap">' + 
                             '<input type="text" name="to_plus' + just_add + '" value="' + addr + '" placeholder="Заезд"/>' + 
                           '</span>' + 
                           '<span data-click="field_add_time" data-id="' + just_add + '" class="form-order-city__field_add_time">' + 
                             '<i class="icon-clock"></i><span class="top-index">' + time + '</span>' + 
                           '</span>' + 
                           '<span data-click="field_delete" data-id="' + just_add + '" class="form-order-city__field_delete">' + 
                             '<i class="icon-trash"></i>' + 
                           '</span>' + 
                           '<i data-click="choice_location" class="icon-street-view form-order-city__add-button"></i>';

    parentDiv.insertBefore(new_field, el);
        
    addEventChooseAddress('to_plus' + just_add);
  }


  function addEvents() {
    
    Event.click = function (event) {
      var target = event.target,
          el, id;
      
      while (target !== this) {
          
        if (target) {
          
          if (target.dataset.click === "addtofav") {
            el = target;
            Ajax.request('POST', 'favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltofav">Удалить из Избранного</button>';
              }
            }, Ajax.error);
          }
          
          if (target.dataset.click === "deltofav") {
            el = target;
            Ajax.request('POST', 'delete-favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtofav">Избранное</button>';
              }
            }, Ajax.error);
          }
          
          if (target.dataset.click === "addtoblack") {
            el = target;
            Ajax.request('POST', 'black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltoblack">Удалить из Черного списка</button>';
              }
            }, Ajax.error); 
          }  
          
          if (target.dataset.click === "deltoblack") {
            el = target;
            Ajax.request('POST', 'delete-black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtoblack">Черный список</button>';
              }
            }, Ajax.error); 
          }  
          
          if (target.dataset.click === 'choice_location') {
            localStorage.setItem('_address_temp', target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
            window.location.hash = '#client_choice_location_map';

            break;
          }

              // = Form add new point order =
          if (target.dataset.click === 'field_add') {
            var just_add = Dom.selAll('.icon-record').length;
            
            if (just_add > 0) {
              if (Dom.selAll('.icon-record')[just_add - 1].parentNode.querySelectorAll('input')[0].value !== "") {
                AddNewZaezd(just_add);
              }
            } else {
              AddNewZaezd(just_add);
            }

            break;
          }

          if (target.dataset.click === 'clean-field') {
            var _field = target.dataset.field;

            if (_field === "from") {
              Model.fromAddress = "";
              Model.fromCity = "";
              Model.fromCoords = "";
              Model.fromFullAddress = "";
            }

            if (_field === "to") {
              Model.toAddress = "";
              Model.toCity = "";
              Model.toCoords = "";
              Model.toFullAddress = "";
            }

            Dom.selAll('.adress_' + _field)[0].value = "";
            stop();
            initMap();

            break;
          }

          if (target.dataset.click === 'field_add_time') {
            id = target.dataset.id;

            Modal.show('<p><button class="button_rounded--green" data-response="0">Без задержки</button></p>' +
                      '<p><button class="button_rounded--green" data-response="5">5 мин</button></p>' + 
                      '<p><button class="button_rounded--green" data-response="10">10 мин</button></p>' + 
                      '<p><button class="button_rounded--green" data-response="15">15 мин</button></p>' + 
                      '<p><button class="button_rounded--green" data-response="20">20 мин</button></p>' + 
                      '<p><button class="button_rounded--green" data-response="30">30 мин</button></p>', 
                    function (response) {
                        eval("Model.times[" + id + "] = " + response);
                        reloadPoints();
                        stop();
                        initMap();
                    });

            break;
          }
              // = Form delete point order =
          if (target.dataset.click === 'field_delete') {
            var be_dead = target.parentNode;
            
            id = target.dataset.id;

            Model.toAddresses.splice(id, 1);
            Model.toCoordses.splice(id, 1);
            Model.times.splice(id, 1);

            be_dead.parentNode.removeChild(be_dead);

            reloadPoints();
            stop();
            initMap();

            break;
          }
        }
        

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    
    content.addEventListener('click', Event.click);
    
    Event.submit = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.submit === "taxy_client_city" || target.dataset.submit === "taxy_driver_offer") {
          var _price = Dom.sel('[name="cost"]').value;
          
          event.preventDefault();
          Dom.sel('[data-click="order-taxi"]').disabled = true;

          Model.price = _price === "" ? recommended_cost : _price;
          Model.comment = Dom.sel('[name="description"]').value;
          
          Model.save(points, function (response) {
            if (response && response.ok) {
              Model.id = response.id;
              if (model === "clClientOrder") {
                window.location.hash = '#client_map';
              }
              if (model === "clDriverOffer") {
                window.location.hash = '#driver_city';
              }
            } else {
              alert('Укажите в профиле ваш город');
            }
          });
          
          return;
        }

        target = target.parentNode;
      }
    };

    content.addEventListener('submit', Event.submit);
    
  }
  
  function reloadPoints() {
    var rem_old_stops = Dom.selAll('.order-city-to_z'),
        i;

    for (i = 0; i < rem_old_stops.length; i++) {
      rem_old_stops[i].parentNode.removeChild(rem_old_stops[i]);
    }

    for (i = 0; i < Model.toAddresses.length; i++) {
      AddNewZaezd(i);
    }
  }
  
  function stop() {
    var i;
    
    GetPositions.clear();
    
    if (model === "clDriverOffer") {
      MyOffer = Model;
      localStorage.setItem('_active_model', 'MyOffer');
    }
    if (model === "clClientOrder") {
      MyOrder = Model;
      localStorage.setItem('_active_model', 'MyOrder');
    }
    if (route) {
      route.setMap(null);
    }
    if (marker_b) {
      marker_b.setMap(null);
    }
    if (marker_a) {
      marker_a.setMap(null);
    }
    if (marker_from) {
      marker_from.setMap(null);
    }
    if (marker_to) {
      marker_to.setMap(null);
    }
    for (i = 0; i < points.length; i++) {
      points[i].setMap(null);
    }
  }
  
  function start(modelka) {
    model = modelka;
    
    if (model === "clDriverOffer") {
      Model = MyOffer;
    }
    if (model === "clClientOrder") {
      Model = MyOrder;
      Order.getMy();
    }
        
    Maps.mapOn();
    GetPositions.drivers();
    GetPositions.my();
    
    price.value = Model.price;
    comment.value = Model.comment;
    
    Dom.selAll('input[name="from"]')[0].value = Model.fromAddress;
    Dom.selAll('input[name="to"]')[0].value = Model.toAddress;
    
    reloadPoints();
    
    addEventChooseAddress('from');
    addEventChooseAddress('to');

    initMap();
    
    addEvents();
    
    require(['ctrlTaxiDriverCity'], function(controller) {
      controller.start('clDriverOffer');
    });
    
    HideForms.init();
    
  }
  
  return {
    start: start,
    clear: stop
  };
  
});