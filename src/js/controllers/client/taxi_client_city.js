/* global User, google, map, MyOrder, MyOffer, cost_of_km, Car, driver_icon, men_icon, Event */

define(['Dom', 'Maps', 'HideForms', 'GetPositions', 'Lists', 'Destinations', 'Favorites', 'Ajax'],
  function (Dom, Maps, HideForms, GetPositions, Lists, Destinations, Favorites, Ajax) {

    var content = Dom.sel('.content');

    function initMap() {
      var MyLatLng = new google.maps.LatLng(User.lat, User.lng),
          zoom;

      zoom = 15;
      map.setCenter(MyLatLng);
      map.setZoom(zoom);
    }

    function addEvents() {
      Event.click = function (event) {
        var target = event.target,
          el;

        while (target !== this) {

          if (target) {

            //  = EVENTS FOR ADD FAV AND BLACK LIST FRON MARKER's DRIVER = 
            if (target.dataset.click === "addtofav") {
              Favorites.addFav(target);
            }
            if (target.dataset.click === "deltofav") {
              Favorites.deleteFav(target);
            }
            if (target.dataset.click === "addtoblack") {
              Favorites.addBlack(target);
            }
            if (target.dataset.click === "deltoblack") {
              Favorites.deleteBlack(target);
            }

            //  ============= EVENTS FOR DESTINATION FIELDS ============== 
            if (target.dataset.click === 'choose_address') {
              el = target;

              localStorage.setItem('_address_temp', el.name);
              localStorage.setItem('_address_string_temp', el.value);
              localStorage.setItem('_active_model', 'order');
              window.location.hash = '#client_choose_address';
            }
            if (target.dataset.click === 'choice_location') {

              localStorage.setItem('_address_temp', target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
              localStorage.setItem('_active_model', 'order');
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

            //  =============== EVENTS FOR LIST OF OFFERS ================
            if (target.dataset.click === "open-order") {
              el = target;
              
              localStorage.setItem('_open_order_id', el.dataset.id);
              window.location.hash = "#driver_order";
            }

            if (target.dataset.click === "taxi_bid") {
              el = target;
              
              Ajax.request('POST', 'approve-bid', User.token, '&id=' + el.dataset.id, '', function (response) {
                if (response && response.ok) {
                  MyOffer.bid_id = el.dataset.id;
                  localStorage.setItem('_current_id_bid', MyOffer.bid_id);
                  localStorage.setItem('_current_id_order', MyOffer.id);
                  window.location.hash = "#client_go";
                }
              }, Ajax.error);
            }

            if (target.dataset.click === "open-offer") {
              var id = target.dataset.id;

              localStorage.setItem('_open_offer_id', id);
              Lists.getByID(id, 'clDriverOffer');

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

          }

          if (target) {
            target = target.parentNode;
          } else {
            break;
          }
        }
      };

      content.addEventListener('click', Event.click);

      Event.submit = function (event) {
        var target = event.target;

        while (target !== this) {
          if (target.dataset.submit === "taxy_client_city") {
            localStorage.setItem('_active_model', 'order');
            Destinations.saveOrder();

            return;
          }

          target = target.parentNode;
        }
      };

      content.addEventListener('submit', Event.submit);

    }

    function stop() {
      Lists.clear();
      GetPositions.clear();
      Destinations.clear();
    }

    function start() {
      Maps.mapOn();


      GetPositions.drivers();
      GetPositions.my();

      initMap();

      // ===== Draw New Order =====
      Destinations.initOrder();

      // = Draw Offers of Drivers =
      Lists.filtersStart();
      Lists.getAllOffers();

      // ===== Draw My Orders =====
      Lists.getAllMyOrders();

      HideForms.init();
      addEvents();

    }

    return {
      start: start,
      clear: stop
    };

  });