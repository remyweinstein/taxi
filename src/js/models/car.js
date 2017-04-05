/* global Conn, Car */

define(function() {
  function cbGetAutos(response) {
    var prfl = response.result.cars;

    Conn.clearCb('cbGetAutos');
    
    for (var i = 0; i < prfl.length; i++) {
      if (prfl[i].isActive) {
        Car.id          = prfl[i].id;
        Car.brand       = prfl[i].brand;
        Car.model       = prfl[i].model;
        Car.color       = prfl[i].color;
        Car.number      = prfl[i].number;
        Car.tonnage     = prfl[i].tonnage;
        Car.type        = prfl[i].type;
        Car.conditioner = prfl[i].conditioner;
        Car.photo       = prfl[i].photo;
        Car.type        = prfl[i].type;
        Car.isActive    = prfl[i].isActive;
        Car.inGarage    = prfl.length;
      }
    }
  };
  
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
    this.inGarage    = 0;

    this.getData = function () {
      
    };
    
    this.setData = function () {
      Conn.request('getAuto', '', cbGetAutos);
    };

    
  };

  return clCar;
  
});