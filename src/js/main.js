//  'use strict';

var lasturl = '', sublasturl = '', lastsection = '';

var content;

var map, map_choice, marker, geocoder;
var google, placeSearch, autocomplete, directionsService, directionsDisplay;

var User = new User();
var MyCar = new Car();

var MyOrder = new ClientOrder();

var Event = new Events();

var my_vehicle;

var bid_id;

var default_vehicle = 'asset/images/no_vehicle.png';

var timerSearchDriver, 
    timerGetBidsTaxy, 
    timerGetBidGo, 
    timerUpdateTaxiDriverOrder, 
    timerUpdateCoords, 
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

User.initToken();

document.addEventListener('DOMContentLoaded', function() {
  content = Dom.sel('.content');
  
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