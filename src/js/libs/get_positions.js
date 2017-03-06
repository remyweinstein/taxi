/* global google, map, driver_icon, men_icon, User, MapElements, MyOrder, MyOffer, default_vehicle, SafeWin, Conn */

define(['Car', 'Maps', 'Dates', 'Dom', 'Geo'], function (Car, Maps, Dates, Dom, Geo) {
  var radiusSearch = 0.5;
  
  function cbGetAgents(response) {
    GetPositions.getPositionDrivers(response);
  }
  
  function init() {
    map.addListener('zoom_changed', function () {
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
      
      Conn.request('stopGetAgents');
      Conn.request('startGetAgents', radiusSearch, cbGetAgents);
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
        var photo = agnts[i].photo ? agnts[i].photo : User.default_avatar,
          photo_car = agnts[i].vehicle ? agnts[i].vehicle : Car.default_vehicle,
          name = agnts[i].name ? agnts[i].name : '&nbsp;',
          brand = agnts[i].brand ? agnts[i].brand : '&nbsp;',
          model = agnts[i].model ? agnts[i].model : '&nbsp;',
          favorite = !agnts[i].isFavorite ? '<button data-id="' + agnts[i].id + '" data-click="addtofav">Избранное</button>' : '<button data-id="' + agnts[i].id + '" data-click="deltofav">Удалить из Избранного</button>',
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

  var GetPositions = {

    clear: function () {
      Conn.request('stopGetAgents');
      Conn.clearCb('cbGetAgents');
      clearInterval(timerMyPos);
      MapElements.clear();
    },
    my: function () {
      get_my_pos();
      clearInterval(timerMyPos);
      timerMyPos = setInterval(get_my_pos, 1000);
    },
    drivers: function () {
      init();
      Conn.request('startGetAgents', radiusSearch, cbGetAgents);
    },
    getPositionDrivers: function (response) {
      get_pos_drivers(response);
    }
  };

  return GetPositions;

});