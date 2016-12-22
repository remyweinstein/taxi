define(['Ajax', 'Dom', 'ModalWindows'], function (Ajax, Dom, Modal) {

  var polygon = new google.maps.Polygon({});
  var Coords = [];
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.click === 'save-zone') {
              
              if (Coords.length < 3) {
                alert('Ну это же не полигон совсем, точки три хотя бы сделайте');
              } else {
                Zones.push(Coords);
                window.history.back();
                //Modal.show('', function(){
                //  window.location.hash = "#client_go";
                //});
              }
              
              return;
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
  
  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
      center: MyLatLng,
      zoom: 12,
      streetViewControl: false,
      mapTypeControl: false,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);

    marker_mine = new google.maps.Marker({
      position: MyLatLng,
      map: map,
      icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==',
      title: 'Я здесь!'
    });

    var markers = {};
    var getMarkerUniqueId= function(lat, lng) {
      return lat + '_' + lng;
    };
    var getLatLng = function(lat, lng) {
      return new google.maps.LatLng(lat, lng);
    };
    var addMarker = google.maps.event.addListener(map, 'click', function(e) {
      var lat = e.latLng.lat();
      var lng = e.latLng.lng();
      var markerId = getMarkerUniqueId(lat, lng);
      var marker = new google.maps.Marker({
        position: getLatLng(lat, lng),
        map: map,
        id: 'marker_' + markerId
      });
      markers[markerId] = marker;
      bindMarkerEvents(marker);
      showPoly();
    });
    var bindMarkerEvents = function(marker) {
      google.maps.event.addListener(marker, 'click', function (point) {
        var markerId = getMarkerUniqueId(point.latLng.lat(), point.latLng.lng());
        var marker = markers[markerId];
        removeMarker(marker, markerId);
      });
    };
    var removeMarker = function(marker, markerId) {
        marker.setMap(null);
        delete markers[markerId];
        showPoly();
    };
    var showPoly = function() {
      Coords = [];
      for (var key in markers) {
        var coord = key.split('_');
        Coords.push({'lat': parseFloat(coord[0]), 'lng': parseFloat(coord[1])});
      }
      polygon.setMap(null);
      polygon = new google.maps.Polygon({
        paths: Coords,
        strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        //draggable: true,
        fillColor: '#FF0000',
        fillOpacity: 0.35
      });
      polygon.setMap(map);
    };
  }
  
  function start() {
    initMap();
    addEvents();
  }
  
  return {
    start: start
  };
});