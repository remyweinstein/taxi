/* global User, Event, Car, MyOffer */

define(['Ajax', 'Dom', 'DriverOrders', 'Dates', 'PopupWindows', 'ModalWindows', 'DriverOffers'], function (Ajax, Dom, clDriverOrders, Dates, Popup, Modal, clDriverOffers) {
  
  var Orders = [],
      add_filter = '',
      arr_filters = {},
      Offers,
      model,
      Model;

  function update_taxi_order() {
    var type = '';
    
    if (model === "clDriverOffer") {
      type = '&filter[type]=offer';  
    }
    if (model === "clClientOrder") {
      type = '&filter[type]=order';
    }
    Ajax.request('GET', 'orders', User.token, type + '&isIntercity=0&fromCity=' + User.city + add_filter, '', function(response) {
      if (response && response.ok) {
        var ords = response.orders;

        var tempOrder = Orders;
        Orders = [];
        for (var i = 0; i < ords.length;) {
          var ordId = ords[i].id;
          var same_el = tempOrder.filter(function(ord) {
            return ord.id === ordId;
          });

          var tempOrders = new clDriverOrders(ords[i], same_el[0]);
          tempOrders.constructor(function(temp_order) {
            Orders.push(temp_order);

            if (temp_order.agentBidId === temp_order.bidId) {
              localStorage.setItem('_current_id_bid', temp_order.bidId);
              localStorage.setItem('_current_id_order', temp_order.id);
              if (model === "clDriverOffer") {
                window.location.hash = "#client_go";
              }
              if (model === "clClientOrder") {
                window.location.hash = '#driver_go';
              }
            }

            i++;
          });            
        }
        
        var orders_result = Dom.sel('.list-orders__result span');
        
        if (orders_result) {
          orders_result.innerHTML = Orders.length;
        }
        
        fillOrders();
      }

    }, function() {});
  }

  function fillOrders() {
    var listOrders = Dom.sel('[data-model=list-orders]');

    if (listOrders) {
      listOrders.innerHTML = '';

      for (var key in Orders) {
        if (Orders.hasOwnProperty(key) &&
            /^0$|^[1-9]\d*$/.test(key) &&
            key <= 4294967294) {

          var active_bid = Orders[key].active_bid ? ' active' : '', 
              zaezdy = '';

          if (Orders[key].stops > 0) {
            zaezdy = '<div class="list-orders_route_to">' +
                        'Остановок по пути ' + Orders[key].stops +
                      '</div>';
          }

          var price_minus = active_bid === "" ? '<i class="icon-minus-circled for-click" data-key="' + key + '" data-click="price_minus"></i>' : '',
              price_plus = active_bid === "" ? '<i class="icon-plus-circle for-click" data-key="' + key + '" data-click="price_plus"></i>' : '',
              time_minus = active_bid === "" ? '<i class="icon-minus-circled for-click" data-key="' + key + '" data-click="time_minus"></i>' : '',
              time_plus = active_bid === "" ? '<i class="icon-plus-circle for-click" data-key="' + key + '" data-click="time_plus"></i>' : '';

          show('LI', '<div class="list-orders_route">' +
                       '<div data-click="open-order" data-id="' + Orders[key].id + '">' +
                        '<div class="list-orders_route_from">' +
                           Orders[key].fromAddress +
                        '</div>' +
                           zaezdy +
                        '<div class="list-orders_route_to">' +
                           Orders[key].toAddress +
                        '</div>' +
                        '<div class="list-orders_route_additional">' +
                          Orders[key].comment +
                        '</div>' +
                        '<div class="list-orders_route_info">' +
                          'До адреса: ' + Orders[key].distance + ' км' +
                        '</div>' +
                        '<div class="list-orders_route_info">' +
                          'Длина маршрута: ' + Math.round(Orders[key].length / 1000, 2) + ' км' +
                        '</div>' +
                        '<div class="list-orders_route_info">' +
                          'Время по маршруту: ' + Dates.minToHours(Orders[key].duration) +
                        '</div>' +
                       '</div>' +
                       '<div class="list-orders_route_price">' +
                          price_minus +
                          '<span>' + Orders[key].price + ' руб.</span>' +
                          price_plus +
                        '</div>' +
                        '<div class="list-orders_route_time">' +
                          'Время подъезда: ' + time_minus +
                          '<span>' + Orders[key].travelTime + ' мин.</span>' + time_plus +
                        '</div>' +
                      '</div>' +
                      '<div class="list-orders_personal">' +
                        '<img src="' + Orders[key].photo + '" alt="" /><br/>' +
                           Orders[key].name + '<br/>' + Orders[key].created +
                      '</div>' +
                      '<div class="list-orders_phone">' +
                        '<i data-click="taxi_bid" data-id="' + Orders[key].id + '" class="icon-ok-circled' + active_bid + '"></i>' +
                      '</div>',
                    listOrders);
        }
      }

      if (Orders.length < 1) {
        show('DIV', '<div class="list-orders_norecords">Нет заказов</div>', listOrders);
      }
    }
  }
  
  function fillMyOffers() {
    var listOffers = Dom.sel('[data-model=list-offers]');

    if (listOffers) {
      var arrOffers = Offers.myOffers;
      listOffers.innerHTML = '';

      for (var key in arrOffers) {
        if (arrOffers.hasOwnProperty(key) &&
            /^0$|^[1-9]\d*$/.test(key) &&
            key <= 4294967294) {

          var zaezdy = '',
              goto = '', del;

          if (!arrOffers[key].comeout) {
            //goto = '<a href="#" data-id="' + arrOffers[key].id + '" data-click="myorders_item_menu_go" onclick="return false;">Перейти</a>';
            del = '<a href="#" data-id="' + arrOffers[key].id + '" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a>';
          }

          if (arrOffers[key].stops > 0) {
            zaezdy = '<div class="list-orders_route_to">' +
                        'Остановок по пути ' + arrOffers[key].stops +
                      '</div>';
          }

          show('LI', '<div class="list-orders_route">' +
                       '<div data-click="open-offer" data-id="' + arrOffers[key].id + '">' +
                          '<div class="list-orders_route_to">' +
                            arrOffers[key].created +
                          '</div>' +
                          '<div class="list-orders_route_from">' +
                            arrOffers[key].fromAddress +
                          '</div>' +
                          zaezdy +
                          '<div class="list-orders_route_to">' +
                            arrOffers[key].toAddress +
                          '</div>' +
                          '<div class="list-orders_route_additional">' +
                            arrOffers[key].comment +
                          '</div>' +
                          '<div class="list-orders_route_info">' +
                            'Длина маршрута: ' + Math.round(arrOffers[key].length / 1000, 2) + ' км' +
                          '</div>' +
                          '<div class="list-orders_route_info">' +
                            'Время по маршруту: ' + Dates.minToHours(arrOffers[key].duration) +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                      '<div class="list-orders_menu">' +
                        '<i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i>' +
                        '<span>' + goto + del + '</span>' +
                      '</div>',
                    listOffers);
        }
      }

      if (arrOffers.length < 1) {
        show('DIV', '<div class="list-orders_norecords">Нет предложений</div>', listOffers);
      }
    }
  }
  
  function show(el, a, to) {
    var n = document.createElement(el);
        n.innerHTML = a;

    to.appendChild(n);
  }
  
  function get_add_filter_string() {
    var add_fil = '',
        arr = arr_filters.filter,
        arrA, keyA;
    
    for (var key in arr) {
      if (arr[key] instanceof Object) {
        arrA = arr[key];
        for (keyA in arrA) {
          if (!(arrA[keyA] instanceof Object)) {
            add_fil += '&filter[' + key + '][' + keyA + ']=' + arrA[keyA];
          }
        }
      } else {
        add_fil += '&filter[' + key + ']=' + arr[key];
      }
    }
    
    arr = arr_filters.orderBy;
    
    for (key in arr) {
      if (arr[key] instanceof Object) {
        arrA = arr[key];
        for (keyA in arrA) {
          if (!(arrA[keyA] instanceof Object)) {
            add_fil += '&orderBy[' + key + '][' + keyA + ']=' + arrA[keyA];
          }
        }
      } else {
        add_fil += '&orderBy[' + key + ']=' + arr[key];
      }
    }
    
    return add_fil;
  }
  
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
            el = target;
            if (Dom.toggle(el, 'active')) {
              delete arr_filters.filter.favorite;
            } else {
              if (arr_filters.filter) {
                arr_filters.filter.favorite = 1;
              } else {
                arr_filters.filter = {};
                arr_filters.filter.favorite = 1;
              }
            }
            add_filter = get_add_filter_string();
          }

          if (target.dataset.click === "filter-orders") {
            var resp = getValueForPopupFilters();
            Popup.show(target, 'Фильтры<br/><br/>' +
                                '<button class="button_rounded--grey" data-click="clearfilters">Сбросить</button>' +
                                'Цена' +
                                '<div class="popup-window__double-range">' +
                                  '<input name="price" type="range" multiple value="' + resp.price.min + ',' + resp.price.max + '" min="0" max="5000" />' +
                                '</div>' +
                                'До клиента' +
                                '<div class="popup-window__double-range">' +
                                  '<input name="distance" type="range" multiple value="' + resp.distance.min + ',' + resp.distance.max + '" min="0" max="20" />' +
                                '</div>' +
                                'По маршруту' +
                                '<div class="popup-window__double-range">' +
                                  '<input name="length" type="range" multiple value="' + resp.length.min + ',' + resp.length.max + '" min="0" max="100000" />' +
                                '</div>' +
                                'Остановок' +
                                '<div class="popup-window__double-range">' +
                                  '<input name="stops" type="range" multiple value="' + resp.stops.min + ',' + resp.stops.max + '" min="0" max="30" />' +
                                '</div>' +
                                '<button class="button_rounded--green" data-click="getfilters">Применить</button>',
            function(response) {
              if (arr_filters.filter) {
                if (arr_filters.filter.favorite) {
                  delete arr_filters.filter;
                  arr_filters.filter = {};
                  arr_filters.filter.favorite = 1;
                } else {
                  delete arr_filters.filter;
                  arr_filters.filter = {};
                }
              }
              
              arr_filters.filter = response.filter;
              add_filter = get_add_filter_string();
              
              /*
                filter[created][min]
                filter[created][max]
                filter[type]=Эконом
                filter[fromCity]=Хабаровск
                filter[agentId]=254
                filter[isIntercity]=1
                filter[phone]=1
                filter[email]=1
              */
            });
          }

          if (target.dataset.click === "sort-orders") {
            Popup.show(target, 'Сортировать по <br/><br/>' +
                                '<span data-num="0" data-sort="created" data-r="1">Дате <i class="icon-down-circle"></i></span>' +
                                '<span data-num="1" data-sort="created" data-r="0">Дате <i class="icon-up-circle"></i></span>' +
                                '<span data-num="2" data-sort="price" data-r="1">Цене <i class="icon-down-circle"></i></span>' +
                                '<span data-num="3" data-sort="price" data-r="0">Цене <i class="icon-up-circle"></i></span>' +
                                '<span data-num="4" data-sort="distance" data-r="1">Расстоянию <i class="icon-down-circle"></i></span>' +
                                '<span data-num="5" data-sort="distance" data-r="0">Расстоянию <i class="icon-up-circle"></i></span>' +
                                '<span data-num="6" data-sort="length" data-r="1">Маршруту <i class="icon-down-circle"></i></span>' +
                                '<span data-num="7" data-sort="length" data-r="0">Маршруту <i class="icon-up-circle"></i></span>' +
                                '<span data-num="8" data-sort="stops" data-r="1">Остановкам <i class="icon-down-circle"></i></span>' +
                                '<span data-num="9" data-sort="stops" data-r="0">Остановкам <i class="icon-up-circle"></i></span>',
            function(response) {
              delete arr_filters.orderBy;
              
              if (response !== "") {
                arr_filters.orderBy = {};
                eval('arr_filters.orderBy.' + response.sort + ' = ' + response.r + ';');
                add_filter = get_add_filter_string();
              }
            }); 
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

            time_el = el.parentNode.children[1];
            time = time_el.innerHTML;
            time = time.split(" ");
            time = parseInt(time[0]) - 5;
            
            if (time < 5) {
              time = 5;
            }
            
            Orders[el.dataset.key].travelTime = time;
            time_el.innerHTML = time + ' мин.';
          }

          if (target.dataset.click === "time_plus") {
            el = target;

            time_el = el.parentNode.children[1];
            time = time_el.innerHTML;
            time = time.split(" ");
            time = parseInt(time[0]) + 5;

            if (time < 0) {
              time = 0;
            }

            Orders[el.dataset.key].travelTime = time;
            time_el.innerHTML = time + ' мин.';
          }

          if (target.dataset.click === "price_minus") {
            el = target;

            price_el = el.parentNode.children[1];
            price = price_el.innerHTML;
            price = price.split(" ");
            price = parseInt(price[0]) - 10;
            
            if (price < 0) {
              price = 0;
            }
            
            Orders[el.dataset.key].price = price;
            price_el.innerHTML = price + ' руб.';
          }

          if (target.dataset.click === "price_plus") {
            el = target;

            price_el = el.parentNode.children[1];
            price = price_el.innerHTML;
            price = price.split(" ");
            price = parseInt(price[0]) + 10;
            
            Orders[el.dataset.key].price = price;
            price_el.innerHTML = price + ' руб.';
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

  function getValueForPopupFilters() {
    var saved_filters = localStorage.getItem('_filters_active');
    var response = {price:{min:0,max:5000},distance:{min:0,max:20},length:{min:0,max:100000},stops:{min:0,max:30}};
    
    if (saved_filters) {
      arr_filters = JSON.parse(saved_filters);
      add_filter = get_add_filter_string();
      response = arr_filters.filter;
    }
    
    return response;
  }
  
  function onstartAddFilters() {
    var saved_filters = localStorage.getItem('_filters_active');
    
    if (saved_filters) {
      arr_filters = JSON.parse(saved_filters);
      add_filter = get_add_filter_string();
    }
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
    console.log('i get perehod');
  }
  
  function start(modelka) {
    model = modelka;
    onstartAddFilters();
    
    if (model === "clDriverOffer") {
      Model = MyOffer;
    }
    if (model === "clClientOrder") {
      Model = MyOrder;
      Offers = new clDriverOffers();
      Offers.getMyOffers(function () {
        fillMyOffers();
      });
    }
    
    update_taxi_order();
    timerUpdateTaxiDriverOrder = setInterval(update_taxi_order, 2000);
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
    
});    