/* global User, Conn, MyOffer */

define(function() {
  
  function cbCreateOffer(response) {
    MyOffer.id = response.result.id;
    window.location.hash = '#driver_city';
    Conn.clearCb('cbCreateOffer');
  }

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
    this.toCity = null;
    this.distance = 0;
    this.price = 0;
    this.comment = null;
    
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
      self.toCity = ord.toCity;
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
    
    this.clear = function () {
      self = null;
    };
    
    this.save = function () {

      var data = {};

      data.fromCity = User.city;
      data.fromAddress = self.fromAddress;
      data.fromLocation = self.fromCoords;
      data.toCity = User.city;
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
