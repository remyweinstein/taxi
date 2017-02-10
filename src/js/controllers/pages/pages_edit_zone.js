/* global Zones, google, map, User, Event */

define(['Dom', 'Geo', 'Maps', 'Funcs'], function (Dom, Geo, Maps, Funcs) {

  var polygon = new google.maps.Polygon({});
  var points = [];
  var markers = [];
  var id_edit_zone;
  var bounds = new google.maps.LatLngBounds();
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              if (target.dataset.click === 'save-zone') {
                var Coords = [];
                
                for (var i = 0; i < points.length; i++) {
                  Coords.push({lat:points[i].lat0, lng:points[i].lng0});
                }
                if (Coords.length < 3) {
                  alert('Ну это же не полигон совсем, точки три хотя бы сделайте');
                } else {
                  var note = Dom.sel('input[name="note_edit_zone"]').value;
                  var name = Dom.sel('input[name="name_edit_zone"]').value;
                  
                  if (id_edit_zone) {
                    Zones.edit(id_edit_zone, Coords, note, name);
                  } else {
                    Zones.add(Coords, note, name);
                  }
                  window.history.back();
                }

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
  }

  function drawPoly() {
    google.maps.event.clearListeners(polygon, 'click', addMarker);
    polygon.setMap(null);

    polygon = Geo.drawPoly(points, map);      
    google.maps.event.addListener(polygon, 'click', addMarker);
  }

  function addMarker(e, edit) {
    var lat, lng;
    
    if (edit) {
      lat = e.lat;
      lng = e.lng;
    } else {
      lat = e.latLng.lat();
      lng = e.latLng.lng();
    }
    var marker = new google.maps.Marker({
      position: getLatLng(lat, lng),
      map: map,
      draggable : true,
      lat: lat,
      lng: lng
    });
    if (markers.length > 1) { // default 2
      findStartPoint(lng, lat, function (v) {
        markers.splice(v, 0, marker);
      });
    } else {
      markers.push(marker);
    }
    bindMarkerEvents(marker);
    showPoly();
  }

  function pDistance(x, y, x1, y1, x2, y2) {

    var xx, yy;
    var A = x - x1;
    var B = y - y1;
    var C = x2 - x1;
    var D = y2 - y1;

    var dot = A * C + B * D;
    var len_sq = C * C + D * D;
    var param = -1;

    if (len_sq !== 0) {
      param = dot / len_sq;
    }

    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }

    var dx = x - xx;
    var dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function findStartPoint(lng, lat, callback) {
    var distA = 10000000000000000000;
    var y = 0, dist;

    for (var i = 0; i < markers.length; i++) {

      if (i === (markers.length - 1)) {
        dist = pDistance(lng, lat, markers[0].lng, markers[0].lat, markers[i].lng, markers[i].lat);
      } else {
        dist = pDistance(lng, lat, markers[i + 1].lng, markers[i + 1].lat, markers[i].lng, markers[i].lat);
      }

      if (distA > dist) {
        distA = dist;
        y = i + 1;
      }
    }

    callback(y);
  }
  
  function getLatLng(lat, lng) {
    return new google.maps.LatLng(lat, lng);
  }
  
  function bindMarkerEvents(marker) {
    google.maps.event.addListener(marker, 'click', function () {
      removeMarker(marker);
    });

    google.maps.event.addListener(marker, 'dragend', function (point) {
      var latlng = new google.maps.LatLng(point.latLng.lat(), point.latLng.lng());

      marker.setPosition(latlng);
      marker.lat = point.latLng.lat();
      marker.lng = point.latLng.lng();
      showPoly();
    });
  }

  function removeMarker(marker) {
    for (var i = 0; i < markers.length; i++) {
      if (google.maps.geometry.spherical.computeDistanceBetween(
            marker.getPosition(), markers[i].getPosition()) < 0.1) {
       markers[i].setMap(null);
       markers.splice(i,1);
      }
    }
    showPoly();
  }
    
  function showPoly() {
    var i;

    points = [];
    var bounds = new google.maps.LatLngBounds();

    for (i = 0; i < markers.length; i++) {
      points.push(markers[i].getPosition());
      bounds.extend(markers[i].getPosition());
    }

    var center = bounds.getCenter();
    var bearing = [];

    for (i = 0; i < points.length; i++) {
      if (google.maps.geometry) {
        bearing = google.maps.geometry.spherical.computeHeading(center, points[i]);

        points[i].bearing = bearing;
        markers[i].bearing = bearing;
        points[i].lat0 = markers[i].lat;
        points[i].lng0 = markers[i].lng;
      }
    }

    //points.sort(bearingsort);
    //markers.sort(bearingsort);

    drawPoly();

  }

  function initMap() {
    id_edit_zone = localStorage.getItem('_edit_zone');
    
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
      map.setCenter(MyLatLng);
      map.setZoom(12);

    marker_mine = new google.maps.Marker({
      position: MyLatLng,
      map: map,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
      title: 'Я здесь!'
    });
        
    google.maps.event.addListener(map, 'click', addMarker);    
  }
  
  function fillName() {
    var name, i, note = '';
    if (id_edit_zone) {
      var arr_id = Funcs.findIdArray(Zones.list, id_edit_zone);
      
      name = Zones.list[arr_id].name;
      note = Zones.list[arr_id].note;
      for (i = 0; i < Zones.list[arr_id].polygon.length; i++) {
        var lat = Zones.list[arr_id].polygon[i].lat;
        var lng = Zones.list[arr_id].polygon[i].lng;
        
        var marker = new google.maps.Marker({
          position: getLatLng(lat, lng),
          map: map,
          draggable : true,
          lat: lat,
          lng: lng
        });
        
        markers.push(marker);

        bindMarkerEvents(marker);
      }
      
      points = [];
      clearBounds();
      
      for (i = 0; i < markers.length; i++) {
        points.push(markers[i].getPosition());
        bounds.extend(markers[i].getPosition());
      }
      for (i = 0; i < points.length; i++) {
        points[i].lat0 = markers[i].lat;
        points[i].lng0 = markers[i].lng;
      }
      
      drawPoly();
      map.fitBounds(bounds);
      
    } else {
      name = 'Зона ' + (Zones.list.length + 1);
    }
    Dom.sel('input[name="name_edit_zone"]').value = name;
    Dom.sel('input[name="note_edit_zone"]').value = note;

    return;
  }
  
  function clearBounds() {
    bounds = new google.maps.LatLngBounds();
  }
  
  function stop() {
    polygon.setMap(null);
    for (var i = 0; i < markers.length; i++) {
      markers[i].setMap(null);
    }
    google.maps.event.clearListeners(markers, 'click');
    google.maps.event.clearListeners(polygon, 'click');
    google.maps.event.clearListeners(map, 'click');
    polygon = new google.maps.Polygon({});
    markers = [];
    points = [];
    localStorage.removeItem('_edit_zone');
  }
  
  function start() {
    Maps.mapOn(false);
    initMap();
    fillName();
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});