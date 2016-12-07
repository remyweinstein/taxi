function ClientOrder() {
  var self = this;

  this.id = null;
  this.bid_id = null;

  this.fromAddress = "";
  this.toAddress = "";
  this.toAddresses = [];
  this.fromCoords = "";
  this.toCoords = "";
  this.toCoordses = [];
  this.fromFullAddress = "";
  this.toFullAddress = "";
  this.toFullAddresses = [];
  this.time0 = 0;
  this.times = [];
  
  this.fromCity  = "" ;
  this.toCity = "";
  
  this.distance = 0;
  this.price = 0;
  this.comment = "";
  
  this.getByID = function (callback) {
                Ajax.request(server_uri, 'GET', 'order', User.token, '&id=' + self.id, '', function(response) {
                  //console.log(response);
                  if (response && response.ok) {
                    var ord = response.order;
                    
                    if(ord.bidId && ord.bidId > 0) {
                      self.bid_id = ord.bidId;
                    }
                    self.fromAddress = ord.fromAddress;
                    self.toAddress = ord.toAddress0;
                    self.fromCoords = ord.fromLocation;
                    self.toCoords = ord.toLocation0;
                    self.fromFullAddress = "";
                    self.toFullAddress = "";
                    
                    self.toAddresses = [];
                    self.toCoordses = [];
                    self.toFullAddresses = [];

                    self.fromCity  = ord.fromCity;
                    self.toCity = ord.toCity0;

                    self.distance = ord.distance;
                    self.price = ord.price;
                    self.comment = ord.comment;
    
                    callback();
                  }
                });
  };

}