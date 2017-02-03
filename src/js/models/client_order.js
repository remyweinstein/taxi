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
    
    this.clear = function () {
      self.id = null;
      self.bid_id = null;

      self.fromAddress = "";
      self.toAddress = "";
      self.toAddresses = [];
      self.fromCoords = "";
      self.toCoords = "";
      self.duration = 0;
      self.toCoordses = [];
      self.fromFullAddress = "";
      self.toFullAddress = "";
      self.toFullAddresses = [];
      self.times = [];
      self.toCities = [];

      self.length = 0;

      self.fromCity  = "" ;
      self.toCity = "";

      self.distance = 0;
      self.price = 0;
      self.comment = "";
    };
    
    this.save = function (points, callback) {

      var data = new FormData();

      data.append('fromCity', User.city);
      data.append('fromAddress', self.fromAddress);
      data.append('fromLocation', self.fromCoords);
      data.append('toCity', User.city);
      data.append('toAddress', self.toAddress);
      data.append('toLocation', self.toCoords);
      data.append('duration', self.duration);
      data.append('isIntercity', 0);
      data.append('price', self.price);
      data.append('comment', self.comment);
      data.append('minibus', 0);
      data.append('babyChair', 0);
      data.append('length', self.length);

      if (self.toAddresses.length > 0) {
        for (var i = 0; i < self.toAddresses.length; i++) {
          var time = self.times[i] ? self.times[i] : 0;
          
          data.append('points[' + i + '][address]', self.toAddresses[i]);
          data.append('points[' + i + '][location]', self.toCoordses[i]);
          data.append('points[' + i + '][stopTime]', time);
          data.append('points[' + i + '][city]', User.city);
          data.append('points[' + i + '][fullAddress]', '');
        }
      }

      Ajax.request('POST', 'order', User.token, '', data, function(response) {
        callback(response);
      }, function() {});
    };
    
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
