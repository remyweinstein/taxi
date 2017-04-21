/* global User, Zones, Conn, Funcs */
/*
 * @param {type} Uries, Funcs, Storage, Notify
 * @returns {connectionL#5.clConn}
 */
define(['Uries', 'Funcs', 'Storage', 'Notify'], function(Uries, Funcs, Storage, Notify) {
  var timerReconnectionWebSocket,
      socket,
      global_id = null;
  
  function viewLog(text) {
    console.log(text);
  }
  
  function getFnName(fn) {
    var f = typeof fn === 'function',
        s = f && ((fn.name && ['', fn.name]) || fn.toString().match(/function ([^\(]+)/));
      
    return (!f && 'not a function') || (s && s[1] || 'anonymous');
  }
  
  function onMessage(data) {
    var response = JSON.parse(data);
    
    viewLog(response);
    Notify.listnerNotify(response);
    
    if (response.error) {
      if (response.error[0] === "Token not found.") {
        if (!User.initialization_token) {
          User.token = null;
          User.initToken();
          MayLoading = false;
        }
        
        return;
      }
    }
    
    for (var i = 0; i < Conn.callback.length; i++) {
      if (typeof Conn.callback[i] === 'function' && response.id === getFnName(Conn.callback[i])) {
        Conn.callback[i](response);
      }
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
  
  function getNotifications() {
    Conn.sendMessage("get-notifications");
  }
  
  function readNotification(id) {
    params.notificationId = id;
    Conn.sendMessage("read-notification", params);
  }
  
  function removeNotification(id) {
    params.notificationId = id;
    Conn.sendMessage("delete-notification", params);
  }
  
  function inviteSosAgent(phone) {
    params.agentPhone = phone;
    Conn.sendMessage("invite-sos-agent", params);
  }
  
  function acceptInviteSosAgent(id) {
    params.notificationId = id;
    Conn.sendMessage("accept-invite-sos-agent", params);
  }
  
  function acceptInviteSosAgent(id) {
    params.notificationId = id;
    Conn.sendMessage("accept-invite-sos-agent", params);
  }
  
  function removeSosAgent(id) {
    params.agentId = id;
    Conn.sendMessage("remove-sos-agent", params);
  }
  
  function getSosAgents() {
    Conn.sendMessage("get-sos-agents");
  }
  
  function searchCity(city) {
    params.city = city;
    Conn.sendMessage("get-city", params);
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
  
  function setActiveAuto(data) {
    params.car = {};
    params.car.id = data;
    params.car.isActive = 1;
    Conn.sendMessage("post-car", params);
  }
  
  function updateAuto(data) {
    params.car = data;
    Conn.sendMessage("post-car", params);
  }
  
  function getProfile() {
    Conn.sendMessage("get-profile");
  }

  function deleteOrderById(id) {
    params.orderId = id;
    Conn.sendMessage("delete-order", params);
  }
  
  function startGetOrdersById(id) {
    params.filter = {};
    params.filter.orderId = id;
    Conn.sendMessage("get-orders", params);
  }
  
  function startGetOrders(type) {
    var filters = Storage.getActiveFilters() ? JSON.parse(Storage.getActiveFilters()) : {},
        orders  = Storage.getActiveSortFilters() ? JSON.parse(Storage.getActiveSortFilters()) : {};

    params.filter = {};
    params = Funcs.extendObj(filters, params);
    params = Funcs.extendObj(orders, params);
    params.filter.type = type;
    params.filter.fromCity = User.city;
    Conn.sendMessage("get-orders", params);
  }

  function stopGetOrders() {
    Conn.sendMessage("stop-get-orders");
  }

  function startGetOffers(type) {
    var filters = Storage.getActiveFilters() ? JSON.parse(Storage.getActiveFilters()) : {},
        orders  = Storage.getActiveSortFilters() ? JSON.parse(Storage.getActiveSortFilters()) : {},
        typer   = type || "taxi";
    
    params.filter = {};
    params = Funcs.extendObj(filters, params);
    params = Funcs.extendObj(orders, params);
    params.filter.type = typer;
    //if (type !== "intercity") {
      params.filter.fromCity = User.city;
    //}
    Conn.sendMessage("get-offers", params);
  }

  function stopGetOffers() {
    Conn.sendMessage("stop-get-offers");
  }

  function agreeOrder(data) {
    params.offer             = {};
    params.offer.order       = data.id;
    params.offer.travelTime  = data.travelTime;
    params.offer.price       = data.price;
    Conn.sendMessage("post-offer", params);
  }
  
  function disagreeOrder(id) {
    params.orderId = id;
    Conn.sendMessage("delete-offer", params);
  }

  function agreeOffer(data) {
    params.offerId            = data.id;
    params.order              = {};
    
    if (data.fromCity) {
      params.order.fromCity     = data.fromCity;
    }
    
    if (data.fromLocation) {
      params.order.fromLocation = data.fromLocation;
    }
    
    if (data.fromAddress) {
      params.order.fromAddress  = data.fromAddress;
    }
    
    if (data.toCity) {
      params.order.toCity       = data.toCity;
    }
    
    if (data.toLocation) {
      params.order.toLocation   = data.toLocation;
    }
    
    if (data.toAddress) {
      params.order.toAddress    = data.toAddress;
    }
    
    if (data.price) {
      params.order.price        = data.price;
    }

    Conn.sendMessage("post-order", params);
  }

  function disagreeOffer(data) {
    //params.offerId = id;
    params.orderId = data;
    Conn.sendMessage("delete-order", params);
  }

  function createOrder(data) {
    params.order = data;
    Conn.sendMessage("post-order", params);
  }
  
  function startChatMessages(data) {
    params = data;
    Conn.sendMessage("get-messages", params);
  }

  function stopChatMessages() {
    Conn.sendMessage("stop-get-messages");
  }
  
  function sendMessageChat(data) {
    params = data;
    Conn.sendMessage('post-message', params);
  }
  
  function createOffer(data) {
    params.offer = data;
    Conn.sendMessage("post-offer", params);
  }

  function requestMyOrders() {
    params.filter      = {};
    params.filter.type = "taxi";
    params.filter.my   = 1;
    Conn.sendMessage("get-orders", params);
  }
  
  function requestMyCargoOrders() {
    params.filter      = {};
    params.filter.type = "trucking";
    params.filter.my   = 1;
    Conn.sendMessage("get-orders", params);
  }
  
  function requestMyIntercityOrders() {
    params.filter      = {};
    params.filter.type = "intercity";
    params.filter.my   = 1;
    Conn.sendMessage("get-orders", params);
  }
  
  function requestMyTourismOrders() {
    params.filter      = {};
    params.filter.type = "tourism";
    params.filter.my   = 1;
    Conn.sendMessage("get-orders", params);
  }
  
  function getSettings() {
    Conn.sendMessage("get-settings");
  }
  
  function setSettings(data) {
    params.settings = [];
    params.settings.push(data);
    Conn.sendMessage("post-settings", params);
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
    params.filter      = {};
    params.filter.type = "taxi";
    params.filter.my   = 1;
    Conn.sendMessage("get-offers", params);
  }
  
  function requestMyCargoOffers() {
    params.filter      = {};
    params.filter.type = "trucking";
    params.filter.my   = 1;
    Conn.sendMessage("get-offers", params);
  }
  
  function requestMyIntercityOffers() {
    params.filter      = {};
    params.filter.type = "intercity";
    params.filter.my   = 1;
    Conn.sendMessage("get-offers", params);
  }
  
  function requestMyTourismOffers() {
    params.filter      = {};
    params.filter.type = "intercity";
    params.filter.my   = 1;
    Conn.sendMessage("get-offers", params);
  }
  
  function requestSos() {
    Conn.sendMessage("sos");
  }
  
  function startOffersByOrder(id) {
    params.filter         = {};
    params.filter.orderId = id;
    //params.filter.type    = "taxi";
    Conn.sendMessage("get-offers", params);
  }
  
  function stopOffersByOrder() {
    Conn.sendMessage("stop-get-offers", params);
  }
  
  function startOrdersByOffer(id) {
    params.filter         = {};
    params.filter.offerId = id;
    //params.filter.type    = "taxi";
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
  
  function checkPin(pin) {
    params.pin = pin;
    Conn.sendMessage("check-pin", params);
  }
  
  function changePin(data) {
    params = data;
    Conn.sendMessage("post-profile", params);
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
  
  function registerUser(data) {
    params = data;
    Conn.sendMessage("register", params);
  }
  
  function confirmSms(data) {
    params = data;
    Conn.sendMessage("confirm", params);
  }
  
  function startOffer(id) {
    params.offerId = id;
    Conn.sendMessage("start-order", params);
  }
  
  function getModels(brand) {
    params.brand = brand;
    Conn.sendMessage("get-models", params);
  }
  
  function getAuto() {
    Conn.sendMessage("get-cars");
  }
  
  function addZones(data) {
    params.zone = data;
    Conn.sendMessage("post-zone", params);
  }
  
  function ulogin(data) {
    params = data;
    Conn.sendMessage("ulogin", params);
  }
  
  var clConn = function () {
    var self = this;
    
    function addCbFunc(cb) {
      var sov = false,
          name = getFnName(cb);
        
      for (var i = 0; i < self.callback.length; i++) {
        if (getFnName(self.callback[i]) === name) {
          sov = true;
          
          break;
        }
      }
      if (!sov) {
        self.callback.push(cb);
        global_id = name;
      }
    }
    
    this.is_connect    = false;
    this.is_connecting = false;
    this.alreadyStart  = false;
    this.callback      = [];
    
    this.clearCb = function(name) {
      for (var i = 0; i < self.callback.length; i++) {
        if (typeof self.callback[i] === 'function') {
          if (getFnName(self.callback[i]) === name) {
            self.callback.splice(i, 1);
            break;
          }
        }
      }
    };
    
    this.request = function(func, data, cb) {
      params = {};
      
      if (cb) {
        addCbFunc(cb);
      } else {
        global_id = null;
      }

      switch (func) {
        case "ulogin":
          ulogin(data);
          break;
        case "getNotifications":
          getNotifications();
          break;
        case "readNotification":
          readNotification(data);
          break;
        case "inviteSosAgent":
          inviteSosAgent(data);
          break;
        case "removeNotification":
          removeNotification(data);
          break;
        case "acceptInviteSosAgent":
          acceptInviteSosAgent(data);
          break;
        case "removeSosAgent":
          removeSosAgent(data);
          break;
        case "getSosAgents":
          getSosAgents();
          break;
        case "searchCity":
          searchCity(data);
          break;
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
        case "setActiveAuto":
          setActiveAuto(data);
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
        case "startGetOrdersById":
          startGetOrdersById(data);
          break;
        case "startGetOrders":
          startGetOrders('taxi');
          break;
        case "startGetOrdersCargo":
          startGetOrders('trucking');
          break;
        case "startGetIntercityOrders":
          startGetOrders('intercity');
          break;
        case "startGetTourismOrders":
          startGetOrders('tourism');
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
        case "getSettings":
          getSettings();
          break;
        case "setSettings":
          setSettings(data);
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
        case "requestMyIntercityOrders":
          requestMyIntercityOrders();
          break;
        case "requestMyTourismOrders":
          requestMyTourismOrders();
          break;
        case "requestMyCargoOrders":
          requestMyCargoOrders();
          break;
        case "requestMyOffers":
          requestMyOffers();
          break;
        case "requestMyCargoOffers":
          requestMyCargoOffers();
          break;
        case "requestMyIntercityOffers":
          requestMyIntercityOffers();
          break;
        case "requestMyTourismOffers":
          requestMyTourismOffers();
          break;
        case "startGetAgents":
          startGetAgents(data);
          break;
        case "requestSos":
          requestSos();
          break;
        case "stopGetAgents":
          stopGetAgents();
          break;
        case "requestProfile":
          requestProfile();
          break;
        case "checkPin":
          checkPin(data);
          break;
        case "changePin":
          changePin(data);
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
        case "startOffer":
          startOffer(data);
          break;
      }
    };
          
    this.start = function (callback) {
      socket = new WebSocket("wss://" + Uries.server_uri + ":4443");
      self.is_connecting = true;
      
      socket.onopen = function () {
        if (self.alreadyStart) {
          self.request('getProfile');
        }
        
        if (Storage.getPrevListOrders()) {
          Storage.clearPrevListOrders();
        }
        
        self.is_connect    = true;
        self.is_connecting = false;
        self.alreadyStart  = true;
        viewLog('Соединение установлено');
        timerReconnectionWebSocket = clearInterval(timerReconnectionWebSocket);
        callback();
      };

      socket.onerror = function (error) {
        self.is_connect    = false;
        self.is_connecting = false;
        viewLog('Ошибка: ' + error.message);
      };

      socket.onclose = function (event) {
        self.is_connect    = false;
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