/* global User, menus_arr, timerSearchDriver, timerGetBidsTaxy, timerGetBidGo, timerGetMyPos, timerGetPosTaxy, timerCheckLoading, Event, timerUpdateTaxiClientOffers */

define(['Dom', 'Chat', 'Maps', 'Tabs', 'HideForms'], function (Dom, Chat, Maps, Tabs, HideForms) {
  
  var App, 
      old_controller,
      routes = [{hash:'#edit_profile', template:'PageEditProfile', controller:'ctrlPageEditProfile', model:'', title:'Редактирование профиля', menu:'', pageType: 'back-arrow'},
                {hash:'#start', template:'PageStart', controller:'ctrlPageStart', model:'', title:'Добро пожаловать', menu:'', pageType: ''},
                {hash:'#login', template:'PageLogin', controller:'ctrlPageLogin', model:'', title:'Авторизация', menu:'', pageType: 'back-arrow'},
                {hash:'#logout', template:'PageLogout', controller:'ctrlPageLogout', model:'', title:'Выход', menu:'', pageType: 'back-arrow'},
                {hash:'#edit_zone', template:'PageEditZone', controller:'ctrlPageEditZone', model:'', title:'Зона на карте', menu:'', pageType: 'back-arrow'},
                {hash:'#trusted_contacts', template:'PagesTrustedContacts', controller:'ctrlPagesTrustedContacts', model:'', title:'Доверенные контакты', menu:'', pageType: 'back-arrow'},
                {hash:'#zones', template:'PageZones', controller:'ctrlPageZones', model:'', title:'Зоны', menu:'', pageType: 'back-arrow'},
                {hash:'#sms', template:'PageSms', controller:'ctrlPageSms', model:'', title:'Введите код', menu:'', pageType: 'back-arrow'},
                {hash:'#settings', template:'PageSettings', controller:'ctrlPageSettings', model:'', title:'Настройки', menu:'', pageType: 'back-arrow'},
                {hash:'#favorites', template:'PageFavorites', controller:'ctrlPageFavorites', model:'', title:'Избранные', menu:'', pageType: 'back-arrow'},
                {hash:'#client_choice_location_map', template:'TaxiClientChoiceLocationMap', controller:'ctrlTaxiClientChoiceLocationMap', model:'', title:'Выбор на карте', menu:'client', pageType: 'back-arrow'},
                {hash:'#client_choose_address', template:'TaxiClientChooseAddress', controller:'ctrlTaxiClientChooseAddress', model:'', title:'Выбор адреса', menu:'client', pageType: 'back-arrow'},
                {hash:'#client_city', template:'TaxiClientCity', controller:'ctrlTaxiClientCity', model:'clClientOrder', title:'Город', menu:'client', pageType: ''},
                {hash:'#client_go', template:'TaxiClientGo', controller:'ctrlTaxiClientGo', model:'', title:'Поехали', menu:'client', pageType: ''},
                {hash:'#client_intercity', template:'TaxiClientIntercity', controller:'ctrlTaxiClientIntercity', model:'', title:'Межгород', menu:'client', pageType: ''},
                {hash:'#client_cargo', template:'TaxiClientCargo', controller:'ctrlTaxiClientCargo', model:'', title:'Грузоперевозки', menu:'client', pageType: ''},
                {hash:'#client_feedback', template:'TaxiClientFeedback', controller:'ctrlTaxiClientFeedback', model:'', title:'Обратная связь', menu:'client', pageType: ''},
                {hash:'#client_drivers_rating', template:'TaxiClientDriversRating', controller:'ctrlTaxiClientDriversRating', model:'', title:'Оставьте свой отзыв', menu:'client', pageType: ''},
                {hash:'#client_help', template:'TaxiClientHelp', controller:'ctrlTaxiClientHelp', model:'', title:'Помощь клиенту', menu:'client', pageType: ''},
                {hash:'#client_map', template:'TaxiClientMap', controller:'ctrlTaxiClientMap', model:'clClientOrder', title:'Поиск водителя', menu:'client', pageType: ''},
                {hash:'#driver_help', template:'TaxiDriverHelp', controller:'ctrlTaxiDriverHelp', model:'', title:'Помощь водителю', menu:'driver', pageType: ''},
                {hash:'#driver_new_offer', template:'TaxiDriverNewOffer', controller:'ctrlTaxiClientCity', model:'clDriverOffer', title:'Новое предложение', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_my_offer', template:'TaxiDriverOffer', controller:'ctrlTaxiClientMap', model:'clDriverOffer', title:'Мое предложение', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_my_account', template:'TaxiDriverMyAccount', controller:'ctrlTaxiDriverMyAccount', model:'', title:'Личный кабинет', menu:'driver', pageType: ''},
                {hash:'#driver_feedback', template:'TaxiDriverFeedback', controller:'ctrlTaxiDriverFeedback', model:'', title:'Обратная связь', menu:'driver', pageType: ''},
                {hash:'#driver_rating', template:'TaxiDriverRating', controller:'ctrlTaxiDriverRating', model:'', title:'Мой рейтинг', menu:'driver', pageType: ''},
                {hash:'#driver_cargo', template:'TaxiDriverCargo', controller:'ctrlTaxiDriverCargo', model:'', title:'Грузоперевозки', menu:'driver', pageType: ''},
                {hash:'#driver_city', template:'TaxiDriverCity', controller:'ctrlTaxiDriverCity', model:'clClientOrder', title:'Город', menu:'driver', pageType: ''},
                {hash:'#driver_clients_rating', template:'TaxiDriverClientsRating', controller:'ctrlTaxiDriverClientsRating', model:'', title:'Оставьте свой отзыв', menu:'driver', pageType: ''},
                {hash:'#driver_go', template:'TaxiDriverGo', controller:'ctrlTaxiDriverGo', model:'', title:'Поехали', menu:'driver', pageType: ''},
                {hash:'#driver_order', template:'TaxiDriverOrder', controller:'ctrlTaxiDriverOrder', model:'clClientOrder', title:'Подробности заказа', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_intercity', template:'TaxiDriverIntercity', controller:'ctrlTaxiDriverIntercity', model:'', title:'Межгород', menu:'driver', pageType: ''},
                {hash:'#driver_my_auto', template:'TaxiDriverMyAuto', controller:'ctrlTaxiDriverMyAuto', model:'', title:'Мой авто', menu:'driver', pageType: ''}],
      defaultRoute = '#start',
      currentHash = '';

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
    var i;
    
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
    
    var list = Dom.sel('.menu__list'),
        temp_els = [];
    
    if (list.children.length > 2) {
      for (i = 0; i < (list.children.length - 2); i++) {
        temp_els[i] = list.children[i];
      }
      for (i = 0; i < temp_els.length; i++) {
        temp_els[i].parentNode.removeChild(temp_els[i]);
      }
    }
    
    if (menus_arr[route.menu]) {
      for (i = (menus_arr[route.menu].length - 1); i > -1; i--) {
        var add_icon = menus_arr[route.menu][i].add_icon || '',
            newLi = document.createElement('li');
          
        newLi.innerHTML = '<a href="' + menus_arr[route.menu][i].url + '">' +
                            '<i class="icon-'+ menus_arr[route.menu][i].icon + '"></i>' +
                            menus_arr[route.menu][i].name + add_icon +
                          '</a>';
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
    clearInterval(timerGetMyPos);
    clearInterval(timerCheckLoading);
    clearInterval(timerUpdateTaxiClientOffers);

    Dom.sel('.content').removeEventListener('click', Event.click);
    Dom.sel('.content').removeEventListener('submit', Event.submit);
    Dom.sel('.content').removeEventListener('mouseenter', Event.hover);
    //content.removeEventListener('keyup');
    //content.removeEventListener('keypress');
  }
  
  function loadController(route) {
    var content_el = Dom.sel('.content'),
        dynamic_el = Dom.sel('.dynamic'),
        content = document.querySelector('#' + route.template).innerHTML,
        dynamic = document.createElement('div');
      
    Tabs.clear();
    HideForms.clear();
            
    if (dynamic_el) {
      dynamic_el.parentNode.removeChild(dynamic_el);
    }
      
    dynamic.classList.add('dynamic');
    dynamic.innerHTML = content;
    content_el.appendChild(dynamic);

    renderMenu(route);
    Maps.mapOff();
    clearVars();
    
    if (old_controller) {
      require([old_controller.controller], function(controller) {
        controller.clear();
      });
    }
    
    require([route.controller], function(controller) {
      App.init();
      controller.start(route.model);
      Dom.finishLoading();
    });
  }

  return {
    start: startRouting
  };
  
});