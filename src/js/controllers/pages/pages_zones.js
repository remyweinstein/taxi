define(['Ajax', 'Dom', 'ModalWindows', 'Geo'], function (Ajax, Dom, Modal, Geo) {

  var polygon = new google.maps.Polygon({});
  var Coords = [];
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              if (target.dataset.click === 'save-zone') {

                if (Coords.length < 3) {
                  alert('Ну это же не полигон совсем, точки три хотя бы сделайте');
                } else {
                  Zones.push(Coords);
                  localStorage.setItem('_my_zones', JSON.stringify(Zones));
                  window.history.back();
                  //Modal.show('', function(){
                  //  window.location.hash = "#client_go";
                  //});
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
    
    var getMarkerUniqueId= function() {
      var rand = 1000000 + Math.random() * (8999999);
      rand = Math.round(rand);
      return rand;
    };
    
    var getLatLng = function(lat, lng) {
      return new google.maps.LatLng(lat, lng);
    };
    
    google.maps.event.addListener(map, 'click', clickOnPoly);
    
    function clickOnPoly(e) {
      var lat = e.latLng.lat();
      var lng = e.latLng.lng();
      var markerId = getMarkerUniqueId();
      var marker = new google.maps.Marker({
        position: getLatLng(lat, lng),
        map: map,
        draggable : true,
        lat: lat,
        lng: lng,
        id: markerId
      });
      markers[markerId] = marker;
      bindMarkerEvents(marker);
      showPoly();
    };
    
    var bindMarkerEvents = function(marker) {
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
    };
    
    var removeMarker = function(marker) {
      delete markers[marker.id];
      marker.setMap(null);
      showPoly();
    };
    
    var showPoly = function() {
      Coords = [];
      for (var key in markers) {
        Coords.push({'lat': parseFloat(markers[key].lat), 'lng': parseFloat(markers[key].lng)});
      }
      google.maps.event.clearListeners(polygon, 'click', clickOnPoly);    
      polygon.setMap(null);
      
      polygon = Geo.drawPoly(Coords, map);      
      google.maps.event.addListener(polygon, 'click', clickOnPoly);    

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