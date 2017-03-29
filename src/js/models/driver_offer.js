/* global User, Conn */

define(['Storage'], function(Storage) {
  
  var clDriverOffer = function () {
    var self = this;

    this.id = null;
    this.bid_id = null;
    this.fromAddress = null;
    this.toAddress = null;
    this.toAddresses = [];
    this.fromCoords = null;
    this.toCoords = null;
    this.duration = 0;
    this.start = null;
    this.toCoordses = [];
    this.fromFullAddress = null;
    this.toFullAddress = null;
    this.toFullAddresses = [];
    this.times = [];
    this.toCities = [];
    this.length = 0;
    this.recommended_cost = null;
    this.fromCity  = null;
    this.fromCityLocation = null;
    this.toCity = null;
    this.toCityLocation = null;
    this.distance = 0;
    this.price = 0;
    this.comment = null;
    
    function cbCreateOffer(response) {
      self.id = response.result.id;
      Conn.clearCb('cbCreateOffer');
      window.location.hash = '#driver_city';
    }
    
    function cbgetOfferById(response) {
      var ord = response.result.offer;

      if (ord.bids) {
        if(ord.bids.length > 0) {
          self.bid_id = ord.bids[0].id;
        }
      } else {
        self.bid_id = null;
      }
      self.id = ord.id;
      self.fromAddress = ord.fromAddress;
      self.toAddress = ord.toAddress;
      self.fromCoords = ord.fromLocation;
      self.toCoords = ord.toLocation;
      //self.duration = ord.duration;
      //self.distance = ord.distance;
      self.start = ord.start;
      self.length = ord.length;
      self.fromFullAddress = "";
      self.toFullAddress = "";
      self.time0 = 0;
      self.toAddresses = [];
      self.toCities = [];
      self.toCoordses = [];
      self.toFullAddresses = [];
      self.times = [];
      self.cities = [];
      if (ord.points) {
        if (ord.points.length > 0) {
          for (var i = 0; i < ord.points.length; i++) {
            self.toAddresses[i] = ord.points[i].address || "";
            self.toCoordses[i] = ord.points[i].location || "";
            self.toFullAddresses[i] = ord.points[i].fullAddress || "";
            self.times[i] = ord.points[i].stopTime || "";
            self.cities[i] = ord.points[i].city || "";
          }
        }
      }
      self.fromCity  = ord.fromCity;
      self.fromCityLocation = ord.fromCityLocation;
      self.toCity = ord.toCity;
      self.toCityLocation = ord.toCityLocation;
      self.price = ord.price;
      self.comment = ord.comment;
      Conn.clearCb('cbgetOfferById');
      
      if (self.bid_id) {
        localStorage.setItem('_current_id_bid', self.bid_id);
      }
      
      if (ord.bids) {
        if (ord.bids[0].approved) {
          localStorage.setItem('_active_offer_id', self.id);
        }
      }

      window.location.hash = '#driver_my_offer';
    }
    
    
    function parse(type) {
      var myOffer = Storage.getTaxiOrderModel(type);
      
      if (myOffer) {
        var ord = JSON.parse(myOffer);
        
        self.fromCity = ord.fromCity;
        self.fromCityLocation = ord.fromCityLocation;
        self.fromAddress = ord.fromAddress;
        self.fromLocation = ord.fromLocation;
        self.toCity = ord.toCity;
        self.toCityLocation = ord.toCityLocation;
        self.toAddress = ord.toAddress;
        self.toLocation = ord.toLocation;
        self.price = ord.price;
        self.comment = ord.comment;
        self.type = ord.type;
        self.start = ord.start;
      }
    }
    
    function lull(type) {
      Storage.getTaxiOrderModel(type, self);
      //self.clear();
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

      data.fromCity = User.city;
      //data.fromCityLocation = self.fromCityLocation;
      data.fromAddress = self.fromAddress;
      data.fromLocation = self.fromCoords;
      data.toCity = User.city;
      //data.toCityLocation = self.toCityLocation;
      data.toAddress = self.toAddress;
      data.toLocation = self.toCoords;
      data.price = self.price;
      data.comment = self.comment;
      data.type = 'taxi';
      data.start = self.start;
      //data.duration = self.duration;
      //data.minibus = 0;
      //data.babyChair = 0;
      //data.length = self.length;

      Conn.request('createOffer', data, cbCreateOffer);
    };

    this.getByID = function (id) {
      Conn.request('getOfferById', id, cbgetOfferById);
    };

  };
  
  return clDriverOffer;
  
});
