define(function() {
  
  var clDriverOrders = function (order, Old_Orders) {
    var self = this;

    this.fromAddress;
    this.toAddress;
    this.toAddresses = [];
    this.totimes = [];
    this.toLocations = [];
    this.stops = 0;
    this.distance2;
    this.distance;
    this.name;
    this.created;
    this.photo;
    this.price;
    this.travelTime;
    this.bidId;
    this.agentId;
    this.agentBidId;
    this.active_bid = false;
    this.id;
    this.comment;

    this.constructor = function (callback) {
                  for (var i = 0; i < order.points.length; i++) {
                    self.toAddresses.push(order.points[i].address);
                    self.toLocations.push(order.points[i].location);
                    self.totimes.push(order.points[i].stopTime);  
                  }

                  self.id = order.id;
                  self.price = Old_Orders && Old_Orders !== "undefined" ? Old_Orders.price : Math.round(order.price);
                  var travelTime = (order.agent.distance / average_speed).toFixed(0);
                    if (travelTime < 5) {
                      travelTime = 5;
                    } else {
                      travelTime = 5 * Math.ceil( travelTime / 5 );
                    }

                  self.travelTime = Old_Orders && Old_Orders !== "undefined" ? Old_Orders.travelTime : travelTime;
                  self.stops = self.toAddresses.length ? self.toAddresses.length : 0;
                  self.distance2 = order.agent.distance ? order.agent.distance.toFixed(1) : 0;
                  self.distance = order.distance ? order.distance : 0;
                  self.name = order.agent.name ? order.agent.name : User.default_name;
                  self.created = Dates.datetimeForPeople(order.created, 'LEFT_TIME_OR_DATE');
                  self.photo = order.agent.photo ? order.agent.photo : User.default_avatar;
                  self.bidId = order.bidId;
                  self.fromAddress = order.fromAddress;
                  self.toAddress = order.toAddress;
                  self.comment = order.comment;

                  for (var y = 0; y < order.bids.length; y++) {
                    var agid = order.bids[y].agentId;                  
                    var a = order.bids[y].id;

                    if (agid === User.id) {
                      self.agentId = agid;
                      self.agentBidId = a;
                      //self.price = Math.round(order.bids[y].price);
                      self.active_bid = true;
                      break;
                    }
                  }

                  callback(self);
                };

  };
  
  return clDriverOrders;
  
});
