define([], function() {
  
  var clSettings = function () {
    var self = this;

    this.safeRadius;
    this.newSafeZone;
    this.disableSafeZoneByPIN;
    this.distributionNearestAgents;
    this.listTrustedContacts;
    this.enableSosWithoutConn;
    this.enableSosByKeyfob;
    this.favoritesAgents;
    
    this.label = [];
    this.type = [];

    this.getSettings = function () {
      self.favoritesAgents = '#favorites';
      self.label.favoritesAgents = 'Избранные агенты';
      self.type.favoritesAgents = 'link';
      
      self.safeRadius = 50;
      self.label.safeRadius = 'Радиус зоны безопасности (м)';
      self.type.safeRadius = 'number';
      
      self.newSafeZone = '#zones';
      self.label.newSafeZone = 'Зоны безопасности';
      self.type.newSafeZone = 'link';
      
      self.disableSafeZoneByPIN = false;
      self.label.disableSafeZoneByPIN = 'Выключать зону безопасности по ПИН коду';
      self.type.disableSafeZoneByPIN = 'boolean';
      
      self.distributionNearestAgents = false;
      self.label.distributionNearestAgents = 'Рассылка ближайшим Агентам при SOS';
      self.type.distributionNearestAgents = 'boolean';
      
      self.listTrustedContacts = '#trusted_contacts';
      self.label.listTrustedContacts = 'Список контактов Безопасности';
      self.type.listTrustedContacts = 'link';
      
      self.enableSosWithoutConn = 0;
      self.label.enableSosWithoutConn = 'Включить SOS при отсутствии связи';
      self.type.enableSosWithoutConn = 'number';
      
      self.enableSosByKeyfob = false;
      self.label.enableSosByKeyfob = 'Включать SOS брелоком-кнопкой';
      self.type.enableSosByKeyfob = 'boolean';

    };
  };
  
  return clSettings;
  
});