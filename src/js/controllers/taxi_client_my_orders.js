    Ajax.request(server_uri, 'GET', 'orders', User.token, '&isIntercity=0&my=1', '', function(response) {
      if (response && response.ok) {
        //console.log('orders='+JSON.stringify(response.orders));
        //console.log('Messages: ' + response.messages);
        
        var toAppend = Dom.sel('.myorders');
         toAppend.innerHTML = '';
        var ords = response.orders;
        
        for (var i = 0; i < ords.length; i++) {
          var goto, del;
          
          if (!ords[i].comeout) {
            goto = '<a href="#" data-id="' + ords[i].id + '" data-click="myorders_item_menu_go" onclick="return false;">Перейти</a>';
            del = '<a href="#" data-id="' + ords[i].id + '" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a>';
          }
          
          var arr = [ords[i].toAddress1, ords[i].toAddress2, ords[i].toAddress3];
          var zaezdy = "";
          for (var y = 0; y < arr.length; y++) {
            if(arr[y] && arr[y] !== ""){
              zaezdy += '<p class="myorders__item__to' + (y + 1) + '">\n\
                           ' + arr[y] + '\
                         </p>';
            }
          }
          
          show('LI','<div>\n\
                      <p class="myorders__item__time">\n\
                        ' + Dates.datetimeForPeople(ords[i].created, "LEFT_TIME_OR_DATE") + '\
                      </p>\n\
                      <p class="myorders__item__from">\n\
                        ' + ords[i].fromAddress + '\
                      </p>\n\
                      ' + zaezdy + '\n\
                      <p class="myorders__item__to">\n\
                        ' + ords[i].toAddress0 + '\
                      </p>\n\
                      <p class="myorders__item__summa">\n\
                        ' + Math.round(ords[i].price) + '\
                      </p>\n\
                      <p class="myorders__item__info">\n\
                        ' + ords[i].comment + '\
                      </p>\n\
                    </div>\n\
                    <div class="myorders__item__menu">\n\
                      <i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i>\n\
                      <span>'+goto+del+'</span>\n\
                    </div>');
        }
        
        if (response.orders.length < 1) {
          show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
        }
        
        function show(nod, a) {
          var node = document.createElement(nod);
           node.classList.add('myorders__item');
           node.innerHTML = a;
           
          toAppend.appendChild(node);                    
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
              // = Menu my Orders Item GO order =
          if (target.dataset.click === 'myorders_item_menu_go') {
            var elem = target;
            var p = elem.parentNode.parentNode.parentNode.children[0].querySelector('.myorders__item__summa').innerHTML;
             p = p !== null && p ? p : 0;
             
            var n = elem.parentNode.parentNode.parentNode.children[0].querySelector('.myorders__item__info').innerHTML;
            
            var fromAdr0 = elem.parentNode.parentNode.parentNode.children[0].querySelector('.myorders__item__from').innerHTML;
            var toAdr0 = elem.parentNode.parentNode.parentNode.children[0].querySelector('.myorders__item__to').innerHTML;
            
            var to1 = elem.parentNode.parentNode.parentNode.children[0].querySelector('.myorders__item__to1');
            var to2 = elem.parentNode.parentNode.parentNode.children[0].querySelector('.myorders__item__to2');
            var to3 = elem.parentNode.parentNode.parentNode.children[0].querySelector('.myorders__item__to3');
            if(to1) var toAdr1 = to1.innerHTML;
            if(to2) var toAdr2 = to2.innerHTML;
            if(to3) var toAdr3 = to3.innerHTML;
            Address.saveWaypoints(toAdr1, toAdr2, toAdr3);
            
            Address.saveAddress(fromAdr0, toAdr0);
            localStorage.setItem('_id_current_taxy_order', elem.dataset.id);
            localStorage.setItem('_current_price_order', p);
            localStorage.setItem('_current_comment_order', n);
            
            document.location = '#client__map';

            return;
          }
              
          target = target.parentNode;
        }
        
      });
