/* global google, map, driver_icon, men_icon, User, MapElements, MyOrder, MyOffer, default_vehicle, SafeWin */

define(['Ajax', 'Car', 'Maps', 'Dates', 'Dom', 'Geo'], function(Ajax, Car, Maps, Dates, Dom, Geo) {
  var radiusSearch = 0.5;
  
  function init() {
    map.addListener('zoom_changed', function() {
      var zoom = map.getZoom();
      
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
  function get_my_pos() {
    if (MapElements.marker_mine) {
      MapElements.marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
    } else {
      MapElements.marker_mine = new google.maps.Marker({
        position: new google.maps.LatLng(User.lat, User.lng),
        map: map,
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
        title: 'Я здесь!'
      });
    }
  }
  
  function get_pos_one_driver(type) {
    var show_route = false;
    
    if (type === 'order') {
      Model = MyOrder;
    } else {
      Model = MyOffer;
    }
    Ajax.request('GET', 'bid', User.token, '&id=' + Model.bid_id, '', function(response) {
      if (response && response.ok) {

        var ords = response.bid.order,
            agnt = response.bid.agent;
        
        Model.id = ords.id;
        dr_model = agnt.brand + ' ' + agnt.model;
        dr_name = agnt.name;
        dr_color = agnt.color;
        dr_number = agnt.number;
        dr_distanse = agnt.distance.toFixed(1);
        var lost_diff = Dates.diffTime(ords.updated, response.bid.travelTime);
        if (lost_diff >= 0) {
          dr_time = lost_diff;
        } else {
          dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
          if (lost_diff < -10) {
            var but = Dom.sel('[data-click="cancel-order"]');
            if (!ords.arrived) {
              if (but && but.classList.contains('button_rounded--red')) {
                but.classList.remove('button_rounded--red');
                but.classList.add('button_rounded--green');
              }
            } else {
              if (but && but.classList.contains('button_rounded--green')) {
                but.classList.remove('button_rounded--green');
                but.classList.add('button_rounded--red');
              }
            }
          }
        }
        if (ords.arrived) {
          dr_time = 'На месте';
        }
        dr_photo = agnt.photo || User.avatar;
        dr_vehicle = agnt.vehicle || default_vehicle;
        fromCoords = ords.fromLocation.split(",");
        toCoords = ords.toLocation.split(",");
        fromAddress = ords.fromAddress;
        toAddress = ords.toAddress;
        price = Math.round(response.bid.price);
        duration_time = Dates.minToHours(ords.duration);

        Dom.sel('[data-view="distance_to_car"]').innerHTML = dr_distanse;
        Dom.sel('[data-view="while_car"]').innerHTML = dr_time;
        Dom.sel('[data-view="duration"]').innerHTML = duration_time;
        
        waypoints = [];
        
        if (ords.toAddresses) {
          for (var i = 0; i < ords.toAddresses.length; i++) {
            var _to = ords.toLocationes[i].split(",");
            waypoints.push({location: new google.maps.LatLng(_to[0], _to[1]), stopover: true});
            
            Maps.addMarker(new google.maps.LatLng(_to[0], _to[1]), ords.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', function(mark){
              Maps.addInfoForMarker(ords.toTimes[i] + 'мин.', true, mark);
              MapElements.points.push(mark);
            });
          }
        }

        MapElements.marker_a = Maps.addMarker(new google.maps.LatLng(fromCoords[0], fromCoords[1]), Model.fromAddress, '//www.google.com/mapfiles/markerA.png', function(){});
        MapElements.marker_b = Maps.addMarker(new google.maps.LatLng(toCoords[0], toCoords[1]), Model.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', function(){});

        if (!show_route) {
          var el_route = Dom.sel('.wait-order-approve__route-info__route'),
              el_price = Dom.sel('.wait-order-approve__route-info__price'),
              el_cancel = Dom.sel('.wait-order-approve__route-info__cancel'),
              el = Dom.sel('.wait-bids-approve'),
              i;

          el_route.children[0].innerHTML = fromAddress;
          el_route.children[2].innerHTML = toAddress;
          el_price.innerHTML = price + ' руб.';
          el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--red">Отмена</button>';
          el.innerHTML = '<div class="wait-bids-approve__item">' +
                            '<div class="wait-bids-approve__item__distance">' +
                              'Автомобиль:<br/>' +
                              'Цвет: ' + dr_color + '<br/>' +
                              'Рег.номер: ' + dr_number +
                            '</div>' +
                            '<div class="wait-bids-approve__item__car">' +
                              '<div>' +
                                '<img src="' + dr_vehicle + '" alt="" />' +
                              '</div>' +
                              '<div>' +
                                dr_model +
                              '</div>' +
                            '</div>' +
                            '<div class="wait-bids-approve__item__driver">' +
                              '<div>' +
                                '<img src="' + dr_photo + '" alt="" />' +
                              '</div>' +
                              '<div>' +
                                dr_name +
                              '</div>' +
                            '</div>' +
                          '</div>';

          directionsService = new google.maps.DirectionsService();
          directionsDisplay = new google.maps.DirectionsRenderer();

          var request = {
            origin: new google.maps.LatLng(fromCoords[0], fromCoords[1]),
            destination: new google.maps.LatLng(toCoords[0], toCoords[1]),
            waypoints: waypoints,
            provideRouteAlternatives: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };
          var requestBack = {
            destination: new google.maps.LatLng(fromCoords[0], fromCoords[1]),
            origin: new google.maps.LatLng(toCoords[0], toCoords[1]),
            waypoints: waypoints,
            provideRouteAlternatives: true,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
          };

          directionsService.route(request, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {

              for (i = 0, len = response.routes.length; i < len; i++) {
                route.push(new google.maps.DirectionsRenderer({
                  map: map,
                  suppressMarkers: true,
                  directions: response,
                  routeIndex: i
                }));
              }
              for(i = 0; i < response.routes.length; i++){
                var temp = response.routes[i].overview_path;
                SafeWin.overviewPath.push(temp);
              }
              directionsService.route(requestBack, function(response, status) {
                if (status === google.maps.DirectionsStatus.OK) {
                  for (i = 0, len = response.routes.length; i < len; i++) {
                    route.push(new google.maps.DirectionsRenderer({
                      map: map,
                      suppressMarkers: true,
                      directions: response,
                      routeIndex: i
                    }));
                  }
                  for(i = 0; i < response.routes.length; i++){
                    var temp = response.routes[i].overview_path;
                    SafeWin.overviewPath.push(temp);
                  }
                }
                addEvents();
              });
            }
          });

          show_route = true;
        }

        if (ords.arrived) {
          var incar_but = Dom.sel('button[data-click="client-incar"]');
          if (incar_but) {
            incar_but.disabled = false;
          }
        }
        
        var toLoc = ords.toLocation;
          toLoc = toLoc.split(',');
        var dist = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]);
        
        if (dist < 1) {
          var but = Dom.sel('[data-click="client-came"]');
          
          if (but) {
            but.disabled = false;
          }
        }
       
        if (ords.canceled) {
          alert('К сожалению, заказ отменен.');
          window.location.hash = '#client_city';
        }
        
        if (ords.inCar) {
          var incar_but = Dom.sel('button[data-click="client-incar"]');
          
          if (incar_but) {
            var kuda = incar_but.parentNode;
            
            kuda.innerHTML = '<button data-click="client-came" class="button_wide--green" disabled>Приехали</button>';
          }
        }

        var loc = agnt.location.split(',');
        
        if (!markers[0]) {
          var VLatLng = new google.maps.LatLng(loc[0], loc[1]);
          
          markers[0] = new google.maps.Marker({
            position: VLatLng,
            map: map,
            icon: driver_icon,
            title: 'Водитель'
          });
        } else {
          markers[0].setPosition(new google.maps.LatLng(loc[0], loc[1]));
        }
      }

    }, Ajax.error);
  }
  
  function get_pos_drivers() {
    function searchArray(index, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === index) {
          return true;
        }
      }
      return false;
    }
    
    Ajax.request('GET', 'agents', User.token, '&radius=' + radiusSearch, '', function(response) {
      if (response && response.ok) {
        var new_markers = [],
            agnts = response.agents,
            loc,
            i;

        for (i = 0; i < agnts.length; i++) {
          if (!searchArray(agnts[i].id, MapElements.markers_driver_pos)) {
            var photo = agnts[i].photo ? agnts[i].photo : User.default_avatar,
                photo_car = agnts[i].vehicle ? agnts[i].vehicle : Car.default_vehicle,
                name = agnts[i].name ? agnts[i].name : '&nbsp;',
                brand = agnts[i].brand ? agnts[i].brand : '&nbsp;',
                model = agnts[i].model ? agnts[i].model : '&nbsp;',
                favorite = !agnts[i].isFavorite ? '<button data-id="' + agnts[i].id  + '" data-click="addtofav">Избранное</button>' : '<button data-id="' + agnts[i].id  + '" data-click="deltofav">Удалить из Избранного</button>',
                info = '<div style="text-align:center;">' +
                          '<div style="width:50%;display:inline-block;float: left;">' + 
                            '<p>id' + agnts[i].id + '<br>' + name + '</p>' + 
                            '<p><img class="avatar" src="' + photo + '" alt=""/></p>' + 
                            '<p>' + favorite + '</p>' + 
                          '</div>' + 
                          '<div style="width:50%;display:inline-block">' + 
                            '<p>' + brand + '<br>' + model + '</p>' + 
                            '<p><img class="avatar" src="' + photo_car + '" alt=""/></p>' + 
                            '<p><button data-id="' + agnts[i].id + '" data-click="addtoblack">Черный список</button></p>' + 
                          '</div>' + 
                        '</div>';

            loc = agnts[i].location.split(',');
            
            var icon = agnts[i].isDriver ? driver_icon : men_icon;
            
            //marker = 
            Maps.addMarker(new google.maps.LatLng(loc[0], loc[1]), agnts[i].name, icon, function (mark) {
              Maps.addInfoForMarker(info, false, mark);
              new_markers.push({'id': agnts[i].id, 'marker': mark});
            });
          } else {
            if (MapElements.markers_driver_pos[i]) {
              loc = agnts[i].location.split(',');
              MapElements.markers_driver_pos[i].marker.setPosition(new google.maps.LatLng(loc[0], loc[1]));
              new_markers.push({'id': agnts[i].id, 'marker': MapElements.markers_driver_pos[i].marker});
            }
          }
        }

        var result = [];
        
        for (i = 0; i < MapElements.markers_driver_pos.length; i++) {
          var s = false;
          for (var y = 0; y < new_markers.length; y++) {
            if (MapElements.markers_driver_pos[i].id === new_markers[y].id) {
              s = true;
            }
          }
          if (!s) {
            result.push(MapElements.markers_driver_pos[i]);
          }
        }

        for (i = 0; i < result.length; i++) {
          result[i].marker.setMap(null);
        }
        
        MapElements.markers_driver_pos = [];
        MapElements.markers_driver_pos = new_markers;
        
      }
    }, function() {});
  }
  
  var GetPositions = {
    
    clear: function () {
      clearInterval(timerGetPosTaxy);
      clearInterval(timerMyPos);
      
      MapElements.clear();
    },
    my: function () {
      get_my_pos();
      clearInterval(timerMyPos);
      timerMyPos = setInterval(get_my_pos, 1000);
    },
    driver: function () {
      get_pos_one_driver();
      clearInterval(timerGetPosOneDriver);
      timerGetPosOneDriver = setInterval(get_pos_one_driver, 1000);
    },
    drivers: function () {
      init();
      get_pos_drivers();
      clearInterval(timerGetPosTaxy);
      timerGetPosTaxy = setInterval(get_pos_drivers, 1000);
    }
  };
  
  return GetPositions;
  
  });