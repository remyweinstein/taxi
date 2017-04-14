define(function() {
  
  var Storage = {
    lullModel: function (Model) {
      var model = Storage.getActiveTypeModelTaxi(),
          type  = Storage.getActiveTypeTaxi();
      
      if (model && type) {
        localStorage.setItem('_my_' + model + '_' + type, JSON.stringify(Model));
      }
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
    },

    getTripClient: function () {
      return localStorage.getItem('_redirect_trip_client');
    },
    
    removeTripClient: function () {
      localStorage.removeItem('_redirect_trip_client');
    },
    
    setTripDriver: function (id) {
      localStorage.setItem('_redirect_trip_driver', id);
    },

    getTripDriver: function () {
      return localStorage.getItem('_redirect_trip_driver');
    },
    
    removeTripDriver: function () {
      localStorage.removeItem('_redirect_trip_driver');
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
      localStorage.setItem('_automat_driver_orders', true);
    },

    getDriverAutomat: function () {
      return localStorage.getItem('_automat_driver_orders');
    },
    
    removeDriverAutomat: function () {
      localStorage.removeItem('_automat_driver_orders');
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