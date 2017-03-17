/* global Zones, google, map, User, Event, Maps, MapElements */

define(['Dom', 'Geo', 'Funcs'], function (Dom, Geo, Funcs) {

  var polygon = new google.maps.Polygon({}),
      points = [],
      markers = [],
      id_edit_zone,
      bounds = new google.maps.LatLngBounds(),
      eventOnClickMarkers,
      eventOnClickPolygon = false,
      eventOnClickMap,
      eventOnDragEndMarker;
      
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
                  Dom.historyBack();
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
    if (eventOnClickPolygon) {
      Maps.removeEvent(eventOnClickPolygon);
    }
    Maps.removeElement(polygon);

    polygon = Maps.drawPoly(points);
    eventOnClickPolygon = Maps.addEvent(polygon, 'click', addMarker);
  }

  function addMarker(e, edit) {
    var LatLng;

    if (edit) {
      LatLng = [e.lat, e.lng];
    } else {
      LatLng = Maps.getLocationClick(e);
    }
    
    var marker = Maps.addMarker(LatLng[0], LatLng[1], '', '//maps.google.com/mapfiles/kml/paddle/red-circle.png', [32,32], function(){});
    
    if (markers.length > 1) { // default 2
      findStartPoint(LatLng[0], LatLng[1], function (v) {
        markers.splice(v, 0, marker);
      });
    } else {
      markers.push(marker);
    }

    bindMarkerEvents(marker);
    showPoly();
  }

  function pDistance(x, y, x1, y1, x2, y2) {
    var xx, yy,
        A = x - x1,
        B = y - y1,
        C = x2 - x1,
        D = y2 - y1,
        dot = A * C + B * D,
        len_sq = C * C + D * D,
        param = -1;

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

    var dx = x - xx,
        dy = y - yy;

    return Math.sqrt(dx * dx + dy * dy);
  }

  function findStartPoint(lng, lat, callback) {
    var distA = 10000000000000000000,
        y = 0, 
        dist;

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
  
  function bindMarkerEvents(marker) {
    eventOnClickMap = Maps.addEvent(marker, 'click', function () {
      removeMarker(marker);
    });
    
    eventOnDragEndMarker = Maps.addEvent(marker, 'dragend', function (point) {
      Maps.markerSetPosition(point.latLng.lat(), point.latLng.lng(), marker);
      marker.lat = point.latLng.lat();
      marker.lng = point.latLng.lng();
      showPoly();
    });
  }

  function removeMarker(marker) {
    for (var i = 0; i < markers.length; i++) {
      if (google.maps.geometry.spherical.computeDistanceBetween(
        marker.getPosition(), markers[i].getPosition()) < 0.1) {
          Maps.removeElement(markers[i]);
          markers.splice(i, 1);
        }
    }
    showPoly();
  }
    
  function showPoly() {
    var bounds,
        bearing = [],
        i;

    points = [];

    for (i = 0; i < markers.length; i++) {
      var coords = Maps.getMarkerCoords(markers[i]);
      
      points.push(coords);
    }
    
    bounds = Maps.newPolygon(points);

    for (i = 0; i < points.length; i++) {
      if (google.maps.geometry) {
        bearing = Maps.getDistance(Maps.getCenterPolygon(bounds), points[i]);
        points[i].bearing = bearing;
        markers[i].bearing = bearing;
        points[i].lat0 = markers[i].lat;
        points[i].lng0 = markers[i].lng;
      }
    }

    drawPoly();
  }

  function initMap() {
    id_edit_zone = localStorage.getItem('_edit_zone');
    
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);

    MapElements.marker_mine = Maps.addMarker(User.lat, User.lng, 'Я здесь!', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==', [10,10], function(){});
    eventOnClickMarkers = Maps.addEvent(Maps.map, 'click', addMarker);
  }
  
  function fillName() {
    var name,
        note = '',
        i;
    
    if (id_edit_zone) {
      var arr_id = Funcs.findIdArray(Zones.list, id_edit_zone);
      
      name = Zones.list[arr_id].name;
      note = Zones.list[arr_id].note;
      
      for (i = 0; i < Zones.list[arr_id].polygon.length; i++) {
        var lat = Zones.list[arr_id].polygon[i].lat,
            lng = Zones.list[arr_id].polygon[i].lng,
            marker = Maps.addMarker(lat, lng, '', '//maps.google.com/mapfiles/kml/paddle/red-circle.png', [32,32], function(){});
        
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
      Maps.map.fitBounds(bounds);
      
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
    Maps.removeElement(polygon);
    
    for (var i = 0; i < markers.length; i++) {
      Maps.removeElement(markers[i]);
    }
    
    Maps.removeEvent(eventOnClickMarkers);
    Maps.removeEvent(eventOnClickPolygon);
    Maps.removeEvent(eventOnClickMap);
    
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