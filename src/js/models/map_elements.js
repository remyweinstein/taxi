/* global Maps */

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
        Maps.removeElement(self.route);
      }
      if (self.marker_b) {
        Maps.removeElement(self.marker_b);
      }
      if (self.marker_a) {
        Maps.removeElement(self.marker_a);
      }
      if (self.marker_from) {
        Maps.removeElement(self.marker_from);
      }
      if (self.marker_to) {
        Maps.removeElement(self.marker_to);
      }
      if (self.marker_client) {
        Maps.removeElement(self.marker_client);
      }
      for (i = 0; i < self.routes.length; i++) {
        Maps.removeElement(self.routes[i]);
      }
      for (i = 0; i < self.markers.length; i++) {
        Maps.removeElement(self.markers[i]);
      }
      for (i = 0; i < self.points.length; i++) {
        Maps.removeElement(self.points[i]);
      }
      if (self.marker_mine) {
        Maps.removeElement(self.marker_mine);
      }
      for (i = 0; i < self.markers_driver_pos.length; i++) {
        Maps.removeElement(self.markers_driver_pos[i].marker);
      }
      for (i = 0; i < self.driver_marker.length; i++) {
        if (self.driver_marker[i]) { 
          Maps.removeElement(self.driver_marker[i]);
        }
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