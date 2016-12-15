define(['Dom', 'Chat'], function (Dom, Chat) {
  
  var App;
  var routes = [{hash:'#edit_profile', controller:'ctrlPageEditProfile', title:'Редактирование профиля', menu:'', pageType: 'back-arrow'},
                {hash:'#login', controller:'ctrlPageLogin', title:'Авторизация', menu:'', pageType: 'back-arrow'},
                {hash:'#logout', controller:'ctrlPageLogout', title:'Выход', menu:'', pageType: 'back-arrow'},
                {hash:'#sms', controller:'ctrlPageSms', title:'Введите код', menu:'', pageType: 'back-arrow'},
                {hash:'#settings', controller:'ctrlPageSettings', title:'Настройки', menu:'', pageType: 'back-arrow'},
                {hash:'#favorites', controller:'ctrlPageFavorites', title:'Избранные', menu:'', pageType: 'back-arrow'},
                {hash:'#client_choice_location_map', controller:'ctrlTaxiClientChoiceLocationMap', title:'Выбор на карте', menu:'client', pageType: 'back-arrow'},
                {hash:'#client_choose_address', controller:'ctrlTaxiClientChooseAddress', title:'Выбор адреса', menu:'client', pageType: 'back-arrow'},
                {hash:'#client_city', controller:'ctrlTaxiClientCity', title:'Город', menu:'client', pageType: ''},
                {hash:'#client_go', controller:'ctrlTaxiClientGo', title:'Поехали', menu:'client', pageType: ''},
                {hash:'#client_intercity', controller:'ctrlTaxiClientIntercity', title:'Межгород', menu:'client', pageType: ''},
                {hash:'#client_cargo', controller:'ctrlTaxiClientCargo', title:'Грузоперевозки', menu:'client', pageType: ''},
                {hash:'#client_feedback', controller:'ctrlTaxiClientFeedback', title:'Обратная связь', menu:'client', pageType: ''},
                {hash:'#client_help', controller:'ctrlTaxiClientHelp', title:'Помощь клиенту', menu:'client', pageType: ''},
                {hash:'#client_map', controller:'ctrlTaxiClientMap', title:'Поиск водителя', menu:'client', pageType: ''},
                {hash:'#client_my_orders', controller:'ctrlTaxiClientMyOrders', title:'Мои заказы', menu:'client', pageType: ''},
                {hash:'#driver_help', controller:'ctrlTaxiDriverHelp', title:'Помощь водителю', menu:'driver', pageType: ''},
                {hash:'#driver_my_account', controller:'ctrlTaxiDriverMyAccount', title:'Личный кабинет', menu:'driver', pageType: ''},
                {hash:'#driver_feedback', controller:'ctrlTaxiDriverFeedback', title:'Обратная связь', menu:'driver', pageType: ''},
                {hash:'#driver_rating', controller:'ctrlTaxiDriverRating', title:'Мой рейтинг', menu:'driver', pageType: ''},
                {hash:'#driver_cargo', controller:'ctrlTaxiDriverCargo', title:'Грузоперевозки', menu:'driver', pageType: ''},
                {hash:'#driver_city', controller:'ctrlTaxiDriverCity', title:'Город', menu:'driver', pageType: ''},
                {hash:'#driver_go', controller:'ctrlTaxiDriverGo', title:'Поехали', menu:'driver', pageType: ''},
                {hash:'#driver_order', controller:'ctrlTaxiDriverOrder', title:'Подробности заказа', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_intercity', controller:'ctrlTaxiDriverIntercity', title:'Межгород', menu:'driver', pageType: ''},
                {hash:'#driver_my_auto', controller:'ctrlTaxiDriverMyAuto', title:'Мой авто', menu:'driver', pageType: ''}];

  var defaultRoute = '#client_city';
  var currentHash = '';

  function startRouting(app) {
    App = app;
    window.location.hash = window.location.hash || defaultRoute;
    setInterval(hashCheck, 250);
  }

  function hashCheck() {
    if (window.location.hash !== currentHash) {
      for (var i = 0, currentRoute; currentRoute = routes[i++];) {
        if (window.location.hash === currentRoute.hash) {
          Dom.sel(".loading").style.visibility = "visible";
          loadController(currentRoute);
          }
      }
      currentHash = window.location.hash;
    }
  }
  
  function renderMenu (route) {
    Dom.sel('.header__title').innerHTML = route.title;
    
    if (route.pageType === "back-arrow") {
      Dom.sel('[data-click="menu-burger"]').style.display = "none";
      Dom.sel('[data-click="back-burger"]').style.display = "block";
      //Dom.sel('.header__link').innerHTML = '<a href="#" onclick="document.forms[0].submit(); return false;"><i class="icon-ok"></i></a>';
    } else {
      Dom.sel('[data-click="menu-burger"]').style.display = "block";
      Dom.sel('[data-click="back-burger"]').style.display = "none";
      //Dom.sel('.header__link').innerHTML = '<i class="icon-share"></i>';
    }

    Dom.sel('.header__link').innerHTML = '<i class="icon-share"></i>';
    
    var list = Dom.sel('.menu__list');
    var temp_els = [];
    
    if (list.children.length > 2) {
      for (var i = 0; i < (list.children.length - 2); i++) {
        temp_els[i] = list.children[i];
      }
      for (var i = 0; i < temp_els.length; i++) {
        temp_els[i].parentNode.removeChild(temp_els[i]);
      }
    }
    
    if (menus_arr[route.menu]) {
      for (var i = (menus_arr[route.menu].length - 1); i > -1; i--) {
        var add_icon = menus_arr[route.menu][i].add_icon ? menus_arr[route.menu][i].add_icon : '';
        var newLi = document.createElement('li');
          newLi.innerHTML = '<a href="' + menus_arr[route.menu][i].url + '">' + 
                          '<i class="icon-'+ menus_arr[route.menu][i].icon + '"></i>' + 
                          menus_arr[route.menu][i].name + 
                          add_icon + 
                      '</a>';
        list.insertBefore(newLi, list.firstChild);
      }
    }
  }
  
  function clearVars() {
    Chat.stop();
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
  }
  
  function loadController(route) {
    Dom.sel('.content').innerHTML = document.querySelector('#' + route.controller).innerHTML;
    renderMenu(route);
    clearVars();
    require([route.controller], function(controller) {
      App.init();
      controller.start(App);
      Dom.sel(".loading").style.visibility = "hidden";
    });
  }

  return {
    start: startRouting
  };
  
});