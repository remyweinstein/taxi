requirejs.config({
  urlArgs: "v=0.59",
	paths: {
		"App" :   "app",
    "Uries" : "uries",
    
    "hammer" :   "vendor/hammer.min",
    "jsutil" :   "vendor/jsutil",
    "jsts" :     "vendor/jsts",
    "domReady" : "vendor/domReady",
    "push" :     "vendor/push.min",
    "mustache" : "vendor/mustache.min",
    "sipjs":       "vendor/sip.min",
    
		"Car" :          "models/car",
		"ClientOrder" :  "models/client_order",
		"DriverOffer" :  "models/driver_offer",
		"DriverOrders" : "models/driver_orders",
		"Events" :       "models/events",
    "Google" :       "models/google",
		"MapElements" :  "models/map_elements",
    "Maps" :         "models/maps",
		"Parameters" :   "models/parameters",
		"Settings" :     "models/settings",
		"User" :         "models/user",
    "Yandex" :       "models/yandex",
		"Zones" :        "models/zones",
    
    "ActiveOrder" :  "libs/active_order_win",
    "Calc" :         "libs/calc",
    "Chat" :         "libs/chat",
    "Conn" :         "libs/connection",
    "Dates" :        "libs/dates",
    "Destinations" : "libs/destinations",
    "Dom" :          "libs/dom",
    "Funcs" :        "libs/funcs",
    "Geo" :          "libs/geo",
    "GetPositions" : "libs/get_positions",
    "HideForms" :    "libs/hide_forms",
    "InputFilters" : "libs/input_filters",
    "Lists" :        "libs/lists",
    "Notify" :       "libs/listner_notify",
    "MainMenu" :     "libs/menu",
		"ModalWindows" : "libs/modal_windows",
		"Sip" :          "libs/sip",
		"Multirange" :   "libs/multirange",
    "Redirect" :     "libs/redirects",
		"PopupWindows" : "libs/popup_windows",
    "Router" :       "libs/router",
    "Stars" :        "libs/stars",
    "SafeWin" :      "libs/safe_win",
    "SharingOrder" : "libs/sharing_order",
    "Storage" :      "libs/storage",
    "Tabs" :         "libs/tabs",
    
    "ctrlPageAdmin" :          "controllers/pages/pages_admin",
    "ctrlPageEditProfile" :    "controllers/pages/pages_edit_profile",
    "ctrlPageStart" :          "controllers/pages/pages_start",
    "ctrlPageLogin" :          "controllers/pages/pages_login",
    "ctrlPageLogout" :         "controllers/pages/pages_logout",
    "ctrlPageMessages" :       "controllers/pages/pages_messages",
    "ctrlPageOpenMessage" :    "controllers/pages/pages_open_message",
    "ctrlPageSettings" :       "controllers/pages/pages_settings",
    "ctrlPageSms" :            "controllers/pages/pages_sms",
    "ctrlPageTrustedContacts": "controllers/pages/pages_trusted_contacts",
    "ctrlPageFavorites" :      "controllers/pages/pages_favorites",
    "ctrlPageWatching" :       "controllers/pages/pages_watching",
    "ctrlPageZones" :          "controllers/pages/pages_zones",
    "ctrlPageEditZone" :       "controllers/pages/pages_edit_zone",
    
    "ctrlTaxiClientChoiceLocationMap" : "controllers/client/taxi_client_choice_location_map",
    "ctrlTaxiClientChooseAddress" :     "controllers/client/taxi_client_choose_address",
    "ctrlTaxiClientCity" :              "controllers/client/taxi_client_city",
    "ctrlTaxiClientGo" :                "controllers/client/taxi_client_go",
    "ctrlTaxiClientIntercity" :         "controllers/client/taxi_client_intercity",
    "ctrlTaxiClientTourism" :           "controllers/client/taxi_client_tourism",
    "ctrlTaxiClientTrucking" :          "controllers/client/taxi_client_trucking",
    "ctrlTaxiClientMap" :               "controllers/client/taxi_client_map",
    "ctrlTaxiClientOffer" :             "controllers/client/taxi_client_offer",

    
    "ctrlTaxiDriverCity" :      "controllers/driver/taxi_driver_city",
    "ctrlTaxiDriverNewOffer" :  "controllers/driver/taxi_driver_new_offer",
    "ctrlTaxiDriverOffer" :     "controllers/driver/taxi_driver_my_offer",
    "ctrlTaxiDriverTrucking" :  "controllers/driver/taxi_driver_trucking",
    "ctrlTaxiDriverMyAccount" : "controllers/driver/taxi_driver_my_account",
    "ctrlTaxiDriverGo" :        "controllers/driver/taxi_driver_go",
    "ctrlTaxiDriverOrder" :     "controllers/driver/taxi_driver_order",
    "ctrlTaxiDriverIntercity" : "controllers/driver/taxi_driver_intercity",
    "ctrlTaxiDriverTourism" :   "controllers/driver/taxi_driver_tourism",
    "ctrlTaxiDriverMyAuto" :    "controllers/driver/taxi_driver_my_auto",
    "ctrlTaxiDriverEditAuto" :  "controllers/driver/taxi_driver_edit_auto"
	},
  shim: {
    "hammer" : {
      exports: "hammer"
    },
    "jsts" : {
      exports: "jsts"
    },
    "push" : {
      exports: "push"
    }
  }
});

var menus_arr = [];
    menus_arr['client'] = [{name: 'Город', url: '#client_city', icon: 'commerical-building'},
                           {name: 'Межгород', url: '#client_intercity', icon: 'suitcase'},
                           {name: 'Грузовые', url: '#client_trucking', icon: 'truck'},
                           {name: 'Туризм', url: '#client_tourism', icon: 'compass'},
                           {name: 'Сообщения', url: '#messages', icon: 'attention'},
                           {name: 'Настройки', url: '#settings', icon: 'cog'},
                           {name: 'Режим водителя', url: '#driver_city', icon: 'steering-wheel', add_icon: '<i class="icon-toggle-off toggle_block--inactive"></i>'},
                           {name: 'Админ', url: '#admin', icon: 'attention'}];
    menus_arr['driver'] = [{name: 'Город', url: '#driver_city', icon: 'commerical-building'},
                           {name: 'Межгород', url: '#driver_intercity', icon: 'suitcase'},
                           {name: 'Грузовые', url: '#driver_trucking', icon: 'truck'},
                           {name: 'Туризм', url: '#driver_tourism', icon: 'compass'},
                           {name: 'Мой кабинет', url: '#driver_my_account', icon: 'money'},
                           {name: 'Сообщения', url: '#messages', icon: 'attention'},
                           {name: 'Настройки', url: '#settings', icon: 'cog'},
                           {name: 'Режим клиента', url: '#client_city', icon: 'steering-wheel',  add_icon: '<i class="icon-toggle-on toggle_block"></i>'},
                           {name: 'Админ', url: '#admin', icon: 'attention'}];

  var content,
      version = '48',
      MayLoading = false, isGeolocation = false,
      
      User, Car, Event, Settings, Parameters, SafeWin, SharingOrder, Zones, Maps, MapGoogle, MapYandex, MapElements, Conn = false,

      driver_icon   = '//maps.gstatic.com/mapfiles/ms2/micons/cabs.png',
      men_icon      = '//maps.gstatic.com/mapfiles/ms2/micons/man.png',
      default_city  = 'Хабаровск',
      average_speed = 40,
  
      global_order_id,
      ymaps,
      timerMyPos,
      timerCheckLoading,
      
      currentRoute,
      
      goToPage,
      
      timerWhenLoadConn = false,
      tempTokenUlogin;
    
  function reciveUlogin(tokena) {
    var token = tokena || tempTokenUlogin;
    
    tempTokenUlogin = token;
    
    if (Conn) {
      Conn.request('ulogin', {'ulogin':token,'host':'indriver.ru'});
      timerWhenLoadConn = clearInterval(timerWhenLoadConn);
    } else {
      timerWhenLoadConn = !timerWhenLoadConn ? setInterval(reciveUlogin, 250) : false;
    }
  }

require(['App'], function (App) {
  App.start();
});
