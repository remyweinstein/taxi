/* global google, User, safe_zone_polygons, cost_of_km, MyOrder, MyOffer, ymaps, SafeWin, MapGoogle, MapYandex, map */

define(['MapsRoutes'], function(MapsRoutes) {

  var clMaps = function () {
    var self = this;
    
    this.currentMapProvider = null;
    this.currentModel = null;
    this.map = null;

    this.start = function () {
      if (!localStorage.getItem('_map_provider')) {
        self.setCurrentModel('google');
      } else {
        self.setCurrentModel(localStorage.getItem('_map_provider'));
      }
    },

    this.setCurrentModel = function (val) {
      localStorage.setItem('_map_provider', val);
      self.currentMapProvider = val;
      if (val === 'google') {
        self.currentModel = MapGoogle;
      } else if (val === 'yandex') {
        self.currentModel = MapYandex;
      }
    },

    this.drawRoute = function (type, back, callback) {
      MapsRoutes.drawRoute(type, back, callback);
    };

    this.init = function() {
      self.currentModel.init();
      console.log('self.map = ');
      console.log(self.map);
      
    };

    this.mapOff = function () {
      document.getElementById('map_canvas').classList.add("hidden");

      for (var i = 0; i < safe_zone_polygons.length; i++) {
        if (self.currentMapProvider === "google") {
          safe_zone_polygons[i].setMap(null);
        } else if (self.currentMapProvider === "yandex") {
          self.map.geoObjects.remove(safe_zone_polygons[i]);
        }
      }
    };

    this.mapOn = function (disable_safe_zone) {
      document.getElementById('map_canvas').classList.remove("hidden");
      
      console.log('self.map = ');
      console.log(self.map);

      if (self.currentMapProvider === "google") {
        google.maps.event.trigger(self.map, 'resize');
      } else if (self.currentMapProvider === "yandex") {
        self.map.container.fitToViewport();
      }

      if (disable_safe_zone) {
        for (var i = 0; i < safe_zone_polygons.length; i++) {
          if (self.currentMapProvider === "google") {
            safe_zone_polygons[i].setMap(SafeWin.map);
          } else if (self.currentMapProvider === "yandex") {
            self.map.geoObjects.add(safe_zone_polygons[i]);
          }
        }
      }
    };

    this.mapMoveTab = function (parent) {
      var map_block = document.getElementById('map_canvas');

      parent.insertBefore(map_block, parent.children[0]);
      if (self.currentMapProvider === "yandex") {
        //this.init();
      }
    };

    this.mapBackTab = function () {
      var map_block = document.getElementById('map_canvas');
      
      document.querySelector('main.content').appendChild(map_block);
      if (self.currentMapProvider === "yandex") {
        //this.init();
      }
    };

    this.point2LatLng = function (x, y) {
      return self.currentModel.point2LatLng(x, y);
    };

    this.getStreetFromGoogle = function (results) {
      var obj = results[0].address_components, key, address;

      for(key in obj) {
        if(obj[key].types[0] === "street_number") {
          address = obj[key].long_name;
        }
        if(obj[key].types[0] === "route") {
          address = obj[key].long_name + ',' + address;
        }
      }

      return address;
    };

    this.addressToLatLng = function (address, success) {
      var geocoder = new google.maps.Geocoder();

      geocoder.geocode( { 'address': address}, function(results, status) {
        if (status === google.maps.GeocoderStatus.OK) {
          success(results[0].geometry.location);
        }
      });
    };

    this.setCenter = function (lat, lng) {
      self.currentModel.setCenter(lat, lng);
    };

    this.setZoom = function (zoom) {
      self.currentModel.setZoom(zoom);
    };

    this.insertHtml = function (how, el) {
      self.currentModel.insertHtml(how, el);
    };

    this.addEvent = function (event, callback) {
      return self.currentModel.addEvent(event, callback);
    };
      
    this.addMarker = function (lat, lon, title, icon, callback) {
      return self.currentModel.addMarker(lat, lon, title, icon, callback);
    };
    
    this.addInfoForMarker = function (text, open, marker) {
      self.currentModel.addInfoForMarker(text, open, marker);
    };
    
    this.markerSetPosition = function (lat, lng, marker) {
      self.currentModel.markerSetPosition(lat, lng, marker);
    };

  };

  return clMaps;
    
  });
