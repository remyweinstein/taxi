/* global User, Maps, Conn, Event */

define(['Dom', 'GetPositions', 'Destinations', 'Lists', 'HideForms', 'ModalWindows', 'Storage', 'ClientOrder'], 
function (Dom, GetPositions, Destinations, Lists, HideForms, Modal, Storage, clClientOrder) {
  var content = Dom.sel('.content'),
      eventOnChangeZoom,
      global_el,
      MyOrder;

  function cbGetMyCargoOrder(response) {
    if (!response.error) {
      Lists.myOrders(response.result);
    }
      Conn.request('stopGetOrders');
      Conn.clearCb('cbGetMyCargoOrder');
  }

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
          
          if (target.dataset.click === "save-order") {
            Destinations.saveOrderCargo();

            return;
          }


          
          //  ============= EVENTS FOR DESTINATION FIELDS ============== 
          if (target.dataset.click === 'choose_address') {
            el = target;
            Storage.setTemporaryAddress(el.value);
            Storage.setTemporaryRoute(el.name);
            window.location.hash = '#client_choose_address';
          }

          if (target.dataset.click === 'choice_location') {
            Storage.setTemporaryRoute(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
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
    Maps.removeEvent(eventOnChangeZoom);
    Storage.lullModel(MyOrder);
  }
  
  function start() {
    Storage.setActiveTypeModelTaxi('order');
    Storage.setActiveTypeTaxi('trucking');
    Storage.setActiveTypeFilters('offers');
    MyOrder = new clClientOrder();
    MyOrder.activateCargo();
    Lists.init(MyOrder);
    Maps.mapOn();
    eventOnChangeZoom = GetPositions.drivers();
    GetPositions.my();
    initMap();
    // ===== Draw New Order =====
    Destinations.init(MyOrder);
    // ===== Draw My Orders =====
    Conn.request('requestMyCargoOrders', '', cbGetMyCargoOrder);
    HideForms.init();
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});