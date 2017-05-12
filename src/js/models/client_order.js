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
    this.toFullAddresses  = [];
    this.toCityLocation   = null;
    this.toFullAddress    = null;
    this.toAddresses      = [];
    this.toCoordses       = [];
    this.toAddress        = null;
    this.toCoords         = null;
    this.toCities         = [];
    this.toCity           = null;
    this.recommended_cost = null;
    this.occupiedSeats    = 0;
    this.canceled         = false;
    this.distance         = 0;
    this.started          = null;
    //this.pregnant         = false;
    this.comment          = null;
    this.duration         = 0;
    this.volume           = null;
    //this.active           = false;
    this.length           = 0;
    this.weight           = null;
    this.times            = [];
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
      
      if (myOrder) {
        var ord = JSON.parse(myOrder);
        
        self.id               = ord.id;
        self.fromCityLocation = ord.fromCityLocation;
        self.fromFullAddress  = ord.fromFullAddress;
        self.fromAddress      = ord.fromAddress;
        self.fromCoords       = ord.fromCoords;
        self.fromCity         = ord.fromCity || User.city;
        self.toFullAddresses  = [];
        self.toCityLocation   = ord.toCityLocation;
        self.toFullAddress    = ord.toFullAddress;
        self.toAddresses      = [];
        self.toCoordses       = [];
        self.toAddress        = ord.toAddress;
        self.toCities         = [];
        self.toCoords         = ord.toCoords;
        self.toCity           = ord.toCity || User.city;
        self.occupiedSeats    = ord.occupiedSeats;
        self.stevedores       = ord.stevedores;
        self.duration         = ord.duration;
        self.canceled         = ord.canceled;
        self.distance         = ord.distance;
        self.started          = ord.started;
        //self.pregnant         = ord.pregnant;
        self.comment          = ord.comment;
        //self.active           = ord.active;
        self.cities           = [];
        self.length           = ord.length;
        self.weight           = ord.weight;
        self.volume           = ord.volume;
        self.start            = ord.start;
        self.times            = [];
        self.price            = ord.price;
        self.route            = ord.route;
        self.type             = ord.type;
        self.zone             = ord.zone;
        
        if (ord.toAddresses) {
          for (var i = 0; i < ord.toAddresses.length; i++) {
            self.toFullAddresses[i] = ord.toFullAddresses[i];
            self.toAddresses[i]     = ord.toAddresses[i];
            self.toCoordses[i]      = ord.toCoordses[i];
            self.cities[i]          = ord.cities[i];
            self.times[i]           = ord.times[i];
          }
        }
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
      self.toFullAddresses  = [];
      self.toCityLocation   = null;
      self.toFullAddress    = null;
      self.toAddresses      = [];
      self.toCoordses       = [];
      self.toAddress        = null;
      self.toCoords         = null;
      self.toCities         = [];
      self.occupiedSeats    = 0;
      self.stevedores       = null;
      self.duration         = 0;
      self.distance         = 0;
      self.canceled         = false;
      self.started          = null;
      //self.pregnant         = false;
      self.comment          = null;
      self.length           = 0;
      self.volume           = null;
      self.toCity           = null;
      //self.active           = false;
      self.weight           = null;
      self.start            = null;
      self.times            = [];
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
      var ord      = !offer ? response.result.order : response.result.offer,
          now      = new Date().getTime(),
          start    = new Date(ord.start).getTime(),
          pregnant = ord.seats === ord.occupiedSeats ? true : false,
          active   = pregnant && start <= now ? true : false;
      
      self.id               = ord.id;
      self.fromCityLocation = ord.fromCityLocation;
      self.fromFullAddress  = ord.fromFullAddress;
      self.fromAddress      = ord.fromAddress;
      self.fromCity         = ord.fromCity || User.city;
      self.fromCoords       = ord.fromLocation;
      self.toFullAddresses  = [];
      self.toCityLocation   = ord.toCityLocation;
      self.toFullAddress    = ord.toFullAddress;
      self.toAddresses      = [];
      self.toCoordses       = [];
      self.toAddress        = ord.toAddress;
      self.toCoords         = ord.toLocation;
      self.toCities         = [];
      self.toCity           = ord.toCity || User.city;
      self.occupiedSeats    = ord.occupiedSeats;
      self.stevedores       = ord.stevedores;
      self.distance         = ord.distance;
      //self.pregnant         = pregnant;
      self.canceled         = ord.canceled;
      self.duration         = ord.duration;
      self.started          = ord.started;
      self.comment          = ord.comment;
      //self.active           = active;
      self.cities           = [];
      self.length           = ord.length;
      self.weight           = ord.weight;
      self.volume           = ord.volume;
      self.times            = [];
      self.start            = ord.start;
      self.price            = ord.price;
      self.route            = ord.route;
      self.seats            = ord.seats;
      self.bags             = ord.bags;
      self.type             = ord.type;
      self.zone             = ord.zone;
      
      if (ord.points) {
        if (ord.points.length > 0) {
          for (var i = 0; i < ord.points.length; i++) {
            self.toFullAddresses[i] = ord.points[i].fullAddress || "";
            self.toAddresses[i]     = ord.points[i].address || "";
            self.toCoordses[i]      = ord.points[i].location || "";
            self.cities[i]          = ord.points[i].city || "";
            self.times[i]           = ord.points[i].stopTime || "";
          }
        }
      }
      
      if (self.active) {
        Storage.setTripClient(self.id);
      }
      
      global_end_get_order = true;
      Storage.lullModel(self);
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
      data.occupiedSeats = self.occupiedSeats;
      data.stevedores    = self.stevedores;
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
      //data.active        = self.active;
      //data.pregnant      = self.pregnant;

      if (self.toAddresses) {
        if (self.toAddresses.length > 0) {
          data.points = [];
          for (var i = 0; i < self.toAddresses.length; i++) {
            var time = self.times[i] || 0;
            
            data.points[i]             = {};
            data.points[i].fullAddress = '';
            data.points[i].location    = self.toCoordses[i];
            data.points[i].stopTime    = time;
            data.points[i].address     = self.toAddresses[i];
            data.points[i].city        = User.city;
          }
        }
      }

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
