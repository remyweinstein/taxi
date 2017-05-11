/* global User, MayLoading */

define(['User', 
        'Car', 
        'Conn',
        'Events', 
        'Settings',
        'Parameters',
        'Geo', 
        'MainMenu', 
        'InputFilters', 
        'Router', 
        'Tabs', 
        'Dom', 
        'Funcs', 
        'domReady', 
        'SafeWin', 
        'Zones', 
        'MapElements',
        'Maps',
        'Google', 
        'Yandex',
        'Storage',
        'push'], 
  function (clUser, 
            clCar, 
            clConn,
            clEvents, 
            clSettings, 
            clParameters,
            Geo, 
            MainMenu, 
            InputFilters, 
            Router, 
            Tabs, 
            Dom, 
            Funcs, 
            domReady, 
            clSafeWin, 
            clZones, 
            clMapElements,
            clMaps,
            clGoogle, 
            clYandex,
            Storage,
            Push) {

  var timerCheckMayLoading;
  
  function checkMayLoading() {
    if (MayLoading) {
      timerCheckMayLoading = clearInterval(timerCheckMayLoading);
      App.afterLoading();
    }
  }
  
  function onPushGranted() {
    console.log('push messages granted');
  }
  
  function onPushDenied() {
    console.log('push messages denied');
  }

  var App =  {
    
    start: function () {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
          navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
          }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
          });
        });
      } else {
        console.log('ServiceWorker do not work');
      }
      
      domReady(function () {
        content = Dom.sel('.content');
        
        SafeWin     = clSafeWin;
        User        = new clUser();
        Car         = new clCar();
        Conn        = new clConn();
        Event       = new clEvents();
        MapElements = new clMapElements();
        Maps        = new clMaps();
        MapGoogle   = new clGoogle();
        MapYandex   = new clYandex();
        Zones       = new clZones();
        Settings    = new clSettings();
        Parameters  = new clParameters();
        
        //Push.Permission.request(onPushGranted, onPushDenied);
        
        Router.start(App, function () {
          App.afterConnection();
        });

        window.addEventListener('resize', function() {
          App.init();
        });
      });

      return User;
    },
    
    afterConnection: function () {
      User.load();
      Parameters.getParameters();
      Geo.init();
      MainMenu.init();
      InputFilters.init();
      timerCheckMayLoading = setInterval(checkMayLoading, 250);
    },
    
    afterLoading: function () {
      Zones.get();
    },

    init: function () {
      domReady(function () {
        var item_login  = Dom.sel('.menu__list__item_login'),
            item_logout = Dom.sel('.menu__list__item_logout');
        
        Tabs.init();
        content.style.height = (window.innerHeight - Funcs.outerHeight(Dom.sel('.header'))) + 'px';

        if (item_login) {
          if (User.is_auth) {
            item_login.style.display = 'none';
            item_logout.style.display = 'block';
          } else {
            item_login.style.display = 'block';
            item_logout.style.display = 'none';
          }
        }
        
      });
    }
  };
  
  return App;

});
