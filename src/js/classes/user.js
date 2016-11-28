function User() { // Dom, Ajax
  var self = this;
  var options = {
    
  };
  var default_avatar = 'asset/images/no_avatar.png';
  var default_name = 'Гость';
  
  this.token = getToken();
  this.id = getId();
  this.lat;
  this.lng;
  this.city;
  this.country;
  this.is_auth = false;
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
      Ajax.request(server_uri, 'GET', 'profile', self.token, '', '', function(response) {
        if (response) {
          if (!response.ok && lasturl !== "#pages__sms") {
            self.is_auth = false;
            self.token = "";

            localStorage.removeItem('_is_auth');
            
          } else {
            var prfl = response.profile;
             self.id = prfl.id;
             localStorage.setItem('_my_id', self.id);

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
      });
    }
  };
  
  this.initToken = function () {
    if (!this.token) {
      Ajax.request(server_uri, 'GET', 'token', '', '', '', function(response) {
        if (response && response.ok) {
          setToken(response.token);
          setId(response.id);
          self.name = default_name;
          
          init();
        }
      });
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

}