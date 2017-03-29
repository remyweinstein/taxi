define(function() {
  
  var Storage = {
    lullModel: function (Model) {
      localStorage.setItem('_my_order_' + Storage.getActiveTypeTaxi(), JSON.stringify(Model));
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
    
    setActiveTypeModelTaxi: function (model) {
      localStorage.setItem('_active_model_order_or_offer', model);
    },
    
    getActiveTypeModelTaxi: function () {
      return localStorage.getItem('_active_model_order_or_offer');
    },
    
    removeActiveTypeModelTaxi: function () {
      localStorage.removeItem('_active_model_order_or_offer');
    }
  
  };
  
	return Storage;
  
});