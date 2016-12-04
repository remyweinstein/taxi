var Orders = [];

  update_taxi_order();

    timerUpdateTaxiDriverOrder = setInterval(update_taxi_order, 2000);

    function update_taxi_order() {
      Ajax.request(server_uri, 'GET', 'orders', User.token, '&isIntercity=0&sort=ASC&fromCity=' + User.city, '', function(response) {
        if (response && response.ok) {
          var ords = response.orders;
          
          var tempOrder = Orders;
          Orders = [];
          for (var i = 0; i < ords.length;) {
            var ordId = ords[i].id;
            var same_el = tempOrder.filter(function(ord) {
              return ord.id === ordId;
            });
            
            var tempOrders = new DriverOrders(ords[i], same_el[0]);
            tempOrders.constructor(function(temp_order){
              Orders.push(temp_order);
              
              if (temp_order.agentBidId === temp_order.bidId) {
                localStorage.setItem('_current_id_bid', temp_order.bidId);
                document.location = '#driver__go';
              }
              
              i++;
            });            
          }
          fillOrders(Orders);
        }
        
      });
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
                            остановок ' + Orders[key].stops + '\
                          </div>';
              }
                
                var price_minus = active_bid === "" ? '<i class="icon-minus-circled for-click" data-key="' + key + '" data-click="price_minus"></i>' : '';
                var price_plus = active_bid === "" ? '<i class="icon-plus-circle for-click" data-key="' + key + '" data-click="price_plus"></i>' : '';
                
                show('LI', '\
                            <div class="list-orders_route">\n\
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
                              <div class="list-orders_route_price">\n\
                                ' + price_minus + '\n\
                                <span>' + Orders[key].price + ' руб.</span> \n\
                                ' + price_plus + '\n\
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

      Event.click = function (event) {
        var target = event.target;
        
        while (target !== this) {
              // Click taxi_bid
          if (target.dataset.click === "taxi_bid") {
            var el = target;
            
            if (el.classList.contains('active')) {
              Ajax.request(server_uri, 'POST', 'delete-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
                if (response && response.ok) {
                  el.classList.remove('active');
                }
              });
            } else {
              var el_price = el.parentNode.parentNode.querySelectorAll('.list-orders_route_price span')[0];
              var get_price = el_price.innerHTML;
                get_price = get_price.split(" ");
              Ajax.request(server_uri, 'POST', 'bid', User.token, '&id=' + el.dataset.id + '&price=' + get_price[0], '', function(response) {
                //console.log('error: ' + response.messages);
                if (response && response.ok) {
                  el.classList.add('active');
                }  
              });
            }
          }
          
          if (target.dataset.click === "price_minus") {
            var el = target;
            
            var price_el = el.parentNode.children[1];
            var price = price_el.innerHTML;
              price = price.split(" ");
              price = parseInt(price[0]) - 50;
              if (price < 0) price = 0;
              Orders[el.dataset.key].price = price;
              price_el.innerHTML = price + ' руб.';
          }

          if (target.dataset.click === "price_plus") {
            var el = target;
            
            var price_el = el.parentNode.children[1];
            var price = price_el.innerHTML;
              price = price.split(" ");
              price = parseInt(price[0]) + 50;
              Orders[el.dataset.key].price = price;
              price_el.innerHTML = price + ' руб.';
          }

          
          target = target.parentNode;
        }
        
      };
      
      content.addEventListener('click', Event.click);