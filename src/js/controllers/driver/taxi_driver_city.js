define(['Ajax', 'Dom', 'DriverOrders', 'Dates', 'PopupWindows', 'ModalWindows'], function (Ajax, Dom, clDriverOrders, Dates, Popup, Modal) {
  
  var Orders = [];
  var add_filter = '';
  var arr_filters = {};

  function update_taxi_order() {
    Ajax.request('GET', 'orders', User.token, '&isIntercity=0&fromCity=' + User.city + add_filter, '', function(response) {
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
              window.location.hash = '#driver_go';
            }

            i++;
          });            
        }
        fillOrders(Orders);
      }

    }, function() {});
  }

  function fillOrders(Orders) {
    var toAppend = Dom.sel('.list-orders');

    if (toAppend) {
      toAppend.innerHTML = '';

      for (var key in Orders) {
        if (Orders.hasOwnProperty(key) &&
                /^0$|^[1-9]\d*$/.test(key) &&
                key <= 4294967294) {


          var active_bid = "";

          if (Orders[key].active_bid) {
            active_bid = ' active';
          }

          var zaezdy = '';
          if (Orders[key].stops > 0) {
            zaezdy = '<div class="list-orders_route_to">\n\
                        Остановок по пути ' + Orders[key].stops + '\
                      </div>';
          }

          var price_minus = active_bid === "" ? '<i class="icon-minus-circled for-click" data-key="' + key + '" data-click="price_minus"></i>' : '';
          var price_plus = active_bid === "" ? '<i class="icon-plus-circle for-click" data-key="' + key + '" data-click="price_plus"></i>' : '';
          var time_minus = active_bid === "" ? '<i class="icon-minus-circled for-click" data-key="' + key + '" data-click="time_minus"></i>' : '';
          var time_plus = active_bid === "" ? '<i class="icon-plus-circle for-click" data-key="' + key + '" data-click="time_plus"></i>' : '';

          show('LI', '\
                      <div class="list-orders_route">\n\
                       <div data-click="open-order" data-id="' + Orders[key].id + '">\n\
                        <div class="list-orders_route_from">\n\
                          ' + Orders[key].fromAddress + '\
                        </div>\n\
                        ' + zaezdy + '\n\
                        <div class="list-orders_route_to">\n\
                          ' + Orders[key].toAddress + '\
                        </div>\n\
                        <div class="list-orders_route_additional">\n\
                          ' + Orders[key].comment + '\
                        </div>\n\
                        <div class="list-orders_route_info">\n\
                          До клиента: ' + Orders[key].distance + ' км\n\
                        </div>\n\
                        <div class="list-orders_route_info">\n\
                          Длина маршрута: ' + Math.round(Orders[key].length / 1000, 2) + ' км\n\
                        </div>\n\
                        <div class="list-orders_route_info">\n\
                          Время по маршруту: ' + Dates.minToHours(Orders[key].duration) + '\n\
                        </div>\n\
                       </div>\n\
                        <div class="list-orders_route_price">\n\
                          ' + price_minus + '\n\
                          <span>' + Orders[key].price + ' руб.</span> \n\
                          ' + price_plus + '\n\
                        </div>\n\
                        <div class="list-orders_route_time">\n\
                          Время подъезда:  \n\
                          ' + time_minus + '\n\
                          <span>' + Orders[key].travelTime + ' мин.</span> \n\
                          ' + time_plus + '\n\
                        </div>\n\
                      </div>\n\
                      <div class="list-orders_personal">\n\
                        <img src="' + Orders[key].photo + '" alt="" /><br/>\n\
                        ' + Orders[key].name + '<br/>\n\
                        ' + Orders[key].created + '\
                      </div>\n\
                      <div class="list-orders_phone">\n\
                        <i data-click="taxi_bid" data-id="' + Orders[key].id + '" class="icon-ok-circled' + active_bid + '"></i>\n\
                      </div>');
        }
      }

      if (Orders.length < 1) {
        show('DIV', '<div class="list-orders_norecords">Нет заказов</div>');
      }

      function show(el, a) {
        var n = document.createElement(el);
         n.innerHTML = a;

        toAppend.appendChild(n);
      }
    }
  }
  
  function get_add_filter_string() {
    var add_fil = '';
    var arr = arr_filters.filter;
    
    for (var key in arr) {
      if (arr[key] instanceof Object) {
        var arrA = arr[key];
        for (var keyA in arrA) {
          if (!(arrA[keyA] instanceof Object)) {
            add_fil += '&filter[' + key + '][' + keyA + ']=' + arrA[keyA];
          }
        }
      } else {
        add_fil += '&filter[' + key + ']=' + arr[key];
      }
    }
    
    var arr = arr_filters.orderBy;
    
    for (var key in arr) {
      if (arr[key] instanceof Object) {
        var arrA = arr[key];
        for (var keyA in arrA) {
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

      while (target !== this) {
        
        if (target) {
          
          if (target.dataset.click === "open-order") {
            var el = target;

            localStorage.setItem('_open_order_id', el.dataset.id);
            window.location.hash = "#driver_order";
          }

          if (target.dataset.click === "fav-orders") {
            var el = target;
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
            Popup.show(target, 'Фильтры<br/><br/>\n\
                                Цена\n\
                                <div class="popup-window__double-range">\n\
                                  <input name="price_min" type="range" value="0" step="50" min="0" max="1000">\n\
                                  <input name="price_max" type="range" value="0" step="50" min="0" max="1000">\n\
                                  <span class="popup-window__range-result"></span>\n\
                                </div>\n\
                                До клиента\n\
                                <div class="popup-window__double-range">\n\
                                  <input name="distance_min" type="range" value="0" step="1" min="0" max="20">\n\
                                  <input name="distance_max" type="range" value="0" step="1" min="0" max="20">\n\
                                  <span class="popup-window__range-result"></span>\n\
                                </div>\n\
                                По маршруту\n\
                                <div class="popup-window__double-range">\n\
                                  <input name="length_min" type="range" value="0" step="1000" min="0" max="100000">\n\
                                  <input name="length_max" type="range" value="0" step="1000" min="0" max="100000">\n\
                                  <span class="popup-window__range-result"></span>\n\
                                </div>\n\
                                Остановок\n\
                                <div class="popup-window__double-range">\n\
                                  <input name="stops_min" type="range" value="0" step="1" min="0" max="30">\n\
                                  <input name="stops_max" type="range" value="0" step="1" min="0" max="30">\n\
                                  <span class="popup-window__range-result"></span>\n\
                                </div>\n\
                                <button class="button_rounded--green" data-click="getfilters">Применить</button>',
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
              
              arr_filters = Object.assign(arr_filters, response);
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
            Popup.show(target, 'Сортировать по <br/><br/> \n\
                                <span data-num="0" data-sort="created">Дате</span> \n\
                                <span data-num="1" data-sort="price">Цене</span> \n\
                                <span data-num="2" data-sort="distance">Расстоянию</span>\n\
                                <span data-num="3" data-sort="length">Маршруту</span>\n\
                                <span data-num="4" data-sort="stops">Остановкам</span>', 
            function(response) {
              delete arr_filters.orderBy;
              
              if (response !== "") {
                arr_filters.orderBy = {};
                eval('arr_filters.orderBy.' + response + ' = 1;');
                add_filter = get_add_filter_string();
              }
            }); 
          }

            // Click taxi_bid
          if (target.dataset.click === "taxi_bid") {
            var el = target;

            if (el.classList.contains('active')) {
              Ajax.request('POST', 'delete-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
                if (response && response.ok) {
                  el.classList.remove('active');
                }
              }, function() {});
            } else {
              if (!User.is_auth) {
                Modal.show('<p>Для совершения заказов необходимо авторизоваться</p>\n\
                          <p><button class="button_rounded--yellow" data-response="no">Отмена</button>\n\
                          <button class="button_rounded--green" data-response="yes">Войти</button></p>\n\
                        ', function (response) {
                            if (response === "yes") {
                              window.location.hash = '#login';
                            }
                        });
              } else if (!Car.brand || !Car.model || !Car.number) {
                Modal.show('<p>Для совершения заказов необходимо заполнить информацию о автомобиле (Марка, модель, госномер)</p>\n\
                          <p><button class="button_rounded--yellow" data-response="no">Отмена</button>\n\
                          <button class="button_rounded--green" data-response="yes">Перейти</button></p>\n\
                        ', function (response) {
                            if (response === "yes") {
                              window.location.hash = '#driver_my_auto';
                            }
                        });
              } else {
                var el_price = el.parentNode.parentNode.querySelectorAll('.list-orders_route_price span')[0];
                var get_price = el_price.innerHTML;
                  get_price = get_price.split(" ");
                var el_time = el.parentNode.parentNode.querySelectorAll('.list-orders_route_time span')[0];
                var get_time = el_time.innerHTML;
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
            var el = target;

            var time_el = el.parentNode.children[1];
            var time = time_el.innerHTML;
              time = time.split(" ");
              time = parseInt(time[0]) - 5;
              if (time < 5) time = 5;
              Orders[el.dataset.key].travelTime = time;
              time_el.innerHTML = time + ' мин.';
          }

          if (target.dataset.click === "time_plus") {
            var el = target;

            var time_el = el.parentNode.children[1];
            var time = time_el.innerHTML;
              time = time.split(" ");
              time = parseInt(time[0]) + 5;
              if (time < 0) time = 0;
              Orders[el.dataset.key].travelTime = time;
              time_el.innerHTML = time + ' мин.';
          }

          if (target.dataset.click === "price_minus") {
            var el = target;

            var price_el = el.parentNode.children[1];
            var price = price_el.innerHTML;
              price = price.split(" ");
              price = parseInt(price[0]) - 10;
              if (price < 0) price = 0;
              Orders[el.dataset.key].price = price;
              price_el.innerHTML = price + ' руб.';
          }

          if (target.dataset.click === "price_plus") {
            var el = target;

            var price_el = el.parentNode.children[1];
            var price = price_el.innerHTML;
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
  
  function start() {
    update_taxi_order();
    timerUpdateTaxiDriverOrder = setInterval(update_taxi_order, 2000);
    addEvents();
  }
  
  return {
    start: start
  };
    
});    