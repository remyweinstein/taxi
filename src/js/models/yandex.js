/* global map, ymaps, User, SafeWin, Maps */

define(['Dom'], function(Dom) {
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
        self.setCenter([User.lat, User.lng]);
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
    
    this.addEvent = function (el, event, callback) {
      return el.events.group().add(event, callback);
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
        iconImageSize: iSize
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
      //Maps.map.geoObjects.remove(el);
      Maps.map.geoObjects.removeAll();
    };
    
    this.geocoder = function (lat, lng, callback) {
      
    };

    this.getStreetFromCoords = function (result) {
      
    };
    
    this.removeEvent = function (handler) {
      handler.removeAll();
    };
    
    this.getLocationClick = function (event) {
      return event.get('coords');
    };
    
    this.drawPoly = function (Coords) {
      return  new ymaps.GeoObject({
                geometry: {
                  type: "Polygon",
                  coordinates: Coords,
                  fillRule: "nonZero"
                }
              }, {
                fillColor: '#00FF00',
                strokeColor: '#0000FF',
                opacity: 0.5,
                strokeWidth: 5,
                strokeStyle: 'shortdash'
              });
    };
    
    this.newPolygon = function (coords) {
      var poly =  new ymaps.GeoObject({
                    geometry: {
                      type: "Polygon",
                      coordinates: objCoordsToArray(coords)
                    }
                  });
                  
      Maps.map.geoObjects.add(poly);
      return poly;
    };
    
    this.getCenterPolygon = function (poly) {
      return coordsToObj(poly.geometry.getBounds());
    };
    
    this.getDistance = function (point1, point2) {
      return ymaps.formatter.distance(
            ymaps.coordSystem.geo.getDistance(objToCoords(point1), objToCoords(point2))
        );
    };

    this.searchPlaces = function (text, radius, callback) {
      var ans = [];
      
      ymaps.geocode('', {results: 10}).then(function (res) {
        var found      = res.metaData.geocoder.found,
            lenght_res = found > 0 ? res.metaData.geocoder.results : 0;
            
        if (found < lenght_res) {
          lenght_res = found;
        }

        for (var i = 0; i < lenght_res; i++) {
          var geoObj = res.geoObjects.get(i),
              coords = geoObj.geometry.getCoordinates();
          
          ans[i]         = {};
          ans[i].lat     = coords[0];
          ans[i].lng     = coords[1];
          ans[i].name    = geoObj.properties.get('name');
          ans[i].address = geoObj.properties.get('text');          
        }

        callback(ans);
      });
    };
    
    this.searchStreet = function (text, radius, callback) {
      var ans = [];
      
      ymaps.geocode(text, {results: 10}).then(function (res) {
        var found      = res.metaData.geocoder.found,
            lenght_res = found > 0 ? res.metaData.geocoder.results : 0;
            
        if (found < lenght_res) {
          lenght_res = found;
        }

        for (var i = 0; i < lenght_res; i++) {
          var geoObj = res.geoObjects.get(i),
              coords = geoObj.geometry.getCoordinates();
          
          ans[i]         = {};
          ans[i].lat     = coords[0];
          ans[i].lng     = coords[1];
          ans[i].name    = geoObj.properties.get('name');
          ans[i].address = geoObj.properties.get('text');          
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