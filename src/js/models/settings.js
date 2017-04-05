/* global User */

define(['Storage'], function(Storage) {
  
  var clSettings = function () {
    var self = this;

    this.safeRadius                = User.routeGuardZoneRadius;
    this.newSafeZone               = null;
    this.disableSafeZoneByPIN      = User.isDisableZoneByPin;
    this.distributionNearestAgents = User.isAllowSendSos;
    this.enableSosWithoutConn      = User.isActivateSosOnDisconnect;
    this.listTrustedContacts       = null;
    this.enableSosByKeyfob         = null;
    this.favoritesAgents           = null;
    this.myAuto                    = null;
    this.myRating                  = null;
    this.selectMapProvider         = User.map;
    
    this.label = [];
    this.type = [];

    this.getSettings = function () {
      self.favoritesAgents = '#favorites';
      self.label.favoritesAgents = 'Избранные агенты';
      self.type.favoritesAgents = 'link';
      
      self.myRating = '#driver_rating';
      self.label.myRating = 'Мой рейтинг';
      self.type.myRating = 'link';
      
      self.myAuto = '#driver_my_auto';
      self.label.myAuto = 'Мой авто';
      self.type.myAuto = 'link';
      
      self.safeRadius = User.routeGuardZoneRadius;
      self.label.safeRadius = 'Радиус зоны безопасности (м)';
      self.type.safeRadius = 'number';
      
      self.newSafeZone = '#zones';
      self.label.newSafeZone = 'Зоны безопасности';
      self.type.newSafeZone = 'link';
      
      self.disableSafeZoneByPIN = User.isDisableZoneByPin;
      self.label.disableSafeZoneByPIN = 'Выключать зону безопасности по ПИН коду';
      self.type.disableSafeZoneByPIN = 'boolean';
      
      self.distributionNearestAgents = User.isAllowSendSos;
      self.label.distributionNearestAgents = 'Рассылка ближайшим Агентам при SOS';
      self.type.distributionNearestAgents = 'boolean';
      
      self.listTrustedContacts = '#trusted_contacts';
      self.label.listTrustedContacts = 'Список контактов Безопасности';
      self.type.listTrustedContacts = 'link';
      
      self.enableSosWithoutConn = User.isActivateSosOnDisconnect;
      self.label.enableSosWithoutConn = 'Включить SOS при отсутствии связи';
      self.type.enableSosWithoutConn = 'boolean';
      
      self.enableSosByKeyfob = false;
      self.label.enableSosByKeyfob = 'Включать SOS брелоком-кнопкой';
      self.type.enableSosByKeyfob = 'boolean';
      
      self.selectMapProvider = User.map;
      self.label.selectMapProvider = 'Google, Yandex';
      self.type.selectMapProvider = 'select';

    };
  };
  
  return clSettings;
  
});