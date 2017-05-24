/* global driver_icon, men_icon, User, MapElements, Conn, Maps */

define(['Car'], function (Car) {
  var radiusSearch = 0.5;
  
  function cbGetAgents(response) {
    if (!response.error) {
      get_pos_drivers(response.result);
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
    var agnts = response.agents,
        i;

    for (i = 0; i < agnts.length; i++) {
      var loc = agnts[i].location.split(',');

      if (!MapElements.markers_driver_pos[agnts[i].id]) {
        var photo     = agnts[i].photo || User.default_avatar,
            photo_car = agnts[i].cars ? agnts[i].cars[0].photo : Car.default_vehicle,
            name      = agnts[i].name || '&nbsp;',
            brand     = agnts[i].cars ? agnts[i].cars[0].brand : '&nbsp;',
            model     = agnts[i].cars ? agnts[i].cars[0].model : '&nbsp;',
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

        Maps.addMarker(loc[0], loc[1], name, icon, [32,32], function(mark){
          Maps.addInfoForMarker(info, false, mark);
          MapElements.markers_driver_pos[agnts[i].id] = mark;
        });
      } else {
        Maps.markerSetPosition(loc[0], loc[1], MapElements.markers_driver_pos[agnts[i].id]);
      }
    }

    for (var key in MapElements.markers_driver_pos) {
      if (MapElements.markers_driver_pos.hasOwnProperty(key) &&
          /^0$|^[1-9]\d*$/.test(key) &&
          key <= 4294967294) {
          var sovp = false;

          for (var i = 0; i < agnts.length; i++) {
            if (agnts[i].id  === key) {
              sovp = true;
            }
          }

          if (!sovp) {
            Maps.removeElement(MapElements.markers_driver_pos[key]);
            delete MapElements.markers_driver_pos[key];
          }
      }
    }
    
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
    }
  };

  return GetPositions;

});