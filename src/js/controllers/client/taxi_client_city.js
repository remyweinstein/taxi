define(['Ajax', 'Dom', 'ModalWindows'], function (Ajax, Dom, Modal) {
  
  var marker_mine;
  var map_choice;
  var markers_driver_pos = [];    
  var recommended_cost = 0;
  var radiusSearch = 0.5;
  var zoom;

  var marker_a, marker_b;
  var price = Dom.sel('[name="cost"]').value;
  var comment = Dom.sel('[name="description"]').value;
  
  var content = Dom.sel('.content');

  function addEventChooseAddress(el) {
    Dom.sel('input[name="' + el + '"]').addEventListener('click', function(event) {
      localStorage.setItem('_address_temp', el);
      localStorage.setItem('_address_string_temp', event.target.value);

      window.location.hash = '#client_choose_address';
    });
  }

  function initialize_iam() {
    zoom = 15;
    //var LatLng = new google.maps.LatLng(48.49, 135.07);
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    var mapCanvas = document.getElementById('map_canvas_iam');
    var mapOptions = {
      center: MyLatLng,
      zoom: zoom,
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map_choice = new google.maps.Map(mapCanvas, mapOptions);

    marker_mine = new google.maps.Marker({
      position: MyLatLng,
      map: map_choice,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
      title: 'Я здесь!'
    });

    var from_value = Dom.selAll('input[name="from"]')[0].value;
    var to_value = Dom.selAll('input[name="to"]')[0].value;

    if (from_value !== '' && to_value === '') {
      var _addr_from = MyOrder.fromCoords.split(",");
      marker_a = addMarker(new google.maps.LatLng(_addr_from[0], _addr_from[1]), from_value, '//www.google.com/mapfiles/markerA.png', map_choice);
    }

    if (to_value !== '' && from_value === '') {
      var _addr_to = MyOrder.toCoords.split(",");
      marker_b = addMarker(new google.maps.LatLng(_addr_to[0], _addr_to[1]), to_value, '//www.google.com/mapfiles/markerB.png', map_choice);
    }

    if (from_value !== '' && to_value !== '') {
      drawLine();
    }

    function drawLine() {
      var directionsService = new google.maps.DirectionsService();
      //if (marker_b && marker_a) {
        marker_b = null;
        marker_a = null;
        var _addr_from = MyOrder.fromCoords.split(",");
        var _addr_to = MyOrder.toCoords.split(",");

        var waypoints = [];

        for (var i = 0; i < MyOrder.toAddresses.length; i++) {
          if (MyOrder.toAddresses[i] && MyOrder.toAddresses[i] !== "") {
            var _wp = MyOrder.toCoordses[i].split(",");
            waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover: true});
            addInfoForMarker(MyOrder.times[i] + ' мин.', true, addMarker(new google.maps.LatLng(_wp[0], _wp[1]), MyOrder.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', map_choice));
          }
        }

        addMarker(new google.maps.LatLng(_addr_from[0], _addr_from[1]), MyOrder.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', map_choice);
        addMarker(new google.maps.LatLng(_addr_to[0], _addr_to[1]), MyOrder.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', map_choice);

        var request = {
          origin: new google.maps.LatLng(_addr_from[0], _addr_from[1]),
          destination: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
          waypoints: waypoints,
          provideRouteAlternatives: false,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };

        directionsService.route(request, function(response, status) {
          if (status === google.maps.DirectionsStatus.OK) {
            
            var routes_dist = response.routes[0].legs;

            MyOrder.duration = Math.round((routes_dist[0].duration.value) / 60);
            MyOrder.length = routes_dist[0].distance.value;
            recommended_cost = 10 * Math.ceil( ((MyOrder.length / 1000) * cost_of_km) / 10 );
            recommended_cost = recommended_cost < 50 ? 50 : recommended_cost;
            Dom.selAll('[name="cost"]')[0].placeholder = 'Рекомендуемая цена ' + recommended_cost + ' руб.';

            new google.maps.DirectionsRenderer({
              map: map_choice,
              suppressMarkers: true,
              directions: response,
              routeIndex: 0
            });
          }
        });
    }

    Dom.selAll('.find-me')[0].addEventListener('click', function() {
      map_choice.setCenter( new google.maps.LatLng(User.lat, User.lng) );
    });

    google.maps.event.addListener(map_choice, 'drag', function() {
      //var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
      //localStorage.setItem('_choice_coords', coords);
    }); 
    map_choice.addListener('zoom_changed', function() {
      var zoom = map_choice.getZoom();      
      if (zoom <= 12) {
        radiusSearch = 10;
      } else if (zoom === 13) {
        radiusSearch = 3;
      } else if (zoom === 14) {
        radiusSearch = 2;
      } else if (zoom === 15) {
        radiusSearch = 1;
      } else if (zoom === 16) {
        radiusSearch = 0.5;
      } else if (zoom > 16) {
        radiusSearch = 0.1;
      }
    });
  }
    
  function addInfoForMarker(text, open, marker) {
    if(text && text !== "") {
      var infowindow = new google.maps.InfoWindow({
        content: text
      });
      if (open) {
        infowindow.open(map_choice, marker);
      }
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map_choice, marker);
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

  function get_pos_drivers() {
    if (marker_mine) {
      marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
    }
    
    function searchArray(index, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === index) {
          return true;
          break;
        }
      }
      return false;
    }
    
    Ajax.request('GET', 'agents', User.token, '&radius=' + radiusSearch, '', function(response) {
      if (response && response.ok) {
        var new_markers = [];
        var agnts = response.agents;

        for (var i = 0; i < agnts.length; i++) {
          if (!searchArray(agnts[i].id, markers_driver_pos)) {
            var photo = agnts[i].photo ? agnts[i].photo : User.default_avatar;
            var photo_car = agnts[i].vehicle ? agnts[i].vehicle : Car.default_vehicle;
            var name = agnts[i].name ? agnts[i].name : '&nbsp;';
            var brand = agnts[i].brand ? agnts[i].brand : '&nbsp;';
            var model = agnts[i].model ? agnts[i].model : '&nbsp;';
            var favorite = !agnts[i].isFavorite ? '<button data-id="' + agnts[i].id  + '" data-click="addtofav">Избранное</button>' : '<button data-id="' + agnts[i].id  + '" data-click="deltofav">Удалить из Избранного</button>';
            var info = '<div style="text-align:center;">\n\
                          <div style="width:50%;display:inline-block;float: left;">\n\
                            <p>id' + agnts[i].id + '<br>' + name + '</p>\n\
                            <p><img class="avatar" src="' + photo + '" alt=""/></p>\n\
                            <p>' + favorite + '</p>\n\
                          </div>\n\
                          <div style="width:50%;display:inline-block">\n\
                            <p>' + brand + '<br>\n\
                            ' + model + '</p>\n\
                            <p><img class="avatar" src="' + photo_car + '" alt=""/></p>\n\
                            <p><button data-id="' + agnts[i].id + '" data-click="addtoblack">Черный список</button></p>\n\
                          </div>\n\
                        </div>\n\
                        ';
            var marker = addInfoForMarker(info, false, addMarker(new google.maps.LatLng(agnts[i].latitude, agnts[i].longitude), agnts[i].name, driver_icon, map_choice));
            //markers_driver_pos.push({'id': agnts[i].id, 'marker': marker});
            new_markers.push({'id': agnts[i].id, 'marker': marker});
            //console.log('new id ' + agnts[i].id);
          } else {
            if (markers_driver_pos[i]) {
              markers_driver_pos[i].marker.setPosition(new google.maps.LatLng(agnts[i].latitude, agnts[i].longitude));
              new_markers.push({'id': agnts[i].id, 'marker': markers_driver_pos[i].marker});
              //console.log('move id ' + agnts[i].id);
            }
          }
        }

        var result = [];
        for (var i = 0; i < markers_driver_pos.length; i++) {
          var s = false;
          for (var y = 0; y < new_markers.length; y++) {
            if (markers_driver_pos[i].id === new_markers[y].id) {
              s = true;
            }
          }
          if (!s) {
            result.push(markers_driver_pos[i]);
          }
        }

        for (var i = 0; i < result.length; i++) {
          //console.log('delete id ' + result[i].id);
          result[i].marker.setMap(null);
        }
        
        markers_driver_pos = [];
        markers_driver_pos = new_markers;
        
      }
    }, function() {});
  }

  function AddNewZaezd(just_add) {
    var time = MyOrder.times[just_add];
    var addr = MyOrder.toAddresses[just_add];
      time = time > 0 ? time + " мин" : "";
      addr = addr ? addr : "";
    var el = Dom.sel('.order-city-to');
    var new_field = document.createElement('div');
     new_field.className += 'form-order-city__field order-city-to_z';
     new_field.innerHTML = '<i class="icon-record form-order-city__label"></i>\n\
                            <span class="form-order-city__wrap">\n\
                              <input type="text" name="to_plus' + just_add + '" value="' + addr + '" placeholder="Заезд"/>\n\
                            </span>\n\
                            <span data-click="field_add_time" data-id="' + just_add + '" class="form-order-city__field_add_time">\n\
                              <i class="icon-clock"></i><span class="top-index">' + time + '</span>\n\
                            </span>\n\
                            <span data-click="field_delete" data-id="' + just_add + '" class="form-order-city__field_delete">\n\
                              <i class="icon-trash"></i>\n\
                            </span>\n\
                            <i data-click="choice_location" class="icon-street-view form-order-city__add-button"></i>';

    var parentDiv = el.parentNode;
      parentDiv.insertBefore(new_field, el);
    addEventChooseAddress('to_plus' + just_add);
  }

  function addEvents() {
    
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
          
        if (target) {
          if (target.dataset.click === "addtofav") {
            var el = target;
            Ajax.request('POST', 'favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltofav">Удалить из Избранного</button>';
              }
            }, function() {});
          }
          
          if (target.dataset.click === "deltofav") {
            var el = target;
            Ajax.request('POST', 'delete-favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtofav">Избранное</button>';
              }
            }, function() {});
          }
          
          if (target.dataset.click === "addtoblack") {
            var el = target;
            Ajax.request('POST', 'black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltoblack">Удалить из Черного списка</button>';
              }
            }, function() {}); 
          }  
          
          if (target.dataset.click === "deltoblack") {
            var el = target;
            Ajax.request('POST', 'delete-black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
              if (response && response.ok) {
                el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtoblack">Черный список</button>';
              }
            }, function() {}); 
          }  
          
          if (target.dataset.click === 'choice_location') {
            localStorage.setItem('_address_temp', target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
            window.location.hash = '#client_choice_location_map';

            return;
          }

          if (target.dataset.click === 'drop-down') {
            var _el = target;
            var _top = Dom.selAll('[data-controller="taxi_client_city"]')[0];
            var _bottom = Dom.selAll('[data-controller="taxi_client_city_bottom"]')[0];

            if (_top.style.top === '4em' || _top.style.top === '') {
              _el.classList.remove('drop-down');
              _el.classList.add('drop-up');
              _top.style.top = '-10em';
              _bottom.style.bottom = '-10em';
              _el.style.opacity = 1;
              _el.style.top = '-3.5em';
            } else {
              _el.classList.remove('drop-up');
              _el.classList.add('drop-down');
              _top.style.top = '4em';
              _bottom.style.bottom = '1em';
              _el.style.top = '-0.5em';
            }

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

            return;
          }

          if (target.dataset.click === 'clean-field') {
            var _field = target.dataset.field;

            if (_field === "from") {
              MyOrder.fromAddress = "";
              MyOrder.fromCity = "";
              MyOrder.fromCoords = "";
              MyOrder.fromFullAddress = "";
            }

            if (_field === "to") {
              MyOrder.toAddress = "";
              MyOrder.toCity = "";
              MyOrder.toCoords = "";
              MyOrder.toFullAddress = "";
            }

            Dom.selAll('.adress_' + _field)[0].value = "";

            return;
          }

          if (target.dataset.click === 'field_add_time') {
            var _id = target.dataset.id;

            Modal.show('<p><button class="button_rounded--green" data-response="0">Без задержки</button></p>\n\
                      <p><button class="button_rounded--green" data-response="5">5 мин</button></p>\n\
                      <p><button class="button_rounded--green" data-response="10">10 мин</button></p>\n\
                      <p><button class="button_rounded--green" data-response="15">15 мин</button></p>\n\
                      <p><button class="button_rounded--green" data-response="20">20 мин</button></p>\n\
                      <p><button class="button_rounded--green" data-response="30">30 мин</button></p>\n\
                    ', function (response) {
                        eval("MyOrder.times[" + _id + "] = " + response);
                        reloadPoints();
                    });

            return;
          }
              // = Form delete point order =
          if (target.dataset.click === 'field_delete') {
            var _id = target.dataset.id;

            MyOrder.toAddresses.splice(_id, 1);
            MyOrder.toCoordses.splice(_id, 1);
            MyOrder.times.splice(_id, 1);

            var be_dead = target.parentNode;
              be_dead.parentNode.removeChild(be_dead);

            reloadPoints();

            return;
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
            // = Click choose location =
        if (target.dataset.submit === "taxy_client_city") {
            Dom.sel('[data-click="order-taxi"]').disabled = true;

            var _price = Dom.sel('[name="cost"]').value;
            MyOrder.price = _price === "" ? recommended_cost : _price;
            MyOrder.comment = Dom.sel('[name="description"]').value;

            var data = new FormData();

            event.preventDefault();

            data.append('fromCity', User.city);
            data.append('fromAddress', MyOrder.fromAddress);
            data.append('fromLocation', MyOrder.fromCoords);
            data.append('toCity', User.city);
            data.append('toAddress', MyOrder.toAddress);
            data.append('toLocation', MyOrder.toCoords);
            data.append('duration', MyOrder.duration);
            data.append('isIntercity', 0);
            //data.append('bidId', '');
            data.append('price', MyOrder.price);
            data.append('comment', MyOrder.comment);
            data.append('minibus', 0);
            data.append('babyChair', 0);
            data.append('length', MyOrder.length);

            if (MyOrder.toAddresses.length > 0) {
              //var _points = [];

              for (var i = 0; i < MyOrder.toAddresses.length; i++) {
                var time = MyOrder.times[i] ? MyOrder.times[i] : 0;
                //_points.push({'address': MyOrder.toAddresses[i],'location': MyOrder.toCoordses[i],'stopTime': time,'city': User.city,'fullAddress': ''});
                data.append('points[' + i + '][address]', MyOrder.toAddresses[i]);
                data.append('points[' + i + '][location]', MyOrder.toCoordses[i]);
                data.append('points[' + i + '][stopTime]', time);
                data.append('points[' + i + '][city]', User.city);
                data.append('points[' + i + '][fullAddress]', '');
              }
              //data.append('points', _points);
            }

            Ajax.request('POST', 'order', User.token, '', data, function(response) {
              if (response && response.ok) {
                MyOrder.id = response.id;
                window.location.hash = '#client_map';                
              } else {
                alert('Укажите в профиле ваш город');
              }
            }, function() {});

          return;
        }

        target = target.parentNode;
      }
    };

    content.addEventListener('submit', Event.submit);
    
  }
  
  function reloadPoints() {
    var rem_old_stops = Dom.selAll('.order-city-to_z');

    for (var i = 0; i < rem_old_stops.length; i++) {
      rem_old_stops[i].parentNode.removeChild(rem_old_stops[i]);
    }

    for (var i = 0; i < MyOrder.toAddresses.length; i++) {
      AddNewZaezd(i);
    }
  }
  
  function start() {
    
    get_pos_drivers();
    
    price.value = MyOrder.price;
    comment.value = MyOrder.comment;

    //from.value = localStorage.getItem('_address_from');
    //to.value = localStorage.getItem('_address_to');
    
    Dom.selAll('input[name="from"]')[0].value = MyOrder.fromAddress;
    Dom.selAll('input[name="to"]')[0].value = MyOrder.toAddress;
    
    reloadPoints();
    
    addEventChooseAddress('from');    
    addEventChooseAddress('to');

    timerGetPosTaxy = setInterval(get_pos_drivers, 1000);
    
    initialize_iam();
    addEvents();
    
  }
  
  return {
    start: start
  };
  
});