/* global google, map, driver_icon, men_icon */

define(['Ajax', 'User', 'Car'], function(Ajax, User, Car) {
  var marker_mine,
      markers_driver_pos = [],
      radiusSearch = 0.5,
      timerGetPosTaxy,
      timerMyPos;
  
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
    if (marker_mine) {
      marker_mine.setPosition(new google.maps.LatLng(User.lat, User.lng));
    } else {
      marker_mine = new google.maps.Marker({
        position: new google.maps.LatLng(User.lat, User.lng),
        map: map,
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
        title: 'Я здесь!'
      });
    }
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
          if (!searchArray(agnts[i].id, markers_driver_pos)) {
            var photo = agnts[i].photo ? agnts[i].photo : User.default_avatar,
                photo_car = agnts[i].vehicle ? agnts[i].vehicle : Car.default_vehicle,
                name = agnts[i].name ? agnts[i].name : '&nbsp;',
                brand = agnts[i].brand ? agnts[i].brand : '&nbsp;',
                model = agnts[i].model ? agnts[i].model : '&nbsp;',
                marker,
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
            
            if (agnts[i].isDriver) {
              marker = addInfoForMarker(info, false, addMarker(new google.maps.LatLng(loc[0], loc[1]), agnts[i].name, driver_icon, map));
            } else {
              marker = addInfoForMarker(info, false, addMarker(new google.maps.LatLng(loc[0], loc[1]), agnts[i].name, men_icon, map));
            }
            //markers_driver_pos.push({'id': agnts[i].id, 'marker': marker});
            new_markers.push({'id': agnts[i].id, 'marker': marker});
          } else {
            if (markers_driver_pos[i]) {
              loc = agnts[i].location.split(',');
              markers_driver_pos[i].marker.setPosition(new google.maps.LatLng(loc[0], loc[1]));
              new_markers.push({'id': agnts[i].id, 'marker': markers_driver_pos[i].marker});
            }
          }
        }

        var result = [];
        
        for (i = 0; i < markers_driver_pos.length; i++) {
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

        for (i = 0; i < result.length; i++) {
          result[i].marker.setMap(null);
        }
        
        markers_driver_pos = [];
        markers_driver_pos = new_markers;
        
      }
    }, function() {});
  }
  
  var PosDrivers = {
    clear: function () {
      clearInterval(timerGetPosTaxy);
      clearInterval(timerMyPos);
      
      if (marker_mine) {
        marker_mine.setMap(null);
      }
      for (i = 0; i < markers_driver_pos.length; i++) {
        markers_driver_pos[i].marker.setMap(null);
      }

    },
    my: function () {
      
    },
    drivers: function () {
      init();
      get_pos_drivers();          
      timerGetPosTaxy = setInterval(get_pos_drivers, 1000);
      timerMyPos = setInterval(get_my_pos, 1000);
    }
  };
  
  return PosDrivers;
  
  });