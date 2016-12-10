define([], function() {
  
  var clSettings = function () {
    var self = this;

    this.safeRadius;
    this.label = [];
    this.type = [];

    this.getSettings = function () {
      self.safeRadius = 50;
      self.label['safeRadius'] = 'Радиус зоны безопасности (м)';
      self.type['safeRadius'] = 'number';
    };
  };
  
  return clSettings;
  
});