/* global driver_icon, men_icon, User, MapElements, Conn, Maps */

define(['Car'], function (Car) {
  var radiusSearch = 0.5;
  
  function cbGetAgents(response) {
    if (!response.error) {
      GetPositions.getPositionDrivers(response.result);
    }
  }
  
  function init() {
    var zoomer = Maps.addZoomEvent(function () {
          var zoom = Maps.map.getZoom();
          
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
          
          Conn.request('stopGetAgents');
          Conn.request('startGetAgents', radiusSearch, cbGetAgents);
        });

    return zoomer;
  }
  
  function get_my_pos() {
    if (MapElements.marker_mine) {
      Maps.markerSetPosition(User.lat, User.lng, MapElements.marker_mine);
    } else {
      MapElements.marker_mine = Maps.addMarker(User.lat, User.lng, 'Я здесь', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==', [10,10], function(){});
    }
  }

  function get_pos_drivers(response) {
    
    function searchArray(index, arr) {
      for (var i = 0; i < arr.length; i++) {
        if (arr[i].id === index) {
          return true;
        }
      }
      return false;
    }

    var new_markers = [],
        agnts = response.agents,
        loc,
        i;

    for (i = 0; i < agnts.length; i++) {
      if (!searchArray(agnts[i].id, MapElements.markers_driver_pos)) {
        var photo     = agnts[i].photo || User.default_avatar,
            photo_car = agnts[i].cars[0].photo || Car.default_vehicle,
            name      = agnts[i].name || '&nbsp;',
            brand     = agnts[i].cars[0].brand || '&nbsp;',
            model     = agnts[i].cars[0].model || '&nbsp;',
            favorite  = !agnts[i].isFavorite ? '<button data-id="' + agnts[i].id + '" data-click="addtofav">Избранное</button>' : '<button data-id="' + agnts[i].id + '" data-click="deltofav">Удалить из Избранного</button>',
            icon      = agnts[i].isDriver ? driver_icon : men_icon,
            info      = '<div style="text-align:center;">' +
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

        Maps.addMarker(loc[0], loc[1], agnts[i].name, icon, [32,32], function (mark) {
          Maps.addInfoForMarker(info, false, mark);
          new_markers.push({'id': agnts[i].id, 'marker': mark});
        });
      } else {
        if (MapElements.markers_driver_pos[i]) {
          loc = agnts[i].location.split(',');
          Maps.markerSetPosition(loc[0], loc[1], MapElements.markers_driver_pos[i].marker);
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
      Maps.removeElement(result[i].marker);
    }
    
    MapElements.markers_driver_pos = [];
    MapElements.markers_driver_pos = new_markers;
  }

  var GetPositions = {

    clear: function () {
      Conn.request('stopGetAgents');
      Conn.clearCb('cbGetAgents');
      timerMyPos = clearInterval(timerMyPos);
      MapElements.clear();
    },
    
    my: function () {
      get_my_pos();
      
      if (timerMyPos) {
        timerMyPos = clearInterval(timerMyPos);
      }
      timerMyPos = setInterval(get_my_pos, 1000);
    },
    
    drivers: function () {
      var link = init();
      
      Conn.request('startGetAgents', radiusSearch, cbGetAgents);
      
      return link;
    },
    
    getPositionDrivers: function (response) {
      get_pos_drivers(response);
    }
  };

  return GetPositions;

});