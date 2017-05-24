/* global google, SafeWin, User, Maps, MapElements, Conn, Parameters */

define(['Dom', 'Storage', 'Geo'], function(Dom, Storage, Geo) {
  var clGoogle = function () {
    var self = this;
    
    this.renderRoute = function (Model, short, line, callback) {
      if (line) {
        var  flightPlanCoordinates = [],
             routa = JSON.parse(Model.route);

        for (var i = 0; i < routa.length; i++) {
          flightPlanCoordinates.push({"lat":routa[i][0], "lng":routa[i][1]});
        }
        
        SafeWin.overviewPath = routa;

        var routeLine = new google.maps.Polyline({
                path: flightPlanCoordinates,
                geodesic: true,
                strokeColor: '#4286f4',
                strokeOpacity: 0.5,
                strokeWeight: 6
              });

        MapElements.routes.push(routeLine);
        Maps.addElOnMap(routeLine);

        callback(0, false);
      } else {
        var directionsService = new google.maps.DirectionsService(),
            _addr_from = Model.fromCoords.split(","),
            _addr_to   = Model.toCoords.split(","),
            waypoints  = [];

        if (Model.toAddresses) {
          for (var i = 0; i < Model.toAddresses.length; i++) {
            var latlng = Model.toCoordses[i].split(',');

            waypoints.push({
              location: new google.maps.LatLng(latlng[0], latlng[1])
              //stopover: true
            });
          }
        }

        if (Model.clientPointsFrom) {
          for (var i = 0; i < Model.clientPointsFrom.length; i++) {
            var latlng = Model.clientPointsFrom[i].location.split(',');

            waypoints.push({
              location: new google.maps.LatLng(latlng[0], latlng[1])
              //stopover: true
            });
          }
        }

        if (Model.clientPointsTo) {
          for (var i = 0; i < Model.clientPointsTo.length; i++) {
            var latlng = Model.clientPointsTo[i].location.split(',');

            waypoints.push({
              location: new google.maps.LatLng(latlng[0], latlng[1])
              //stopover: true
            });
          }
        }

        var request = {
              origin: new google.maps.LatLng(_addr_from[0], _addr_from[1]),
              destination: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
              waypoints: waypoints,
              optimizeWaypoints: short,
              provideRouteAlternatives: false,
              travelMode: google.maps.DirectionsTravelMode.DRIVING
            };

        directionsService.route(request, function(response, status) {

          if (response.routes[0]) {
            var roi = response.routes[0].overview_path,
                arrRoi = [];
                
            SafeWin.overviewPath = [];

            for (var i = 0; i < roi.length; i++) {
              arrRoi.push([Geo.roundCoords(roi[i].lat()), Geo.roundCoords(roi[i].lng())]);
            }
            
            SafeWin.overviewPath = arrRoi;
          }

          if (status === google.maps.DirectionsStatus.OK) {
            var routes_dist = response.routes[0].legs,
                dura = 0, dist = 0,
                i;

            for (i = 0; i < routes_dist.length; i++) {
              dura += routes_dist[i].duration.value;
              dist += routes_dist[i].distance.value;
            }

            Model.duration = Math.round(dura / 60);
            Model.length = dist;
            var recommended_cost = 10 * Math.ceil( ((Model.length / 1000) * parseInt(Parameters.orderCostOfKm) + parseInt(Parameters.orderLandingPrice)) / 10 );
            recommended_cost = recommended_cost < 50 ? 50 : recommended_cost;

            MapElements.routes.push(new google.maps.DirectionsRenderer({
              map: Maps.map,
              suppressMarkers: true,
              directions: response,
              routeIndex: 0
            }));

            Storage.lullModel(Model);
            callback(recommended_cost, arrRoi);
          }
        });
      }
    };
      
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
    
    function findClient(e) {
      var el = e.srcElement || e.target,
          location = el.dataset.location.split(',');
      
      self.setCenter(location[0], location[1]);
    }
    
    this.addFindClient = function () {
      self.insertHtml('beforeend', '<i class="icon-pitch find-client" data-click="find-client"></i>');
      Dom.sel('.find-client').addEventListener('click', findClient);
    };
    
    this.removeFindClient = function () {
      var target = Dom.sel('.find-client');
      
      target.removeEventListener('click', findClient);
      target.parentNode.removeChild(target);
    };
    
    function findDriver(e) {
      var el = e.srcElement || e.target,
          location = el.dataset.location.split(',');
      
      self.setCenter(location[0], location[1]);
    }
    
    this.addFindDriver = function () {
      self.insertHtml('beforeend', '<i class="icon-taxi find-driver" data-click="find-driver"></i>');
      Dom.sel('.find-driver').addEventListener('click', findDriver);
    };
    
    this.removeFindDriver = function () {
      var target = Dom.sel('.find-driver');
      
      target.removeEventListener('click', findDriver);
      target.parentNode.removeChild(target);
    };
    
    this.setZoom = function (zoom) {
      Maps.map.setZoom(zoom);
    };
    
    this.insertHtml = function (how, el) {
      Maps.map.getDiv().insertAdjacentHTML(how, el);
    };
    
    this.convertWayPointsForRoutes = function (lat, lng) {
      return {location: new google.maps.LatLng(lat, lng), stopover: true};
    };
    
    this.addZoomEvent = function (callback) {
      return self.addEvent(Maps.map, 'zoom_changed', callback);
    };
    
    this.addEvent = function (el, event, callback) {
      return google.maps.event.addListener(el, event, callback);
    };
    
    this.addEventStartDrag = function (el, callback) {
      var event = google.maps.event.addListener(el, 'dragstart', function (marker) {
        callback([marker.latLng.lat(), marker.latLng.lng()]);
      });
      
      return event;
    };
          
    this.addEventDrag = function (el, callback) {
      var event = google.maps.event.addListener(el, 'dragend', function (marker) {
        callback([marker.latLng.lat(), marker.latLng.lng()]);
      });
      
      return event;
    };
          
    this.point2LatLng = function (x, y) {
      var topRight = Maps.map.getProjection().fromLatLngToPoint(Maps.map.getBounds().getNorthEast()),
          bottomLeft = Maps.map.getProjection().fromLatLngToPoint(Maps.map.getBounds().getSouthWest()),
          scale = Math.pow(2, Maps.map.getZoom()),
          worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);

      return Maps.map.getProjection().fromPointToLatLng(worldPoint);      
    };
    
    this.addMarker = function (lat, lng, title, icon_url, iSize, callback) {
      var icon = {
            url: icon_url,
            scaledSize: new google.maps.Size(iSize[0], iSize[1])
          },
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            icon: icon,
            title: title,
            map: Maps.map
          });
      
      callback(marker);

      return marker;
    };

    this.addMarkerDrag = function (lat, lng, title, icon_url, iSize, callback) {
      var icon = {
            url: icon_url,
            scaledSize: new google.maps.Size(iSize[0], iSize[1])
          },
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            draggable: true,
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
      if (el) {
        el.setMap(null);
      }
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
      var obj = result[0].address_components, key, address, city;

      for(key in obj) {
        if(obj[key].types[0] === "street_number") {
          address = obj[key].long_name;
        }
        if(obj[key].types[0] === "route") {
          address = obj[key].long_name + ',' + address;
        }
        if(obj[key].types[0] === "locality") {
          city = obj[key].long_name;
        }
      }

      return {"address":address,"city":city};
    };
    
    this.removeEvent = function (handler) {
      google.maps.event.removeListener(handler);
    };
    
    this.getLocationClick = function (event) {
      return [event.latLng.lat(),event.latLng.lng()];
    };
    
    this.getPath = function(poly) {
      var path = poly.getPath(),
          arr = [];
      
      if (path) {
        for (var i = 0; i < path.b.length; i++) {
          arr.push({"lat":path.b[i].lat(),"lng":path.b[i].lng()});
        }
      }
      
      return arr;
    };
    
    this.drawPoly = function (Coords, color) {
      color = color || '#FF0088';
      
      var poly = new google.maps.Polygon({
                  paths: Coords,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: color,
                  fillOpacity: 0.35
                });

      return poly;
    };
    
    this.drawLine = function(Coords, color) {
      return new google.maps.Polyline({
               path: Coords,
               geodesic: true,
               strokeColor: color,
               strokeOpacity: 0.5,
               strokeWeight: 6
             });
    };
    
    this.drawPolyS = function(Coords, color, callback) {
      color = color || '#FF0088';
      
      var poly = new google.maps.Polygon({
                  paths: Coords,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: color,
                  fillOpacity: 0.35
                });
                
      callback(poly);
    };
    
    this.newPolygon = function () {
      return new google.maps.Polygon({});
    };
    
    this.addElOnMap = function (el) {
      el.setMap(Maps.map);
    };
    
    this.addBearingPoligonOnMap = function (el) {
      
    };
    
    this.getCenterPolygon = function (poly) {
      var lowx,
          highx,
          lowy,
          highy,
          lats = [],
          lngs = [],
          vertices = poly.getPath();

      for(var i=0; i<vertices.length; i++) {
        lngs.push(vertices.getAt(i).lng());
        lats.push(vertices.getAt(i).lat());
      }

      lats.sort();
      lngs.sort();
      lowx = lats[0];
      highx = lats[vertices.length - 1];
      lowy = lngs[0];
      highy = lngs[vertices.length - 1];
      center_x = lowx + ((highx-lowx) / 2);
      center_y = lowy + ((highy - lowy) / 2);

      return (new google.maps.LatLng(center_x, center_y));
    };

    this.getDistance = function (p1, p2) {
      var rad = function(x) {
            return x * Math.PI / 180;
          },
          R = 6378137,
          dLat = rad(p2.lat - p1.lat),
          dLong = rad(p2.lng - p1.lng),
          a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rad(p1.lat)) * Math.cos(rad(p2.lat)) *
            Math.sin(dLong / 2) * Math.sin(dLong / 2),
          c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)),
          d = R * c;
    
      return d;
    };

    this.searchPlaces = function (text, radius, city, callback) {
      var service   = new google.maps.places.PlacesService(Maps.map);

      if (city !== User.city) {
        Conn.request('searchCity', city, cbSearchCity);

        function cbSearchCity(results) {
          Conn.clearCb('cbSearchCity');
          
          var cities = results.result.city;

          if (cities[0]) {            
            var loc = cities[0].location;
            loc = loc.split(',');
            var request   = {
              location: new google.maps.LatLng(loc[0], loc[1]),
              radius: radius
            };

            getSearch(request);
          }
        }
        
      } else {
        var request   = {
          location: new google.maps.LatLng(User.lat, User.lng),
          radius: radius
        };

        getSearch(request);
      }
      
      function getSearch(request) {
        service.nearbySearch(request, function (response) {
          var results = [];

          if (response) {
            for (var i = 0; i < response.length; i++) {
              results[i]         = {};
              results[i].address = response[i].vicinity;
              results[i].lat     = response[i].geometry.location.lat();
              results[i].lng     = response[i].geometry.location.lng();
              results[i].name    = response[i].name;
              results[i].city    = city;
            }
          }

          callback(results);
        });
      }
    };
    
    this.searchStreet = function (text, radius, city, callback) {
      var service   = new google.maps.places.PlacesService(Maps.map);
      
      if (city !== User.city) {
        Conn.request('searchCity', city, cbSearchCity);

        function cbSearchCity(results) {
          Conn.clearCb('cbSearchCity');
          
          if (results.result) {
            var cities = results.result.city;

            if (cities[0]) {
              var loc = cities[0].location;

              loc = loc.split(',');

              var request = {
                query: text,
                location: new google.maps.LatLng(loc[0], loc[1]),
                radius: radius
              };

              getSearch(request);
            }
          }
        }
        
      } else {
        var request   = {
          query: text,
          location: new google.maps.LatLng(User.lat, User.lng),
          radius: radius
        };

        getSearch(request);
      }
      
      function getSearch(request) {
        service.textSearch(request, function (response) {
          var results = [];

          if (response) {
            for (var i = 0; i < response.length; i++) {
              results[i]         = {};
              results[i].address = response[i].formatted_address;
              results[i].lat     = response[i].geometry.location.lat();
              results[i].lng     = response[i].geometry.location.lng();
              results[i].name    = response[i].name;
              results[i].city    = city;
            }
          }

          callback(results);
        });
      }
    };
    
    this.getMarkerCoords = function (el) {
      var pos = el.getPosition(),
          coords = {};
      
      coords.lat = pos.lat();
      coords.lng = pos.lng();
      
      return coords;
    };

    
  };

  return clGoogle;
  
});