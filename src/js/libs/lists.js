/* global User, driver_icon, MapElements, Conn, Maps, Car */

define(['Dates', 'Dom', 'DriverOrders', 'PopupWindows', 'Storage'], 
function(Dates, Dom, clDriverOrders, Popup, Storage) {
  var Orders = [],
      old_list_bids,
      arr_filters = {},
      Model;
  
  function cbListApproveOffer(resp) {
    Conn.clearCb('cbListApproveOffer');
    
    if (!resp.error) {
      Model.getByID(Model.id, function () {});
    }
  }
  
  function cbListGetClientBids(response) {
    var el = Dom.sel('.wait-bids-approve'),
        orders = response.result.orders,
        innText = '',
        automat_driver_approve = Storage.getDriverAutomat(),
        gl_active = false;
      
    el.innerHTML = "";

    if (orders) {
      if (Storage.getTripDriver()) {
        goToPage = '#driver_go';
      }
      
      if (orders.length > 0 && automat_driver_approve) {
        Lists.clear();
        Conn.request('approveOrder', orders[0].id, cbListApproveOffer);
        return;
      }
      
      for (var i = 0; i < orders.length; i++) {
        var agIndex = parseObj(getAgentIndexes(orders[i].agent, 'client')),
            approve = orders[i].bids[0] ? orders[i].bids[0].approved : false,
            vehicle = orders[i].agent.vehicle || Car.default_vehicle,
            active  = approve ? ' active' : ' inactive',
            photo   = orders[i].agent.photo || User.avatar,
            loc     = orders[i].agent.location;
        
        if (!gl_active && approve) {
          gl_active = true;
        }
        
        loc = loc.split(',');

        if (!MapElements.markers_driver_pos[orders[i].agent.id]) {
          MapElements.marker_client = Maps.addMarker(loc[0], loc[1], orders[i].agent.name, driver_icon, [32,32], function(){});
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.markers_driver_pos[orders[i].agent.id]);
        }

        var dist = orders[i].agent.distance ? (orders[i].agent.distance).toFixed(1) : 0;
        
        innText += '<div class="wait-bids-approve__item">' +
                      '<div class="wait-bids-approve__item__distance">' +
                        'Растояние до водителя, <span>' + dist + ' км</span>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__driver">' +
                        '<div>' +
                          '<img src="' + photo + '" alt="" />' +
                        '</div>' +
                        '<div>' + orders[i].agent.name + '</div>' +
                        '<div>' + agIndex + '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__car">' +
                        '<div>' +
                          '<img src="' + vehicle + '" alt="" />' +
                        '</div>' +
                        '<div>' +
                          orders[i].agent.brand + ' ' + orders[i].agent.model +
                        '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__approve">' +
                        '<i data-click="taxi_client_bid" data-id="' + orders[i].id + '" class="icon-ok-circled' + active + '"></i>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__bid-time">' +
                        'Время подъезда: <span>' + orders[i].travelTime + ' мин</span>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__bid-price">' +
                        'Предложенная цена: <span>' + Math.round(orders[i].price) + ' руб</span>' +
                      '</div>' +
                    '</div>';
      }
      
      if (old_list_bids !== JSON.stringify(orders) && Storage.getActiveTypeTaxi() === "intercity" && Storage.getActiveTypeModelTaxi() === "offer") {
        if (window.location.hash !== "#client_offer") {
          require(['ctrlTaxiDriverOffer'], function (controller) {
            controller.redrawRoute(orders);
          });
        }
      }
      
      old_list_bids = JSON.stringify(orders);
      
      var startButton = Dom.sel('button[data-click="start-offer"]'),
          start = Model.start;
      
      if (gl_active) {
        startButton.disabled = false;
      }
      
    }
    
    el.innerHTML = innText;
  }
  
  function cbListGetBids(response) {
    var el = Dom.sel('.wait-bids-approve'),
        offers = response.result.offers,
        innText = '',
        automat_client_approve = Storage.getClientAutomat();
      
    el.innerHTML = "";
    
    if (!offers || offers === "undefined") {
      offers = response.result.orders;
    }

    if (offers) {
      if (Storage.getTripClient()) {
        goToPage = '#client_go';
      }
      
      if (offers.length > 0 && automat_client_approve) {
        Lists.clear();
        Conn.request('approveOffer', offers[0].id, cbListApproveOffer);
        return;
      }
      
      for (var i = 0; i < offers.length; i++) {
        var agIndex = parseObj(getAgentIndexes(offers[i].agent, 'driver')),
            car     = offers[i].agent.cars[0],
            vehicle = car.photo || Car.default_vehicle,
            approve = offers[i].bids ? offers[i].bids[0].approved : false,
            active  = approve ? ' active' : ' inactive',
            photo   = offers[i].agent.photo || User.avatar,
            loc     = offers[i].agent.location;

        loc = loc.split(',');
        
        if (!MapElements.markers_driver_pos[offers[i].agent.id]) {
          MapElements.marker_client = Maps.addMarker(loc[0], loc[1], offers[i].agent.name, driver_icon, [32,32], function(){});
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.markers_driver_pos[offers[i].agent.id]);
        }

        var dist = offers[i].agent.distance ? (offers[i].agent.distance).toFixed(1) : 0;
        
        innText += '<div class="wait-bids-approve__item">' +
                      '<div class="wait-bids-approve__item__distance">' +
                        'Растояние до водителя, <span>' + dist + ' км</span>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__driver">' +
                        '<div>' +
                          '<img src="' + photo + '" alt="" />' +
                        '</div>' +
                        '<div>' + offers[i].agent.name + '</div>' +
                        '<div>' + agIndex + '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__car">' +
                        '<div>' +
                          '<img src="' + vehicle + '" alt="" />' +
                        '</div>' +
                        '<div>' +
                          car.brand + ' ' + car.model +
                        '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__approve">' +
                        '<i data-click="taxi_client_bid" data-id="' + offers[i].id + '" class="icon-ok-circled' + active + '"></i>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__bid-time">' +
                        'Время подъезда: <span>' + offers[i].travelTime + ' мин</span>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__bid-price">' +
                        'Предложенная цена: <span>' + Math.round(offers[i].price) + ' руб</span>' +
                      '</div>' +
                    '</div>';
      }
    }
    el.innerHTML = innText;
  }
  
  function getAgentIndexes(agent, role) {
    if (role === "driver") {
      return {'flag-checkered':agent.driverAccuracyIndex, 'block':agent.driverCancelIndex, 'thumbs-up':agent.driverDelayIndex, 'clock':agent.driverFinishIndex};
    } else {
      return {'flag-checkered':agent.clientAccuracyIndex, 'block':agent.clientCancelIndex, 'thumbs-up':agent.clientDelayIndex, 'clock':agent.clientFinishIndex};
    }
  }
  
  function parseObj(obj) {
    var content = '';
    
    for (var key in obj) {
      content += '<span><i class="icon-' + key + '"></i> ' + obj[key] + ' </span>';
    }
    
    return content;
  }
  
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
  }
  
  function render_list(order, response) {
    var ords = order==='order' ? response.orders : response.offers,
        prevList = Storage.getPrevListOrders(),
        order_canceled,
        order_finished,
        order_finishedClient,
        order_finishedDriver,
        tempOrder = Orders,
        orders_result = Dom.sel('.list-orders__result span'),
        automat_driver = order==='order' ? Storage.getDriverAutomat() : false,
        automat_client = order==='order' ? false : Storage.getClientOfferAutomat(),
        type = Storage.getActiveTypeTaxi();
      
    Orders = [];

    if (ords) {
      if (Storage.getTripDriver()) {
        goToPage = '#driver_go';
      }
      
      if (automat_driver) {
        var max_bids = Math.min(ords.length, 20);

        for (var i = 0; i < max_bids; i++) {
          var data = {},
              approved = ords[i].bids[0] ? true : false;
          
          data.id = ords[i].id;
          
          if (!approved) {
            Conn.request('agreeOrder', data);
          }
        }
      }
      
      for (var i = 0; i < ords.length;) {
        if (i === 0 && tempOrder.length > 0) {
          if (tempOrder[0].type !== ords[0].type) {
            tempOrder = [];
          }
        }
        
        var ordId = ords[i].id,
            same_el = tempOrder.filter(function(ord) {
              return ord.id === ordId;
            });
        
        if (order === 'order') {
          order_canceled       = ords[i].canceled;
          order_finished       = ords[i].finished;
          order_finishedDriver = ords[i].finishedByDriver;
          order_finishedClient = ords[i].finishedByClient;
        } else if (ords[i].bids) {
          order_canceled       = ords[i].bids[0].order.canceled;
          order_finished       = ords[i].bids[0].order.finished;
          order_finishedDriver = ords[i].bids[0].finishedByDriver;
          order_finishedClient = ords[i].bids[0].finishedByClient;
        }

        var tempOrders = new clDriverOrders(ords[i], same_el[0]);

        tempOrders.constructor(function(temp_order) {
          Orders.push(temp_order);
          i++;
        });
      }
      
      for (var i = 0; i < tempOrder.length; i++) {
        var id = tempOrder[i].id,
            sovp = false;
        
        for (var y = 0; y < Orders.length; y++) {
          if (tempOrder[i].id === Orders[y].id) {
            sovp = true;
          }
        }
        
        if (!sovp) {
          if (!tempOrder[i].deactived) {
            tempOrder[i].deactived = new Date().valueOf() + 60000;
          }
          
          if (tempOrder[i].deactived > new Date().valueOf()) {
            //i = i===0 ? -1 : i;
            Orders.splice(i, 0, tempOrder[i]);
          }
        }

      }
    }

    if (orders_result) {
      orders_result.innerHTML = Orders.length;
    }
    
    //if (prevList === '{"offers":[]}' || prevList === '{"orders":[]}' || !prevList) {
    
    if (prevList !== JSON.stringify(response)) {
      fillOrders(order, type);
    }
    
    Storage.setPrevListOrders(JSON.stringify(response));
  }
  
  function fillOrders(order, type) {
    var listOrders = Dom.sel('[data-model=list-orders]');

    if (listOrders) {
      listOrders.innerHTML = '';

      for (var key in Orders) {
        if (Orders.hasOwnProperty(key) &&
            /^0$|^[1-9]\d*$/.test(key) &&
            key <= 4294967294) {

          var active_bid = Orders[key].active_bid ? ' active' : '', 
              zaezdy     = '',
              fromCity   = '', toCity = '', safety = '',
              clas       = Orders[key].deactived ? 'deactivate' : false,
              forClick   =  !Orders[key].deactived ? 'data-click="taxi_bid"' : '';

          if (Orders[key].stops > 0) {
            zaezdy = '<div class="list-orders_route_to">' +
                        'Остановок по пути ' + Orders[key].stops +
                      '</div>';
          }

          var price_minus = active_bid === "" && !Orders[key].deactived ? '<i class="icon-minus-circled for-click" data-key="' + key + '" data-click="price_minus"></i>' : '',
              price_plus = active_bid === "" && !Orders[key].deactived ? '<i class="icon-plus-circle for-click" data-key="' + key + '" data-click="price_plus"></i>' : '',
              time_minus = active_bid === "" && !Orders[key].deactived ? '<i class="icon-minus-circled for-click" data-key="' + key + '" data-click="time_minus"></i>' : '',
              time_plus = active_bid === "" && !Orders[key].deactived ? '<i class="icon-plus-circle for-click" data-key="' + key + '" data-click="time_plus"></i>' : '',
              ideika = Orders[key].order_in_offer || Orders[key].id,
              cargo_info = '';
          
          if (Orders[key].weight) {
            cargo_info += '<div class="list-orders_route_info">Вес: ' + Orders[key].weight + '</div>';
          }
          
          if (Orders[key].zone) {
            safety = '<div style="color:red">Строго по маршруту</div>';
          }

          if (Orders[key].volume) {
            cargo_info += '<div class="list-orders_route_info">Объем: ' + Orders[key].volume + '</div>';
          }

          if (Orders[key].stevedores) {
            cargo_info += '<div class="list-orders_route_info">Грузчики: ' + Orders[key].stevedores + '</div>';
          }
          
          if (type === "intercity") {
            fromCity = Orders[key].fromCity + ', ';
            toCity = Orders[key].toCity + ', ';
          }

          show('LI', '<div class="list-orders_route">' +
                       '<div data-click="open-' + order + '" data-id="' + Orders[key].id + '">' +
                        '<div class="list-orders_route_from">' +
                           fromCity + Orders[key].fromAddress +
                        '</div>' +
                           zaezdy +
                        '<div class="list-orders_route_to">' +
                           toCity + Orders[key].toAddress +
                        '</div>' +
                        '<div class="list-orders_route_additional">' +
                          Orders[key].comment +
                        '</div>' +
                        cargo_info +
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
                          safety +
                        '</div>' +
                      '</div>' +
                      '<div class="list-orders_personal">' +
                        '<img src="' + Orders[key].photo + '" alt="" /><br/>' +
                           Orders[key].name + '<br/>' + Orders[key].created +
                      '</div>' +
                      '<div class="list-orders_phone">' +
                        '<i ' + forClick + ' data-id="' + ideika + '" class="icon-ok-circled' + active_bid + '"></i>' +
                      '</div>',
                    listOrders, clas);
        }
      }

      if (Orders.length < 1) {
        show('DIV', '<div class="list-orders_norecords">Нет заказов</div>', listOrders);
      }
    }
  }
  
  function show(el, a, to, clas) {
    var n = document.createElement(el);
        n.innerHTML = a;
    
    if (clas) {
      n.classList.add(clas);
    }
    
    to.appendChild(n);
  }
  
  function render_list_my_order(response) {
        var toAppend = Dom.sel('.myorders'),
            ords = response.orders,
            zaezdy;
        
        if (toAppend) {
          toAppend.innerHTML = '';
        }
        
        for (var i = 0; i < ords.length; i++) {
          var goto = '<a href="#" data-id="' + ords[i].id + '" data-click="myorders_item_menu_go" onclick="return false;">Перейти</a>',
              del  = '<a href="#" data-id="' + ords[i].id + '" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a>';

          if (!ords[i].canceled) {
            del = '';
          }
          
          if (ords[i].finished || ords[i].canceled) {
            goto = '';
          }

          zaezdy = "";
          
          if (ords[i].points) {
            for (var y = 0; y < ords[i].points.length; y++) {
                zaezdy += '<p class="myorders__item__to' + (y + 1) + '">' +
                            ords[i].points[y].address +
                          '</p>';
            }
          }

        show('LI','<div>' +
                      '<p class="myorders__item__time">' +
                        Dates.datetimeForPeople(ords[i].created) + //, "LEFT_TIME_OR_DATE") +
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
  
  function onstartAddFilters() {
    var saved_filters = Storage.getActiveFilters(),
        saved_sort = Storage.getActiveSortFilters();
    
    add_filter = '';
    
    if (saved_filters) {
      arr_filters = JSON.parse(saved_filters);
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
  
  function render_list_my_offer(response) {
    var Offer = {},
        listOffers = Dom.sel('[data-model=list-offers]');

    if (listOffers) {
      Offer.myOffers = response.offers;

      var arrOffers = Offer.myOffers;
      
      listOffers.innerHTML = '';

      for (var key in arrOffers) {
        if (arrOffers.hasOwnProperty(key) &&
            /^0$|^[1-9]\d*$/.test(key) &&
            key <= 4294967294) {

          var del,
              zaezdy         = '',
              goto           = '',
              fromCity       = '',
              toCity         = '',
              activeTypeTaxi = Storage.getActiveTypeTaxi();

          if (!arrOffers[key].comeout) {
            //goto = '<a href="#" data-id="' + arrOffers[key].id + '" data-click="myorders_item_menu_go" onclick="return false;">Перейти</a>';
            del = '<a href="#" data-id="' + arrOffers[key].id + '" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a>';
          }

          if (arrOffers[key].stops > 0) {
            zaezdy = '<div class="list-orders_route_to">' +
                        'Остановок по пути ' + arrOffers[key].stops +
                      '</div>';
          }

          
          if (activeTypeTaxi === "intercity" || activeTypeTaxi === "tourism") {
            fromCity = arrOffers[key].fromCity + ', ';
            toCity = arrOffers[key].toCity + ', ';
          }
          
          show('LI', '<div class="list-orders_route">' +
                       '<div data-click="open-offer" data-id="' + arrOffers[key].id + '">' +
                          '<div class="list-orders_route_to">' +
                            arrOffers[key].created +
                          '</div>' +
                          '<div class="list-orders_route_from">' +
                            fromCity + arrOffers[key].fromAddress +
                          '</div>' +
                          zaezdy +
                          '<div class="list-orders_route_to">' +
                            toCity + arrOffers[key].toAddress +
                          '</div>' +
                          '<div class="list-orders_route_to">' +
                            'Отправление ' + arrOffers[key].start +
                          '</div>' +
                          '<div class="list-orders_route_additional">' +
                            arrOffers[key].comment +
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
      
      if (arrOffers){
        if (arrOffers.length < 1) {
          show('DIV', '<div class="list-orders_norecords">Нет предложений</div>', listOffers);
        }
      } else {
        show('DIV', '<div class="list-orders_norecords">Нет предложений</div>', listOffers);
      }
    }
  }
  
  function getValueForPopupFiltersSort() {
    var saved_sorts = Storage.getActiveSortFilters(),
        response = {orderBy:{created:0}};
    
    if (saved_sorts) {
      arr_filters = JSON.parse(saved_sorts);
      response = arr_filters.orderBy;
    }
    
    return response;
  }
  
  function getValueForPopupFilters() {
    var saved_filters = Storage.getActiveFilters(),
        response = {price:{min:0,max:15000},distance:{min:0,max:20},length:{min:0,max:30000000},stops:{min:0,max:30}};
    
    if (saved_filters) {
      arr_filters = JSON.parse(saved_filters);
      response = arr_filters.filter;
    }
    
    return response;
  }
  
  function cancelOrder(target) {
    var item = target.parentNode.parentNode.parentNode;
    
    Conn.request('cancelOrder', target.dataset.id);
    item.style.display = 'none';
  }
  
  function filterSortWindow(el) {
    var resp = getValueForPopupFiltersSort();
    
    Popup.show(el,'Сортировать по <br/><br/>' +
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
      }
    }); 
  }
  
  function enableAutomatDriver(el) {
    if (Dom.toggle(el, 'active')) {
      Storage.removeDriverAutomat();
    } else {
      Storage.setDriverAutomat();
    }
  }
  
  function enableAutomatClient(el) {
    if (Dom.toggle(el, 'active')) {
      Storage.removeClientOfferAutomat();
    } else {
      Storage.setClientOfferAutomat();
    }
  }
  
  function filterShowWindow(el) {
    var resp = getValueForPopupFilters();

    Popup.show(el,'Фильтры<br/><br/>' +
                  '<button class="button_rounded--grey" data-click="clearfilters">Сбросить</button>' +
                  'Цена' +
                  '<div class="popup-window__double-range">' +
                    '<input name="price" type="range" multiple value="' + resp.price.min + ',' + resp.price.max + '" min="0" max="15000" />' +
                  '</div>' +
                  'До клиента' +
                  '<div class="popup-window__double-range">' +
                    '<input name="distance" type="range" multiple value="' + resp.distance.min + ',' + resp.distance.max + '" min="0" max="20" />' +
                  '</div>' +
                  'По маршруту' +
                  '<div class="popup-window__double-range">' +
                    '<input name="length" type="range" multiple value="' + resp.length.min + ',' + resp.length.max + '" min="0" max="30000000" />' +
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

      /*
        filter[created][min]
        filter[created][max]
        filter[type]=Эконом
        filter[fromCity]=Хабаровск
        filter[agentId]=254
        filter[type]=1
        filter[phone]=1
        filter[email]=1
      */
    });
  }
  
  function get_bid_drivers () {
    Conn.request('startOffersByOrder', Model.id, cbListGetBids);
  }
  
  function get_bid_clients () {
    Conn.request('startOrdersByOffer', Model.id, cbListGetClientBids);
  }
  
  var Lists = {
    clear: function () {
      Storage.clearPrevListOrders();
      Orders = [];
      MapElements.clear();
      Conn.request('stopGetOrders');
      Conn.clearCb('cbListGetBids');
      Conn.clearCb('cbListGetClientBids');
      Conn.clearCb('cbListApproveOffer');
    },
    
    init: function (model) {
      Model = model;
    },
    
    getBidsDriver: function () {
      get_bid_drivers();
    },
    
    getBidsClient: function () {
      get_bid_clients();
    },
    
    getOfferByID: function (id) {
      Model.getByID(id, function () {});
    },
    
    getOrderByID: function (id) {
      Model.getByID(id, function () {});
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
    
    enableAutomat: function (el, isDriver) {
      if (isDriver) {
        enableAutomatDriver(el);
      } else {
        enableAutomatClient(el);
      }
    },
    
    filtersStart: function () {
      onstartAddFilters();
    },
    
    cancelOrder: function (target) {
      cancelOrder(target);
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
    
    myOffers: function (response) {
      render_list_my_offer(response);
    },
    
    myOrders: function (response) {
      render_list_my_order(response);
    },
    
    allOrders: function (response) {
      render_list('order', response);
    },
    
    allOrdersIntercity: function (response) {
      render_list('order', response, 'intercity');
    },
    
    allOrdersTourism: function (response) {
      render_list('order', response, 'tourism');
    },
    
    allOffers: function (response) {
      render_list('offer', response);
    }
  };
  
  return Lists;
  
  });