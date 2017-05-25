/* global User, Zones, Conn, Funcs, currentRoute, HideForms */
/*
 * @param {type} Uries, Funcs, Storage, Notify
 * @returns {connectionL#5.clConn}
 */
define(['Uries', 'Funcs', 'Storage', 'Notify', 'HideForms'], function(Uries, Funcs, Storage, Notify, HideForms) {
  var timerReconnectionWebSocket,
      socket,
      global_cb = null;
  
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
      
      if (response.error[0] === "Token not found." || response.error === "Missing required parameters: token") {
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
  
  
  var clConn = function () {
    var self = this;
    
    function addCbFunc(cb) {
      if (!cb) {
        return null;
      }
      
      var sovp = false,
          name = getFnName(cb);
        
      for (var i = 0; i < self.callback.length; i++) {
        if (getFnName(self.callback[i]) === name) {
          sovp = true;
          break;
        }
      }
      
      if (!sovp) {
        self.callback.push(cb);
      }
      
      return name;      
    }
    
    this.is_connect    = false;
    this.is_connecting = false;
    this.alreadyStart  = false;
    this.callback      = [];
    
    this.clearCb = function(name) {
      for (var i = 0; i < self.callback.length; i++) {
        if (typeof self.callback[i] === 'function' && getFnName(self.callback[i]) === name) {
          self.callback.splice(i, 1);
          return;
        }
      }
    };
    
    this.request = function(func, data, cb) {
      var method = false, 
          params = {};
      
      if (User.initialization_token) {
        return;
      }
      
      global_cb = addCbFunc(cb);
      
      var funcs = {
        "ulogin": function () {
          params = data;
          method = "ulogin";
        },
        
        "activateTrackZone": function () {
          params = data;
          method = "track-zones";
        },
        
        "deactivateTrackZone": function () {
          params = data;
          method = "track-zones";
        },
        
        "getNotifications": function () {
          method = "get-notifications";
        },
        
        "readNotification": function () {
          params.notificationId = data;
          method = "read-notification";
        },
        
        "inviteSosAgent": function () {
          params.agentPhone = data;
          method = "invite-sos-agent";
        },
        
        "removeNotification": function () {
          params.notificationId = data;
          method = "delete-notification";
        },
        
        "acceptInviteSosAgent": function () {
          params.notificationId = data;
          method = "accept-invite-sos-agent";
        },
        
        "removeSosAgent": function () {
          params.agentId = data;
          method = "remove-sos-agent";
        },
        
        "getSosAgentsById": function () {
          params.agentId = data;
          method = "get-sos-agents";
        },
        
        "getSosAgents": function () {
          method = "get-sos-agents";
        },
        
        "stopGetSosAgents": function () {
          method = "stop-get-sos-agents";
        },
        
        "searchCity": function () {
          params.city = data;
          method = "get-city";
        },
        
        "requestFavorites": function () {
          method = "get-favorites";
        },
        
        "addFavorites": function () {
          params.id = data;
          method = "post-favorites";
        },
        
        "deleteFavorites": function () {
          params.id = data;
          method = "delete-favorites";
        },
        
        "transferOrder": function () {
          params.orderId = data.orderId;
          params.toAgentId = data.toAgentId;
          method = "transfer-order";
        },
        
        "addBlackList": function () {
          params.id = data;
          method = "post-black-list";
        },
        
        "deleteBlackList": function () {
          params.id = data;
          method = "delete-black-list";
        },
        
        "cancelOrder": function () {
          params.orderId = data;
          method = "cancel-order";
        },
        
        "getOrderById": function () {
          params.orderId = data;
          method = "get-order";
        },
        
        "stopGetOrder": function () {
          method = "stop-get-order";
        },
        
        "getOfferById": function () {
          params.offerId = data;
          method = "get-offer";
        },
        
        "getOfferByHash": function () {
          params.offerId = data.id;
          params.hash = data.hash;
          method = "get-offer";
        },
        
        "sendMessageChat": function () {
          params = data;
          method = "post-message";
        },
        
        "startChatMessages": function () {
          params = data;
          method = "get-messages";
        },
        
        "stopChatMessages": function () {
          method = "stop-get-messages";
        },
        
        "getAuto": function () {
          method = "get-cars";
        },
        
        "getModels": function () {
          params.brand = data;
          method = "get-models";
        },
        
        "updateAuto": function () {
          params.car = data;
          method = "post-car";
        },
        "deleteAuto": function () {
          params.id = data;
          method = "delete-car";
        },
        
        "setActiveAuto": function () {
          params.car = {};
          params.car.id = data;
          params.car.isActive = 1;
          method = "post-car";
        },
        
        "addZones": function () {
          params.zone = data;
          method = "post-zone";
        },
        
        "requestToken": function () {
          method = "get-token";
        },
        
        "deletePhoto": function () {
          method = "post-clear-photo";
        },
        
        "updateProfile": function () {
          params.profile = data;
          method = "post-profile";
        },
        
        "addOrderToFav": function () {
          params.orderId = data;
          params.isFavorite = true;    
          method = "post-order-is-favorite";
        },
        
        "addOrderFromFav": function () {
          params.orderId = data;
          params.isFavorite = false;    
          method = "post-order-is-favorite";
        },
        
        "getProfile": function () {
          method = "get-profile";
        },
        
        "finishOrder": function () {
          params.orderId = data;
          method = "finish";
        },
        
        "inCarClient": function () {
          params.orderId = data;
          method = "in-car";
        },
        
        "transferedOrder": function () {
          params.orderId = data;
          params.transferred = true;
          method = "post-order-transferred";
        },
        
        "arrivedDriver": function () {
          params.orderId = data;
          method = "arrived";
        },
        
        "deleteOrderById": function () {
          params.orderId = data;
          method = "delete-order";
        },
        
        "startGetOrdersById": function () {
          params.filter = {};
          params.filter.orderId = data;
          method = "get-orders";
        },
        
        "startGetOrders": function () {
          var filters = Storage.getActiveFilters() ? JSON.parse(Storage.getActiveFilters()) : {},
              orders  = Storage.getActiveSortFilters() ? JSON.parse(Storage.getActiveSortFilters()) : {};

          params.filter = {};
          params = Funcs.extendObj(filters, params);
          params = Funcs.extendObj(orders, params);
          params.filter.type = 'taxi';
          params.filter.fromCity = User.city;
          method = "get-orders";
        },
        
        "startGetOrdersTrucking": function () {
          var filters = Storage.getActiveFilters() ? JSON.parse(Storage.getActiveFilters()) : {},
              orders  = Storage.getActiveSortFilters() ? JSON.parse(Storage.getActiveSortFilters()) : {};

          params.filter = {};
          params = Funcs.extendObj(filters, params);
          params = Funcs.extendObj(orders, params);
          params.filter.type = 'trucking';
          params.filter.fromCity = User.city;
          method = "get-orders";
        },
        
        "startGetIntercityOrders": function () {
          var filters = Storage.getActiveFilters() ? JSON.parse(Storage.getActiveFilters()) : {},
              orders  = Storage.getActiveSortFilters() ? JSON.parse(Storage.getActiveSortFilters()) : {};

          params.filter = {};
          params = Funcs.extendObj(filters, params);
          params = Funcs.extendObj(orders, params);
          params.filter.type = 'intercity';
          params.filter.fromCity = User.city;
          method = "get-orders";
        },
        
        "startGetTourismOrders": function () {
          var filters = Storage.getActiveFilters() ? JSON.parse(Storage.getActiveFilters()) : {},
              orders  = Storage.getActiveSortFilters() ? JSON.parse(Storage.getActiveSortFilters()) : {};

          params.filter = {};
          params = Funcs.extendObj(filters, params);
          params = Funcs.extendObj(orders, params);
          params.filter.type = 'tourism';
          params.filter.fromCity = User.city;
          method = "get-orders";
        },
        
        "stopGetOrders": function () {
          method = "stop-get-orders";
        },
        
        "startGetOffers": function () {
          var filters = Storage.getActiveFilters() ? JSON.parse(Storage.getActiveFilters()) : {},
              orders  = Storage.getActiveSortFilters() ? JSON.parse(Storage.getActiveSortFilters()) : {},
              typer   = data || "taxi";

          params.filter = {};
          params = Funcs.extendObj(filters, params);
          params = Funcs.extendObj(orders, params);
          params.filter.type = typer;
          params.filter.fromCity = User.city;
          method = "get-offers";
        },
        
        "stopGetOffers": function () {
          method = "stop-get-offers";
        },
        
        "stopOffersByOrder": function () {
          method = "stop-get-offers";
        },
        
        "stopOrdersByOffer": function () {
          method = "stop-get-orders";
        },
        
        "cancelOffer": function () {
          params.offerId = data;
          method = "cancel-offer";
        },
        
        "agreeOrder": function () {
          params.offer             = {};
          params.offer.order       = data.id;
          params.offer.travelTime  = data.travelTime;
          params.offer.price       = data.price;
          delete params.offer.zone;
          method = "post-offer";
        },
        
        "startOffersByOrder": function () {
          params.filter         = {};
          params.filter.orderId = data;
          method = "get-offers";
        },
        
        "startOrdersByOffer": function () {
          params.filter         = {};
          params.filter.offerId = data;
          method = "get-orders";
        },
        
        "disagreeOrder": function () {
          params.orderId = data;
          method = "delete-offer";
        },
        
        "deleteOffer": function () {
          params.offerId = data;
          method = "delete-offer";
        },
        
        "getSettings": function () {
          method = "get-settings";
        },
        
        "setSettings": function () {
          params.settings = [];
          params.settings.push(data);
          method = "post-settings";
        },
        
        "approveOffer": function () {
          params.offerId = data;
          method = "approve-offer";
        },
        
        "approveOrder": function () {
          params.orderId = data;
          method = "approve-order";
        },
        
        "agreeOffer": function () {
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
          if (data.seats) {
            params.order.seats        = data.seats;
          } else {
            params.order.seats        = 1;
          }

          method = "post-order";
        },
        
        "disagreeOffer": function () {
          params.orderId = data;
          method = "delete-order";
        },
        
        "createOrder": function () {
          params.order = data;
          delete params.order.zone;
          method = "post-order";
        },
        
        "createOffer": function () {
          params.offer = data;
          delete params.offer.zone;
          method = "post-offer";
        },
        
        "requestMyOrders": function () {
          params.filter      = {};
          params.filter.type = "taxi";
          params.filter.my   = 1;
          method = "get-orders";
        },
        
        "requestMyIntercityOrders": function () {
          params.filter      = {};
          params.filter.type = "intercity";
          params.filter.my   = 1;
          method = "get-orders";
        },
        
        "requestMyTourismOrders": function () {
          params.filter      = {};
          params.filter.type = "tourism";
          params.filter.my   = 1;
          method = "get-orders";
        },
        
        "requestMyTruckingOrders": function () {
          params.filter      = {};
          params.filter.type = "trucking";
          params.filter.my   = 1;
          method = "get-orders";
        },
        
        "requestMyOffers": function () {
          params.filter      = {};
          params.filter.type = "taxi";
          params.filter.my   = 1;
          method = "get-offers";
        },
        
        "requestMyTruckingOffers": function () {
          params.filter      = {};
          params.filter.type = "trucking";
          params.filter.my   = 1;
          method = "get-offers";
        },
        
        "requestMyIntercityOffers": function () {
          params.filter      = {};
          params.filter.type = "intercity";
          params.filter.my   = 1;
          method = "get-offers";
        },
        
        "requestMyTourismOffers": function () {
          params.filter      = {};
          params.filter.type = "intercity";
          params.filter.my   = 1;
          method = "get-offers";
        },
        
        "startGetAgents": function () {
          params.radius = data;
          method = "get-agents";
        },
        
        "requestSos": function () {
          method = "sos";
        },
        
        "stopGetAgents": function () {
          method = "stop-get-agents";
        },
        
        "requestProfile": function () {
          method = "get-profile";
        },
        
        "addRating": function () {
          params = data;
          method = "post-rating";
        },
        
        "checkPin": function () {
          params.pin = data;
          method = "check-pin";
        },
        
        "changePin": function () {
          params = data;
          method = "post-profile";
        },
        
        "requestZones": function () {
          method = "get-zones";
        },
        
        "deleteZones": function () {
          params.id = data;
          method = "delete-zone";
        },
        
        "updateUserLocation": function () {
          params.location = User.lat + ',' + User.lng;
          method = "post-location";
        },
        
        "registerUser": function () {
          params = data;
          method = "register";
        },
        
        "confirmSms": function () {
          params = data;
          method = "confirm";
        },
        
        "startOffer": function () {
          params.offerId = data;
          method = "start-order";
        }
      };
      
      funcs[func]();

      if (method) {
        self.sendMessage(method, params);
      }
      
      return;
    };
          
    this.start = function (callback) {
      socket = new WebSocket('wss://' + Uries.server_uri + ':4443');
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
        timerReconnectionWebSocket = setTimeout(self.start(function(){
          HideForms.clear();
          require([currentRoute.controller], function(controller) {
            controller.clear();
            controller.start();
          });
        }), 2000);
        
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
      
      req.method       = method;
      req.id           = global_cb || method;
      req.params       = params || {};
      req.params.token = User.token;
      
      viewLog(JSON.stringify(req));
      
      if (self.is_connect) {
        socket.send(JSON.stringify(req));
      }
    };

  };

  return clConn;
  
});