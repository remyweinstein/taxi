/* global User, Zones, MyOffer */

define(['Uries', 'GetPositions', 'Lists'], function(Uries, GetPositions, Lists) {
  var timerReconnectionWebSocket,
      socket;
  
  function viewLog(text) {
    console.log(text);
  }
  
  function onMessage(data) {
    var response = JSON.parse(data);
    var id = response.id;

    viewLog(response);
    
    switch (id) {
      
      case "get-zones":
      Zones.initSafeWin(response.result);
      break;
      
      case "get-token":
      User.setNewToken(response.result);
      break;
      
      case "get-profile":
      User.setData(response.result);
      break;
      
      case "get-agents":
      GetPositions.getPositionDrivers(response.result);
      break;
      
      case "get-offers":
      Lists.allOffers(response.result);
      break;
      
      case "get-orders":
      Lists.allOrders(response.result);
      break;
      
      case "get-my-orders":
      Lists.myOrders(response.result);
      Conn.stopGetOrders();
      break;
      
      case "get-my-offers":
      Lists.myOffers(response.result);
      Conn.stopGetOffers();
      break;
      
      case "create-offer":
        MyOffer.id = response.result.id;
          window.location.hash = '#driver_city';
      break;
      
      default:
      viewLog('id ответа не опознан...');
    }
    
  }
  
  var clConn = function () {
    var self = this,
        params = {};
    
    this.is_connect = false;
    this.is_connecting = false;
    
    this.requestToken = function () {
      self.sendMessage("get-token");
    };
    
    this.deleteOrderById = function (id) {
      params = {};
      params.id = id;
      self.sendMessage("delete-order", params);
    };
    
    this.startGetOrders = function () {
      params = {};
      params.filter = {};
      params.filter.isIntercity = 0;
      params.filter.fromCity = User.city;
      self.sendMessage("get-orders", params);
    };
    
    this.stopGetOrders = function () {
      self.sendMessage("stop-get-orders");
    };
    
    this.startGetOffers = function (add_filter) {
      params = {};
      params.filter = {};
      params.filter.isIntercity = 0;
      params.filter.fromCity = User.city;
      self.sendMessage("get-offers", params);
    };
    
    this.stopGetOffers = function () {
      self.sendMessage("stop-get-offers");
    };
    
    this.approveOrder = function (id) {
      params = {};
      params.order = {};
      params.order.offer = id;
      self.sendMessage("post-order", params, "approve-offer");
    };

    this.approveOffer = function (id) {
      params = {};
      params.offer = {};
      params.offer.order = id;
      self.sendMessage("post-offer", params, "approve-order");
    };

    this.createOrder = function (data) {
      params = {};
      params.order = data;
      self.sendMessage("post-order", params, "create-order");
    };
    
    this.createOffer = function (data) {
      params = {};
      params.offer = data;
      self.sendMessage("post-offer", params, "create-offer");
    };
    
    this.createBidOrder = function (id) {
      params = {};
      params.offer = {};
      params.offer.order = id;
      self.sendMessage("post-offer", params, "bid-order");
    };
    
    this.createBidOffer = function (id) {
      params = {};
      params.order = {};
      params.order.offer = id;
      self.sendMessage("post-order", params, "bid-offer");
    };
    
    this.requestMyOrders = function () {
      params = {};
      params.filter = {};
      params.filter.isIntercity = 0;
      params.filter.my = 1;
      self.sendMessage("get-orders", params, "get-my-orders");
    };
    
    this.requestMyOffers = function () {
      params = {};
      params.filter = {};
      params.filter.isIntercity = 0;
      params.filter.my = 1;
      self.sendMessage("get-offers", params, "get-my-offers");
    };
    
    this.stopGetOrders = function () {
      self.sendMessage("stop-get-orders");
    };
    
    this.startGetAgents = function (radius) {
      params = {};
      params.radius = radius;
      self.sendMessage("get-agents");
    };
    
    this.stopGetAgents = function () {
      self.sendMessage("stop-get-agents");
    };
    
    this.requestProfile = function () {
      self.sendMessage("get-profile");
    };
    
    this.requestZones = function () {
      self.sendMessage("get-zones");
    };
    
    this.updateUserLocation = function () {
      params = {};
      params.location = User.lat + ',' + User.lng;
      self.sendMessage("post-location", params);
    };
    
    this.updateProfile = function (data) {
      params = {};
      params.profile = data;
      self.sendMessage("post-profile", params);
    };
      
    this.start = function (callback) {
      socket = new WebSocket("wss://" + Uries.server_uri + ":4443");
      self.is_connecting = true;
      
      socket.onopen = function () {
        self.is_connect = true;
        self.is_connecting = false;
        viewLog('Соединение установлено');
        clearInterval(timerReconnectionWebSocket);
        callback();
      };

      socket.onerror = function (error) {
        self.is_connect = false;
        self.is_connecting = false;
        viewLog('Ошибка: ' + error.message);
      };

      socket.onclose = function (event) {
        self.is_connect = false;
        self.is_connecting = false;
        timerReconnectionWebSocket = setTimeout(self.start, 2000);
        if (event.wasClean) {
          viewLog('Соединение закрыто чисто, Код: ' + event.code);
        } else {
          viewLog('Обрыв соединения, Код: ' + event.code);
        }
      };

      socket.onmessage = function(event) {
        onMessage(event.data);
      };
    };
    
    this.sendMessage = function (method, params, id) {
      var req = {};
      
      req.method = method;
      req.id = id ? id : method;
      req.params = params ? params : {};
      req.params.token = User.token;
      
      console.log(JSON.stringify(req));
      
      if (self.is_connect) {
        socket.send(JSON.stringify(req));
      }
    };

  };

  return clConn;
  
});