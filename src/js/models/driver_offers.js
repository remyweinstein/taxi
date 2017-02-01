/* global User */

define(['Dates', 'Ajax'], function(Dates, Ajax) {
  
  var clDriverOffers = function () {
    var self = this,
        fromAddress,
        toAddress,
        toAddresses = [],
        totimes = [],
        toLocations = [],
        stops = 0,
        distance,
        length,
        duration,
        name,
        created,
        bids_length,
        photo,
        price,
        travelTime,
        bidId,
        agentId,
        agentBidId,
        active_bid = false,
        id,
        comment;
      
    this.myOffers = [];
    this.listOffers = [];
    this.idOffer = null;

    this.getMyOffers = function (callback) {
                  self.myOffers = [];
                  
                  Ajax.request('GET', 'orders', User.token, '&filter[type]=offer&my=1', '', function(response) {
                    if (response && response.ok) {
                      self.myOffers = response.orders;
                      callback();
                    }
                  }, Ajax.error);
                };
    this.getAllOffers = function (add_filter, callback) {
                  self.listOffers = [];
                  
                  Ajax.request('GET', 'orders', User.token, '&filter[type]=offer&filter[isIntercity]=0&filter[fromCity]=' + User.city + add_filter, '', function(response) {
                    if (response && response.ok) {
                      self.listOffers = response.orders;
                      callback();
                    }
                  }, Ajax.error);
                };
    this.getOneOffer = function (id, callback) {
                  self.idOffer = null;
                  
                  Ajax.request('GET', 'order', User.token, '&filter[type]=offer&id=' + id, '', function(response) {
                    if (response && response.ok) {
                      self.idOffer = response.orders;
                      callback();
                    }
                  }, Ajax.error);
                };

  };
  
  return clDriverOffers;
  
});
