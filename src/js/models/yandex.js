/* global map, ymaps, User, SafeWin, Maps */

define(['Dom'], function(Dom) {

  var clYandex = function () {
    var self = this;

    this.init = function () {
      ymaps.ready(init);

      function init() {
        Maps.map = new ymaps.Map("map_canvas", {
          center: [User.lat, User.lng], 
          zoom: 12,
          controls: ['zoomControl']
        });
        Maps.map.behaviors.enable('scrollZoom');
console.log('init yandex');
      }

      self.insertHtml('beforeend', '<i class="icon-target find-me" data-click="find-me"></i>');
      Dom.sel('.find-me').addEventListener('click', function() {
        self.setCenter([User.lat, User.lng]);
      });

      SafeWin.map = Maps.map;
    };
    
    this.setCenter = function (lat, lng) {
      Maps.map.setCenter([lat, lng]);
    };
    
    this.setZoom = function (zoom) {
      Maps.map.setZoom( zoom );
    };
    
    this.insertHtml = function (how, el) {
      document.getElementById('map_canvas').insertAdjacentHTML(how, el);
    };
    
    this.addEvent = function (event, callback) {
      
    };
    
    this.point2LatLng = function (x, y) {
      var projection = Maps.map.options.get('projection'),
          coords = projection.fromGlobalPixels(Maps.map.converter.pageToGlobal([x, y]), Maps.map.getZoom());
      
      return '(' + coords[0] + ', ' + coords[1] + ')';
    };
    
    this.addMarker = function (lat, lng, title, icon, callback) {
      var marker =  new ymaps.Placemark([lat, lng], {
                      balloonContent: ''
                    }, {
                      preset: 'islands#greenDotIconWithCaption',
                      iconColor: '#0095b6'
                    });
      Maps.map.geoObjects.add(marker);
      callback(marker);
    };
    
    this.addInfoForMarker = function (text, open, marker) {
      if (text && text !== "") {
        marker.properties.set({
                    balloonContent: text
                });
      }
    };
    
    this.markerSetPosition = function (lat, lng, marker) {
      marker.geometry.setCoordinates([lat, lng]);
    };

    
  };

  return clYandex;
  
});