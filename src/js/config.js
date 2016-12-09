requirejs.config({
	paths: {
		"App" : "app",
    "Uries" : "uries",
    
    "hammer" : "vendor/hammer.min",
    "jsutil" : "vendor/jsutil",
    "jsts" : "vendor/jsts",
    "domReady" : "vendor/domReady",
    
		"User" : "classes/user",
		"Car" : "classes/car",
		"ClientOrder" : "classes/client_order",
		"DriverOrders" : "classes/driver_orders",
		"Events" : "classes/events",
		"ModalWindows" : "classes/modal_windows",
		"Settings" : "classes/settings",
    
    "Address" : "modules/address",
    "Ajax" : "modules/ajax",
    "Chat" : "modules/chat",
    "Dates" : "modules/dates",
    "Dom" : "modules/dom",
    "Funcs" : "modules/funcs",
    "Geo" : "modules/geo",
    "InputFilters" : "modules/input_filters",
    "Maps" : "modules/maps",
    "MainMenu" : "modules/menu",
    "Router" : "modules/router",
    "Tabs" : "modules/tabs",
    
    "ctrlPageEditProfile" : "modules/pages_edit_profile",
    "ctrlPageLogin" : "modules/pages_login",
    "ctrlPageLogout" : "modules/pages_logout",
    "ctrlPageSettings" : "modules/pages_settings",
    "ctrlPageSms" : "modules/pages_sms",
    "ctrlTaxiClientChoiceLocationMap" : "modules/taxi_client_choice_location_map",
    "ctrlTaxiClientChooseAddress" : "modules/taxi_client_choose_address",
    "ctrlTaxiClientCity" : "modules/taxi_client_city",
    "ctrlTaxiClientGo" : "modules/taxi_client_go",
    "ctrlTaxiClientIntercity" : "modules/taxi_client_intercity",
    "ctrlTaxiClientMap" : "modules/taxi_client_map",
    "ctrlTaxiClientMyOrders" : "modules/taxi_client_my_orders",
    "ctrlTaxiDriverCity" : "modules/taxi_driver_city",
    "ctrlTaxiDriverGo" : "modules/taxi_driver_go",
    "ctrlTaxiDriverIntercity" : "modules/taxi_driver_intercity",
    "ctrlTaxiDriverMyAuto" : "modules/taxi_driver_my_auto"
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

require(['App'], function (App) {  
  App.start();
});
