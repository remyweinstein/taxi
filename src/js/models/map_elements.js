define(function() {

  var clMapElements = function () {
    var self = this;
    
    this.route = null;
    this.routes = [];
    this.marker_b = null;
    this.marker_a = null;
    this.marker_from = null;
    this.marker_to = null;
    this.points = [];
    this.markers = [];
    this.markers_driver_pos = [];
    this.marker_mine = null;
    this.driver_marker = [];
    this.marker_client = null;
    
    this.clear = function () {
      var i;
            
      if (self.route) {
        self.route.setMap(null);
      }
      if (self.marker_b) {
        self.marker_b.setMap(null);
      }
      if (self.marker_a) {
        self.marker_a.setMap(null);
      }
      if (self.marker_from) {
        self.marker_from.setMap(null);
      }
      if (self.marker_to) {
        self.marker_to.setMap(null);
      }
      if (self.marker_client) {
        self.marker_client.setMap(null);
      }
      for (i = 0; i < self.routes.length; i++) {
        self.routes[i].setMap(null);
      }
      for (i = 0; i < self.markers.length; i++) {
        self.markers[i].setMap(null);
      }
      for (i = 0; i < self.points.length; i++) {
        self.points[i].setMap(null);
      }
      if (self.marker_mine) {
        self.marker_mine.setMap(null);
      }
      for (i = 0; i < self.markers_driver_pos.length; i++) {
        self.markers_driver_pos[i].marker.setMap(null);
      }
      for (i = 0; i < self.driver_marker.length; i++) {
        self.driver_marker[i].setMap(null);
      }
      
      self.route = null;
      self.routes = [];
      self.markers = [];
      self.marker_client = null;
      self.marker_b = null;
      self.marker_a = null;
      self.marker_from = null;
      self.marker_to = null;
      self.marker_mine = null;
      self.points = [];
      self.markers_driver_pos = [];
      self.driver_marker = [];

    };

  };

  return clMapElements;
  
});