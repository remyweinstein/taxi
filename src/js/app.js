/* global User */

define(['User', 
        'Car', 
        'Conn',
        'ClientOrder', 
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
        'Maps', 
        'Zones', 
        'DriverOffer',
        'MapElements'], 
  function (clUser, 
            clCar, 
            clConn,
            clClientOrder, 
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
            Maps, 
            clZones, 
            clDriverOffer,
            clMapElements) {

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
        MyOrder     = new clClientOrder();
        MyOffer     = new clDriverOffer();
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
      Settings.getSettings();
      User.getData();
      Geo.init();
      Zones.get();        

      MainMenu.init();
      InputFilters.init();
      Maps.init();
    },

    init: function () {
      domReady(function () {
        
        Tabs.init();

        content.style.height = (window.innerHeight - Funcs.outerHeight(Dom.sel('.header'))) + 'px';

        var item_login = Dom.sel('.menu__list__item_login'),
            item_logout = Dom.sel('.menu__list__item_logout');

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
