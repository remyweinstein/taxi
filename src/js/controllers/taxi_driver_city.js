    update_taxi_order();

    timerUpdateTaxiDriverOrder = setInterval(update_taxi_order, 3000);

    function update_taxi_order() {
      Ajax.request(server_uri, 'GET', 'orders', User.token, '&isIntercity=0&fromCity=' + User.city, '', function(response) {
        // alert(response.ok);
        if (response && response.ok) {
          var toAppend = Dom.sel('.list-orders');
          
          if (toAppend) {
            
            toAppend.innerHTML = '';
            var ords = response.orders;

            for (var i = 0; i < ords.length; i++) {
                //console.log('order '+i+': '+JSON.stringify(response.orders[i]));

                var photo_img = ords[i].agent.photo ? ords[i].agent.photo : User.default_avatar;
                var price = ords[i].price ? Math.round(ords[i].price) : 0;
                var bidId = ords[i].bidId;
                var active_bid = '';

                for (var y=0; y<ords[i].bids.length; y++) {
                  var agidbid = ords[i].bids[y].id;

                  if (agidbid === bidId) {
                      localStorage.setItem('_current_id_bid', bidId);
                      document.location = '#driver__go';
                      break;
                  }
                }

                for (var y = 0; y < ords[i].bids.length; y++) {
                  var agidbid = ords[i].bids[y].agentId;

                  if (agidbid === User.id) {
                    active_bid = ' active';
                    break;
                  }
                }

                var arr = [];
                  if(ords[i].toAddress1) arr.push(ords[i].toAddress1);
                  if(ords[i].toAddress2) arr.push(ords[i].toAddress2);
                  if(ords[i].toAddress3) arr.push(ords[i].toAddress3);
                var zaezdy = "";
                if (arr.length) {
                  zaezdy = '<div class="list-orders_route_to">\n\
                              остановок ' + arr.length + '\
                            </div>';
                }
          
                var long = ords[i].agent.distance ? ords[i].agent.distance.toFixed(1) : 0;
                var dr_name = ords[i].agent.name ? ords[i].agent.name : User.default_name;
                show('LI', '\
                            <div class="list-orders_route">\n\
                              <div class="list-orders_route_from">\n\
                                ' + ords[i].fromAddress + '\
                              </div>\n\
                              ' + zaezdy + '\n\
                              <div class="list-orders_route_to">\n\
                                ' + ords[i].toAddress0 + '\
                              </div>\n\
                              <div class="list-orders_route_additional">\n\
                                ' + ords[i].comment + '\
                              </div>\n\
                              <div class="list-orders_route_info">\n\
                                До клиента: ' + long + ' км\n\
                              </div>\n\
                              <div class="list-orders_route_info">\n\
                                <i class="icon-minus-circled"  data-click="price_minus"></i>\n\
                                <span>' + price + ' руб.</span> \n\
                                <i class="icon-plus-circle" data-click="price_plus"></i>\n\
                              </div>\n\
                            </div>\n\
                            <div class="list-orders_personal">\n\
                              <img src="' + photo_img + '" alt="" /><br/>\n\
                              ' + dr_name + '<br/>\n\
                              ' + Dates.datetimeForPeople(ords[i].created, 'LEFT_TIME_OR_DATE') + '\
                            </div>\n\
                            <div class="list-orders_phone">\n\
                              <i data-click="taxi_bid" data-id="' + ords[i].id + '" class="icon-ok-circled' + active_bid + '"></i>\n\
                            </div>');
            }

            if (ords.length < 1) {
              show('DIV', '<div class="list-orders_norecords">Нет заказов</div>');
            }

            function show(el, a) {
              var n = document.createElement(el);
               n.innerHTML = a;

              toAppend.appendChild(n);                    
            }
          }
          
        }
        
      });
    }

    var content = Dom.sel('.content');
      content.addEventListener('click', function(event) {
        var target = event.target;
        
        while (target !== this) {
              // Click taxi_bid
          if (target.dataset.click === "taxi_bid") {
            var el = target;
            
            if (el.classList.contains('active')) {
              Ajax.request(server_uri, 'POST', 'delete-bid', User.token, '&id='+el.dataset.id, '', function(response) {
                if (response && response.ok) {
                  el.classList.remove('active');
                }
              });
            } else {
              Ajax.request(server_uri, 'POST', 'bid', User.token, '&id='+el.dataset.id, '', function(response) {
                //console.log(JSON.stringify('mess = '+response.messages));
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
              if(price < 0) price = 0;
              
              price_el.innerHTML = price + ' руб';
          }

          if (target.dataset.click === "price_plus") {
            var el = target;
            
            var price_el = el.parentNode.children[1];
            var price = price_el.innerHTML;
              price = price.split(" ");
              price = parseInt(price[0]) + 50;
              
              price_el.innerHTML = price + ' руб';
          }

          
          target = target.parentNode;
        }
        
      });
