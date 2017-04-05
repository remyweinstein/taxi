/* global User, Conn */

define(['Storage'], function(Storage) {
  
  var clDriverOffer = function () {
    var self = this;

    this.id               = null;
    this.bid_id           = null;
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
    this.bags             = 0;
    
    function cbCreateOffer(response) {
      var targetLink = Storage.getActiveTypeTaxi();
      
      targetLink = targetLink==="taxi" ? "city" : targetLink;
      targetLink = targetLink==="trucking" ? "cargo" : targetLink;
      self.id = response.result.id;
      Conn.clearCb('cbCreateOffer');
      window.location.hash = '#driver_' + targetLink;
    }
    
    function cbgetOfferById(response) {
      var ord = response.result.offer;

      self.bid_id           = (ord.bids && ord.bids.length > 0) ? ord.bids[0].id : null;
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
      self.bags             = ord.bags;
      Conn.clearCb('cbgetOfferById');
      
      if (self.bid_id) {
        localStorage.setItem('_current_id_bid', self.bid_id);
      }
      
      if (ord.bids) {
        if (ord.bids[0].approved) {
          localStorage.setItem('_active_offer_id', self.id);
        }
      }
      Storage.lullModel(self);
      window.location.hash = '#driver_my_offer';
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
        self.bags             = ord.bags;
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

      data.fromCity     = self.fromCity || User.city;
      data.fromAddress  = self.fromAddress;
      data.fromLocation = self.fromCoords;
      data.toCity       = self.toCity || User.city;
      data.toAddress    = self.toAddress;
      data.toLocation   = self.toCoords;
      data.price        = self.price;
      data.comment      = self.comment;
      data.type         = self.type;
      data.weight       = self.weight;
      data.volume       = self.volume;
      data.stevedores   = self.stevedores;
      data.seats        = self.seats;
      data.bags         = self.bags;
      data.start        = self.start;
      Conn.request('createOffer', data, cbCreateOffer);
    };

    this.getByID = function (id) {
      Conn.request('getOfferById', id, cbgetOfferById);
    };

  };
  
  return clDriverOffer;
  
});
