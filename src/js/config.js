requirejs.config({
	paths: {
		"App" :           "app",
    "Uries" :         "uries",
    
    "hammer" :        "vendor/hammer.min",
    "parallel" :      "vendor/parallel",
    "jsutil" :        "vendor/jsutil",
    "jsts" :          "vendor/jsts",
    "domReady" :      "vendor/domReady",
    "mustache" :      "vendor/mustache.min.js",
    
		"Car" :           "models/car",
		"ClientOrder" :   "models/client_order",
		"DriverOffer" :   "models/driver_offer",
		"DriverOrders" :  "models/driver_orders",
		"Events" :        "models/events",
    "Google" :        "models/google",
		"MapElements" :   "models/map_elements",
    "Maps" :          "models/maps",
		"Settings" :      "models/settings",
		"User" :          "models/user",
    "Yandex" :        "models/yandex",
		"Zones" :         "models/zones",
    
    "Chat" :          "libs/chat",
    "Conn" :          "libs/connection",
    "Dates" :         "libs/dates",
    "Destinations" :  "libs/destinations",
    "Dom" :           "libs/dom",
    "Funcs" :         "libs/funcs",
    "Geo" :           "libs/geo",
    "GetPositions" :  "libs/get_positions",
    "HideForms" :     "libs/hide_forms",
    "InputFilters" :  "libs/input_filters",
    "Lists" :         "libs/lists",
    "MainMenu" :      "libs/menu",
		"ModalWindows" :  "libs/modal_windows",
		"Multirange" :    "libs/multirange",
		"PopupWindows" :  "libs/popup_windows",
    "Router" :        "libs/router",
    "Stars" :         "libs/stars",
    "SafeWin" :       "libs/safe_win",
    "Storage" :       "libs/storage",
    "Tabs" :          "libs/tabs",
    
    "ctrlPageEditProfile" :     "controllers/pages/pages_edit_profile",
    "ctrlPageStart" :           "controllers/pages/pages_start",
    "ctrlPageLogin" :           "controllers/pages/pages_login",
    "ctrlPageLogout" :          "controllers/pages/pages_logout",
    "ctrlPageMessages" :        "controllers/pages/pages_messages",
    "ctrlPageSettings" :        "controllers/pages/pages_settings",
    "ctrlPageSms" :             "controllers/pages/pages_sms",
    "ctrlPagesTrustedContacts": "controllers/pages/pages_trusted_contacts",
    "ctrlPageFavorites" :       "controllers/pages/pages_favorites",
    "ctrlPageZones" :           "controllers/pages/pages_zones",
    "ctrlPageEditZone" :        "controllers/pages/pages_edit_zone",
    
    "ctrlTaxiClientChoiceLocationMap" : "controllers/client/taxi_client_choice_location_map",
    "ctrlTaxiClientChooseAddress" :     "controllers/client/taxi_client_choose_address",
    "ctrlTaxiClientCity" :              "controllers/client/taxi_client_city",
    "ctrlTaxiClientGo" :                "controllers/client/taxi_client_go",
    "ctrlTaxiClientIntercity" :         "controllers/client/taxi_client_intercity",
    "ctrlTaxiClientCargo" :             "controllers/client/taxi_client_cargo",
    "ctrlTaxiClientFeedback" :          "controllers/client/taxi_client_feedback",
    "ctrlTaxiClientHelp" :              "controllers/client/taxi_client_help",
    "ctrlTaxiClientMap" :               "controllers/client/taxi_client_map",
    "ctrlTaxiClientDriversRating" :     "controllers/client/taxi_client_drivers_rating",
    "ctrlTaxiClientOffer" :             "controllers/client/taxi_client_offer",

    
    "ctrlTaxiDriverCity" :          "controllers/driver/taxi_driver_city",
    "ctrlTaxiDriverNewOffer" :      "controllers/driver/taxi_driver_new_offer",
    "ctrlTaxiDriverOffer" :         "controllers/driver/taxi_driver_my_offer",
    "ctrlTaxiDriverFeedback" :      "controllers/driver/taxi_driver_feedback",
    "ctrlTaxiDriverCargo" :         "controllers/driver/taxi_driver_cargo",
    "ctrlTaxiDriverMyAccount" :     "controllers/driver/taxi_driver_my_account",
    "ctrlTaxiDriverRating" :        "controllers/driver/taxi_driver_rating",
    "ctrlTaxiDriverGo" :            "controllers/driver/taxi_driver_go",
    "ctrlTaxiDriverOrder" :         "controllers/driver/taxi_driver_order",
    "ctrlTaxiDriverIntercity" :     "controllers/driver/taxi_driver_intercity",
    "ctrlTaxiDriverHelp" :          "controllers/driver/taxi_driver_help",
    "ctrlTaxiDriverClientsRating" : "controllers/driver/taxi_driver_clients_rating",
    "ctrlTaxiDriverMyAuto" :        "controllers/driver/taxi_driver_my_auto"
	},
  shim: {
    "hammer" : {
      exports: "hammer"
    },
    "parallel" : {
      exports: "parallel"
    },
    "jsts" : {
      exports: "jsts"
    }
  }
});

var menus_arr = [];
    menus_arr['client'] = [{name: 'Город', url: '#client_city', icon: 'commerical-building'},
                           {name: 'Межгород', url: '#client_intercity', icon: 'suitcase'},
                           {name: 'Грузовые', url: '#client_cargo', icon: 'truck'},
                           {name: 'Сообщения', url: '#messages', icon: 'attention'},
                           {name: 'Настройки', url: '#settings', icon: 'cog'},
                           {name: 'Обратная связь', url: '#client_feedback', icon: 'attention'},
                           {name: 'Режим водителя', url: '#driver_city', icon: 'steering-wheel', add_icon: '<i class="icon-toggle-off toggle_block--inactive"></i>'},
                           {name: 'Помощь', url: '#client_help', icon: 'lifebuoy'}];
    menus_arr['driver'] = [{name: 'Город', url: '#driver_city', icon: 'commerical-building'},
                           {name: 'Межгород', url: '#driver_intercity', icon: 'suitcase'},
                           {name: 'Грузовые', url: '#driver_cargo', icon: 'truck'},
                           {name: 'Мой кабинет', url: '#driver_my_account', icon: 'money'},
                           {name: 'Сообщения', url: '#messages', icon: 'attention'},
                           {name: 'Настройки', url: '#settings', icon: 'cog'},
                           {name: 'Обратная связь', url: '#driver_feedback', icon: 'attention'},
                           {name: 'Режим клиента', url: '#client_city', icon: 'steering-wheel',  add_icon: '<i class="icon-toggle-on toggle_block"></i>'},
                           {name: 'Помощь', url: '#driver_help', icon: 'lifebuoy'}];

  var content,
      lastURL = '',
      MayLoading = false,
      
      User, Car, Conn = false, Event, Settings, SafeWin, Zones, Maps, MapGoogle, MapYandex, 

      driver_icon = '//maps.gstatic.com/mapfiles/ms2/micons/cabs.png',
      men_icon = '//maps.gstatic.com/mapfiles/ms2/micons/man.png',
      default_vehicle = 'assets/images/no_vehicle.png',
      default_city = 'Хабаровск',
      average_speed = 40,
      cost_of_km = 25,
  
      global_order_id,
      timerMyPos,
      timerCheckLoading,
      
      timerWhenLoadConn = false,
      tempTokenUlogin;
    
  function reciveUlogin(tokena) {
    var token = tokena || tempTokenUlogin;
    
    tempTokenUlogin = token;
    
    if (Conn) {
      Conn.request('ulogin', {'ulogin':token,'host':'indriver.ru'});
      clearInterval(timerWhenLoadConn);
    } else {
      timerWhenLoadConn = !timerWhenLoadConn ? setInterval(reciveUlogin, 250) : false;
    }
  }

require(['App'], function (App) {
  App.start();
});
