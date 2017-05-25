/* global User, Conn */

define(['Storage'], function(Storage) {
  
  var clClientOrder = function () {
    var self = this,
        timerWaiterEndGetById,
        global_end_get_order = false;
    
    this.id               = null;
    this.type             = null;
    this.fromCityLocation = null;
    this.fromFullAddress  = null;
    this.fromAddress      = null;
    this.fromCity         = null;
    this.fromCoords       = null;
    this.stevedores       = null;
    this.toCityLocation   = null;
    this.toFullAddress    = null;
    this.toAddress        = null;
    this.toCoords         = null;
    this.toCity           = null;
    this.points           = [];
    this.recommended_cost = null;
    this.occupiedSeats    = 0;
    this.isConstant       = false;
    this.canceled         = false;
    this.distance         = 0;
    this.started          = null;
    this.comment          = null;
    this.duration         = 0;
    this.volume           = null;
    this.length           = 0;
    this.weight           = null;
    this.price            = 0;
    this.route            = null;
    this.seats            = 1;
    this.start            = null;
    this.zone             = null;
    this.bags             = 0;
    
    function cbCreateOrder(response) {
      Conn.clearCb('cbCreateOrder');
      self.id = response.result.id;
      
      if (Storage.getSafeRoute()) {
        var data = {};
        
        data.polygon  = Storage.getSafeRoute();
        data.name     = 'temporary';
        data.isActive = true;
        data.orderId  = self.id;
        self.zone     = data;
        
        Conn.request('addZones', data, cbAddSafeRoute);
        Storage.clearSafeRoute();
      } else {
        self.callback();
      }
    }
    
    function cbAddSafeRoute() {
      Conn.clearCb('cbAddSafeRoute');
      self.callback();
    }
  
    function cbgetOrderById(response) {
      Conn.clearCb('cbgetOrderById');
      self.setModel(response);
    }
    
    function parse(type) {
      var myOrder = Storage.getTaxiOrderModel(type);
      
      if (myOrder && myOrder !== "undefined") {
        var ord = JSON.parse(myOrder);
        
        self.id               = ord.id;
        self.fromCityLocation = ord.fromCityLocation;
        self.fromFullAddress  = ord.fromFullAddress;
        self.fromAddress      = ord.fromAddress;
        self.fromCoords       = ord.fromCoords;
        self.fromCity         = ord.fromCity || User.city;
        self.toCityLocation   = ord.toCityLocation;
        self.toFullAddress    = ord.toFullAddress;
        self.toAddress        = ord.toAddress;
        self.toCoords         = ord.toCoords;
        self.toCity           = ord.toCity || User.city;
        self.points           = ord.points;
        self.occupiedSeats    = ord.occupiedSeats;
        self.isConstant       = ord.isConstant;
        self.stevedores       = ord.stevedores;
        self.duration         = ord.duration;
        self.canceled         = ord.canceled;
        self.distance         = ord.distance;
        self.started          = ord.started;
        self.comment          = ord.comment;
        self.length           = ord.length;
        self.weight           = ord.weight;
        self.volume           = ord.volume;
        self.start            = ord.start;
        self.price            = ord.price;
        self.route            = ord.route;
        self.type             = ord.type;
        self.zone             = ord.zone;
      }
    }
    
    function lull(type) {
      Storage.setTaxiOrderModel(type, self);
    }
    
    function clear() {
      self.id               = null;
      self.fromCityLocation = null;
      self.fromFullAddress  = null;
      self.fromAddress      = null;
      self.fromCoords       = null;
      self.fromCity         = null;
      self.toCityLocation   = null;
      self.toFullAddress    = null;
      self.toAddress        = null;
      self.toCoords         = null;
      self.toCity           = null;
      self.points           = [];
      self.occupiedSeats    = 0;
      self.stevedores       = null;
      self.isConstant       = false;
      self.duration         = 0;
      self.distance         = 0;
      self.canceled         = false;
      self.started          = null;
      self.comment          = null;
      self.length           = 0;
      self.volume           = null;
      self.weight           = null;
      self.start            = null;
      self.price            = 0;
      self.route            = null;
      self.seats            = 1;
      self.bags             = 0;
      self.type             = null;
      self.zone             = null;
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
    
    this.activateTourism = function () {
      parse('tourism');
    };
    
    this.lullInterCity = function () {
      lull('intercity');
    };
    
    this.activateTrucking = function () {
      parse('trucking');
    };
    
    this.lullTrucking = function () {
      lull('trucking');
    };
    
    this.setModel = function (response, offer) {
      var ord      = !offer ? response.result.order : response.result.offer;
      
      if (ord) {
        var now      = new Date().getTime(),
            start    = new Date(ord.start).getTime();

        self.id               = ord.id;
        self.fromCityLocation = ord.fromCityLocation;
        self.fromFullAddress  = ord.fromFullAddress;
        self.fromAddress      = ord.fromAddress;
        self.fromCity         = ord.fromCity || User.city;
        self.fromCoords       = ord.fromLocation;
        self.toCityLocation   = ord.toCityLocation;
        self.toFullAddress    = ord.toFullAddress;
        self.toAddress        = ord.toAddress;
        self.toCoords         = ord.toLocation;
        self.toCity           = ord.toCity || User.city;
        self.points           = ord.points;
        self.occupiedSeats    = ord.occupiedSeats;
        self.stevedores       = ord.stevedores;
        self.isConstant       = ord.isConstant;
        self.distance         = ord.distance;
        self.canceled         = ord.canceled;
        self.duration         = ord.duration;
        self.started          = ord.started;
        self.comment          = ord.comment;
        self.length           = ord.length;
        self.weight           = ord.weight;
        self.volume           = ord.volume;
        self.start            = ord.start;
        self.price            = ord.price;
        self.route            = ord.route;
        self.seats            = ord.seats;
        self.bags             = ord.bags;
        self.type             = ord.type;
        self.zone             = ord.zone;

        if (self.active) {
          Storage.setTripClient(self.id);
        }

        global_end_get_order = true;
        Storage.lullModel(self);
      }
    };
    
    this.clear = function () {
      clear();
    };
    
    this.save = function (callback) {
      var data = {};

      data.fromLocation  = self.fromCoords;
      data.fromAddress   = self.fromAddress;
      data.fromCity      = self.fromCity || User.city;
      data.toLocation    = self.toCoords;
      data.toAddress     = self.toAddress;
      data.toCity        = self.toCity || User.city;
      data.points        = self.points;
      data.occupiedSeats = self.occupiedSeats;
      data.stevedores    = self.stevedores;
      data.isConstant    = self.isConstant;
      data.babyChair     = 0;
      data.duration      = self.duration;
      data.minibus       = 0;
      data.comment       = self.comment;
      data.length        = self.length;
      data.volume        = self.volume;
      data.weight        = self.weight;
      data.seats         = self.seats;
      data.start         = self.start;
      data.price         = self.price;
      data.route         = self.route;
      data.type          = self.type;
      data.bags          = self.bags;
      data.zone          = self.zone;

      Conn.request('createOrder', data, cbCreateOrder);
      
      function st() {
        callback();
      };
      
      arguments.callee.st = st;
    };
    
    this.callback = function () {
      self.save.st();
      
      return true;
    };
    
    this.getByID = function (id, callback) {
      Conn.request('getOrderById', id, cbgetOrderById);
      Conn.request('stopGetOrder');
      global_end_get_order = false;
      timerWaiterEndGetById = setInterval(function () {
        if (global_end_get_order) {
          timerWaiterEndGetById = clearInterval(timerWaiterEndGetById);
          callback();
        }
      }, 250);
    };

  };
  
  return clClientOrder;
  
});
