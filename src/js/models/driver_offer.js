/* global User, Conn */

define(['Ajax'], function(Ajax) {
  
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
    this.toCoordses = [];
    this.fromFullAddress = null;
    this.toFullAddress = null;
    this.toFullAddresses = [];
    this.times = [];
    this.toCities = [];
    
    this.length = 0;

    this.fromCity  = null;
    this.toCity = null;

    this.distance = 0;
    this.price = 0;
    this.comment = null;
    
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
      data.duration = self.duration;
      data.isIntercity = 0;
      data.price = self.price;
      data.comment = self.comment;
      data.minibus = 0;
      data.babyChair = 0;
      data.type = 'offer';
      data.length = self.length;

      Conn.createOffer(data);
    };

    this.getByID = function (_id, callback) {
                  Conn.getOfferById(_id);
                      var ord = response.order;
                      
                      if(ord.bidId && ord.bidId > 0) {
                        self.bid_id = ord.bidId;
                      } else {
                        self.bid_id = null;
                      }
                      self.id = ord.id;
                      self.fromAddress = ord.fromAddress;
                      self.toAddress = ord.toAddress;
                      self.fromCoords = ord.fromLocation;
                      self.toCoords = ord.toLocation;
                      self.duration = ord.duration;
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
                      if (ord.points.length > 0) {
                        for (var i = 0; i < ord.points.length; i++) {
                          self.toAddresses[i] = ord.points[i].address || "";
                          self.toCoordses[i] = ord.points[i].location || "";
                          self.toFullAddresses[i] = ord.points[i].fullAddress || "";
                          self.times[i] = ord.points[i].stopTime || "";
                          self.cities[i] = ord.points[i].city || "";
                        }
                      }
                      self.fromCity  = ord.fromCity;
                      self.toCity = ord.toCity;

                      self.distance = ord.distance;
                      self.price = ord.price;
                      self.comment = ord.comment;

    };

  };
  
  return clDriverOffer;
  
});
