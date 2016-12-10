requirejs.config({
	paths: {
		"App" : "app",
    "Uries" : "uries",
    
    "hammer" : "vendor/hammer.min",
    "jsutil" : "vendor/jsutil",
    "jsts" : "vendor/jsts",
    "domReady" : "vendor/domReady",
    
		"User" : "models/user",
		"Car" : "models/car",
		"ClientOrder" : "models/client_order",
		"DriverOrders" : "models/driver_orders",
		"Events" : "models/events",
		"ModalWindows" : "models/modal_windows",
		"Settings" : "models/settings",
    
    "Address" : "libs/address",
    "Ajax" : "libs/ajax",
    "Chat" : "libs/chat",
    "Dates" : "libs/dates",
    "Dom" : "libs/dom",
    "Funcs" : "libs/funcs",
    "Geo" : "libs/geo",
    "InputFilters" : "libs/input_filters",
    "Maps" : "libs/maps",
    "MainMenu" : "libs/menu",
    "Router" : "libs/router",
    "Tabs" : "libs/tabs",
    
    "ctrlPageEditProfile" : "controllers/pages_edit_profile",
    "ctrlPageLogin" : "controllers/pages_login",
    "ctrlPageLogout" : "controllers/pages_logout",
    "ctrlPageSettings" : "controllers/pages_settings",
    "ctrlPageSms" : "controllers/pages_sms",
    "ctrlTaxiClientChoiceLocationMap" : "controllers/taxi_client_choice_location_map",
    "ctrlTaxiClientChooseAddress" : "controllers/taxi_client_choose_address",
    "ctrlTaxiClientCity" : "controllers/taxi_client_city",
    "ctrlTaxiClientGo" : "controllers/taxi_client_go",
    "ctrlTaxiClientIntercity" : "controllers/taxi_client_intercity",
    "ctrlTaxiClientMap" : "controllers/taxi_client_map",
    "ctrlTaxiClientMyOrders" : "controllers/taxi_client_my_orders",
    "ctrlTaxiDriverCity" : "controllers/taxi_driver_city",
    "ctrlTaxiDriverGo" : "controllers/taxi_driver_go",
    "ctrlTaxiDriverIntercity" : "controllers/taxi_driver_intercity",
    "ctrlTaxiDriverMyAuto" : "controllers/taxi_driver_my_auto"
	},
  shim: {
    "hammer" : {
      deps: [],
      exports: "hammer"
    },
    "jsutil" : {
      deps: [],
      exports: "jsutil"
    },
    "jsts" : {
      deps: ['jsutil'],
      exports: "jsts"
    }
  }
});

  var content;
  var map, map_choice, marker, geocoder;
  var google, placeSearch, autocomplete, directionsService, directionsDisplay;

  var average_speed = 40;
  var cost_of_km = 25;

  var User;

  var driver_icon = '//maps.gstatic.com/mapfiles/ms2/micons/cabs.png';

  var my_vehicle;

  var bid_id;

  var default_vehicle = 'asset/images/no_vehicle.png';

  var timerSearchDriver, 
      timerGetBidsTaxy, 
      timerGetBidGo, 
      timerUpdateTaxiDriverOrder, 
      timerUpdateCoords,
      timerGetPosTaxy,
      timerGetMyPos;


require(['App'], function (App) {  
  App.start();
});
