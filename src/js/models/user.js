define(['Dom', 'Ajax'], function(Dom, Ajax) {
  
  var clUser = function () {
    var self = this;
    var options = {

    };
    var default_avatar = 'assets/images/no_avatar.png';
    var default_name = 'Гость';

    this.default_avatar = default_avatar;
    this.default_name = default_name;

    this.token = getToken();
    this.id = getId();
    this.lat;
    this.lng;
    this.city;
    this.country;
    this.is_auth = false;
    this.authToken;
    this.name;
    this.phone;
    this.avatar;
    this.birthday;
    this.sex;

    this.getInfo = function () {
      return "token = " + this.token + ", id =  " + this.id;
    };

    this.getData = function () {
      if (self.token) {
        Ajax.request('GET', 'profile', self.token, '', '', function(response) {
          if (response) {
            if (!response.ok && lasturl !== "#sms") {
              self.is_auth = false;
              localStorage.removeItem('_is_auth');
              
              self.token = "";
              localStorage.removeItem('_my_token');

              self.initToken;

            } else if (response.ok) {
              
              var prfl = response.profile;
              self.id = prfl.id;
              localStorage.setItem('_my_id', self.id);
              
              Car.brand = prfl.brand;
              Car.model = prfl.model;
              Car.number = prfl.number;
              Car.photo = prfl.vehicle;
              Car.color = prfl.color;
              
              self.city = prfl.city !== "" ? prfl.city : self.city;
              localStorage.setItem('_my_city', self.city);

              self.phone = prfl.phone;
              self.name = prfl.name && prfl.name !== "undefined" ? prfl.name : default_name;
              self.avatar = prfl.photo ? prfl.photo : default_avatar;
              //my_vehicle = prfl.vehicle;

              if (Dom.selAll('.jq_my_name').length) {
                Dom.sel('.jq_my_name').innerHTML = self.name;
                Dom.sel('.jq_my_phone').innerHTML = self.phone;

                if (!self.avatar) {
                  self.avatar = default_avatar;
                }

                Dom.sel('.menu__desc_avatar').src = self.avatar;
              }

            }
          }
        }, function() {});
      } else {
        self.initToken();
      }
    };

    this.initToken = function () {
      if (!self.token) {
        Ajax.request('GET', 'token', '', '', '', function(response) {
          if (response && response.ok) {
            setToken(response.token);
            setId(response.id);
            self.name = default_name;
            if (!User.lat || !User.lng) {
              User.lat = 48.471041;
              User.lng = 135.063500;
            }
            Ajax.request('POST', 'location', User.token, '&location=' + User.lat + ',' + User.lng, '', function() {}, function() {});
          }
        }, function() {});
      }

      return;
    };

    function setToken(token) {
      localStorage.setItem('_my_token', token);
      self.token = token;
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