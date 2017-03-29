/* global User, Event, Conn, Maps */

define(['Dom', 'HideForms', 'GetPositions', 'Lists', 'Destinations', 'ModalWindows', 'ClientOrder', 'Storage'],
  function (Dom, HideForms, GetPositions, Lists, Destinations, Modal, clClientOrder, Storage) {
    var content = Dom.sel('.content'), 
        global_el,
        MyOrder,
        eventOnChangeZoom,
        old_filters = localStorage.getItem('_filters_active');
    
    function cbAfterAddFav() {
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="deltofav">Удалить из Избранного</button>';
      Conn.clearCb();
    }
    
    function cbAfterDeleteFav() {
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="addtofav">Избранное</button>';
      Conn.clearCb();
    }
    
    function cbAfterAddBlackList() {
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="deltoblack">Удалить из Черного списка</button>';
    }
    
    function cbAfterDeleteBlackList() {
      global_el.parentNode.innerHTML = '<button data-id="' + global_el.dataset.id  + '" data-click="addtoblack">Черный список</button>';
    }
    
    function cbGetOffers(response) {
      var filters = localStorage.getItem('_filters_active');

      if (filters !== old_filters) {
        Conn.request('stopGetOffers');
        Conn.clearCb('cbGetOffers');
        Conn.request('startGetOffers', '', cbGetOffers);
        old_filters = filters;

        return;
      }
      
      if (!response.error) {
        Lists.allOffers(response.result);
      }
      
      old_filters = filters;
    }
    
    function cbGetMyOrder(response) {
      if (!response.error) {
        Lists.myOrders(response.result);
      }
        Conn.request('stopGetOrders');
        Conn.clearCb('cbGetMyOrder');
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
              Conn.addFavorites(target.dataset.id, cbAfterAddFav);
            }
            
            if (target.dataset.click === "deltofav") {
              global_el = target;
              Conn.deleteFavorites(target.dataset.id, cbAfterDeleteFav);
            }
            
            if (target.dataset.click === "addtoblack") {
              global_el = target;
              Conn.addBlackList(target.dataset.id, cbAfterAddBlackList);
            }
            
            if (target.dataset.click === "deltoblack") {
              global_el = target;
              Conn.deleteBlackList(target.dataset.id, cbAfterDeleteBlackList);
            }

            //  ============= EVENTS FOR DESTINATION FIELDS ============== 
            if (target.dataset.click === 'choose_address') {
              el = target;

              localStorage.setItem('_address_temp', el.name);
              localStorage.setItem('_address_string_temp', el.value);
              Storage.setActiveTypeModelTaxi('order');
              localStorage.setItem('_active_city', User.city);
              window.location.hash = '#client_choose_address';
            }
            
            if (target.dataset.click === 'choice_location') {
              localStorage.setItem('_address_temp', target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
              Storage.setActiveTypeModelTaxi('order');
              window.location.hash = '#client_choice_location_map';
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
              Modal.calendar( function (datetime) {
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
              Destinations.saveOrder();

              return;
            }
          
              // = Menu my Orders Item DELETE order =
            if (target.dataset.click === 'myorders_item_menu_delete') {
              Lists.deleteOrder(target);

              return;
            }
            
              // = Menu my Orders Item GO order =
            if (target.dataset.click === 'myorders_item_menu_go') {
              Lists.getOrderByID(target.dataset.id);

              return;
            }
            
            //  =============== EVENTS FOR LIST OF OFFERS ================
            if (target.dataset.click === "open-offer") {
              el = target;
              
              localStorage.setItem('_open_offer_id', el.dataset.id);
              window.location.hash = "#client_offer";
            }
            
            if (target.dataset.click === "taxi_bid") {
              var data = {};
              
              data.id = target.dataset.id;
              
              if (Dom.toggle(target, 'active')) {
                Conn.request('disagreeOffer', data);
              } else {
                Conn.request('agreeOffer', data);
              }
            }
            
            if (target.dataset.click === "open-offer") {
              var id = target.dataset.id;

              localStorage.setItem('_open_offer_id', id);
              //Lists.getByID(id, 'clDriverOffer');
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
    }

    function start() {
      Storage.setActiveTypeModelTaxi('order');
      Storage.setActiveTypeTaxi('taxi');
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