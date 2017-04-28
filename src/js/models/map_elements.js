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
    this.marker_from_2 = null;
    this.marker_to_2 = null;
    this.points = [];
    this.markers = [];
    this.markers_driver_pos = [];
    this.marker_mine = null;
    this.driver_marker = null;
    this.marker_client = null;
    this.marker_clients = [];
    
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
      if (self.marker_from_2) {
        Maps.removeElement(self.marker_from_2);
      }
      if (self.marker_to_2) {
        Maps.removeElement(self.marker_to_2);
      }
      if (self.marker_client) {
        Maps.removeElement(self.marker_client);
      }
      for (i = 0; i < self.marker_clients.length; i++) {
        Maps.removeElement(self.marker_clients[i]);
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
      self.driver_marker = null;
      self.route = null;
      self.routes = [];
      self.markers = [];
      self.marker_client = null;
      self.marker_clients = [];
      self.marker_b = null;
      self.marker_a = null;
      self.marker_from = null;
      self.marker_to = null;
      self.marker_from_2 = null;
      self.marker_to_2 = null;
      self.marker_mine = null;
      self.points = [];
      self.markers_driver_pos = [];

    };

  };

  return clMapElements;
  
});