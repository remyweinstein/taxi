/* global User, Event, Car, MyOffer */

define(['Ajax', 'ModalWindows', 'DriverOffers', 'Order'], function (Ajax, Modal, clDriverOffers, Order) {
  
  var Offers,
      model,
      Model;


  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;
      var time_el, time, price_el, price, el;

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
              Ajax.request('GET', 'delete-order', User.token, '&id=' + target.dataset.id, '', function(response) {
                if (response && response.ok) {
                  var item = target.parentNode.parentNode.parentNode;
                   item.style.display = 'none';
                }
              }, function() {});

            return;
          }
              // = Menu my Orders Item GO order =
          if (target.dataset.click === 'myorders_item_menu_go') {
            var elem = target;
            
            Model.getByID(elem.dataset.id, function () {
              if (Model.bid_id) {
                localStorage.setItem('_current_id_bid', Model.bid_id);
                window.location.hash = "#client_go";
              } else {
                window.location.hash = '#client_map';
              }
            });

            return;
          }
          
          if (target.dataset.click === "open-order") {
            el = target;

            localStorage.setItem('_open_order_id', el.dataset.id);
            window.location.hash = "#driver_order";
          }

          if (target.dataset.click === "open-offer") {
            el = target;

            localStorage.setItem('_open_offer_id', el.dataset.id);
            
            MyOffer.getByID(el.dataset.id, function () {
              if (MyOffer.bid_id) {
                localStorage.setItem('_current_id_bid', MyOffer.bid_id);
                //window.location.hash = "#client_go";
              } else {
                window.location.hash = '#driver_my_offer';
              }
            });
          }

          if (target.dataset.click === "fav-orders") {
            Order.filterToggleFav(target);
          }

          if (target.dataset.click === "filter-orders") {
            Order.filterShowWindow(target);
          }

          if (target.dataset.click === "sort-orders") {
            Order.filterSortWindow(target);
          }

            // Click taxi_bid
          if (target.dataset.click === "taxi_bid") {
            el = target;

            if (el.classList.contains('active')) {
              Ajax.request('POST', 'delete-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
                if (response && response.ok) {
                  el.classList.remove('active');
                }
              }, function() {});
            } else {
              if (!User.is_auth && model === "clClientOrder") {
                Modal.show('<p>Для совершения заказов необходимо авторизоваться</p>' +
                          '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                          '<button class="button_rounded--green" data-response="yes">Войти</button></p>',
                        function (response) {
                            if (response === "yes") {
                              window.location.hash = '#login';
                            }
                        });
              } else if ((!Car.brand || !Car.model || !Car.number) && model === "clClientOrder") {
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
                
                Ajax.request('POST', 'bid', User.token, '&id=' + el.dataset.id + '&price=' + get_price[0] + '&travelTime=' + get_time[0], '', function(response) {
                  if (response && response.ok) {
                    el.classList.add('active');
                  }  
                }, function() {});
              }
            }
          }

          if (target.dataset.click === "time_minus") {
            el = target;
            
            Order.timeMinus(el);
          }

          if (target.dataset.click === "time_plus") {
            el = target;

            Order.timePlus(el);
          }

          if (target.dataset.click === "price_minus") {
            el = target;

            Order.priceMinus(el);
          }

          if (target.dataset.click === "price_plus") {
            el = target;

            Order.pricePlus(el);
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
    if (model === "clDriverOffer") {
      MyOffer = Model;
      localStorage.setItem('_active_model', 'MyOffer');
    }
    if (model === "clClientOrder") {
      MyOrder = Model;
      localStorage.setItem('_active_model', 'MyOrder');
    }
  }
  
  function start(modelka) {
    model = modelka;
    Order.filtersStart();
    
    if (model === "clDriverOffer") {
      Model = MyOffer;
    }
    if (model === "clClientOrder") {
      Model = MyOrder;
      Offers = new clDriverOffers();
      Offers.getMyOffers(function () {
        Order.fillMyOffers();
      });
    }

    Order.getList(model);
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
    
});    