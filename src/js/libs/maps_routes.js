/* global SafeWin, google, MapElements, map, Maps, cost_of_km */

define(function() {

  var MapsRoutes = {

  renderDirections: function (map, result, polylineOpts) {
      var directionsRenderer = new google.maps.DirectionsRenderer();

      directionsRenderer.setMap(map);

      if (polylineOpts) {
        directionsRenderer.setOptions({
          polylineOptions: polylineOpts
        });
      }

      directionsRenderer.setDirections(result);
    },

    drawRoute: function(type, back, callback) {
      var directionsService = new google.maps.DirectionsService(),
          _addr_from, _addr_to,
          waypoints = [],
          recommended_cost = 0,
          Model;

      if (type === "order") {
        Model = MyOrder;
      } else {
        Model = MyOffer;
      }

      _addr_from = Model.fromCoords.split(",");
      _addr_to = Model.toCoords.split(",");

      MapElements.marker_b = null;
      MapElements.marker_a = null;

      if (Model.toAddresses) {
        for (var i = 0; i < Model.toAddresses.length; i++) {
          if (Model.toAddresses[i] && Model.toAddresses[i] !== "") {
            var _wp = Model.toCoordses[i].split(","),
                time = "";

            waypoints.push({location: new google.maps.LatLng(_wp[0], _wp[1]), stopover: true});
            if (Model.times[i]) {
              time = Model.times[i] + ' мин.';
            }
            Maps.addMarker(_wp[0], _wp[1], Model.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', function(mark){
              Maps.addInfoForMarker(time, true, mark);
              MapElements.points.push(mark);
            });
          }
        }
      }

      MapElements.marker_from = Maps.addMarker(_addr_from[0], _addr_from[1], Model.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', function(){});
      MapElements.marker_to = Maps.addMarker(_addr_to[0], _addr_to[1], Model.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', function(){});

      var request = {
        origin: new google.maps.LatLng(_addr_from[0], _addr_from[1]),
        destination: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
        waypoints: waypoints,
        provideRouteAlternatives: false,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      var requestBackTrip = {
        destination: new google.maps.LatLng(_addr_from[0], _addr_from[1]),
        origin: new google.maps.LatLng(_addr_to[0], _addr_to[1]),
        waypoints: waypoints,
        provideRouteAlternatives: true,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
      };

      SafeWin.overviewPath = [];
      directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
          var routes_dist = response.routes[0].legs,
              dura = 0, dist = 0;

          for (var i = 0; i < routes_dist.length; i++) {
            dura += routes_dist[i].duration.value;
            dist += routes_dist[i].distance.value;
          }

          Model.duration = Math.round(dura / 60);
          Model.length = dist;
          recommended_cost = 10 * Math.ceil( ((Model.length / 1000) * cost_of_km) / 10 );
          recommended_cost = recommended_cost < 50 ? 50 : recommended_cost;

          for (i = 0; i < response.routes.length; i++) {
            MapElements.routes.push(new google.maps.DirectionsRenderer({
              map: Maps.map,
              suppressMarkers: true,
              directions: response,
              routeIndex: i
            }));
          }
          for (i = 0; i < response.routes.length; i++) {
            var temp = response.routes[i].overview_path;

            SafeWin.overviewPath.push(temp);
          }
          directionsService.route(requestBackTrip, function(response, status) {
            if (status === google.maps.DirectionsStatus.OK) {            
              for (i = 0; i < response.routes.length; i++) {
                MapElements.routes.push(new google.maps.DirectionsRenderer({
                  map: Maps.map,
                  suppressMarkers: true,
                  directions: response,
                  routeIndex: i
                }));
              }
              for (i = 0; i < response.routes.length; i++) {
                var temp = response.routes[i].overview_path;

                SafeWin.overviewPath.push(temp);
              }
              callback(recommended_cost);
              if (type === "order") {
                MyOrder = Model;
              } else {
                MyOffer = Model;
              }
            }
          });

        }
      });

    }

  };

  return MapsRoutes;
  
});