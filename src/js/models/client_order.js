/* global User, Conn, MyOrder */

define(function() {
  
  function cbCreateOrder(response) {
    MyOrder.id = response.id;
    Conn.clearCb('cbCreateOrder');
    window.location.hash = '#client_map';
  }
  
  var clClientOrder = function () {
    var self = this;

    function cbgetOrderById(response) {
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
      Conn.clearCb('cbgetOrderById');
      
      if (self.bid_id) {
        localStorage.setItem('_current_id_bid', self.bid_id);
        //window.location.hash = "#client_go";
      } else {
        window.location.hash = '#client_map';
      }      
    }
    
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
      self.id = null;
      self.bid_id = null;

      self.fromAddress = null;
      self.toAddress = null;
      self.toAddresses = [];
      self.fromCoords = null;
      self.toCoords = null;
      self.duration = 0;
      self.toCoordses = [];
      self.fromFullAddress = null;
      self.toFullAddress = null;
      self.toFullAddresses = [];
      self.times = [];
      self.toCities = [];

      self.length = 0;

      self.fromCity  = null;
      self.toCity = null;

      self.distance = 0;
      self.price = 0;
      self.comment = null;
    };
    
    this.save = function (points) {

      var data = {};

      data.fromCity = User.city;
      data.fromAddress = self.fromAddress;
      data.fromLocation = self.fromCoords;
      data.toCity = User.city;
      data.toAddress = self.toAddress;
      data.toLocation = self.toCoords;
      data.duration = self.duration;
      //data.isIntercity = 0;
      data.price = self.price;
      data.comment = self.comment;
      data.minibus = 0;
      data.babyChair = 0;
      data.type = 'taxi';
      data.length = self.length;

      if (self.toAddresses.length > 0) {
        for (var i = 0; i < self.toAddresses.length; i++) {
          var time = self.times[i] ? self.times[i] : 0;
          
          data.points[i].address = self.toAddresses[i];
          data.points[i].location = self.toCoordses[i];
          data.points[i].stopTime = time;
          data.points[i].city = User.city;
          data.points[i].fullAddress = '';
        }
      }

      Conn.request('createOrder', data, cbCreateOrder);

    };
    this.callback = function () {
      
    };
    
    this.getByID = function (id) {
      Conn.request('getOrderById', id, cbgetOrderById);
      Conn.request('stopGetOrder');
    };

  };
  
  return clClientOrder;
  
});
