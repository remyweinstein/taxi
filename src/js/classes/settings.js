define([], function() {
  
  var Settings = function () {
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
  
  return Settings;
  
});