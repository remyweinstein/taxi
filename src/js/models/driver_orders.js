/* global average_speed, User */

define(['Dates'], function(Dates) {
  
  var clDriverOrders = function (order, Old_Orders) {
    var self = this;

    this.fromAddress    = null;
    this.deactived      = false;
    this.fromCity       = null;
    this.toAddress      = null;
    this.toCity         = null;
    this.toAddresses    = [];
    this.totimes        = [];
    this.toLocations    = [];
    this.stops          = 0;
    this.distance       = 0;
    this.weight         = null;
    this.volume         = null;
    this.type           = null;
    this.stevedores     = null;
    this.length         = 0;
    this.duration       = 0;
    this.name           = null;
    this.created        = null;
    this.order_in_offer = null;
    this.bids_length    = 0;
    this.photo          = null;
    this.price          = 0;
    this.travelTime     = 0;
    this.bidId          = 0;
    this.agentId        = null;
    this.agentBidId     = null;
    this.active_bid     = false;
    this.id             = null;
    this.zone           = null;
    this.comment        = null;

    this.constructor = function (callback) {
      if (order.points) {
        for (var i = 0; i < order.points.length; i++) {
          self.toAddresses.push(order.points[i].address);
          self.toLocations.push(order.points[i].location);
          //self.fromCities.push(order.points[i].city);
          //self.fromCities.push(order.points[i].city);
          self.totimes.push(order.points[i].stopTime);  
        }
      }

      var travelTime = ((self.distance / average_speed) * 60).toFixed(0);
      
      if (travelTime < 5) {
        travelTime = 5;
      } else {
        travelTime = 5 * Math.ceil( travelTime / 5 );
      }
      
      self.id          = order.id;
      self.deactived   = Old_Orders && Old_Orders !== "undefined" ? Old_Orders.deactived : false;
      self.price       = Old_Orders && Old_Orders !== "undefined" ? Old_Orders.price : Math.round(order.price);
      self.distance    = order.agent.distance ? order.agent.distance.toFixed(1) : 0;
      self.weight      = order.weight;
      self.volume      = order.volume;
      self.type        = order.type;
      self.stevedores  = order.stevedores;      
      self.travelTime  = Old_Orders && Old_Orders !== "undefined" ? Old_Orders.travelTime : travelTime;
      self.stops       = self.toAddresses.length || 0;
      self.length      = order.length || 0;
      self.duration    = order.duration || 0;
      self.name        = order.agent.name || User.default_name;
      self.created     = Dates.datetimeForPeople(order.created);
      self.photo       = order.agent.photo || User.default_avatar;
      self.bidId       = order.bidId;
      self.fromAddress = order.fromAddress;
      self.fromCity    = order.fromCity;
      self.toAddress   = order.toAddress;
      self.toCity      = order.toCity;
      self.comment     = order.comment;
      self.zone        = order.zone;

      if (order.bids) {
        if (order.bids[0]) {
          self.active_bid = true;
          if (order.bids[0].order) {
            self.order_in_offer = order.bids[0].order.id;
          }
        }
      }

      callback(self);
      };

  };
  
  return clDriverOrders;
  
});
