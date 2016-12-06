function ClientOrder() {
  var self = this;

  this.id = null;
  this.bid_id = null;

  this.fromAddress = "";
  this.toAddress = "";
  this.toAddress1 = "";
  this.toAddress2 = "";
  this.toAddress3 = "";
  this.fromCoords = "";
  this.toCoords = "";
  this.toCoords1 = "";
  this.toCoords2 = "";
  this.toCoords3 = "";
  this.fromFullAddress = "";
  this.toFullAddress = "";
  this.toFullAddress1 = "";
  this.toFullAddress2 = "";
  this.toFullAddress3 = "";
  this.time0 = 0;
  this.time1 = 0;
  this.time2 = 0;
  this.time3 = 0;
  
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
                    self.toAddress1 = ord.toAddress1;
                    self.toAddress2 = ord.toAddress2;
                    self.toAddress3 = ord.toAddress3;
                    self.fromCoords = ord.fromLocation;
                    self.toCoords = ord.toLocation0;
                    self.toCoords1 = ord.toLocation1;
                    self.toCoords2 = ord.toLocation2;
                    self.toCoords3 = ord.toLocation3;
                    self.fromFullAddress = "";
                    self.toFullAddress = "";
                    self.toFullAddress1 = "";
                    self.toFullAddress2 = "";
                    self.toFullAddress3 = "";

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