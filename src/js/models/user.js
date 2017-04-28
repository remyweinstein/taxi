/* global Car, User, Conn, Maps, Settings */

define(['Dom', 'Storage', 'MainMenu'], function(Dom, Storage, MainMenu) {
  var clUser = function () {
    var self = this;
    
    function cbReloadProfileData(response) {
      Conn.clearCb('cbgetProfileData');
      
      self.setData(response.result);
      Settings.getSettings();
    }
    
    function cbgetProfileData(response) {
      Conn.clearCb('cbgetProfileData');
      
      if (response.error) {
        self.token = null;
        self.initToken();
      } else {
        self.setData(response.result);
        Settings.getSettings();
        Maps.start();
        Maps.init();
      }
    }
    
    function cbGetToken(response) {
      Conn.clearCb('cbGetToken');
      self.initialization_token = false;
      self.setNewToken(response.result);
      Conn.request('requestProfile', '', cbgetProfileData);
    }

    var default_avatar = 'assets/images/no_avatar.png';
    var default_name = 'Гость';

    this.initialization_token      = false;
    this.default_avatar            = default_avatar;
    this.default_name              = default_name;
    this.token                     = null;
    this.id                        = null;
    this.lat                       = null;
    this.lng                       = null;
    this.hasPin                    = false;
    this.city                      = null;
    this.country                   = null;
    this.is_auth                   = false;
    this.authToken                 = null;
    this.name                      = null;
    this.phone                     = null;
    this.avatar                    = null;
    this.birthday                  = null;
    this.sex                       = null;
    this.hasVkontakte              = false;
    this.hasOdnoklassniki          = false;
    this.hasMailru                 = false;
    this.hasFacebook               = false;
    this.hasTwitter                = false;
    this.hasGoogle                 = false;
    this.hasYandex                 = false;
    this.hasGoogleplus             = false;
    this.hasInstagram              = false;
    this.hasYoutube                = false;
    this.hasWargaming              = false;
    this.isAllowReciveSos          = false;
    this.isAllowSendSos            = false;
    this.isDisableZoneByPin        = false;
    this.isActivateSosOnDisconnect = false;
    this.map                       = null;
    this.routeGuardZoneRadius      = null;
      
    this.constructor = function() {
      self.load();
    };
    
    this.getInfo = function () {
      return "token = " + this.token + ", id =  " + this.id;
    };

    this.getData = function () {
      if (self.token) {
        Conn.request('requestProfile', '', cbgetProfileData);
      } else {
        self.initToken();
      }
    };
        
    this.reloadData = function () {
      if (self.token) {
        Conn.request('requestProfile', '', cbReloadProfileData);
      } else {
        //self.initToken();
      }
    };
    
    
    this.clear = function () {
      self.token                     = null;
      self.id                        = null;
      self.initialization_token      = false;
      self.hasPin                    = false;
      self.is_auth                   = false;
      self.authToken                 = null;
      self.name                      = null;
      self.phone                     = null;
      self.avatar                    = default_avatar;
      self.birthday                  = null;
      self.sex                       = null;
      self.hasVkontakte              = false;
      self.hasOdnoklassniki          = false;
      self.hasMailru                 = false;
      self.hasFacebook               = false;
      self.hasTwitter                = false;
      self.hasGoogle                 = false;
      self.hasYandex                 = false;
      self.hasGoogleplus             = false;
      self.hasInstagram              = false;
      self.hasYoutube                = false;
      self.hasWargaming              = false;
      self.isAllowReciveSos          = false;
      self.isAllowSendSos            = false;
      self.isDisableZoneByPin        = false;
      self.isActivateSosOnDisconnect = false;
      self.routeGuardZoneRadius      = null;
      
      self.initToken();
    };
    
    this.setData = function (response) {
      var prfl = response.profile;
      
      Car.setData();
      self.id                        = prfl.id;
      self.city                      = prfl.city || self.city;
      self.phone                     = prfl.phone;
      self.name                      = prfl.name || default_name;
      self.avatar                    = prfl.photo || prfl.avatar || default_avatar;
      self.hasPin                    = prfl.hasPin;
      self.hasVkontakte              = prfl.hasVkontakte;
      self.hasOdnoklassniki          = prfl.hasOdnoklassniki;
      self.hasMailru                 = prfl.hasMailru;
      self.hasFacebook               = prfl.hasFacebook;
      self.hasTwitter                = prfl.hasTwitter;
      self.hasGoogle                 = prfl.hasGoogle;
      self.hasYandex                 = prfl.hasYandex;
      self.hasGoogleplus             = prfl.hasGoogleplus;
      self.hasInstagram              = prfl.hasInstagram;
      self.hasYoutube                = prfl.hasYoutube;
      self.hasWargaming              = prfl.hasWargaming;
      self.isAllowReciveSos          = prfl.isAllowReciveSos;
      self.isAllowSendSos            = prfl.isAllowSendSos;
      self.isDisableZoneByPin        = prfl.isDisableZoneByPin;
      self.isActivateSosOnDisconnect = prfl.isActivateSosOnDisconnect;
      self.map                       = prfl.map || 'google';
      self.routeGuardZoneRadius      = prfl.routeGuardZoneRadius || 50;

      MainMenu.renderUserInfo();
      self.save();
    };
    
    this.setNewToken = function (response) {
      setToken(response.token);
      setId(response.id);
      self.name = default_name;
    };
    
    this.initToken = function () {
      if (!self.token) {
        self.is_auth = false;
        
        if (!self.initialization_token) {
          Conn.request('requestToken', '', cbGetToken);
        }
        
        self.initialization_token = true;
        self.save();
      }
      
      return;
    };
    
    this.load = function () {
      var obj = Storage.getUser();
      
      if (obj) {
        self.initialization_token      = obj.initialization_token;
        self.default_avatar            = obj.default_avatar;
        self.default_name              = obj.default_name;
        self.token                     = obj.token;
        self.id                        = obj.id;
        self.lat                       = obj.lat;
        self.lng                       = obj.lng;
        self.hasPin                    = obj.hasPin;
        self.city                      = obj.city;
        self.country                   = obj.country;
        self.is_auth                   = obj.is_auth;
        self.authToken                 = obj.authToken;
        self.name                      = obj.name;
        self.phone                     = obj.phone;
        self.avatar                    = obj.avatar;
        self.birthday                  = obj.birthday;
        self.sex                       = obj.sex;
        self.hasVkontakte              = obj.hasVkontakte;
        self.hasOdnoklassniki          = obj.hasOdnoklassniki;
        self.hasMailru                 = obj.hasMailru;
        self.hasFacebook               = obj.hasFacebook;
        self.hasTwitter                = obj.hasTwitter;
        self.hasGoogle                 = obj.hasGoogle;
        self.hasYandex                 = obj.hasYandex;
        self.hasGoogleplus             = obj.hasGoogleplus;
        self.hasInstagram              = obj.hasInstagram;
        self.hasYoutube                = obj.hasYoutube;
        self.hasWargaming              = obj.hasWargaming;
        self.isAllowReciveSos          = obj.isAllowReciveSos;
        self.isAllowSendSos            = obj.isAllowSendSos;
        self.isDisableZoneByPin        = obj.isDisableZoneByPin;
        self.isActivateSosOnDisconnect = obj.isActivateSosOnDisconnect;
        self.map                       = obj.map;
        self.routeGuardZoneRadius      = obj.routeGuardZoneRadius;
        
        var response = {};
        
        response.profile = obj;        
        self.setData(response);
        Settings.getSettings();
        Maps.start();
        Maps.init();
      } else {
        self.getData();
      }      
    };
    
    this.save = function () {
      var obj = {};

      obj.initialization_token      = self.initialization_token;
      obj.default_avatar            = self.default_avatar;
      obj.default_name              = self.default_name;
      obj.token                     = self.token;
      obj.id                        = self.id;
      obj.lat                       = self.lat;
      obj.lng                       = self.lng;
      obj.hasPin                    = self.hasPin;
      obj.city                      = self.city;
      obj.country                   = self.country;
      obj.is_auth                   = self.is_auth;
      obj.authToken                 = self.authToken;
      obj.name                      = self.name;
      obj.phone                     = self.phone;
      obj.avatar                    = self.avatar;
      obj.birthday                  = self.birthday;
      obj.sex                       = self.sex;
      obj.hasVkontakte              = self.hasVkontakte;
      obj.hasOdnoklassniki          = self.hasOdnoklassniki;
      obj.hasMailru                 = self.hasMailru;
      obj.hasFacebook               = self.hasFacebook;
      obj.hasTwitter                = self.hasTwitter;
      obj.hasGoogle                 = self.hasGoogle;
      obj.hasYandex                 = self.hasYandex;
      obj.hasGoogleplus             = self.hasGoogleplus;
      obj.hasInstagram              = self.hasInstagram;
      obj.hasYoutube                = self.hasYoutube;
      obj.hasWargaming              = self.hasWargaming;
      obj.isAllowReciveSos          = self.isAllowReciveSos;
      obj.isAllowSendSos            = self.isAllowSendSos;
      obj.isDisableZoneByPin        = self.isDisableZoneByPin;
      obj.isActivateSosOnDisconnect = self.isActivateSosOnDisconnect;
      obj.map                       = self.map;
      obj.routeGuardZoneRadius      = self.routeGuardZoneRadius;

      Storage.setUser(obj);
    };

    function setToken(token) {
      self.token = token;
      self.save();
      Conn.request('updateUserLocation');
    }

    function setId(id) {
      self.id = id;
      self.save();
    }
  };

	return clUser;
});