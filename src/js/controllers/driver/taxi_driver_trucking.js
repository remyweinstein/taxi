/* global User, Event, Car, Conn */

define(['ModalWindows', 'Lists', 'Storage', 'DriverOffer'], function (Modal, Lists, Storage, clDriverOffer) {
  var old_filters,
      old_sortes,
      myOffer;
  
  function cbMyOffers(response) {
    Conn.clearCb('cbMyOffers');
    
    if (!response.error) {
      Lists.myOffers(response.result);
    }
  }
  
  function cbAgreeOrder(response) {
    Conn.clearCb('cbAgreeOrder');
    
    if (!response.error) {
      var checkOffer = new clDriverOffer;
      
      checkOffer.getByID(response.result.id, function () {});
    }
  }
  
  function cbGetOrders(response) {
    var stopStartOrders = function () {
          Conn.request('stopGetOrders');
          Conn.clearCb('cbGetOrders');
          Conn.request('startGetOrdersTrucking', '', cbGetOrders);
        },
        filters = Storage.getActiveFilters(),
        sortes = Storage.getActiveSortFilters();
    
    if (filters !== old_filters || sortes !== old_sortes) {
      stopStartOrders();
      old_filters = filters;
      old_sortes = sortes;

      return;
    }

    if (!response.error) {
      Lists.allOrders(response.result);
    }
    
    old_filters = filters;
    old_sortes = sortes;
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target, el, id;

      while (target !== this) {
        if (target) {
          if (target.dataset.click === "new-offer") {
            goToPage = "#driver_new_offer";
          }
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
            Lists.Delete(target);
            
            return;
          }
              // = Menu my Orders Item GO order =
          if (target.dataset.click === 'myorders_item_menu_go') {
            id = target.dataset.id;
            myOffer.getByID(id, function () {
              localStorage.setItem('_open_offer_id', id);
              Storage.setActiveTypeModelTaxi('offer');
              Storage.setActiveTypeTaxi('trucking');
              goToPage = '#driver_my_offer';
            });
            
            return;
          }
          
          if (target.dataset.click === "open-order") {
            el = target;
            localStorage.setItem('_open_order_id', el.dataset.id);
            goToPage = "#driver_order";
          }
          
          if (target.dataset.click === "open-offer") {
            id = target.dataset.id;
            myOffer.getByID(id, function () {
              localStorage.setItem('_open_offer_id', id);
              Storage.setActiveTypeModelTaxi('offer');
              Storage.setActiveTypeTaxi('trucking');
              goToPage = '#driver_my_offer';
            });
          }
          
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
            Lists.enableAutomat(target, true);
          }

            // Click taxi_bid
          if (target.dataset.click === "taxi_bid") {
            el = target;
            id = target.dataset.id;

            if (el.classList.contains('active')) {
              Conn.request('disagreeOrder', id);
              el.classList.remove('active');
            } else {
              if (!User.is_auth) {
                Modal.show('<p>Для совершения заказов необходимо авторизоваться</p>' +
                          '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                          '<button class="button_rounded--green" data-response="yes">Войти</button></p>',
                        function (response) {
                            if (response === "yes") {
                              goToPage = '#login';
                            }
                        });
              } else if (Car.inGarage === 0) {
                Modal.show('<p>Для совершения заказов необходимо добавить автомобиль</p>' +
                          '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                          '<button class="button_rounded--green" data-response="yes">Перейти</button></p>',
                        function (response) {
                            if (response === "yes") {
                              goToPage = '#driver_my_auto';
                            }
                        });
              } else  if (!Car.id) {
                Modal.show('<p>Для совершения заказов необходимо выбрать автомобиль из списка</p>' +
                          '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                          '<button class="button_rounded--green" data-response="yes">Перейти</button></p>',
                        function (response) {
                            if (response === "yes") {
                              goToPage = '#driver_my_auto';
                            }
                        });
              } else {
                var el_price = el.parentNode.parentNode.querySelectorAll('.list-orders_route_price span')[0],
                    el_time = el.parentNode.parentNode.querySelectorAll('.list-orders_route_time span')[0],
                    get_time = el_time.innerHTML,
                    get_price = el_price.innerHTML;
                    
                get_price = get_price.split(" ");
                get_time = get_time.split(" ");
                
                var data = {};
                
                data.id = id;
                data.price = parseInt(get_price[0]);
                data.travelTime = parseInt(get_time[0]);
                Conn.request('agreeOrder', data, cbAgreeOrder);
                el.classList.add('active');
              }
            }
          }
          if (target.dataset.click === "time_minus") {
            Lists.timeMinus(target);
          }
          if (target.dataset.click === "time_plus") {
            Lists.timePlus(target);
          }
          if (target.dataset.click === "price_minus") {
            Lists.priceMinus(target);
          }
          if (target.dataset.click === "price_plus") {
            Lists.pricePlus(target);
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
    Conn.clearCb('cbGetOrders');
    Conn.request('stopGetOrders');
    Modal.close();
  }
  
  function start() {
    myOffer = new clDriverOffer();
    Storage.setActiveTypeModelTaxi('offer');
    Storage.setActiveTypeTaxi('trucking');
    Storage.setActiveTypeFilters('orders');
    old_filters = Storage.getActiveFilters();
    old_sortes = Storage.getActiveSortFilters();
    Lists.filtersStart();
    Conn.request('requestMyTruckingOffers', '', cbMyOffers);
    Conn.request('startGetOrdersTrucking', '', cbGetOrders);
    Conn.request('stopGetOffers');
    addEvents();
  }
  
  return {
    start: start,
    clear: stop,
    addEvents: addEvents
  };
    
});    