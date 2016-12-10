define(['User', 'ClientOrder', 'ModalWindows', 'Events', 'Settings', 'Geo', 'MainMenu', 'InputFilters', 'Router', 'Tabs', 'Dom', 'Funcs', 'domReady'], 
function(clUser, clClientOrder, clModalWindow, clEvents, clSettings, Geo, MainMenu, InputFilters, Router, Tabs, Dom, Funcs, domReady) {

  var App =  {
    
    start: function () {
      
      domReady(function () {

        User =     new clUser();
        Modal =    new clModalWindow();
        Event =    new clEvents();
        Settings = new clSettings();
          Settings.getSettings();
        MyOrder =  new clClientOrder();

        User.initToken();
        content = Dom.sel('.content');

        User.city = localStorage.getItem('_my_city');
        User.id   = localStorage.getItem('_my_id');
        User.lat  = localStorage.getItem('_my_pos_lat');
        User.lng  = localStorage.getItem('_my_pos_lon');    

        if ( localStorage.getItem('_is_auth') === "true" ) {
          User.is_auth = true;
        }

        User.token = localStorage.getItem('_my_token');
        
        //console.log('this = ' + App.ex);
        
        Geo.init();
        MainMenu.init();
        InputFilters.init();
        Router.start(App);

        window.addEventListener('resize', function() {
          init();
        });

      });

      return User;
    },

    init: function () {
      domReady(function () {
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
      });
    }
  };
  
  return App;

});
