/* global Zones, User, Event, Maps, MapElements */

define(['Dom', 'Funcs'], function (Dom, Funcs) {

  var polygon,
      points = [],
      markers = [],
      id_edit_zone,
      eventOnClickMarker = null,
      eventOnClickPolygon = null,
      eventOnClickMap = null,
      eventOnDragEndMarker = null;
      
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              if (target.dataset.click === 'save-zone') {
                var Coords = [];
                
                for (var i = 0; i < points.length; i++) {
                  Coords.push({lat:points[i].lat, lng:points[i].lng});
                }
                
                if (Coords.length < 3) {
                  alert('Ну это же не полигон совсем, точки три хотя бы сделайте');
                } else {
                  var note = Dom.sel('input[name="note_edit_zone"]').value,
                      name = Dom.sel('input[name="name_edit_zone"]').value;
                  
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
    
    if (polygon) {
      Maps.removeElement(polygon);
      polygon = null;
    }

    polygon = Maps.drawPoly(points);
    Maps.addElOnMap(polygon);
    eventOnClickPolygon = Maps.addEvent(polygon, 'click', addMarker);
  }

  function addMarker(e, edit) {
    var LatLng;

    if (edit) {
      LatLng = [e.lat, e.lng];
    } else {
      LatLng = Maps.getLocationClick(e);
    }
    
    var marker = Maps.addMarkerDrag(LatLng[0], LatLng[1], '', '//maps.google.com/mapfiles/kml/paddle/red-circle.png', [32,32], function(){});
    
    if (markers.length > 2) { // default 2
      findStartPoint(LatLng[0], LatLng[1], function (v) {
        if (markers.length === (v + 1)) {
          markers.push(marker);
        } else {
          markers.splice(v + 1, 0, marker);
        }
      });
    } else {
      markers.push(marker);
    }

    bindMarkerEvents(marker);
    showPoly();
  }

  function pDistance(x, y, x1, y1, x2, y2) {
    function sqr(x) { 
        return x * x;
    }

    function dist2(v, w) { 
        return sqr(v.x - w.x) + sqr(v.y - w.y);
    }

    function distToSegmentSquared(p, v, w) {
      var l2 = dist2(v, w);

      if (l2 === 0) {
        return dist2(p, v);
      }

      var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

      if (t < 0) {
        return dist2(p, v);
      }
      
      if (t > 1) {
        return dist2(p, w);
      }

      return dist2(p, { x: v.x + t * (w.x - v.x), y: v.y + t * (w.y - v.y) });
    }

    return Math.sqrt(distToSegmentSquared({x: x*10000, y: y*10000}, {x: x1*10000, y: y1*10000 }, {x: x2*10000, y: y2*10000 }));
  }

  function findStartPoint(lat, lng, callback) {
    var distA = 1000000000000000,
        y = points.length - 1, 
        dist;

    for (var i = 0; i < points.length; i++) {
      if ((i + 1) === points.length) {
        dist = pDistance(lat, lng, points[0].lat, points[0].lng, points[i].lat, points[i].lng);
      } else {
        dist = pDistance(lat, lng, points[i].lat, points[i].lng, points[i + 1].lat, points[i + 1].lng);
      }
      
      if (parseFloat(dist) < parseFloat(distA)) {
        distA = dist;
        y = i;
      }
    }

    callback(y);
  }
  
  function bindMarkerEvents(marker) {
    eventOnClickMarker = Maps.addEvent(marker, 'click', function () {
      removeMarker(marker);
    });
    
    eventOnDragEndMarker = Maps.addEventDrag(marker, function (point) {
      Maps.markerSetPosition(point[0], point[1], marker);
      marker.lat = point[0];
      marker.lng = point[1];
      showPoly();
    });
  }

  function removeMarker(marker) {
    for (var i = 0; i < markers.length; i++) {
      if (Maps.getDistance(Maps.getMarkerCoords(marker), Maps.getMarkerCoords(markers[i])) < 0.1) {
        Maps.removeElement(markers[i]);
        markers.splice(i, 1);
      }
    }
    
    showPoly();
  }
    
  function showPoly() {
    var bounds = null,
        bearing = [],
        i;
    points = [];

    for (i = 0; i < markers.length; i++) {
      points.push(Maps.getMarkerCoords(markers[i]));
    }
    
    bounds = Maps.drawPoly(points);
    Maps.addElOnMap(bounds);
    
    for (i = 0; i < points.length; i++) {
      bearing = Maps.getDistance(Maps.getCenterPolygon(bounds), points[i]);
      points[i].bearing = bearing;
      markers[i].bearing = bearing;
    }
    
    Maps.removeElement(bounds);
    drawPoly();
  }

  function initMap() {    
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);

    MapElements.marker_mine = Maps.addMarker(User.lat, User.lng, 'Я здесь!', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==', [10,10], function(){});
    eventOnClickMap = Maps.addEvent(Maps.map, 'click', addMarker);
  }
  
  function fillName() {
    var name,
        note = '',
        i;
    
    if (id_edit_zone) {
      var arr_id = Funcs.findIdArray(Zones.list, id_edit_zone),
          polies = Zones.list[arr_id].polygon;
      
      name = Zones.list[arr_id].name;
      note = Zones.list[arr_id].note;
      
      for (i = 0; i < polies.length; i++) {
        var marker = Maps.addMarkerDrag(polies[i].lat, polies[i].lng, '', '//maps.google.com/mapfiles/kml/paddle/red-circle.png', [32,32], function(){});
        
        markers.push(marker);
        bindMarkerEvents(marker);
      }
      
      points = [];
      
      for (i = 0; i < markers.length; i++) {
        points.push(Maps.getMarkerCoords(markers[i]));
      }
      
      drawPoly();
      
    } else {
      name = 'Зона ' + (Zones.list.length + 1);
    }
    
    Dom.sel('input[name="name_edit_zone"]').value = name;
    Dom.sel('input[name="note_edit_zone"]').value = note;

    return;
  }
  
  function stop() {
    Maps.removeEvent(eventOnClickPolygon);
    Maps.removeEvent(eventOnClickMap);
    Maps.removeEvent(eventOnDragEndMarker);
    Maps.removeEvent(eventOnClickMarker);
    Maps.removeElement(polygon);
    
    for (var i = 0; i < markers.length; i++) {
      Maps.removeElement(markers[i]);
    }
        
    polygon = null;
    markers = [];
    points = [];
    eventOnClickMarker = null;
    eventOnClickPolygon = null;
    eventOnClickMap = null;
    eventOnDragEndMarker = null;
    localStorage.removeItem('_edit_zone');
  }
  
  function start() {
    id_edit_zone = localStorage.getItem('_edit_zone');

    Maps.mapOn();
    initMap();
    fillName();
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});