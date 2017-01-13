define(['Dom', 'Chat'], function (Dom, Chat) {
  
  var App, old_controller;
  var routes = [{hash:'#edit_profile', controller:'ctrlPageEditProfile', title:'Редактирование профиля', menu:'', pageType: 'back-arrow'},
                {hash:'#start', controller:'ctrlPageStart', title:'Добро пожаловать', menu:'', pageType: ''},
                {hash:'#login', controller:'ctrlPageLogin', title:'Авторизация', menu:'', pageType: 'back-arrow'},
                {hash:'#logout', controller:'ctrlPageLogout', title:'Выход', menu:'', pageType: 'back-arrow'},
                {hash:'#zones', controller:'ctrlPageZones', title:'Зоны', menu:'', pageType: 'back-arrow'},
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
                {hash:'#client_drivers_rating', controller:'ctrlTaxiClientDriversRating', title:'Оставьте свой отзыв', menu:'client', pageType: ''},
                {hash:'#client_help', controller:'ctrlTaxiClientHelp', title:'Помощь клиенту', menu:'client', pageType: ''},
                {hash:'#client_map', controller:'ctrlTaxiClientMap', title:'Поиск водителя', menu:'client', pageType: ''},
                {hash:'#client_my_orders', controller:'ctrlTaxiClientMyOrders', title:'Мои заказы', menu:'client', pageType: ''},
                {hash:'#driver_help', controller:'ctrlTaxiDriverHelp', title:'Помощь водителю', menu:'driver', pageType: ''},
                {hash:'#driver_my_account', controller:'ctrlTaxiDriverMyAccount', title:'Личный кабинет', menu:'driver', pageType: ''},
                {hash:'#driver_feedback', controller:'ctrlTaxiDriverFeedback', title:'Обратная связь', menu:'driver', pageType: ''},
                {hash:'#driver_rating', controller:'ctrlTaxiDriverRating', title:'Мой рейтинг', menu:'driver', pageType: ''},
                {hash:'#driver_cargo', controller:'ctrlTaxiDriverCargo', title:'Грузоперевозки', menu:'driver', pageType: ''},
                {hash:'#driver_city', controller:'ctrlTaxiDriverCity', title:'Город', menu:'driver', pageType: ''},
                {hash:'#driver_clients_rating', controller:'ctrlTaxiDriverClientsRating', title:'Оставьте свой отзыв', menu:'driver', pageType: ''},
                {hash:'#driver_go', controller:'ctrlTaxiDriverGo', title:'Поехали', menu:'driver', pageType: ''},
                {hash:'#driver_order', controller:'ctrlTaxiDriverOrder', title:'Подробности заказа', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_intercity', controller:'ctrlTaxiDriverIntercity', title:'Межгород', menu:'driver', pageType: ''},
                {hash:'#driver_my_auto', controller:'ctrlTaxiDriverMyAuto', title:'Мой авто', menu:'driver', pageType: ''}];

  var defaultRoute = '#start';
  var currentHash = '';

  function startRouting(app) {
    App = app;
    window.location.hash = window.location.hash || defaultRoute;
    setInterval(hashCheck, 250);
  }

  function hashCheck() {
    if (User.city) {
      MayLoading = true;
    } else {
      MayLoading = false;
    }
    if (!MayLoading) {
      window.location.hash = '#start';
    }
    if (window.location.hash !== currentHash) {
      for (var i = 0, currentRoute; currentRoute = routes[i++];) {
        if (currentHash === currentRoute.hash) {
          old_controller = currentRoute;
        }
      }
      for (var i = 0, currentRoute; currentRoute = routes[i++];) {
        if (window.location.hash === currentRoute.hash) {
          Dom.startLoading();
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
      if (route.menu !== "") {
        Dom.sel('[data-click="menu-burger"]').style.display = "block";
        Dom.sel('[data-click="back-burger"]').style.display = "none";
        //Dom.sel('.header__link').innerHTML = '<i class="icon-share"></i>';
      } else {
        Dom.sel('[data-click="menu-burger"]').style.display = "none";
        Dom.sel('[data-click="back-burger"]').style.display = "none";
      }
    }

    var toggle = Dom.sel('.header__toggle');

    if (route.menu === "driver") {
      toggle.innerHTML = '<div class="header__toggle__button" data-click="toggleIsDriver"></div>';
      var isd = localStorage.getItem('_is_driver');
      if (isd) {
        var but = Dom.sel('.header__toggle__button');
        Dom.toggle(but, 'active');
      }
    } else {
      toggle.innerHTML = '';
    }
    
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
        var add_icon = menus_arr[route.menu][i].add_icon || '';
        var newLi = document.createElement('li');
          newLi.innerHTML = '<a href="' + menus_arr[route.menu][i].url + '">\n\
                             <i class="icon-'+ menus_arr[route.menu][i].icon + '"></i>\n\
                             ' + menus_arr[route.menu][i].name + add_icon + '\
                             </a>';
        list.insertBefore(newLi, list.firstChild);
      }
    }
    
    var win_route = Dom.selAll('.safe_by_route')[0];
    if (win_route) {
      if (route.hash === "#client_go" || route.hash === "#driver_go" || route.hash === "#client_map") {
        win_route.classList.remove('hidden');
      } else {
        win_route.classList.add('hidden');
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
    clearInterval(timerCheckLoading);

    Dom.sel('.content').removeEventListener('click', Event.click);
    Dom.sel('.content').removeEventListener('submit', Event.submit);
    Dom.sel('.content').removeEventListener('mouseenter', Event.hover);
    //content.removeEventListener('keyup');
    //content.removeEventListener('keypress');
  }
  
  function loadController(route) {
    var content_el = Dom.sel('.content');
    var dynamic_el = Dom.sel('.dynamic');
    
    if (dynamic_el) {
      dynamic_el.parentNode.removeChild(dynamic_el);
    }

    var content = document.querySelector('#' + route.controller).innerHTML;
    var dynamic = document.createElement('div');
      dynamic.classList.add('dynamic');
      dynamic.innerHTML = content;
    content_el.appendChild(dynamic);

    renderMenu(route);
    Dom.mapOff();
    clearVars();
    if (old_controller) {
      require([old_controller.controller], function(controller) {
        controller.clear();
      });
    }
    require([route.controller], function(controller) {
      App.init();
      controller.start(App);
      Dom.finishLoading();
    });
  }

  return {
    start: startRouting
  };
  
});