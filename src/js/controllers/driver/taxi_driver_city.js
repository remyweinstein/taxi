/* global User, Event, Car, MyOffer, Conn */

define(['Ajax', 'ModalWindows', 'DriverOffers', 'Lists'], function (Ajax, Modal, clDriverOffers, Lists) {
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target, el;

      while (target !== this) {
        
        if (target) {
          
          if (target.dataset.click === "new-offer") {
            window.location.hash = "#driver_new_offer";
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
            
            Lists.getOfferByID(target.dataset.id);

            return;
          }
          
          if (target.dataset.click === "open-order") {
            el = target;

            localStorage.setItem('_open_order_id', el.dataset.id);
            window.location.hash = "#driver_order";
          }

          if (target.dataset.click === "open-offer") {
            var id = target.dataset.id;

            localStorage.setItem('_open_offer_id', id);
            
            Lists.getOfferByID(id);

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

            // Click taxi_bid
          if (target.dataset.click === "taxi_bid") {
            el = target;

            if (el.classList.contains('active')) {
              el.classList.remove('active');
              //Ajax.request('POST', 'delete-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
              //  if (response && response.ok) {
              //  }
              //}, Ajax.error);
            } else {
              if (!User.is_auth) {
                Modal.show('<p>Для совершения заказов необходимо авторизоваться</p>' +
                          '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                          '<button class="button_rounded--green" data-response="yes">Войти</button></p>',
                        function (response) {
                            if (response === "yes") {
                              window.location.hash = '#login';
                            }
                        });
              } else if ((!Car.brand || !Car.model || !Car.number)) {
                Modal.show('<p>Для совершения заказов необходимо заполнить информацию о автомобиле (Марка, модель, госномер)</p>' +
                          '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                          '<button class="button_rounded--green" data-response="yes">Перейти</button></p>',
                        function (response) {
                            if (response === "yes") {
                              window.location.hash = '#driver_my_auto';
                            }
                        });
              } else {
                var el_price = el.parentNode.parentNode.querySelectorAll('.list-orders_route_price span')[0],
                    el_time = el.parentNode.parentNode.querySelectorAll('.list-orders_route_time span')[0],
                    get_time = el_time.innerHTML,
                    get_price = el_price.innerHTML;
                    
                get_price = get_price.split(" ");
                get_time = get_time.split(" ");
                
                Conn.approveOrder(id);
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
    Conn.stopGetOrders();
  }
  
  function start() {
    Lists.filtersStart();

    Conn.requestMyOffers();
    Conn.startGetOrders();
    
    addEvents();
    
  }
  
  return {
    start: start,
    clear: stop,
    addEvents: addEvents
  };
    
});    