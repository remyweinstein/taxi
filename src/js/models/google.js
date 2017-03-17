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
    
    this.addEvent = function (el, event, callback) {
      return google.maps.event.addListener(el, event, callback);
    };
    
    this.point2LatLng = function (x, y) {
      var topRight = Maps.map.getProjection().fromLatLngToPoint(Maps.map.getBounds().getNorthEast()),
          bottomLeft = Maps.map.getProjection().fromLatLngToPoint(Maps.map.getBounds().getSouthWest()),
          scale = Math.pow(2, Maps.map.getZoom()),
          worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);

      return Maps.map.getProjection().fromPointToLatLng(worldPoint);      
    };
    
    this.addMarker = function (lat, lng, title, icon, iSize, callback) {
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
    
    this.removeElement = function (el) {
      el.setMap(null);
    };
    
    this.geocoder = function (lat, lng, callback) {
      var geocoder = new google.maps.Geocoder();
      
      geocoder.geocode ({
        'latLng': new google.maps.LatLng(lat, lng)
      }, function (results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            callback(results);
          }
        });
    };
    
    this.getStreetFromCoords = function (result) {
      var obj = result[0].address_components, key, address;

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
    
    this.removeEvent = function (handler) {
      google.maps.event.removeListener(handler);
    };
    
    this.getLocationClick = function (event) {
      return [event.latLng.lat(),event.latLng.lng()];
    };
    
    this.drawPoly = function (Coords) {
      return new google.maps.Polygon({
               paths: Coords
               //strokeColor: '#FF0000',
               //strokeOpacity: 0.8,
               //strokeWeight: 2,
               //draggable: true,
               //fillColor: '#FF0000',
               //fillOpacity: 0.35
             });
    };
    
    this.newPolygon = function (coords) {
      return new google.maps.Polygon({
               paths: coords
               //strokeColor: '#FF0000',
               //strokeOpacity: 0.8,
               //strokeWeight: 2,
               //draggable: true,
               //fillColor: '#FF0000',
               //fillOpacity: 0.35
             });
    };
    
    this.getCenterPolygon = function (poly) {
      return poly.getCenter();
    };

    this.getDistance = function (point1, point2) {
      return google.maps.geometry.spherical.computeHeading(point1, point2);
    };

    this.searchPlaces = function (text, radius, callback) {
      var MyLatLng  = new google.maps.LatLng(User.lat, User.lng),
          service   = new google.maps.places.PlacesService(Maps.map),
          request   = {
            location: MyLatLng,
            radius: radius
          };

      service.nearbySearch(request, function (response) {
        var results = [];
        
        if (response) {
          for (var i = 0; i < response.length; i++) {
            results[i]         = {};
            results[i].address = response[i].vicinity;
            results[i].lat     = response[i].geometry.location.lat();
            results[i].lng     = response[i].geometry.location.lng();
            results[i].name    = response[i].name;
          }
        }
        
        callback(results);
      });
    };
    
    this.searchStreet = function (text, radius, callback) {
      var MyLatLng  = new google.maps.LatLng(User.lat, User.lng),
          service   = new google.maps.places.PlacesService(Maps.map),
          request = {
            location: MyLatLng,
            radius: radius,
            query: text
          };
      
      service.textSearch(request, function (response) {
        var results = [];
        
        if (response) {
          for (var i = 0; i < response.length; i++) {
            results[i]         = {};
            results[i].address = response[i].formatted_address;
            results[i].lat     = response[i].geometry.location.lat();
            results[i].lng     = response[i].geometry.location.lng();
            results[i].name    = response[i].name;
          }
        }

        callback(results);
      });
    };
    
    this.getMarkerCoords = function (el) {
      return el.getPosition();
    };

    
  };

  return clGoogle;
  
});