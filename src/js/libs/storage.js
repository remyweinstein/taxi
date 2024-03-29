define(['ActiveOrder'], function(ActiveOrder) {
  
  var Storage = {
    clear: function () {
      Storage.removeActiveTypeModelTaxi();
      Storage.clearActiveTypesTaxi();
      Storage.removeActiveTypeFilters();
      Storage.clearHistoryPages();
      Storage.clearOpenNotify();
      Storage.clearLastPage();
      Storage.clearMyActiveOrder();
      Storage.clearPrevListOrders();
      Storage.removeOpenOfferId();
      Storage.clearModels();
      Storage.clearActiveFilters();
    },
    
    lullModel: function (Model) {
      var model = Storage.getActiveTypeModelTaxi(),
          type  = Storage.getActiveTypeTaxi();
      
      if (model && type) {
        localStorage.setItem('_my_' + model + '_' + type, JSON.stringify(Model));
      }
    },
    
    clearModels: function () {
      localStorage.removeItem('_my_order_trucking');
      localStorage.removeItem('_my_order_tourism');
      localStorage.removeItem('_my_order_taxi');
      localStorage.removeItem('_my_order_intercity');
      localStorage.removeItem('_my_offer_taxi');
      localStorage.removeItem('_my_offer_intercity');
      localStorage.removeItem('_my_offer_tourism');
      localStorage.removeItem('_my_offer_trucking');
    },
    
    removeOpenOfferId: function() {
      localStorage.removeItem('_open_offer_id');
    },
    
    getOpenOfferId: function() {
      return localStorage.getItem('_open_offer_id');
    },
    
    setOpenOfferId: function(id) {
      localStorage.setItem('_open_offer_id', id);
    },
    
    removeZoneSosAgent: function() {
      localStorage.removeItem('_zone_sos_agent');
    },
    
    getZoneSosAgent: function() {
      return localStorage.getItem('_zone_sos_agent');
    },
    
    setZoneSosAgent: function(id) {
      localStorage.setItem('_zone_sos_agent', id);
    },
    
    setChangeLocations: function() {
      localStorage.setItem('_update_location', true);
    },
    
    removeChangeLocations: function() {
      localStorage.removeItem('_update_location');
    },
    
    getChangeLocations: function() {
      return localStorage.getItem('_update_location');
    },
    
    setUpdateVersion: function(version) {
      localStorage.setItem('_update_version', version);
    },
    
    getUpdateVersion: function() {
      localStorage.getItem('_update_version');
    },
    
    addMyActiveOrder: function(ids) {
      localStorage.setItem('_my_active_orders', JSON.stringify(ids));
    },
    
    clearMyActiveOrder: function() {
      localStorage.removeItem('_my_active_orders');
    },
    
    getMyActiveOrder: function() {
      return JSON.parse(localStorage.getItem('_my_active_orders'));
    },
    
    getUserRole: function() {
      return localStorage.getItem('_user_role');
    },
    
    setUserRole: function(role) {
      localStorage.setItem('_user_role', role);
    },
    
    removeUserRole: function() {
      localStorage.removeItem('_user_role');
    },
    
    setSafeRoute: function(points) {
      localStorage.setItem('_safe_route', JSON.stringify(points));
    },
    
    getSafeRoute: function() {
      return JSON.parse(localStorage.getItem('_safe_route'));
    },
    
    clearSafeRoute: function() {
      localStorage.removeItem('_safe_route');
    },
    
    setLastPage: function(hash) {
      localStorage.setItem('_last_url', hash);
    },
    
    getLastPage: function() {
      return localStorage.getItem('_last_url');
    },
    
    clearLastPage: function() {
      localStorage.removeItem('_last_url');
    },
    
    addHistoryPages: function(url) {
      var arr = Storage.getHistoryPages(),
          arrLen = arr.length,
          newArr = [];

      if (url === "#logout" || url === "#start" || url === "undefined" || url === "open_message" || !url) {
        return;
      }
      
      for (var i = 0; i < arrLen; i++) {
        if (i === 9) {
          break;
        } else if (!((arrLen > 9 && i === 0) || ((i + 1) === arrLen && arr[i] === url))) {
          newArr.push(arr[i]);
        }
      }
      
      newArr.push(url);
      Storage.saveHistoryPages(newArr);
    },
    
    saveHistoryPages: function(arr) {
      localStorage.setItem('_history_url', arr.join('|'));
    },
    
    getPreviousHistoryPages: function() {
      var urls = localStorage.getItem('_history_url'),
          def = '#client_city';
      
      urls = urls.replace('#open_message|#messages', '#messages');      
      urls = urls || def;
      urls = urls.split('|');
      
      var urlsLen = urls.length,
          resp = urlsLen > 2 ? urls[urlsLen - 2] : def;
      
      urls.splice((urlsLen - 1), 1);
      Storage.saveHistoryPages(urls);
      
      return resp;
    },
    
    getHistoryPages: function() {
      var urls = localStorage.getItem('_history_url'),
          def = '#client_city';
      
      urls = urls || def;
      
      return urls.split('|');
    },
    
    clearHistoryPages: function() {
      localStorage.removeItem('_history_url');
    },
    
    setWatchingTrip: function(offer) {
      localStorage.setItem('_watching_trip', offer);
    },
    
    setWatchingHash: function(hash) {
      localStorage.setItem('_watching_hash', hash);
    },
    
    getWatchingTrip: function() {
      return localStorage.getItem('_watching_trip');
    },
    
    getWatchingHash: function() {
      return localStorage.getItem('_watching_hash');
    },
    
    removeWatchingTrip: function() {
      localStorage.removeItem('_watching_trip');
    },
    
    removeWatchingHash: function() {
      localStorage.removeItem('_watching_hash');
    },
    
    setStartLoading: function() {
      localStorage.setItem('_break_communication', true);
    },
    
    getStartLoading: function() {
      return localStorage.getItem('_break_communication');
    },
    
    clearStartLoading: function() {
      localStorage.removeItem('_break_communication');
    },
    
    setPrevListOrders: function (data) {
      localStorage.setItem('_previous_order_list', data);
    },
    
    getPrevListOrders: function () {
      return localStorage.getItem('_previous_order_list');
    },
    
    clearPrevListOrders: function () {
      localStorage.removeItem('_previous_order_list');
    },
    
    setActiveTypeTaxi: function (type) {
      localStorage.setItem('_active_taxi_type', type);
    },
    
    getActiveTypeTaxi: function () {
      return localStorage.getItem('_active_taxi_type');
    },
    
    clearActiveTypesTaxi: function () {
      localStorage.removeItem('_active_taxi_type');
    },
    
    setOpenNotify: function (id) {
      localStorage.setItem('_id_open_notify', id);
    },
    
    getOpenNotify: function () {
      return localStorage.getItem('_id_open_notify');
    },
    
    clearOpenNotify: function () {
      localStorage.removeItem('_id_open_notify');
    },
    
    setUser: function (Model) {
      localStorage.setItem('_user', JSON.stringify(Model));
    },
    
    getUser: function () {
      return JSON.parse(localStorage.getItem('_user'));
    },
    
    clearUser: function () {
      localStorage.removeItem('_user');
    },
    
    getTaxiOrderModel: function (type) {
      return localStorage.getItem('_my_order_' + type);
    },
    
    setTaxiOrderModel: function (type, Model) {
      localStorage.setItem('_my_order_' + type, JSON.stringify(Model));
    },
    
    getTaxiOfferModel: function (type) {
      return localStorage.getItem('_my_offer_' + type);
    },
    
    setTaxiOfferModel: function (type, Model) {
      localStorage.setItem('_my_offer_' + type, JSON.stringify(Model));
    },
    
    setActiveTypeModelTaxi: function (model) {
      localStorage.setItem('_active_model_order_or_offer', model);
    },
    
    getActiveTypeModelTaxi: function () {
      return localStorage.getItem('_active_model_order_or_offer');
    },
    
    removeActiveTypeModelTaxi: function () {
      localStorage.removeItem('_active_model_order_or_offer');
    },
    
    setTemporaryAddress: function (address) {
      localStorage.setItem('_address_temp', address);
    },
  
    getTemporaryAddress: function () {
      return localStorage.getItem('_address_temp');
    },
  
    removeTemporaryAddress: function () {
      localStorage.removeItem('_address_temp');
    },
  
    setTemporaryRoute: function (route) {
      localStorage.setItem('_route_temp', route);
    },
  
    getTemporaryRoute: function () {
      return localStorage.getItem('_route_temp');
    },
  
    removeTemporaryRoute: function () {
      localStorage.removeItem('_route_temp');
    },

    setTemporaryCoords: function (route) {
      localStorage.setItem('_choice_coords', route);
    },
  
    getTemporaryCoords: function () {
      return localStorage.getItem('_choice_coords');
    },
  
    removeTemporaryCoords: function () {
      localStorage.removeItem('_choice_coords');
    },
    
    setActiveFilters: function (value) {
      localStorage.setItem('_filters_active_' + Storage.getActiveTypeTaxi() + '_' + Storage.getActiveTypeFilters(), value);
    },
  
    getActiveFilters: function () {
      return localStorage.getItem('_filters_active_' + Storage.getActiveTypeTaxi() + '_' + Storage.getActiveTypeFilters());
    },
  
    removeActiveFilters: function () {
      localStorage.removeItem('_filters_active_' + Storage.getActiveTypeTaxi() + '_' + Storage.getActiveTypeFilters());
    },
    
    clearActiveFilters: function () {
      localStorage.removeItem('_filters_sort_active_trucking_offers');
      localStorage.removeItem('_filters_sort_active_tourism_offers');
      localStorage.removeItem('_filters_sort_active_intercity_offers');
      localStorage.removeItem('_filters_sort_active_taxi_offers');
      localStorage.removeItem('_filters_sort_active_trucking_orders');
      localStorage.removeItem('_filters_sort_active_tourism_orders');
      localStorage.removeItem('_filters_sort_active_intercity_orders');
      localStorage.removeItem('_filters_sort_active_taxi_orders');
    },
    
    setActiveSortFilters: function (value) {
      localStorage.setItem('_filters_sort_active_' + Storage.getActiveTypeTaxi() + '_' + Storage.getActiveTypeFilters(), value);
    },
  
    getActiveSortFilters: function () {
      return localStorage.getItem('_filters_sort_active_' + Storage.getActiveTypeTaxi() + '_' + Storage.getActiveTypeFilters());
    },
  
    removeActiveSortFilters: function () {
      localStorage.removeItem('_filters_sort_active_' + Storage.getActiveTypeTaxi() + '_' + Storage.getActiveTypeFilters());
    },
    
    setActiveTypeFilters: function (value) {
      localStorage.setItem('_filters_active_type', value);
    },
  
    getActiveTypeFilters: function () {
      return localStorage.getItem('_filters_active_type');
    },
  
    removeActiveTypeFilters: function () {
      localStorage.removeItem('_filters_active_type');
    },
    
    setIdEditCar: function (id) {
      localStorage.setItem('_edit_auto_id', id);
    },

    getIdEditCar: function () {
      return localStorage.getItem('_edit_auto_id');
    },
    
    removeIdEditCar: function () {
      localStorage.removeItem('_edit_auto_id');
    },
    
    setCurrentMap: function (map) {
      localStorage.setItem('_map_provider', map);
    },

    getCurrentMap: function () {
      return localStorage.getItem('_map_provider');
    },
    
    removeCurrentMap: function () {
      localStorage.removeItem('_map_provider');
    },
    
    setTripClient: function (id) {
      localStorage.setItem('_redirect_trip_client', id);
      ActiveOrder.enable();
    },

    getTripClient: function () {
      return localStorage.getItem('_redirect_trip_client');
    },
    
    removeTripClient: function () {
      localStorage.removeItem('_redirect_trip_client');
      ActiveOrder.disable();
    },
    
    setTripDriver: function (id) {
      localStorage.setItem('_redirect_trip_driver', id);
      ActiveOrder.enable();
    },

    getTripDriver: function () {
      return localStorage.getItem('_redirect_trip_driver');
    },
    
    removeTripDriver: function () {
      localStorage.removeItem('_redirect_trip_driver');
      ActiveOrder.disable();
    },

    setFollowOrder: function () {
      localStorage.setItem('_follow_order', true);
    },

    getFollowOrder: function () {
      return localStorage.getItem('_follow_order');
    },
    
    removeFollowOrder: function () {
      localStorage.removeItem('_follow_order');
    },

    setClientAutomat: function () {
      localStorage.setItem('_automat_client_approve', true);
    },

    getClientAutomat: function () {
      return localStorage.getItem('_automat_client_approve');
    },
    
    removeClientAutomat: function () {
      localStorage.removeItem('_automat_client_approve');
    },
    
    setDriverAutomat: function () {
      localStorage.setItem('_automat_driver_orders_' + Storage.getActiveTypeTaxi(), true);
    },

    getDriverAutomat: function () {
      return localStorage.getItem('_automat_driver_orders_' + Storage.getActiveTypeTaxi());
    },
    
    removeDriverAutomat: function () {
      localStorage.removeItem('_automat_driver_orders_' + Storage.getActiveTypeTaxi());
    },
        
    setClientOfferAutomat: function () {
      localStorage.setItem('_automat_client_offers', true);
    },

    getClientOfferAutomat: function () {
      return localStorage.getItem('_automat_client_offers');
    },
    
    removeClientOfferAutomat: function () {
      localStorage.removeItem('_automat_client_offers');
    },
    
    setIsDriverMenu: function () {
      localStorage.setItem('_is_driver_menu', true);
    },

    getIsDriverMenu: function () {
      return localStorage.getItem('_is_driver_menu');
    },
    
    removeIsDriverMenu: function () {
      localStorage.removeItem('_is_driver_menu');
    },
    
    setActiveZones: function (zones) {
      localStorage.setItem('_enable_safe_zone', zones);
    },

    getActiveZones: function () {
      return localStorage.getItem('_enable_safe_zone');
    },
    
    removeActiveZones: function () {
      localStorage.removeItem('_enable_safe_zone');
    },
    
    setActiveRoute: function (route) {
      localStorage.setItem('_enable_safe_route', route);
    },

    getActiveRoute: function () {
      return localStorage.getItem('_enable_safe_route');
    },
    
    removeActiveRoute: function () {
      localStorage.removeItem('_enable_safe_route');
    }

  };
  
	return Storage;
  
});