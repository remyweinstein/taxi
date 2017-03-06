/* global Conn */

define(function() {

  var clCar = function () {
    var self = this;
    
    this.default_vehicle = 'assets/images/no_vehicle.png';

    this.brand = null;
    this.model = null;
    this.color = null;
    this.number = null;
    this.tonnage = null;
    this.type = null;
    this.conditioner = null;
    this.photo = null;

    this.getData = function () {
      
    };
    
    this.setData = function (response) {
      var prfl = response.profile;
      
      self.brand = prfl.brand;
      self.model = prfl.model;
      self.number = prfl.number;
      self.photo = prfl.vehicle;
      self.color = prfl.color;
    };

    
  };

  return clCar;
  
});