/* global map, ymaps, User, SafeWin, Maps, MapElements, Parameters */

define(['Dom', 'Storage'], function(Dom, Storage) {
  function objCoordsToArray (obj) {
    var newArr = [];
    
    for (var i = 0; i < obj.length; i++) {
      var arr = [];
      
      arr[0] = obj[i].lat;
      arr[1] = obj[i].lng;
      newArr.push(arr);
    }
    
    return newArr;
  }
  
  function objToCoords (obj) {
    var arr = [];

    arr[0] = obj.lat;
    arr[1] = obj.lng;
    
    return arr;
  }
  
  function coordsToObj (arr) {
    var obj = {};

    obj.lat = arr[0];
    obj.lng = arr[1];

    return obj;
  }
  
  function arrCoordsToObj (arr) {
    var newObj = [];
    
    for (var i = 0; i < arr.length; i++) {
      var obj = {};
      
      obj.lat = arr[i][0];
      obj.lng = arr[i][1];
      newObj.push(obj);
    }
    
    return newObj;
  }

  var clYandex = function () {
    var self = this;

    this.renderRoute = function (Model, callback) {
      var _addr_from = Model.fromCoords.split(","),
          _addr_to = Model.toCoords.split(","),
          points = [],
          waypoints = [];

      points.push({ 
        type: 'wayPoint', 
        point: [_addr_from[0], _addr_from[1]]
      });
      
      if (Model.toAddresses && Model.toAddresses.length > 0) {
        for (var i = 0; i < Model.toAddresses.length; i++) {
          var latlng = Model.toCoordses[i].split(',');
          
          points.push({
            type: 'viaPoint', 
            point: [latlng[0], latlng[1]]
          });
        }
      }
      
      points.push({ 
        type: 'wayPoint', 
        point: [_addr_to[0], _addr_to[1]] 
      });

      ymaps.route(points).then(function (route) {
          var routa = route.getPaths();
          
          routa.options.set({
            hasBalloon: false,
            strokeStyle: '',
            strokeWidth: 5,
            opacity: 0.7
          });

          Maps.map.geoObjects.add(routa);
          MapElements.routes.push(routa);

          Model.duration = Math.round(route.getTime()/60);
          Model.length = Math.round(route.getLength());
          
          var recommended_cost = 10 * Math.ceil( ((Model.length / 1000) * parseInt(Parameters.orderCostOfKm) + parseInt(Parameters.orderLandingPrice)) / 10 );
          recommended_cost = recommended_cost < 50 ? 50 : recommended_cost;
          
          Storage.lullModel(Model);
          callback(recommended_cost);
        });

    };
    
    this.init = function () {
      ymaps.ready(init);

      function init() {
        Maps.map = new ymaps.Map("map_canvas", {
          center: [User.lat, User.lng], 
          zoom: 12,
          controls: ['zoomControl']
        });
        Maps.map.behaviors.enable('scrollZoom');
      }

      self.insertHtml('beforeend', '<i class="icon-target find-me" data-click="find-me"></i>');
      Dom.sel('.find-me').addEventListener('click', function() {
        self.setCenter(User.lat, User.lng);
      });
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
    
    this.convertWayPointsForRoutes = function (lat, lng) {
      return '{"type":"wayPoint","point":[' + lat + ',' + lng + ']}';
    };
    
    this.addZoomEvent = function (callback) {
      return self.addEvent(Maps.map, 'boundschange', callback);
    };
    
    this.addEvent = function (handler, event, callback) {
      return handler.events.group().add(event, callback);
    };
    
    this.addEventDrag = function (handler, callback) {
      var event = handler.events.group().add('dragend', function () {
        callback(handler.geometry.getCoordinates());
      });
      
      return event;
    };

    this.point2LatLng = function (x, y) {
      var projection = Maps.map.options.get('projection'),
          coords = projection.fromGlobalPixels(Maps.map.converter.pageToGlobal([x, y]), Maps.map.getZoom());
      
      return '(' + coords[0] + ', ' + coords[1] + ')';
    };
    
    this.addMarker = function (lat, lng, title, icon, iSize, callback) {
      var marker =  new ymaps.Placemark([lat, lng], {
        hintContent: title
      }, {
        iconLayout: 'default#image',
        iconImageHref: icon,
        iconImageSize: iSize,
        iconImageOffset: [-16, -32]
      });
      Maps.map.geoObjects.add(marker);
      callback(marker);
      
      return marker;
    };
    
    this.addMarkerDrag = function (lat, lng, title, icon, iSize, callback) {
      var marker =  new ymaps.Placemark([lat, lng], {
        hintContent: title
      }, {
        iconLayout: 'default#image',
        iconImageHref: icon,
        iconImageSize: iSize,
        iconImageOffset: [-16, -32],
        draggable: true
      });
      Maps.map.geoObjects.add(marker);
      callback(marker);
      
      return marker;
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

    this.removeElement = function (el) {
      Maps.map.geoObjects.remove(el);
      //Maps.map.geoObjects.removeAll();
    };
    
    this.geocoder = function (lat, lng, callback) {
      
    };

    this.getStreetFromCoords = function (result) {
      
    };
    
    this.removeEvent = function (handler) {
      if (handler) {
        handler.removeAll();
      }
    };
    
    this.getLocationClick = function (event) {
      return event.get('coords');
    };
    
    this.drawPoly = function (Coords, color) {
      color = color || '#FF0088';

      var poly =  new ymaps.Polygon([
                    objCoordsToArray(Coords)
                  ],{
                    fillColor: color,
                    strokeColor: '#0000FF',
                    opacity: 0.35,
                    strokeWidth: 2
                  });
      
      return poly;
    };
    
    this.newPolygon = function () {
      var poly =  new ymaps.Polygon();
                  
      //Maps.map.geoObjects.add(poly);
      return poly;
    };
    
    this.addElOnMap = function (el) {
      Maps.map.geoObjects.add(el);
    };
    
    this.addBearingPoligonOnMap = function (el) {
      Maps.map.geoObjects.add(el);
    };
    
    this.getCenterPolygon = function (poly) {
      return coordsToObj(poly.geometry.getBounds());
    };
    
    this.getDistance = function (point1, point2) {
      return ymaps.coordSystem.geo.getDistance(objToCoords(point1), objToCoords(point2));
    };

    this.searchPlaces = function (text, radius, city, callback) {
      var ans = [];
      
      ymaps.geocode(city, {results: 10}).then(function (res) {
        var found      = res.metaData.geocoder.found,
            lenght_res = found > 0 ? res.metaData.geocoder.results : 0;
            
        if (found < lenght_res) {
          lenght_res = found;
        }

        for (var i = 0; i < lenght_res; i++) {
          var geoObj = res.geoObjects.get(i),
              coords = geoObj.geometry.getCoordinates(),
              all = res.geoObjects.get(0).properties.getAll();
              
          ans[i]         = {};
          ans[i].lat     = coords[0];
          ans[i].lng     = coords[1];
          ans[i].name    = all.name;
          ans[i].address = all.text;
          ans[i].city    = city;
        }

        callback(ans);
      });
    };
    
    this.searchStreet = function (text, radius, city, callback) {
      var ans = [],
          query = city ? city + ' ' + text : text;
        
      ymaps.geocode(query, {results: 10}).then(function (res) {
        var found      = res.metaData.geocoder.found,
            lenght_res = found > 0 ? res.metaData.geocoder.results : 0;
            
        if (found < lenght_res) {
          lenght_res = found;
        }

        for (var i = 0; i < lenght_res; i++) {
          var geoObj = res.geoObjects.get(i),
              coords = geoObj.geometry.getCoordinates(),
              all = res.geoObjects.get(0).properties.getAll();
          
          ans[i]         = {};
          ans[i].lat     = coords[0];
          ans[i].lng     = coords[1];
          ans[i].name    = all.name;
          ans[i].address = all.text;
          ans[i].city = city;
        }

        callback(ans);
      });
    };
    
    this.getMarkerCoords = function (el) {
      return coordsToObj(el.geometry.getCoordinates());
    };

    
    
  };

  return clYandex;
  
});