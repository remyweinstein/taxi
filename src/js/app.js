/* global User, MayLoading */

define(['User', 
        'Car', 
        'Conn',
        'Events', 
        'Settings', 
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
        'Storage'], 
  function (clUser, 
            clCar, 
            clConn,
            clEvents, 
            clSettings, 
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
            Storage) {

  var timerCheckMayLoading;
  
  function checkMayLoading() {
    if (MayLoading) {
      timerCheckMayLoading = clearInterval(timerCheckMayLoading);
      App.afterLoading();
    }
  }

  var App =  {
    
    start: function () {
                  
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
      //User.getData();
      Geo.init();
      MainMenu.init();
      //Maps.init();
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
