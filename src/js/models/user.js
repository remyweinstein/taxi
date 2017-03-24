/* global lastURL, Car, User, Conn */

define(['Dom'], function(Dom) {
  var clUser = function () {
    var self = this;
    
    function cbgetProfileData(response) {
      if (response.error) {
        self.token = null;
        self.initToken();
      } else {
        self.setData(response.result);
        Conn.clearCb('cbgetProfileData');
      }
    }
    
    function cbGetToken(response) {
      self.initialization_token = false;
      self.setNewToken(response.result);
      Conn.clearCb('cbGetToken');
    }

    var default_avatar = 'assets/images/no_avatar.png';
    var default_name = 'Гость';

    this.initialization_token = false;
    this.default_avatar = default_avatar;
    this.default_name = default_name;
    this.token = getToken();
    this.id = getId();
    this.lat = null;
    this.lng = null;
    this.hasPin = false;
    this.city = null;
    this.country = null;
    this.is_auth = false;
    this.authToken = null;
    this.name = null;
    this.phone = null;
    this.avatar = null;
    this.birthday = null;
    this.sex = null;

    this.getInfo = function () {
      return "token = " + this.token + ", id =  " + this.id;
    };

    this.getData = function () {
      self.city = localStorage.getItem('_my_city');
      self.id   = localStorage.getItem('_my_id');
      self.lat  = localStorage.getItem('_my_pos_lat');
      self.lng  = localStorage.getItem('_my_pos_lon');

      if ( localStorage.getItem('_is_auth') === "true" ) {
        self.is_auth = true;
      }

      self.token = localStorage.getItem('_my_token');

      if (self.token) {
        Conn.request('requestProfile', '', cbgetProfileData);
      } else {
        self.initToken();
      }
    };
    
    this.setData = function (response) {
      Car.setData(response);
      /*
      if (lastURL === "#sms") {
        self.is_auth = false;
        localStorage.removeItem('_is_auth');

        self.token = "";
        localStorage.removeItem('_my_token');

        self.initToken();

      } else {
        */
        var prfl = response.profile;
        self.id = prfl.id;
        localStorage.setItem('_my_id', self.id);

        self.city = prfl.city || self.city;
        if (self.city) {
          localStorage.setItem('_my_city', self.city);
        }

        self.phone = prfl.phone;
        self.name = prfl.name && prfl.name !== "undefined" ? prfl.name : default_name;
        self.avatar = prfl.photo ? prfl.photo : default_avatar;
        self.hasPin = prfl.hasPin;

        if (Dom.selAll('.jq_my_name').length) {
          Dom.sel('.jq_my_name').innerHTML = self.name;
          Dom.sel('.jq_my_phone').innerHTML = self.phone;

          if (!self.avatar) {
            self.avatar = default_avatar;
          }
          
          var img = Dom.sel('.menu__desc_avatar');
          
          img.src = self.avatar;
          img.alt = self.name;
          
        /*
        }
        */
      }
    };
    
    this.setNewToken = function (response) {
      setToken(response.token);
      setId(response.id);
      self.name = default_name;
    };
    
    this.initToken = function () {
      if (!self.token) {
        localStorage.removeItem('_is_auth');
        self.is_auth = false;
        if (!self.initialization_token) {
          Conn.request('requestToken', '', cbGetToken);
        }
        self.initialization_token = true;
      }
      
      return;
    };

    function setToken(token) {
      localStorage.setItem('_my_token', token);
      self.token = token;
      Conn.request('updateUserLocation');
    }

    function getToken() {
      return localStorage.getItem('_my_token');
    }

    function setId(id) {
      localStorage.setItem('_my_id', id);
      self.id = id;
    }

    function getId() {
      return localStorage.getItem('_my_id');
    }

  };

	return clUser;
});