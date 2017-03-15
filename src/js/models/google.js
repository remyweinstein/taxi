/* global google, map, SafeWin, User, Maps */

define(['Dom'], function(Dom) {

  var clGoogle = function () {
    var self = this;
    
    this.init = function () {
      var MyLatLng = new google.maps.LatLng(User.lat, User.lng),
          mapCanvas = document.getElementById('map_canvas'),
          mapOptions = {
            center: MyLatLng,
            zoom: 12,
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

      Maps.map = new google.maps.Map(mapCanvas, mapOptions);

      self.insertHtml('beforeend', '<i class="icon-target find-me" data-click="find-me"></i>');
      Dom.sel('.find-me').addEventListener('click', function() {
        self.setCenter(User.lat, User.lng);
      });
      
      SafeWin.map = Maps.map;
    };
    
    this.setCenter = function (lat, lng) {
      Maps.map.setCenter(new google.maps.LatLng(lat, lng));
    };
    
    this.setZoom = function (zoom) {
      Maps.map.setZoom(zoom);
    };
    
    this.insertHtml = function (how, el) {
      Maps.map.getDiv().insertAdjacentHTML(how, el);
    };
    
    this.addEvent = function (event, callback) {
      return google.maps.event.addListener(Maps.map, event, callback);
    };
    
    this.point2LatLng = function (x, y) {
      var topRight = Maps.map.getProjection().fromLatLngToPoint(Maps.map.getBounds().getNorthEast()),
          bottomLeft = Maps.map.getProjection().fromLatLngToPoint(Maps.map.getBounds().getSouthWest()),
          scale = Math.pow(2, Maps.map.getZoom()),
          worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);

      return Maps.map.getProjection().fromPointToLatLng(worldPoint);      
    };
    
    this.addMarker = function (lat, lng, title, icon, callback) {
      var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        //animation: google.maps.Animation.DROP,
        icon: icon,
        title: title,
        map: Maps.map
      });
      
      callback(marker);

      return marker;
    };

    this.addInfoForMarker = function (text, open, marker) {
      if (text && text !== "") {
        var infowindow = new google.maps.InfoWindow({
          content: text
        });
        
        if (open) {
          infowindow.open(Maps.map, marker);
        }
        
        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(Maps.map, marker);
        });
      }
    };
    
    this.markerSetPosition = function (lat, lng, marker) {
      marker.setPosition(new google.maps.LatLng(lat, lng));
    };
    
  };

  return clGoogle;
  
});