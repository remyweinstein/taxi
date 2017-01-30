/* global User */

define(['Ajax', 'Dates', 'Dom', 'DriverOrders', 'PopupWindows'], function(Ajax, Dates, Dom, clDriverOrders, Popup) {
  var Orders = [],
      timerUpdateTaxiDriverOrder,
      add_filter = '',
      arr_filters = {};

  function filterToggleFav(el) {
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
    add_filter = filterConvertToString();
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
  
  function update_taxi_order(model) {
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
  
  function show(el, a, to) {
    var n = document.createElement(el);
        n.innerHTML = a;

    to.appendChild(n);
  }
  
  function getMyOrders() {
    Ajax.request('GET', 'orders', User.token, '&filter[type]=order&isIntercity=0&my=1', '', function(response) {
      if (response && response.ok) {
        var toAppend = Dom.sel('.myorders');
        if (toAppend) {
          toAppend.innerHTML = '';
        }
        var ords = response.orders;

        for (var i = 0; i < ords.length; i++) {
          var goto, del;

          if (!ords[i].comeout) {
            goto = '<a href="#" data-id="' + ords[i].id + '" data-click="myorders_item_menu_go" onclick="return false;">Перейти</a>';
            del = '<a href="#" data-id="' + ords[i].id + '" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a>';
          }

          var zaezdy = "";
          if (ords[i].points) {
            for (var y = 0; y < ords[i].points.length; y++) {
                zaezdy += '<p class="myorders__item__to' + (y + 1) + '">' +
                             ords[i].points[y].address +
                           '</p>';
            }
          }

          show('LI','<div>' +
                      '<p class="myorders__item__time">' +
                        Dates.datetimeForPeople(ords[i].created, "LEFT_TIME_OR_DATE") +
                      '</p>' +
                      '<p class="myorders__item__from">' +
                        ords[i].fromAddress +
                      '</p>' +
                        zaezdy +
                      '<p class="myorders__item__to">' +
                        ords[i].toAddress +
                      '</p>' +
                      '<p class="myorders__item__summa">' +
                        Math.round(ords[i].price) +
                      '</p>' +
                      '<p class="myorders__item__info">' +
                        ords[i].comment +
                      '</p>' +
                    '</div>' +
                    '<div class="myorders__item__menu">' +
                      '<i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i>' +
                      '<span>' + goto + del + '</span>' +
                    '</div>', toAppend);
        }

        if (response.orders.length < 1) {
          show('DIV', '<div class="list-orders_norecords">Нет заказов</div>', toAppend);
        }

        function show(nod, a, to) {
          var node = document.createElement(nod);
          
          node.classList.add('myorders__item');
          node.innerHTML = a;

          to.appendChild(node);                    
        }

      }

    }, function() {});
  }
  
  function onstartAddFilters() {
    var saved_filters = localStorage.getItem('_filters_active');
    
    add_filter = '';
    
    if (saved_filters) {
      arr_filters = JSON.parse(saved_filters);
      add_filter = get_add_filter_string();
    }
  }
  
  function timeMinus(el) {
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
  
  function timePlus(el) {
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
  
  function priceMinus(el) {
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
  
  function pricePlus(el) {
    price_el = el.parentNode.children[1];
    price = price_el.innerHTML;
    price = price.split(" ");
    price = parseInt(price[0]) + 10;

    Orders[el.dataset.key].price = price;
    price_el.innerHTML = price + ' руб.';
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
  
  function getValueForPopupFilters() {
    var saved_filters = localStorage.getItem('_filters_active');
    var response = {price:{min:0,max:5000},distance:{min:0,max:20},length:{min:0,max:100000},stops:{min:0,max:30}};
    
    if (saved_filters) {
      arr_filters = JSON.parse(saved_filters);
      add_filter = Order.filterConvertToString();
      response = arr_filters.filter;
    }
    
    return response;
  }
  
  function filterSortWindow(el) {
    Popup.show(el, 'Сортировать по <br/><br/>' +
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
        add_filter = Order.filterConvertToString();
      }
    }); 
  }
  
  function filterShowWindow(el) {
    var resp = getValueForPopupFilters();

    Popup.show(el, 'Фильтры<br/><br/>' +
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
      add_filter = Order.filterConvertToString();

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
  
  var Order = {
    clear: function () {
      clearInterval(timerUpdateTaxiDriverOrder);
    },
    start: function () {
      
    },
    fillMyOffers: function () {
      fillMyOffers();
    },
    filterToggleFav: function (el) {
      filterToggleFav(el);
    },
    filterSortWindow: function (el) {
      filterSortWindow(el);
    },
    filterShowWindow: function (el) {
      filterShowWindow(el);
    },
    filterConvertToString: function () {
      var filter = get_add_filter_string();
      
      return filter;
    },
    filtersStart: function () {
      onstartAddFilters();
    },
    priceMinus: function (el) {
      priceMinus(el);
    },
    pricePlus: function (el) {
      pricePlus(el);
    },
    timeMinus: function (el) {
      timeMinus(el);
    },
    timePlus: function (el) {
      timePlus(el);
    },
    getMy: function () {
      getMyOrders();
    },
    getList: function (model) {
      update_taxi_order(model);
      timerUpdateTaxiDriverOrder = setInterval(update_taxi_order(model), 2000);
    }
  };
  
  return Order;
  
  });