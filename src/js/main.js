//  'use strict';

requirejs.config({
	paths: {
		"hammer" : "vendor/hammer.min",
		"jsutil" : "vendor/javascript.util",
		"jsts" : "vendor/jsts",
		"main" : "main",
    
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
    "Menu" : "modules/menu",
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
    
	}/*,
  shim: {
    "hammer" : {
      deps: [],
      exports: "hammer"
    },
    "user" : {
      deps: [],
      exports: "user"
    }
  }*/
});

require(['User', 'Settings', 'Car', 'ClientOrder', 'ModalWindows', 'Events', 'Geo', 'Menu', 'InputFilters', 'Router', 'Tabs', 'Dom'], 
 function(User, Settings, MyCar, MyOrder, Modal, Event, Geo, MainMenu, InpFlt, Router, Tabs, Dom) {

  var lasturl = '', sublasturl = '', lastsection = '';

  var content;

  var map, map_choice, marker, geocoder;
  var google, placeSearch, autocomplete, directionsService, directionsDisplay;

//  var User = new User();
//  var Settings = new Settings();
//  var MyCar = new Car();

//  var MyOrder = new ClientOrder();
//  var Modal = new ModalWindow();

  var average_speed = 40;
  var cost_of_km = 25;

  var driver_icon = '//maps.gstatic.com/mapfiles/ms2/micons/cabs.png';

//  var Event = new Events();

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

  //= modules/dom.js
  //= modules/ajax.js
  //= modules/inputfilter.js
  //= modules/geo.js
  //= modules/address.js
  //= modules/dates.js
  //= modules/funcs.js
  //= modules/maps.js
  //= modules/menu.js
  //= modules/tabs.js
  //= modules/chat.js
  //= modules/router.js

  //= classes/user.js
  //= classes/car.js
  //= classes/driver_orders.js
  //= classes/client_order.js
  //= classes/events.js
  //= classes/modal_windows.js
  //= classes/settings.js

  User.initToken();

  document.addEventListener('DOMContentLoaded', function() {
    content = Dom.sel('.content');

    Settings.getSettings();

    User.city = localStorage.getItem('_my_city');
    User.id = localStorage.getItem('_my_id');
    User.lat = localStorage.getItem('_my_pos_lat');
    User.lng = localStorage.getItem('_my_pos_lon');    

    if ( localStorage.getItem('_is_auth') === "true" ) {
      User.is_auth = true;
    }

    User.token = localStorage.getItem('_my_token');

    Geo.init();
    MainMenu.init();
    InpFlt.init();
    Router.init();

    window.addEventListener('resize', function() {
      init();
    });

  });

    function init() {
          clearInterval(timerSearchDriver);
          clearInterval(timerGetBidsTaxy);
          clearInterval(timerGetBidGo);
          clearInterval(timerUpdateTaxiDriverOrder);
          clearInterval(timerGetMyPos);
          clearInterval(timerGetPosTaxy);

      content.removeEventListener('click', Event.click);
      content.removeEventListener('submit', Event.submit);
          //content.removeEventListener('keyup');
          //content.removeEventListener('keypress');

      User.getData();

      Tabs.init();

      content.style.height = (window.innerHeight - Funcs.outerHeight(Dom.sel('.header'))) + 'px';

      var item_login = Dom.sel('.menu__list__item_login');
      var item_logout = Dom.sel('.menu__list__item_logout');
      if (item_login) {
        if (User.is_auth) {
          item_login.style.display = 'none';
          item_logout.style.display = 'block';
        } else {
          item_login.style.display = 'block';
          item_logout.style.display = 'none';
        }
      }

      if (Dom.sel('[data-controller="pages_settings"]')) {
        //= controllers/pages_settings.js
      }

      if (Dom.sel('[data-controller="pages_edit_profile"]')) {
        //= controllers/pages_edit_profile.js
      }

      if (Dom.sel('[data-controller="pages_login"]')) {
        //= controllers/pages_login.js
      }

      if (Dom.selAll('[data-controller="pages_logout"]').length) {
        //= controllers/pages_logout.js
      }

      if (Dom.sel('[data-controller="pages_sms"]')) {
        //= controllers/pages_sms.js
      }

      if (Dom.selAll('[data-controller="taxi_client_intercity"]').length) {
        //= controllers/taxi_client_intercity.js
      }

      if (Dom.selAll('[data-controller="taxi_client_go"]').length) {
        //= controllers/taxi_client_go.js
      }

      if (Dom.selAll('[data-controller="taxi_client_my_orders"]').length) {
        //= controllers/taxi_client_my_orders.js
      }

      if (Dom.selAll('[data-controller="taxi_client_choose_address"]').length) {
        //= controllers/taxi_client_choose_address.js
      }

      if (Dom.selAll('[data-controller="taxi_client_city"]').length) {
        //= controllers/taxi_client_city.js
      }

      if (Dom.selAll('[data-controller="taxi_client_choice_location_map"]').length) {
        //= controllers/taxi_client_choice_location_map.js
      }

      if (Dom.selAll('[data-controller="taxi_client_map"]').length) {
        //= controllers/taxi_client_map.js
      }

      if (Dom.selAll('[data-controller="taxi_driver_my_auto"]').length) {
        //= controllers/taxi_driver_my_auto.js
      }

      if (Dom.selAll('[data-controller="taxi_driver_go"]').length) {
        //= controllers/taxi_driver_go.js
      }

      if (Dom.selAll('[data-controller="taxi_driver_city"]').length) {
        //= controllers/taxi_driver_city.js
      }

      if (Dom.selAll('[data-controller="taxi_driver_intercity"]').length) {
        //= controllers/taxi_driver_intercity.js
      }

    }
  }
);
