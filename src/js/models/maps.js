/* global User, ymaps, MapGoogle, MapYandex, google, Settings */

define(['MapsRoutes', 'jsts'], function(MapsRoutes, jsts) {

  var clMaps = function () {
    var self = this;

    function stopLoading() {
      self.loading = false;
    }
    
    this.currentMapProvider = null;
    this.currentModel = null;
    this.map = null;
    this.loading = true;

    this.start = function () {
      if (!localStorage.getItem('_map_provider')) {
        self.setCurrentModel('google');
      } else {
        self.setCurrentModel(localStorage.getItem('_map_provider'));
      }
      ymaps.ready(stopLoading);
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
    
    this.renderRoute = function (waypoints, type, Model, callback) {
      self.currentModel.renderRoute(waypoints, type, Model, callback);
    };

    this.init = function() {
      self.currentModel.init();
    };

    this.mapOff = function () {
      document.getElementById('map_canvas').classList.add("hidden");
    };

    this.mapOn = function () {
      document.getElementById('map_canvas').classList.remove("hidden");

      if (self.currentMapProvider === "google") {
        google.maps.event.trigger(self.map, 'resize');
      } else if (self.currentMapProvider === "yandex") {
        if (self.map) {
          self.map.container.fitToViewport();
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

    this.getStreetFromCoords = function (result) {
      return self.currentModel.getStreetFromCoords(result);
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
    
    this.convertWayPointsForRoutes = function (lat, lng) {
      return self.currentModel.convertWayPointsForRoutes(lat, lng);
    };
    
    this.addEvent = function (el, event, callback) {
      return self.currentModel.addEvent(el, event, callback);
    };
    
    this.addZoomEvent = function (callback) {
      return self.currentModel.addZoomEvent(callback);
    };
    
    this.addEventDrag = function (el, callback) {
      return self.currentModel.addEventDrag(el, callback);
    };
      
    this.addMarker = function (lat, lon, title, icon, iSize, callback) {
      return self.currentModel.addMarker(lat, lon, title, icon, iSize, callback);
    };
    
    this.addMarkerDrag = function (lat, lon, title, icon, iSize, callback) {
      return self.currentModel.addMarkerDrag(lat, lon, title, icon, iSize, callback);
    };
    
    this.addInfoForMarker = function (text, open, marker) {
      self.currentModel.addInfoForMarker(text, open, marker);
    };
    
    this.markerSetPosition = function (lat, lng, marker) {
      self.currentModel.markerSetPosition(lat, lng, marker);
    };
    
    this.removeElement = function (el) {
      self.currentModel.removeElement(el);
    };
    
    this.geocoder = function (lat, lng, callback) {
      self.currentModel.geocoder(lat, lng, callback);
    };
    
    this.removeEvent = function (handler) {
      self.currentModel.removeEvent(handler);
    };
    
    this.searchPlaces = function (text, radius, callback) {
      self.currentModel.searchPlaces(User.city + ' ' + text, radius, callback);
    };
    
    this.searchStreet = function (text, radius, callback) {
      self.currentModel.searchStreet(User.city + ' ' + text, radius, callback);
    };
    
    this.getLocationClick = function (event) {
      return self.currentModel.getLocationClick(event);
    };
    
    this.drawPoly = function(Coords) {
      var polygon = false;

      if (Coords) {
        polygon = self.currentModel.drawPoly(Coords);
        self.removeElement(polygon);
      }

      return polygon;
    };
    
    this.newPolygon = function (coords) {
      return self.currentModel.newPolygon(coords);
    };
    
    this.addElOnMap = function (el) {
      this.currentModel.addElOnMap(el);
    };
    
    this.addBearingPoligonOnMap = function (el) {
      this.currentModel.addBearingPoligonOnMap(el);
    };
    
    this.getCenterPolygon = function (poly) {
      return self.currentModel.getCenterPolygon(poly);
    };
    
    this.getDistance = function (point1, point2) {
      return self.currentModel.getDistance(point1, point2);
    };

    this.showPoly = function(overviewPath) {
      var overviewPathGeo = [];

      for (var i = 0; i < overviewPath.length; i++) {
        overviewPathGeo[i] = [];
        for (var z = 0; z < overviewPath[i].length; z++) {
          overviewPathGeo[i].push([overviewPath[i][z].lng(), overviewPath[i][z].lat()]);
        }
      }

      var distance = Settings.safeRadius / 500 / 111.12,
      geoInput = {
        type: "MultiLineString",
        coordinates: overviewPathGeo
        };
      var geoReader = new jsts.io.GeoJSONReader(),
          geoWriter = new jsts.io.GeoJSONWriter();
      var geometry = geoReader.read(geoInput).buffer(distance, 2);
      var polygon = geoWriter.write(geometry);

      var oLanLng = [],
          oCoordinates = polygon.coordinates[0];

      for (i = 0; i < oCoordinates.length; i++) {
        var oItem = oCoordinates[i];

        oLanLng.push(new google.maps.LatLng(oItem[1], oItem[0]));
      }

      var polygone = new google.maps.Polygon({
        paths: oLanLng,
        //strokeWeight: 0,
        map: self.map
      });

      return polygone;
    };
    
    this.getMarkerCoords = function (el) {
      return self.currentModel.getMarkerCoords(el);
    };


  };

  return clMaps;
    
  });
