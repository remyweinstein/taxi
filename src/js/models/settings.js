define([], function() {
  
  var clSettings = function () {
    var self = this;

    this.safeRadius;
    this.newSafeZone;
    this.label = [];
    this.type = [];

    this.getSettings = function () {
      self.safeRadius = 50;
      self.label['safeRadius'] = 'Радиус зоны безопасности (м)';
      self.type['safeRadius'] = 'number';
      self.newSafeZone = '#zones';
      self.label['newSafeZone'] = 'Добавить новую зону безопасности';
      self.type['newSafeZone'] = 'link';
    };
  };
  
  return clSettings;
  
});