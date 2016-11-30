    Ajax.request(server_uri, 'GET', 'orders', User.token, '&isIntercity=1&my=1', '', function(response) {
      if (response && response.ok) {
        //console.log('Ok?: ' + response.ok + ', orders='+response.orders);
        //console.log('Messages: ' + response.messages);
        var t = Dom.sel('.myorders');
         t.innerHTML = '';
        var ords = response.orders;
        
        for (var i=0; i < ords.length; i++) {
          show('LI','<div>\n\
                      <p class="myorders__item__time">\n\
                        ' + Dates.datetimeForPeople(ords[i].created) + '\
                      </p>\n\
                      <p class="myorders__item__from">\n\
                        ' + ords[i].fromCity + '\
                      </p>\n\
                      <p class="myorders__item__to">\n\
                        ' + ords[i].toCity0 + '\
                      </p>\n\
                      <p class="myorders__item__summa">\n\
                        ' + ords[i].price + '\
                      </p>\n\
                      <p class="myorders__item__info">\n\
                       ' + ords[i].comment + '\
                      </p>\n\
                    </div>\n\
                    <div class="myorders__item__menu">\n\
                      <i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i>\n\
                      <span>\n\
                        <a href="#" data-id="' + ords[i].id + '" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a>\n\
                      </span>\n\
                    </div>');
        }
        
        if (ords.length < 1) {
          show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
        }
        
        function show(el, a) {
          var n = document.createElement(el);
           n.classList.add('myorders__item');
           n.innerHTML = a;
          t.appendChild(n);      
        }
        
      }
    });

    var content = Dom.sel('.content');
    content.addEventListener('click', function(event) {
      var target = event.target;
      
      while (target !== this) {
            // = Menu my Orders Item =
        if (target.dataset.click === 'myorders_item_menu') {
          var menu = target.parentNode.children[1];
          var currentState = menu.style.display;
          
          if (currentState === 'none' || currentState === '') {
              menu.style.display = 'block';
          } else {
              menu.style.display = 'none';
          }
          
          return;
        }
            // = Menu my Orders Item DELETE order =
        if (target.dataset.click === 'myorders_item_menu_delete') {
          Ajax.request(server_uri, 'GET', 'delete-order', User.token, '&id='+target.dataset.id, '', function(response) {
            if (response && response.ok) {
              var item = target.parentNode.parentNode.parentNode;
               item.style.display = 'none';
            }
          });
          
        return;
        }

        target = target.parentNode;
      }
    });
    
  document.addEventListener('DOMContentLoaded', function() {
            // = Client Order Intercity =
    Dom.sel('[data-submit="client_order_intercity"]').addEventListner('submit', function() {
      var from_city = Dom.sel('[name="city_from"]').value;
      var to_city = Dom.sel('[name="city_to"]').value;
      var from_address = Dom.sel('[name="adress_from"]').value;
      var to_address = Dom.sel('[name="adress_to"]').value;
      var price = Dom.sel('[name="cost"]').value;
      var comment = Dom.sel('[name="description"]').value;
      var to1 = "", to2 = "", to3 = "";
      var data = new FormData();

      Address.saveAddress(from_address, to_address);

      if (Dom.sel('[name="to_plus1"]')) {
        to1 = Dom.sel('[name="to_plus1"]').value;
        data.append('toAddress1', to1);
      }
      
      if (Dom.sel('[name="to_plus2"]')) {
        to2 = Dom.sel('[name="to_plus2"]').value;
        data.append('toAddress2', to2);
      }
      
      if (Dom.sel('[name="to_plus3"]')) {
        to3 = Dom.sel('[name="to_plus3"]').value;
        data.append('toAddress3', to3);
      }
      
      Address.saveWaypoints(to1, to2, to3);

      data.append('fromCity', from_city);
      data.append('fromAddress', from_address);
      data.append('toCity0', to_city);
      data.append('toAddress0', to_address);
      data.append('isIntercity', 1);
      //data.append('bidId', '');
      data.append('price', price);
      data.append('comment', comment);
      data.append('minibus', 0);
      data.append('babyChair', 0);
      
      Ajax.request(server_uri, 'POST', 'order', User.token, '', data, function(response) {
        if (response && response.ok) {
          //console.log('id='+response.id);
          changeTab(3);
        }
      });
    });
  });
