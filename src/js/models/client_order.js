/* global User */

define(['Ajax'], function(Ajax) {
  
  var clClientOrder = function () {
    var self = this;

    this.id = null;
    this.bid_id = null;

    this.fromAddress = "";
    this.toAddress = "";
    this.toAddresses = [];
    this.fromCoords = "";
    this.toCoords = "";
    this.duration = 0;
    this.toCoordses = [];
    this.fromFullAddress = "";
    this.toFullAddress = "";
    this.toFullAddresses = [];
    this.times = [];
    this.toCities = [];
    
    this.length = 0;

    this.fromCity  = "" ;
    this.toCity = "";

    this.distance = 0;
    this.price = 0;
    this.comment = "";

    this.getByID = function (_id, callback) {
                  Ajax.request('GET', 'order', User.token, '&id=' + _id, '', function(response) {
                    if (response && response.ok) {
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

                      callback();
                    }
                  }, function() {});
    };

  };
  
  return clClientOrder;
  
});
