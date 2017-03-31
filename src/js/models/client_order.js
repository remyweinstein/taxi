/* global User, Conn */

define(['Storage'], function(Storage) {
  
  var clClientOrder = function () {
    var self = this;
    
    this.id               = null;
    this.bid_id           = null;
    this.type             = null;
    this.fromAddress      = null;
    this.toAddress        = null;
    this.toAddresses      = [];
    this.fromCoords       = null;
    this.toCoords         = null;
    this.duration         = 0;
    this.start            = null;
    this.weight           = null;
    this.volume           = null;
    this.stevedores       = null;
    this.toCoordses       = [];
    this.fromFullAddress  = null;
    this.toFullAddress    = null;
    this.toFullAddresses  = [];
    this.times            = [];
    this.toCities         = [];
    this.length           = 0;
    this.recommended_cost = null;
    this.fromCityLocation = null;
    this.fromCity         = null;
    this.toCityLocation   = null;
    this.toCity           = null;
    this.distance         = 0;
    this.price            = 0;
    this.seats            = 1;
    this.bags             = 0;
    this.comment          = null;
    
    function cbCreateOrder(response) {
      self.id = response.result.id;
      Conn.clearCb('cbCreateOrder');
      window.location.hash = '#client_map';
    }
  
    function cbgetOrderById(response) {
      self.setModel(response);
      Conn.clearCb('cbgetOrderById');
      
      if (self.bid_id) {
        localStorage.setItem('_current_id_bid', self.bid_id);
        //window.location.hash = "#client_go";
      } else {
        window.location.hash = '#client_map';
      }      
    }
    
    function parse(type) {
      var myOrder = Storage.getTaxiOrderModel(type);
      
      if (myOrder) {
        var ord = JSON.parse(myOrder);
        
        self.type = ord.type;
        self.id = ord.id;
        self.fromAddress = ord.fromAddress;
        self.toAddress = ord.toAddress;
        self.fromCoords = ord.fromCoords;
        self.toCoords = ord.toCoords;
        self.duration = ord.duration;
        self.length = ord.length;
        self.start = ord.start;
        self.weight = ord.weight;
        self.volume = ord.volume;
        self.stevedores = ord.stevedores;
        self.fromFullAddress = ord.fromFullAddress;
        self.toFullAddress = ord.toFullAddress;
        self.toAddresses = [];
        self.toCities = [];
        self.toCoordses = [];
        self.toFullAddresses = [];
        self.times = [];
        self.cities = [];
        self.fromCity  = ord.fromCity || User.city;
        self.fromCityLocation = ord.fromCityLocation;
        self.toCity = ord.toCity || User.city;
        self.toCityLocation = ord.toCityLocation;
        self.distance = ord.distance;
        self.price = ord.price;
        self.comment = ord.comment;
        
        if (ord.toAddresses) {
          for (var i = 0; i < ord.toAddresses.length; i++) {
            self.toAddresses[i] = ord.toAddresses[i];
            self.toCoordses[i] = ord.toCoordses[i];
            self.toFullAddresses[i] = ord.toFullAddresses[i];
            self.times[i] = ord.times[i];
            self.cities[i] = ord.cities[i];
          }
        }
      }
    }
    
    function lull(type) {
      Storage.setTaxiOrderModel(type, self);
    }
    
    function clear() {
      self.id = null;
      self.bid_id = null;
      self.type = null;
      self.fromAddress = null;
      self.toAddress = null;
      self.toAddresses = [];
      self.fromCoords = null;
      self.toCoords = null;
      self.duration = 0;
      self.start = null;
      self.weight = null;
      self.volume = null;
      self.stevedores = null;
      self.toCoordses = [];
      self.fromFullAddress = null;
      self.toFullAddress = null;
      self.toFullAddresses = [];
      self.times = [];
      self.toCities = [];
      self.length = 0;
      self.fromCity  = null;
      self.fromCityLocation = null;
      self.toCity = null;
      self.toCityLocation = null;
      self.distance = 0;
      self.price = 0;
      self.seats = 1;
      self.bags = 0;
      self.comment = null;
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
    
    this.setModel = function (response, offer) {
      var ord = !offer ? response.result.order : response.result.offer;
      
      self.bid_id           = (ord.bidId && ord.bidId > 0) ? ord.bidId : null;
      self.type             = ord.type;
      self.id               = ord.id;
      self.fromAddress      = ord.fromAddress;
      self.toAddress        = ord.toAddress;
      self.fromCoords       = ord.fromLocation;
      self.toCoords         = ord.toLocation;
      self.duration         = ord.duration;
      self.length           = ord.length;
      self.start            = ord.start;
      self.weight           = ord.weight;
      self.volume           = ord.volume;
      self.stevedores       = ord.stevedores;
      self.fromFullAddress  = ord.fromFullAddress;
      self.toFullAddress    = ord.toFullAddress;
      self.toAddresses      = [];
      self.toCities         = [];
      self.toCoordses       = [];
      self.toFullAddresses  = [];
      self.times            = [];
      self.cities           = [];
      self.fromCity         = ord.fromCity || User.city;
      self.fromCityLocation = ord.fromCityLocation;
      self.toCity           = ord.toCity || User.city;
      self.toCityLocation   = ord.toCityLocation;
      self.distance         = ord.distance;
      self.price            = ord.price;
      self.seats            = ord.seats;
      self.bags             = ord.bags;
      self.comment          = ord.comment;
      
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
    };
    
    this.clear = function () {
      clear();
    };
    
    this.save = function () {
      var data = {};

      data.fromCity     = self.fromCity || User.city;
      data.fromAddress  = self.fromAddress;
      data.fromLocation = self.fromCoords;
      data.toCity       = self.toCity || User.city;
      data.toAddress    = self.toAddress;
      data.toLocation   = self.toCoords;
      data.duration     = self.duration;
      data.start        = self.start;
      data.price        = self.price;
      data.comment      = self.comment;
      data.weight       = self.weight;
      data.volume       = self.volume;
      data.stevedores   = self.stevedores;
      data.minibus      = 0;
      data.babyChair    = 0;
      data.type         = self.type;
      data.seats        = self.seats;
      data.bags         = self.bags;
      data.length       = self.length;

      if (self.toAddresses) {
        if (self.toAddresses.length > 0) {
          data.points = [];
          for (var i = 0; i < self.toAddresses.length; i++) {
            var time = self.times[i] || 0;
            
            data.points[i] = {};
            data.points[i].address = self.toAddresses[i];
            data.points[i].location = self.toCoordses[i];
            data.points[i].stopTime = time;
            data.points[i].city = User.city;
            data.points[i].fullAddress = '';
          }
        }
      }

      Conn.request('createOrder', data, cbCreateOrder);

    };
    this.callback = function () {
      
    };
    
    this.getByID = function (id) {
      Conn.request('getOrderById', id, cbgetOrderById);
      Conn.request('stopGetOrder');
    };

  };
  
  return clClientOrder;
  
});
