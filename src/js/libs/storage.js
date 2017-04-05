define(function() {
  
  var Storage = {
    lullModel: function (Model) {
      localStorage.setItem('_my_' + Storage.getActiveTypeModelTaxi() + '_' + Storage.getActiveTypeTaxi(), JSON.stringify(Model));
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
    }


  };
  
	return Storage;
  
});