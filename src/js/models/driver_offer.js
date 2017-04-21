/* global User, Conn */

define(['Storage'], function(Storage) {
  
  var clDriverOffer = function () {
    var self = this,
        global_end_get_order, timerWaiterEndGetById;

    this.id               = null;
    this.fromAddress      = null;
    this.toAddress        = null;
    this.fromCoords       = null;
    this.toCoords         = null;
    this.start            = null;
    this.fromFullAddress  = null;
    this.toFullAddress    = null;
    this.length           = 0;
    this.recommended_cost = null;
    this.fromCity         = null;
    this.fromCityLocation = null;
    this.toCity           = null;
    this.toCityLocation   = null;
    this.price            = 0;
    this.weight           = null;
    this.volume           = null;
    this.stevedores       = null;
    this.seats            = 1;
    this.occupiedSeats    = 0;
    this.bags             = 0;
    this.canceled         = false;
    this.started          = null;
    //this.active           = false;
    //this.pregnant         = false;
    
    function cbCreateOffer(response) {
      Conn.clearCb('cbCreateOffer');
      
      var targetLink = Storage.getActiveTypeTaxi();
      
      targetLink = targetLink==="taxi" ? "city" : targetLink;
      targetLink = targetLink==="trucking" ? "cargo" : targetLink;
      self.id = response.result.id;
      window.location.hash = '#driver_my_offer'; //+ targetLink;
    }
    
    function cbgetOfferById(response) {
      Conn.clearCb('cbgetOfferById');
      
      if (response.result) {

        var ord      = response.result.offer,
            now      = new Date().getTime(),
            start    = new Date(ord.start).getTime(),
            pregnant = ord.seats === ord.occupiedSeats ? true : false,
            active   = pregnant && start <= now ? true : false;

        self.id               = ord.id;
        self.fromAddress      = ord.fromAddress;
        self.toAddress        = ord.toAddress;
        self.fromCoords       = ord.fromLocation;
        self.toCoords         = ord.toLocation;
        self.start            = ord.start;
        self.length           = ord.length;
        self.fromFullAddress  = ord.fromFullAddress;
        self.toFullAddress    = ord.toFullAddress;
        self.fromCity         = ord.fromCity;
        self.fromCityLocation = ord.fromCityLocation;
        self.toCity           = ord.toCity;
        self.toCityLocation   = ord.toCityLocation;
        self.price            = ord.price;
        self.comment          = ord.comment;
        self.weight           = ord.weight;
        self.volume           = ord.volume;
        self.stevedores       = ord.stevedores;
        self.seats            = ord.seats;
        self.occupiedSeats    = ord.occupiedSeats;
        self.bags             = ord.bags;
        self.started          = ord.started;
        self.canceled         = ord.canceled;
        //self.active           = active;
        //self.pregnant         = pregnant;

        if (self.active) {
          Storage.setTripDriver(self.id);
        }

        global_end_get_order = true;
        Storage.lullModel(self);
      }
    }
    
    function parse(type) {
      var myOffer = Storage.getTaxiOfferModel(type);

      if (myOffer) {
        var ord = JSON.parse(myOffer);
        
        self.id               = ord.id;
        self.fromCity         = ord.fromCity || User.city;
        self.fromCityLocation = ord.fromCityLocation;
        self.fromAddress      = ord.fromAddress;
        self.fromCoords       = ord.fromCoords;
        self.toCity           = ord.toCity || User.city;
        self.toCityLocation   = ord.toCityLocation;
        self.toAddress        = ord.toAddress;
        self.toCoords         = ord.toCoords;
        self.price            = ord.price;
        self.comment          = ord.comment;
        self.type             = ord.type;
        self.start            = ord.start;
        self.weight           = ord.weight;
        self.volume           = ord.volume;
        self.stevedores       = ord.stevedores;
        self.seats            = ord.seats;
        self.occupiedSeats    = ord.occupiedSeats;
        self.bags             = ord.bags;
        self.started          = ord.started;
        self.canceled         = ord.canceled;
        //self.active           = ord.active;
        //self.pregnant         = ord.pregnant;
      }
    }
    
    function lull(type) {
      Storage.getTaxiOrderModel(type, self);
    }
    
    this.activateCurrent = function () {
      parse(Storage.getActiveTypeTaxi());
    };
    
    this.lullCurrent = function () {
      lull(Storage.getActiveTypeTaxi());
    };
    
    this.activateCity = function () {
      parse('taxi');
    };
    
    this.lullCity = function () {
      lull('taxi');
    };
    
    this.activateInterCity = function () {
      parse('intercity');
    };
    
    this.lullInterCity = function () {
      lull('intercity');
    };
    
    this.activateCargo = function () {
      parse('trucking');
    };
    
    this.lullCargo = function () {
      lull('trucking');
    };
    
    this.clear = function () {
      self = null;
    };
    
    this.save = function () {
      var data = {};

      data.fromCity      = self.fromCity || User.city;
      data.fromAddress   = self.fromAddress;
      data.fromLocation  = self.fromCoords;
      data.toCity        = self.toCity || User.city;
      data.toAddress     = self.toAddress;
      data.toLocation    = self.toCoords;
      data.price         = self.price;
      data.comment       = self.comment;
      data.type          = self.type;
      data.weight        = self.weight;
      data.volume        = self.volume;
      data.stevedores    = self.stevedores;
      data.seats         = self.seats;
      data.occupiedSeats = self.occupiedSeats;
      data.bags          = self.bags;
      data.start         = self.start;
      //data.active /      = self.active;   //far future
      //data.pregnant /    = self.pregnant;
      
      Conn.request('createOffer', data, cbCreateOffer);
    };

    this.getByID = function (id, callback) {
      Conn.request('getOfferById', id, cbgetOfferById);
      global_end_get_order = false;
      timerWaiterEndGetById = setInterval(function () {
        if (global_end_get_order) {
          timerWaiterEndGetById = clearInterval(timerWaiterEndGetById);
          callback();
        }
      }, 250);
    };

  };
  
  return clDriverOffer;
  
});