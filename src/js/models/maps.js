/* global User, ymaps, MapGoogle, MapYandex, google, Parameters, MapElements, Conn, Settings */

define(['jsts', 'Storage'], function(jsts, Storage) {

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
      self.setCurrentModel(User.map);      
      ymaps.ready(stopLoading);
    },

    this.setCurrentModel = function (val) {
      self.currentMapProvider = val;
      
      if (val === 'google') {
        self.currentModel = MapGoogle;
      } else if (val === 'yandex') {
        self.currentModel = MapYandex;
      }
    },

    this.drawRoute = function (Model, back, short, line, callback) {
      var _addr_from, 
          _addr_to,
          path_icon = '//maps.google.com/mapfiles/kml/paddle/';
          icon_from = path_icon + 'A.png',
          icon_to   = path_icon + 'B.png';
        
      if (Storage.getActiveTypeTaxi() === "intercity" && Storage.getActiveTypeModelTaxi() === "offer") {
        if (window.location.hash !== "#client_offer") {
          icon_from = path_icon + 'wht-circle.png';
          icon_to   = icon_from;
        }
      }

      if (!Model.fromCoords || !Model.toCoords) {
        return;
      }
      
      _addr_from              = Model.fromCoords.split(",");
      _addr_to                = Model.toCoords.split(",");
      MapElements.marker_b    = null;
      MapElements.marker_a    = null;
      MapElements.marker_to   = self.addMarker(_addr_to[0], _addr_to[1], Model.toAddress, icon_to, [32,32], function(){});
      MapElements.marker_from = self.addMarker(_addr_from[0], _addr_from[1], Model.fromAddress, icon_from, [32,32], function(){});

      if (Model.toAddresses) {
        for (var i = 0; i < Model.toAddresses.length; i++) {
          if (Model.toAddresses[i] && Model.toAddresses[i] !== "") {
            var _wp = Model.toCoordses[i].split(","),
                time = Model.times[i] ? Model.times[i] + ' мин.' : '';
            
            self.addMarker(_wp[0], _wp[1], Model.toAddresses[i], path_icon + (i + 1) + '.png', [32,32], function(mark){
              self.addInfoForMarker(time, true, mark);
              MapElements.points.push(mark);
            });
          }
        }
      }
      
      if (Model.clientPointsFrom) {
        for (var i = 0; i < Model.clientPointsFrom.length; i++) {
          _wp = Model.clientPointsFrom[i].location.split(',');
          MapElements.points.push(self.addMarker(_wp[0], _wp[1], Model.clientPointsFrom[i].address, path_icon + (i + 1) + '.png', [32,32], function(){}));
        }
        
        for (var i = 0; i < Model.clientPointsTo.length; i++) {
          _wp = Model.clientPointsTo[i].location.split(',');
          MapElements.points.push(self.addMarker(_wp[0], _wp[1], Model.clientPointsTo[i].address, path_icon + (i + 1) + '.png', [32,32], function(){}));
        }
      }
      
      self.renderRoute(Model, short, line, function (price, arrRoi) {
        callback(price, arrRoi);
      });      
    };
    
    this.renderRoute = function (Model, short, line, callback) {
      self.currentModel.renderRoute(Model, short, line, callback);
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
    
    this.addEventStartDrag = function (el, callback) {
      return self.currentModel.addEventStartDrag(el, callback);
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
    
    this.searchPlaces = function (text, radius, city, callback) {
      self.currentModel.searchPlaces(city + ' ' + text, radius, city, callback);
    };
    
    this.searchStreet = function (text, radius, city, callback) {
      self.currentModel.searchStreet(city + ' ' + text, radius, city, callback);
    };
    
    this.getLocationClick = function (event) {
      return self.currentModel.getLocationClick(event);
    };
    
    this.getPath = function(poly) {
      return self.currentModel.getPath(poly);
    };
    
    this.drawPoly = function(Coords, color) {
      if (Coords) {
        return self.currentModel.drawPoly(Coords, color);
      } else {
        return false;
      }
    };
    
    this.drawLine = function(Coords, color) {
      color = color || '#FF0088';
      
      return self.currentModel.drawLine(Coords, color);
    };
    
    this.drawPolyS = function(Coords, color, callback) {
      if (Coords) {
        self.currentModel.drawPolyS(Coords, color, callback);
      } else {
        callback;
      }
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

    this.showPoly = function(overviewPath, callback) {
      var overviewPathGeo = [];
      
      overviewPathGeo[0] = [];

      for (var i = 0; i < overviewPath.length; i++) {
        overviewPathGeo[0].push([overviewPath[i][0], overviewPath[i][1]]);
      }
      
      var distance = Settings.safeRadius / 500 / 111.12,
          geoInput = {
            type: "MultiLineString",
            coordinates: overviewPathGeo
            },
          geoReader = new jsts.io.GeoJSONReader(),
          geoWriter = new jsts.io.GeoJSONWriter(),
          geometry = geoReader.read(geoInput).buffer(distance, 2),
          polygon = geoWriter.write(geometry),
          oLanLng = [],
          oCoordinates = polygon.coordinates[0];

      for (i = 0; i < oCoordinates.length; i++) {
        var oItem = oCoordinates[i];

        oLanLng.push({"lat":oItem[1], "lng":oItem[0]});
      }
      
      self.drawPolyS(oLanLng, '#ffffff', callback);
    };
    
    this.getMarkerCoords = function (el) {
      return self.currentModel.getMarkerCoords(el);
    };


  };

  return clMaps;
    
  });
