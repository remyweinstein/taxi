/* global User, Zones, MyOffer, MyOrder, Conn */
/*

 type = taxi
 type = isIntercity
 type = trucking
 type = tourism

 * @param {type} Uries
 * @returns {connectionL#5.clConn}
 */
define(['Uries'], function(Uries) {
  var timerReconnectionWebSocket,
      socket,
      global_id = null;
  
  function viewLog(text) {
    console.log(text);
  }
  
  function onMessage(data) {
    var response = JSON.parse(data);
    
    if (!response.error) {
      viewLog(response);
      for (var i = 0; i < Conn.callback.length; i++) {
        if (typeof Conn.callback[i] === 'function' && response.id === Conn.callback[i].name) {
          Conn.callback[i](response.result);
        }
      }
    } else {
      viewLog(response.error);
    }
  }
  
  function requestToken() {
    Conn.sendMessage("get-token");
  }
  
  function getOrderById(id) {
    params.orderId = id;
    Conn.sendMessage("get-order", params);
  }
  
  function stopGetOrder() {
    Conn.sendMessage("stop-get-order");
  }
  
  function getOfferById(id) {
    params.offerId = id;
    Conn.sendMessage("get-offer", params);
  }
  
  function requestFavorites() {
    Conn.sendMessage("get-favorites");
  }
  
  function deleteBlackList(id) {
    params.id = id;
    Conn.sendMessage("delete-black-list");
  }
  
  function deleteFavorites(id) {
    params.id = id;
    Conn.sendMessage("delete-favorites");
  }
  
  function addBlackList(id) {
    params.id = id;
    Conn.sendMessage("post-black-list");
  }
  
  function addFavorites(id) {
    params.id = id;
    Conn.sendMessage("post-favorites");
  }
  
  function deletePhoto() {
    Conn.sendMessage("post-clear-photo");
  }

  function updateProfile(data) {
    params.profile = data;
    Conn.sendMessage("post-profile", params);
  }
  
  function updateAuto(data) {
    params.profile = data;
    Conn.sendMessage("post-profile", params);
  }

  function getProfile() {
    Conn.sendMessage("get-profile");
  }

  function deleteOrderById(id) {
    params.orderId = id;
    Conn.sendMessage("delete-order", params);
  }

  function startGetOrders(type) {
    params.filter = {};
    params.filter.type = type;
    params.filter.fromCity = User.city;
    Conn.sendMessage("get-orders", params);
  }

  function stopGetOrders() {
    Conn.sendMessage("stop-get-orders");
  }

  function startGetOffers(add_filter) {
    params.filter = {};
    params.filter.type = "taxi";
    params.filter.fromCity = User.city;
    Conn.sendMessage("get-offers", params);
  }

  function stopGetOffers() {
    Conn.sendMessage("stop-get-offers");
  }

  function agreeOrder(id) {
    params.offer = {};
    params.offer.order = id;
    Conn.sendMessage("post-offer", params);
  }
  
  function disagreeOrder(id) {
    params.orderId = id;
    Conn.sendMessage("delete-offer", params);
  }

  function agreeOffer(id) {
    params.order = {};
    params.order.offer = id;
    Conn.sendMessage("post-order", params);
  }

  function disagreeOffer(id) {
    params.offerId = id;
    Conn.sendMessage("delete-order", params);
  }

  function createOrder(data) {
    params.order = data;
    Conn.sendMessage("post-order", params);
  }
  
  function startChatMessages(id) {
    params.orderId = id;
    Conn.sendMessage("get-messages", params);
  }

  function stopChatMessages() {
    Conn.sendMessage("stop-messages");
  }
  
  function sendMessageChat(data) {
    params = data;
    Conn.request('sendMessageChat', params);
  }
  
  function createOffer(data) {
    params.offer = data;
    Conn.sendMessage("post-offer", params);
  }

  function requestMyOrders() {
    params.filter = {};
    params.filter.type = "taxi";
    params.filter.my = 1;
    Conn.sendMessage("get-orders", params);
  }
  
  function approveOffer(id) {
    params.offerId = id;
    Conn.sendMessage("approve-offer", params);
  }

  function approveOrder(id) {
    params.orderId = id;
    Conn.sendMessage("approve-order", params);
  }

  function requestMyOffers() {
    params.filter = {};
    params.filter.type = "taxi";
    params.filter.my = 1;
    Conn.sendMessage("get-offers", params);
  }
  
  function startOffersByOrder(id) {
    params.filter = {};
    params.filter.orderId = id;
    params.filter.type = "taxi";
    Conn.sendMessage("get-offers", params);
  }
  
  function stopOffersByOrder() {
    Conn.sendMessage("stop-get-offers", params);
  }
  
  function startOrdersByOffer(id) {
    params.filter = {};
    params.filter.offerId = id;
    params.filter.type = "taxi";
    Conn.sendMessage("get-orders", params);
  }
  
  function stopOrdersByOffer() {
    Conn.sendMessage("stop-get-orders", params);
  }

  function startGetAgents(radius) {
    params.radius = radius;
    Conn.sendMessage("get-agents");
  }

  function stopGetAgents() {
    Conn.sendMessage("stop-get-agents");
  }

  function requestProfile() {
    Conn.sendMessage("get-profile");
  }

  function requestZones() {
    Conn.sendMessage("get-zones");
  }
  
  function deleteZones(id) {
    params.id = id;
    Conn.sendMessage("delete-zone", params);
  }
  
  function arrivedDriver(id) {
    params.orderId = id;
    Conn.sendMessage("arrived", params);
  }
  
  function finishOrder(id) {
    params.orderId = id;
    Conn.sendMessage("finish", params);
  }
  
  function inCarClient(id) {
    params.orderId = id;
    Conn.sendMessage("in-car", params);
  }
  
  function cancelOrder(id) {
    params.orderId = id;
    Conn.sendMessage("cancel-order", params);
  }

  function cancelOffer(id) {
    params.offerId = id;
    Conn.sendMessage("cancel-offer", params);
  }

  function updateUserLocation() {
    params.location = User.lat + ',' + User.lng;
    Conn.sendMessage("post-location", params);
  }
  
  function registerUser(phone) {
    params.phone = '8' + phone;
    Conn.sendMessage("register", params);
  }
  
  function confirmSms(data) {
    params = data;
    Conn.sendMessage("confirm", params);
  }
  
  function getModels(brand) {
    params.brand = brand;
    Conn.sendMessage("get-models", params);
  }
  
  function getAuto() {
    Conn.sendMessage("get-auto");
  }
  
  function addZones(data) {
    params.zone = data;
    Conn.sendMessage("post-zone", params);
  }
  
  
  var clConn = function () {
    var self = this;
    
    function addCbFunc(cb) {
      var sov = false;
      
      for (var i = 0; i < self.callback.length; i++) {
        if (self.callback[i].name === cb.name) {
          sov = true;
          break;
        }
      }
      if (!sov) {
        self.callback.push(cb);
        global_id = cb.name;
      }
    }
    
    this.is_connect = false;
    this.is_connecting = false;
    this.callback = [];
    
    this.clearCb = function(name) {
      for (var i = 0; i < self.callback.length; i++) {
        if (typeof self.callback[i] === 'function') {
          if (self.callback[i].name === name) {
            self.callback.splice(i, 1);
            break;
          }
        }
      }
    };
    
    this.request = function(func, data, cb) {
      //var fn = window[func];
      
      params = {};
      
      if (cb) {
        addCbFunc(cb);
      } else {
        global_id = null;
      }
      
      //if (typeof fn === "function") {
      //  fn(data);
      //}

      
      switch (func) {
        case "requestFavorites":
          requestFavorites();
          break;
        case "addFavorites":
          addFavorites(data);
          break;
        case "deleteFavorites":
          deleteFavorites(data);
          break;
        case "addBlackList":
          addBlackList(data);
          break;
        case "deleteBlackList":
          deleteBlackList(data);
          break;
        case "cancelOrder":
          cancelOrder(data);
          break;
        case "getOrderById":
          getOrderById(data);
          break;
        case "stopGetOrder":
          stopGetOrder();
          break;
        case "getOfferById":
          getOfferById(data);
          break;
        case "sendMessageChat":
          sendMessageChat(data);
          break;
        case "startChatMessages":
          startChatMessages(data);
          break;
        case "stopChatMessages":
          stopChatMessages();
          break;
        case "getAuto":
          getAuto();
          break;
        case "getModels":
          getModels(data);
          break;
        case "updateAuto":
          updateAuto(data);
          break;
        case "addZones":
          addZones(data);
          break;
        case "requestToken":
          requestToken();
          break;          
        case "deletePhoto":
          deletePhoto();
          break;
        case "updateProfile":
          updateProfile(data);
          break;
        case "getProfile":
          getProfile();
          break;
        case "finishOrder":
          finishOrder(data);
          break;
        case "inCarClient":
          inCarClient(data);
          break;
        case "arrivedDriver":
          arrivedDriver(data);
          break;
        case "deleteOrderById":
          deleteOrderById(data);
          break;
        case "startGetOrders":
          startGetOrders('taxi');
          break;
        case "startGetIntercityOrders":
          startGetOrders('isIntercity');
          break;
        case "stopGetOrders":
          stopGetOrders();
          break;
        case "startGetOffers":
          startGetOffers(data);
          break;
        case "stopGetOffers":
          stopGetOffers();
          break;
        case "stopOffersByOrder":
          stopOffersByOrder(data);
          break;
        case "stopOrdersByOffer":
          stopOrdersByOffer(data);
          break;
        case "cancelOffer":
          cancelOffer(data);
          break;
        case "agreeOrder":
          agreeOrder(data);
          break;
        case "startOffersByOrder":
          startOffersByOrder(data);
          break;
        case "startOrdersByOffer":
          startOrdersByOffer(data);
          break;
        case "disagreeOrder":
          disagreeOrder(data);
          break;
        case "approveOffer":
          approveOffer(data);
          break;
        case "approveOrder":
          approveOrder(data);
          break;
        case "agreeOffer":
          agreeOffer(data);
          break;
        case "disagreeOffer":
          disagreeOffer(data);
          break;
        case "createOrder":
          createOrder(data);
          break;
        case "createOffer":
          createOffer(data);
          break;
        case "requestMyOrders":
          requestMyOrders();
          break;
        case "requestMyOffers":
          requestMyOffers();
          break;
        case "stopGetOrders":
          stopGetOrders();
          break;
        case "startGetAgents":
          startGetAgents(data);
          break;
        case "stopGetAgents":
          stopGetAgents();
          break;
        case "requestProfile":
          requestProfile();
          break;
        case "requestZones":
          requestZones();
          break;
        case "deleteZones":
          deleteZones(data);
          break;
        case "updateUserLocation":
          updateUserLocation();
          break;
        case "updateProfile":
          updateProfile(data);
          break;
        case "registerUser":
          registerUser(data);
          break;
        case "confirmSms":
          confirmSms(data);
          break;
      }
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
    
    this.sendMessage = function (method, params) {
      var req = {};
      
      req.method = method;
      req.id = global_id || method;
      req.params = params || {};
      req.params.token = User.token;
      
      viewLog(JSON.stringify(req));
      
      if (self.is_connect) {
        socket.send(JSON.stringify(req));
      }
    };

  };

  return clConn;
  
});