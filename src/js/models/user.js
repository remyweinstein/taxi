/* global lastURL, Car, User, Conn, Maps, Settings */

define(['Dom', 'Storage'], function(Dom, Storage) {
  var clUser = function () {
    var self = this;
    
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
    this.token                     = getToken();
    this.id                        = getId();
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
      
    this.getInfo = function () {
      return "token = " + this.token + ", id =  " + this.id;
    };

    this.getData = function () {
      var load = self.load();
      
      if (self.token) {
        Conn.request('requestProfile', '', cbgetProfileData);
      } else {
        self.initToken();
      }
    };

    this.setData = function (response) {
      var prfl = response.profile;
      
      Car.setData();
      self.id                        = prfl.id;
      self.city                      = prfl.city || self.city;
      self.phone                     = prfl.phone;
      self.name                      = prfl.name && prfl.name !== "undefined" ? prfl.name : default_name;
      self.avatar                    = prfl.photo ? prfl.photo : default_avatar;
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

      if (Dom.selAll('.jq_my_name').length) {
        var img = Dom.sel('.menu__desc_avatar');
        
        Dom.sel('.jq_my_name').innerHTML = self.name;
        Dom.sel('.jq_my_phone').innerHTML = self.phone;

        if (!self.avatar) {
          self.avatar = default_avatar;
        }

        img.src = self.avatar;
        img.alt = self.name;
      }
      
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
        self.initialization_token      = obj.initialization_token || self.initialization_token;
        self.default_avatar            = obj.default_avatar || self.default_avatar;
        self.default_name              = obj.default_name || self.default_name;
        self.token                     = obj.token || self.token;
        self.id                        = obj.id || self.id;
        self.lat                       = obj.lat || self.lat;
        self.lng                       = obj.lng || self.lng;
        self.hasPin                    = obj.hasPin || self.hasPin;
        self.city                      = obj.city || self.city;
        self.country                   = obj.country || self.country;
        self.is_auth                   = obj.is_auth || self.is_auth;
        self.authToken                 = obj.authToken || self.authToken;
        self.name                      = obj.name || self.name;
        self.phone                     = obj.phone || self.phone;
        self.avatar                    = obj.avatar || self.avatar;
        self.birthday                  = obj.birthday || self.birthday;
        self.sex                       = obj.sex || self.sex;
        self.hasVkontakte              = obj.hasVkontakte || self.hasVkontakte;
        self.hasOdnoklassniki          = obj.hasOdnoklassniki || self.hasOdnoklassniki;
        self.hasMailru                 = obj.hasMailru || self.hasMailru;
        self.hasFacebook               = obj.hasFacebook || self.hasFacebook;
        self.hasTwitter                = obj.hasTwitter || self.hasTwitter;
        self.hasGoogle                 = obj.hasGoogle || self.hasGoogle;
        self.hasYandex                 = obj.hasYandex || self.hasYandex;
        self.hasGoogleplus             = obj.hasGoogleplus || self.hasGoogleplus;
        self.hasInstagram              = obj.hasInstagram || self.hasInstagram;
        self.hasYoutube                = obj.hasYoutube || self.hasYoutube;
        self.hasWargaming              = obj.hasWargaming || self.hasWargaming;
        self.isAllowReciveSos          = obj.isAllowReciveSos || self.isAllowReciveSos;
        self.isAllowSendSos            = obj.isAllowSendSos || self.isAllowSendSos;
        self.isDisableZoneByPin        = obj.isDisableZoneByPin || self.isDisableZoneByPin;
        self.isActivateSosOnDisconnect = obj.isActivateSosOnDisconnect || self.isActivateSosOnDisconnect;
        self.map                       = obj.map || self.map;
        self.routeGuardZoneRadius      = obj.routeGuardZoneRadius || self.routeGuardZoneRadius;
        
        return true;
      }
      
      return false;
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

    function getToken() {
      return self.token;
    }

    function setId(id) {
      self.id = id;
      self.save();
    }

    function getId() {
      return self.id;
    }
    
    
    

  };

	return clUser;
});