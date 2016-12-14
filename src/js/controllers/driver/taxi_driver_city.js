define(['Ajax', 'Dom', 'DriverOrders', 'Dates'], function (Ajax, Dom, clDriverOrders, Dates) {
  
  var Orders = [];

  function update_taxi_order() {
    Ajax.request('GET', 'orders', User.token, '&isIntercity=0&fromCity=' + User.city, '', function(response) {
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
          tempOrders.constructor(function(temp_order){
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
                          До клиента: ' + Orders[key].distance2 + ' км\n\
                        </div>\n\
                        <div class="list-orders_route_info">\n\
                          Длина маршрута: ' + Math.round(Orders[key].distance / 1000, 2) + ' км\n\
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

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        
        if (target.dataset.click === "open-order") {
          var el = target;
          
          localStorage.setItem('_open_order_id', el.dataset.id);
          window.location.hash = "#driver_order";
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
            if (price < 50) price = 50;
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