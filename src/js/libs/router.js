/* global User, menus_arr, timerCheckLoading, Event, Conn, Maps, goToPage, isGeolocation, SafeWin, urlArgs */

define(['Dom', 'Chat', 'Tabs', 'HideForms', 'Redirect', 'Storage'], 
function (Dom, Chat, Tabs, HideForms, Redirect, Storage) {
  
  var App, 
      old_controller,
      routes = [{hash:'#edit_profile', template:'PageEditProfile', controller:'ctrlPageEditProfile', title:'Мой профиль', menu:'', pageType: 'back-arrow'},
                {hash:'#start', controller:'ctrlPageStart', title:'Добро пожаловать', menu:'', pageType: ''},
                {hash:'#login', template:'PageLogin', controller:'ctrlPageLogin', title:'Авторизация', menu:'', pageType: 'back-arrow'},
                {hash:'#logout', controller:'ctrlPageLogout', title:'Выход', menu:'', pageType: 'back-arrow'},
                {hash:'#edit_zone', template:'PageEditZone', controller:'ctrlPageEditZone', title:'Зона на карте', menu:'', pageType: 'back-arrow'},
                {hash:'#trusted_contacts', controller:'ctrlPageTrustedContacts', title:'Доверенные', menu:'', pageType: 'back-arrow'},
                {hash:'#parent_control', controller:'ctrlPageParentControl', title:'Род. контроль', menu:'', pageType: 'back-arrow'},
                {hash:'#parent_map', template:'PageParentMap', controller:'ctrlPageParentMap', title:'Род. контроль', menu:'', pageType: 'back-arrow'},
                {hash:'#zones', controller:'ctrlPageZones', title:'Зоны', menu:'', pageType: 'back-arrow'},
                {hash:'#messages', controller:'ctrlPageMessages', title:'Сообщения', menu:'', pageType: 'back-arrow'},
                {hash:'#admin', template:'PageAdmin', controller:'ctrlPageAdmin', title:'Параметры', menu:'client', pageType: ''},
                {hash:'#open_message', controller:'ctrlPageOpenMessage', title:'Сообщение', menu:'', pageType: 'back-arrow'},
                {hash:'#sms', controller:'ctrlPageSms', title:'Введите код', menu:'', pageType: 'back-arrow'},
                {hash:'#settings', template:'PageSettings', controller:'ctrlPageSettings', title:'Настройки', menu:'', pageType: 'back-arrow'},
                {hash:'#favorites', template:'PageFavorites', controller:'ctrlPageFavorites', title:'Избранные', menu:'', pageType: 'back-arrow'},
                {hash:'#client_choice_location_map', template:'TaxiClientChoiceLocationMap', controller:'ctrlTaxiClientChoiceLocationMap', title:'Выбор на карте', menu:'client', pageType: 'back-arrow'},
                {hash:'#client_choose_address', template:'TaxiClientChooseAddress', controller:'ctrlTaxiClientChooseAddress', title:'Выбор адреса', menu:'client', pageType: 'back-arrow'},
                {hash:'#client_city', template:'TaxiClientCity', controller:'ctrlTaxiClientCity', title:'Город', menu:'client', pageType: ''},
                {hash:'#client_go', template:'TaxiClientGo', controller:'ctrlTaxiClientGo', title:'Поехали', menu:'client', pageType: ''},
                {hash:'#client_intercity', template:'TaxiClientIntercity', controller:'ctrlTaxiClientIntercity', title:'Межгород', menu:'client', pageType: ''},
                {hash:'#client_tourism', template:'TaxiClientTourism', controller:'ctrlTaxiClientTourism', title:'Туризм', menu:'client', pageType: ''},
                {hash:'#client_trucking', template:'TaxiClientTrucking', controller:'ctrlTaxiClientTrucking', title:'Грузоперевозки', menu:'client', pageType: ''},
                {hash:'#client_feedback', template:'TaxiClientFeedback', controller:'ctrlTaxiClientFeedback', title:'Обратная связь', menu:'client', pageType: ''},
                {hash:'#client_help', template:'TaxiClientHelp', controller:'ctrlTaxiClientHelp', title:'Помощь клиенту', menu:'client', pageType: ''},
                {hash:'#client_map', template:'TaxiClientMap', controller:'ctrlTaxiClientMap', title:'Поиск водителя', menu:'client', pageType: ''},
                {hash:'#client_offer', template:'TaxiClientOffer', controller:'ctrlTaxiClientOffer', title:'Предложение', menu:'client', pageType: ''},
                {hash:'#driver_help', template:'TaxiDriverHelp', controller:'ctrlTaxiDriverHelp', title:'Помощь водителю', menu:'driver', pageType: ''},
                {hash:'#driver_new_offer', template:'TaxiDriverNewOffer', controller:'ctrlTaxiDriverNewOffer', title:'Новое предложение', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_my_offer', template:'TaxiDriverOffer', controller:'ctrlTaxiDriverOffer', title:'Мое предложение', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_my_account', template:'TaxiDriverMyAccount', controller:'ctrlTaxiDriverMyAccount', title:'Личный кабинет', menu:'driver', pageType: ''},
                {hash:'#driver_feedback', template:'TaxiDriverFeedback', controller:'ctrlTaxiDriverFeedback', title:'Обратная связь', menu:'driver', pageType: ''},
                {hash:'#driver_rating', template:'TaxiDriverRating', controller:'ctrlTaxiDriverRating', title:'Мой рейтинг', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_trucking', template:'TaxiDriverTrucking', controller:'ctrlTaxiDriverTrucking', title:'Грузоперевозки', menu:'driver', pageType: ''},
                {hash:'#driver_city', template:'TaxiDriverCity', controller:'ctrlTaxiDriverCity', title:'Город', menu:'driver', pageType: ''},
                {hash:'#driver_go', template:'TaxiDriverGo', controller:'ctrlTaxiDriverGo', title:'Поехали', menu:'driver', pageType: ''},
                {hash:'#driver_order', template:'TaxiDriverOrder', controller:'ctrlTaxiDriverOrder', title:'Подробности заказа', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_intercity', template:'TaxiDriverIntercity', controller:'ctrlTaxiDriverIntercity', title:'Межгород', menu:'driver', pageType: ''},
                {hash:'#driver_tourism', template:'TaxiDriverTourism', controller:'ctrlTaxiDriverTourism', title:'Туризм', menu:'driver', pageType: ''},
                {hash:'#driver_my_auto', template:'TaxiDriverMyAuto', controller:'ctrlTaxiDriverMyAuto', title:'Мой гараж', menu:'driver', pageType: 'back-arrow'},
                {hash:'#driver_edit_auto', template:'TaxiDriverEditAuto', controller:'ctrlTaxiDriverEditAuto', title:'Мой авто', menu:'', pageType: 'back-arrow'}],
      defaultRoute = '#start',
      currentHash = '';

  function hashCheck() {
    if (!goToPage || goToPage === "undefined") {
      goToPage = '#start';
    }
    
    if (window.location.hash !== goToPage && window.location.hash !== currentHash) {
      goToPage = window.location.hash;
    }
    
    if (User.city && User.lat && User.lng && (Conn.is_connect || Conn.alreadyStart) && !Maps.loading && isGeolocation) {
      MayLoading = true;
    } else {
      if (!Conn.is_connect) {
        if (!Conn.is_connecting) {
          //Conn.start(function(){});
        }
      }
      MayLoading = false;
    }
    
    if (!MayLoading) {
      goToPage = '#start';
    }
    
    if (!Conn.is_connect) {
      if (Conn.alreadyStart) {
        Dom.startAgainConnection();
        return;
      }
    } else {
      Dom.finishAgainConnection();
    }
    
    Redirect.check(currentHash);
    
      var last_page = Storage.getLastPage(),
          cur_hash  = goToPage;

      if (last_page !== cur_hash) {
        if (cur_hash !== "#logout" && cur_hash !== "#start" && cur_hash !== "") {
          Storage.setLastPage(cur_hash);
        }
      } 
      
    if (goToPage !== currentHash) {
      window.location.hash = goToPage;
      
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
      
      Storage.addHistoryPages(window.location.hash);
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
      var isd = Storage.getIsDriverMenu();
      
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
  }
  
  function clearVars() {
    Chat.stop();
    timerCheckLoading = clearInterval(timerCheckLoading);

    Dom.sel('.content').removeEventListener('click', Event.click);
    Dom.sel('.content').removeEventListener('submit', Event.submit);
    Dom.sel('.content').removeEventListener('mouseenter', Event.hover);
    //content.removeEventListener('keyup');
    //content.removeEventListener('keypress');
  }
  
  function render(template, callback) {
    var content_el      = Dom.sel('.content'),
        dynamic_el      = Dom.sel('.dynamic'),
        templateEl      = document.createElement('div'),
        dynamic         = document.createElement('div'),
        componentHtml   = document.createDocumentFragment(),
        componentScript = document.createElement('script');

    
    if (dynamic_el) {
      dynamic_el.parentNode.removeChild(dynamic_el);
    }
    
    dynamic.classList.add('dynamic');
    content_el.appendChild(dynamic);
    
    if (template) {
        var request = new XMLHttpRequest();
        
        request.open('GET', 'assets/js/templates/' + template + '.htm?' + urlArgs, true);

        request.onload = function() {
          if (request.status >= 200 && request.status < 400) {
            templateEl.innerHTML = request.responseText;

            componentHtml.appendChild(templateEl.querySelector('template').content);
            var scriptNode = templateEl.querySelector('script');
            
            dynamic.appendChild(componentHtml);
            
            if (scriptNode) {
              componentScript.innerHTML = scriptNode.innerHTML;
              dynamic.appendChild(componentScript);
            }
            
            callback();
          }
        };

        request.send();
    } else {
        callback();
    }
  }
  
  function loadController(route) {
    currentRoute = route;
    Tabs.clear();
    HideForms.clear();
    SafeWin.reloadPage();
    
    renderMenu(route);
    Maps.mapOff();
    clearVars();
    
    if (old_controller) {
      require([old_controller.controller], function(controller) {
        controller.clear();
      });
    }
    
    render(route.template, function() {
        require([route.controller], function(controller) {
          App.init();
          controller.start();
          Dom.finishLoading();
        });
    });
  }
  
  function checkActiveOrder() {
    Conn.request('requestMyOrders', '', cbCheckActiveOrder);
    Conn.request('stopGetOrders');
  }
  
  function cbCheckActiveOrder(response) {
      Conn.clearCb('cbCheckActiveOrder');
      
      if (!response.error) {
        var orders = response.result.orders,
            tempArr = [];
          
        for (var i = 0; i < orders.length; i++) {

          if (!orders[i].finished && !orders[i].canceled) {
            tempArr.push(parseInt(orders[i].id));
          }
        }
        
        Storage.addMyActiveOrder(tempArr);
      }
  }

  return {
    start: function (app, callback) {
      App = app;
      //window.location.hash = window.location.hash || defaultRoute;
      setInterval(hashCheck, 250);
      if (!Conn.is_connect && !Conn.is_connecting) {
        Conn.start(function(){
          callback();
        });
      }
    }
  };
  
});