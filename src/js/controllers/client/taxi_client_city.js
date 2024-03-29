/* global User, Event, Conn, Maps, SafeWin */

define(['Dom', 'HideForms', 'GetPositions', 'Lists', 'Destinations', 'ModalWindows', 'ClientOrder', 'Storage'],
  function (Dom, HideForms, GetPositions, Lists, Destinations, Modal, clClientOrder, Storage) {
    var content = Dom.sel('.content'), 
        global_el,
        global_item,
        MyOrder,
        eventOnChangeZoom,
        old_filters = Storage.getActiveFilters(),
        old_sorts   = Storage.getActiveSortFilters();
    
    function cbDeleteOrder(response) {
      Conn.clearCb('cbDeleteOrder');
      
      if (!response.error) {
        global_item.style.display = 'none';
      }
    }
    
    function cbAfterAddFav() {
      Conn.clearCb('cbAfterAddFav');
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="deltofav">Удалить из Избранного</button>';
    }
    
    function cbAfterDeleteFav() {
      Conn.clearCb('cbAfterDeleteFav');
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="addtofav">Избранное</button>';
    }
    
    function cbAfterAddBlackList() {
      Conn.clearCb('cbAfterAddBlackList');
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="deltoblack">Удалить из Черного списка</button>';
    }
    
    function cbAfterDeleteBlackList() {
      Conn.clearCb('cbAfterDeleteBlackList');
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="addtoblack">Черный список</button>';
    }
    
    function cbGetOffers(response) {
      var filters = Storage.getActiveFilters(),
          sorts   = Storage.getActiveSortFilters();

      if (filters !== old_filters || old_sorts !== sorts) {
        Conn.request('stopGetOffers');
        Conn.clearCb('cbGetOffers');
        Conn.request('startGetOffers', '', cbGetOffers);
        old_filters = filters;
        old_sorts   = sorts;

        return;
      }
      
      if (!response.error) {
        Lists.allOffers(response.result);
      }
      
      old_filters = filters;
    }
    
    function cbGetMyOrder(response) {
      Conn.request('stopGetOrders');
      Conn.clearCb('cbGetMyOrder');
      
      if (!response.error) {
        Lists.myOrders(response.result);
      }
    }
    
    function cbChangeFavorites(response) {
      Conn.clearCb('cbChangeFavorites');
      
      if (!response.error) {
        Conn.request('requestMyOrders', '', cbGetMyOrder);
      }
    }

    function initMap() {
      Maps.setCenter(User.lat, User.lng);
      Maps.setZoom(15);
    }

    function addEvents() {
      Event.click = function (event) {
        var target = event.target,
            el;

        while (target !== this) {
          if (target) {
            //  = EVENTS FOR ADD FAV AND BLACK LIST FRON MARKER's DRIVER = 
            if (target.dataset.click === "addtofav") {
              global_el = target;
              Conn.request('addFavorites', target.dataset.id, cbAfterAddFav);
            }
            
            if (target.dataset.click === "deltofav") {
              global_el = target;
              Conn.request('deleteFavorites', target.dataset.id, cbAfterDeleteFav);
            }
            
            if (target.dataset.click === "addtoblack") {
              global_el = target;
              Conn.request('addBlackList', target.dataset.id, cbAfterAddBlackList);
            }
            
            if (target.dataset.click === "deltoblack") {
              global_el = target;
              Conn.request('deleteBlackList', target.dataset.id, cbAfterDeleteBlackList);
            }

            //  ============= EVENTS FOR DESTINATION FIELDS ============== 
            if (target.dataset.click === 'choose_address') {
              el = target;
              Storage.setTemporaryRoute(el.name);
              Storage.setTemporaryAddress(el.value);
              Storage.setActiveTypeModelTaxi('order');
              goToPage = '#client_choose_address';
            }
            
            if (target.dataset.click === 'choice_location') {
              Storage.setTemporaryRoute(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
              Storage.setActiveTypeModelTaxi('order');
              goToPage = '#client_choice_location_map';
              break;
            }
            
            // = Form add new point order =
            if (target.dataset.click === 'field_add') {
              var just_add = Dom.selAll('.icon-record').length;

              if (just_add > 0) {
                if (Dom.selAll('.icon-record')[just_add - 1].parentNode.querySelectorAll('input')[0].value !== "") {
                  Destinations.addNewInterpoint(just_add);
                }
              } else {
                Destinations.addNewInterpoint(just_add);
              }
              break;
            }
            
            if (target.dataset.click === 'date_order') {
              Modal.calendar(function (datetime) {
                                Destinations.addStartTimeOrder(datetime);
                              });
              break;
            }

            if (target.dataset.click === 'clean-field') {
              Destinations.cleanFieldOrder(target.dataset.field);
              break;
            }
            
            if (target.dataset.click === 'field_add_time') {
              Destinations.addTimeOrder(target.dataset.id);
              break;
            }
            
              // = Form delete point order =
            if (target.dataset.click === 'field_delete') {
              Destinations.deleteField(target);
              break;
            }
            
            //  =============== EVENTS FOR MENU MY ORDERS ================
              // = Menu my Orders Item =
            if (target.dataset.click === 'myorders_item_menu') {
              var menu = target.parentNode.children[1],
                  currentState = menu.style.display;

              if (currentState === 'none' || currentState === '') {
                menu.style.display = 'block';
              } else {
                menu.style.display = 'none';
              }

              return;
            }
            
            if (target.dataset.click === "save-order") {
              Storage.setActiveTypeModelTaxi('order');
              Destinations.saveOrder(function () {
                goToPage = '#client_map';
              });

              return;
            }
          
              // = Menu my Orders Item DELETE order =
            if (target.dataset.click === 'myorders_item_menu_delete') {
              global_item = target.parentNode.parentNode.parentNode;
              Conn.request('deleteOrderById', target.dataset.id, cbDeleteOrder);
            }
              // = Menu my Orders Item GO order =
            if (target.dataset.click === 'myorders_item_menu_go') {
              MyOrder.getByID(target.dataset.id, function () {
                goToPage = "#client_map";
              });
            }
              // = Menu my Orders Item add to Favorites =
            if (target.dataset.click === 'myorders_item_menu_add_fav') {
              Conn.request('addOrderToFav', target.dataset.id, cbChangeFavorites);
            }
              // = Menu my Orders Item delete to Favorites =
            if (target.dataset.click === 'myorders_item_menu_delete_fav') {
              Conn.request('addOrderFromFav', target.dataset.id, cbChangeFavorites);
            }
            
            //  =============== EVENTS FOR LIST OF OFFERS ================
            if (target.dataset.click === "open-offer") {
              el = target;
              
              Storage.setActiveTypeModelTaxi('offer');
              Storage.setActiveTypeTaxi('taxi');
              Storage.setOpenOfferId(el.dataset.id);
              goToPage = "#client_offer";
            }
            
            if (target.dataset.click === "taxi_bid") {
              var data = {};
              
              data.id = target.dataset.id;
              
              if (Dom.toggle(target, 'active')) {
                Conn.request('disagreeOffer', target.dataset.id);
              } else {
                Conn.request('agreeOffer', data);
              }
            }
            
            //  =========== EVENTS FILTERS AND SORTS FOR OFFERS =============
            if (target.dataset.click === "fav-orders") {
              Lists.filterToggleFav(target);
            }
            
            if (target.dataset.click === "filter-orders") {
              Lists.filterShowWindow(target);
            }
            
            if (target.dataset.click === "sort-orders") {
              Lists.filterSortWindow(target);
            }
            
            if (target.dataset.click === "automat-orders") {
              Lists.enableAutomat(target, false);
            }
          }

          if (target) {
            target = target.parentNode;
          } else {
            break;
          }
        }
      };
      
      content.addEventListener('click', Event.click);
    }

    function stop() {
      Lists.clear();
      GetPositions.clear();
      Destinations.clear();
      Conn.clearCb('cbGetOffers');
      Conn.request('stopGetOffers');
      Maps.removeEvent(eventOnChangeZoom);
      Storage.lullModel(MyOrder);
      Modal.close();
      SafeWin.disableZoneForRoute();
    }

    function start() {
      Storage.setActiveTypeModelTaxi('order');
      Storage.setActiveTypeTaxi('taxi');
      Storage.setActiveTypeFilters('offers');
      MyOrder = new clClientOrder();
      MyOrder.activateCity();
      Lists.init(MyOrder);
      Maps.mapOn();
      eventOnChangeZoom = GetPositions.drivers();
      GetPositions.my();
      initMap();
      // ===== Draw New Order =====
      Destinations.init(MyOrder);
      // = Draw Offers of Drivers =
      Lists.filtersStart();
      Conn.request('startGetOffers', '', cbGetOffers);
      // ===== Draw My Orders =====
      Conn.request('requestMyOrders', '', cbGetMyOrder);
      HideForms.init();
      addEvents();
    }

    return {
      start: start,
      clear: stop
    };

  });