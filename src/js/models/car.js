/* global Conn */

define(function() {

  var clCar = function () {
    var self = this;
    
    this.default_vehicle = 'assets/images/no_vehicle.png';
    
    this.id          = null;
    this.brand       = null;
    this.model       = null;
    this.color       = null;
    this.number      = null;
    this.tonnage     = null;
    this.type        = null;
    this.conditioner = null;
    this.photo       = null;
    this.type        = null;
    this.isActive    = false;

    this.getData = function () {
      
    };
    
    this.setData = function (response) {
      var prfl = response.profile;

      self.id          = prfl.id;
      self.brand       = prfl.brand;
      self.model       = prfl.model;
      self.color       = prfl.color;
      self.number      = prfl.number;
      self.tonnage     = prfl.tonnage;
      self.type        = prfl.type;
      self.conditioner = prfl.conditioner;
      self.photo       = prfl.photo;
      self.type        = prfl.type;
      self.isActive    = prfl.isActive;
    };

    
  };

  return clCar;
  
});