define(['User', 'Car', 'ClientOrder', 'Events', 'Settings', 'Geo', 'MainMenu', 'InputFilters', 'Router', 'Tabs', 'Dom', 'Funcs', 'domReady', 'SafeWin', 'Maps', 'Zones'], 
function(clUser, clCar, clClientOrder, clEvents, clSettings, Geo, MainMenu, InputFilters, Router, Tabs, Dom, Funcs, domReady, clSafeWin, Maps, clZones) {

  var App =  {
    
    start: function () {
                  
      domReady(function () {
        content = Dom.sel('.content');
        
        SafeWin =  clSafeWin;
        User =     new clUser();
        Car =      new clCar();
        Event =    new clEvents();
        MyOrder =  new clClientOrder();
        Zones =    new clZones();
        Settings = new clSettings();
          Settings.getSettings();

        User.initToken();

        User.city = localStorage.getItem('_my_city');
        User.id   = localStorage.getItem('_my_id');
        User.lat  = localStorage.getItem('_my_pos_lat');
        User.lng  = localStorage.getItem('_my_pos_lon');    

        if ( localStorage.getItem('_is_auth') === "true" ) {
          User.is_auth = true;
        }

        User.token = localStorage.getItem('_my_token');
        
        Geo.init(App);
        MainMenu.init();
        InputFilters.init();
        Router.start(App);
        SafeWin.init();
        Maps.init();

        window.addEventListener('resize', function() {
          App.init();
        });
      });

      return User;
    },

    init: function () {
      domReady(function () {

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
      });
    }
  };
  
  return App;

});
