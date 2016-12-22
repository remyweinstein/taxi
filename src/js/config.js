requirejs.config({
	paths: {
		"App" : "app",
    "Uries" : "uries",
    
    "hammer" : "vendor/hammer.min",
    "jsutil" : "vendor/jsutil",
    "jsts" : "vendor/jsts",
    "domReady" : "vendor/domReady",
    
    "html5slider" : "polyfills/html5slider",
    
		"User" : "models/user",
		"Car" : "models/car",
		"ClientOrder" : "models/client_order",
		"DriverOrders" : "models/driver_orders",
		"Events" : "models/events",
		"Settings" : "models/settings",
    "Zones" : "models/zones",
    
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
    "SafeWin" : "libs/safe_win",
		"ModalWindows" : "libs/modal_windows",
		"PopupWindows" : "libs/popup_windows",
    
    "ctrlPageEditProfile" : "controllers/pages/pages_edit_profile",
    "ctrlPageLogin" : "controllers/pages/pages_login",
    "ctrlPageLogout" : "controllers/pages/pages_logout",
    "ctrlPageSettings" : "controllers/pages/pages_settings",
    "ctrlPageSms" : "controllers/pages/pages_sms",
    "ctrlPageFavorites" : "controllers/pages/pages_favorites",
    "ctrlPageZones" : "controllers/pages/pages_zones",
    
    "ctrlTaxiClientChoiceLocationMap" : "controllers/client/taxi_client_choice_location_map",
    "ctrlTaxiClientChooseAddress" : "controllers/client/taxi_client_choose_address",
    "ctrlTaxiClientCity" : "controllers/client/taxi_client_city",
    "ctrlTaxiClientGo" : "controllers/client/taxi_client_go",
    "ctrlTaxiClientIntercity" : "controllers/client/taxi_client_intercity",
    "ctrlTaxiClientCargo" : "controllers/client/taxi_client_cargo",
    "ctrlTaxiClientFeedback" : "controllers/client/taxi_client_feedback",
    "ctrlTaxiClientHelp" : "controllers/client/taxi_client_help",
    "ctrlTaxiClientMap" : "controllers/client/taxi_client_map",
    "ctrlTaxiClientMyOrders" : "controllers/client/taxi_client_my_orders",
    
    "ctrlTaxiDriverCity" : "controllers/driver/taxi_driver_city",
    "ctrlTaxiDriverFeedback" : "controllers/driver/taxi_driver_feedback",
    "ctrlTaxiDriverCargo" : "controllers/driver/taxi_driver_cargo",
    "ctrlTaxiDriverMyAccount" : "controllers/driver/taxi_driver_my_account",
    "ctrlTaxiDriverRating" : "controllers/driver/taxi_driver_rating",
    "ctrlTaxiDriverGo" : "controllers/driver/taxi_driver_go",
    "ctrlTaxiDriverOrder" : "controllers/driver/taxi_driver_order",
    "ctrlTaxiDriverIntercity" : "controllers/driver/taxi_driver_intercity",
    "ctrlTaxiDriverHelp" : "controllers/driver/taxi_driver_help",
    "ctrlTaxiDriverMyAuto" : "controllers/driver/taxi_driver_my_auto"
	},
  shim: {
    "hammer" : {
      exports: "hammer"
    },
    "jsts" : {
      exports: "jsts"
    },
    "html5slider" : {
      exports: "html5slider"
    }
  }
});

var menus_arr = [];
    menus_arr['client'] = [{name: 'Город', url: '#client_city', icon: 'commerical-building'},
                           {name: 'Мои заказы', url: '#client_my_orders', icon: 'archive'},
                           {name: 'Межгород', url: '#client_intercity', icon: 'suitcase'},
                           {name: 'Грузовые', url: '#client_cargo', icon: 'truck'},
                           {name: 'Избранные', url: '#favorites', icon: 'star'},
                           {name: 'Настройки', url: '#settings', icon: 'cog'},
                           {name: 'Обратная связь', url: '#client_feedback', icon: 'attention'},
                           {name: 'Режим водителя', url: '#driver_city', icon: 'steering-wheel', add_icon: '<i class="icon-toggle-off toggle_block--inactive"></i>'},
                           {name: 'Помощь', url: '#client_help', icon: 'lifebuoy'}];
    menus_arr['driver'] = [{name: 'Город', url: '#driver_city', icon: 'commerical-building'},
                           {name: 'Межгород', url: '#driver_intercity', icon: 'suitcase'},
                           {name: 'Грузовые', url: '#driver_cargo', icon: 'truck'},
                           {name: 'Избранные', url: '#favorites', icon: 'star'},
                           {name: 'Мой авто', url: '#driver_my_auto', icon: 'cog-alt'},
                           {name: 'Мой кабинет', url: '#driver_my_account', icon: 'money'},
                           {name: 'Мой рейтинг', url: '#driver_rating', icon: 'user'},
                           {name: 'Настройки', url: '#settings', icon: 'cog'},
                           {name: 'Обратная связь', url: '#driver_feedback', icon: 'attention'},
                           {name: 'Режим клиента', url: '#client_city', icon: 'steering-wheel',  add_icon: '<i class="icon-toggle-on toggle_block"></i>'},
                           {name: 'Помощь', url: '#driver_help', icon: 'lifebuoy'}];

  var content;
  var map, map_choice, marker, geocoder;
  var google, placeSearch, autocomplete, directionsService, directionsDisplay;
  
  var lasturl = '';


  var average_speed = 40;
  var cost_of_km = 25;

  var User, Car, Event, Settings, MyOrder, Zones = [];

  var driver_icon = '//maps.gstatic.com/mapfiles/ms2/micons/cabs.png';

  var my_vehicle;

  var bid_id;

  var default_vehicle = 'assets/images/no_vehicle.png';
  var default_city = 'Хабаровск';

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
