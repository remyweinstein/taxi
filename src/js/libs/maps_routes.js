/* global SafeWin, MapElements, Maps, cost_of_km, MyOrder, MyOffer */

define(function() {

  var MapsRoutes = {

    drawRoute: function(type, back, callback) {
      var _addr_from, _addr_to,
          Model = type==="order" ? MyOrder : MyOffer,
          waypoints = [];

      if (!Model.fromCoords || !Model.toCoords) {
        return;
      }
      
      _addr_from = Model.fromCoords.split(",");
      _addr_to = Model.toCoords.split(",");
      MapElements.marker_b = null;
      MapElements.marker_a = null;
      MapElements.marker_from = Maps.addMarker(_addr_from[0], _addr_from[1], Model.fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', [32,32], function(){});
      MapElements.marker_to = Maps.addMarker(_addr_to[0], _addr_to[1], Model.toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', [32,32], function(){});

      if (Model.toAddresses) {
        for (var i = 0; i < Model.toAddresses.length; i++) {
          if (Model.toAddresses[i] && Model.toAddresses[i] !== "") {
            var _wp = Model.toCoordses[i].split(","),
                time = "";
            
            waypoints.push(Maps.convertWayPointsForRoutes(_wp[0], _wp[1]));
            
            if (Model.times[i]) {
              time = Model.times[i] + ' мин.';
            }
            
            Maps.addMarker(_wp[0], _wp[1], Model.toAddresses[i], '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', [32,32], function(mark){
              Maps.addInfoForMarker(time, true, mark);
              MapElements.points.push(mark);
            });
          }
        }
      }
      
    Maps.renderRoute(waypoints, type, Model, function (price) {
      callback(price);
    });
    
    }

  };

  return MapsRoutes;
  
});