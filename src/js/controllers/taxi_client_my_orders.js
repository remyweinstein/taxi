    Ajax.request(server_uri, 'GET', 'orders', User.token, '&isIntercity=0&my=1', '', function(response) {
      if (response && response.ok) {
        console.log('orders='+JSON.stringify(response.orders));
        //console.log('Messages: ' + response.messages);
        
        var toAppend = Dom.sel('.myorders');
         toAppend.innerHTML = '';
        var ords = response.orders;
        
        for (var i=0; i < ords.length; i++) {
          var goto,del;
          
          if (!ords[i].comeout) {
            goto = '<a href="#" data-id="'+ords[i].id+'" data-click="myorders_item_menu_go" onclick="return false;">Перейти</a>';
            del = '<a href="#" data-id="'+ords[i].id+'" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a>';
          }
          
          show('LI','<div><p class="myorders__item__time">'+Dates.datetimeForPeople(ords[i].created)+'</p><p class="myorders__item__from">'+ords[i].fromAddress+'</p><p class="myorders__item__to">'+ords[i].toAddress0+'</p><p class="myorders__item__summa">'+Math.round(ords[i].price)+'</p><p class="myorders__item__info">'+ords[i].comment+'</p></div><div class="myorders__item__menu"><i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i><span>'+goto+del+'</span></div>');
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
            var p = elem.parentNode.parentNode.parentNode.children[0].children[3].innerHTML;
             p = p !== null && p ? p : 0;
             
            var n = elem.parentNode.parentNode.parentNode.children[0].children[4].innerHTML;
            
            Address.saveAddress(elem.parentNode.parentNode.parentNode.children[0].children[1].innerHTML, elem.parentNode.parentNode.parentNode.children[0].children[2].innerHTML);
            localStorage.setItem('_id_current_taxy_order', elem.dataset.id);
            localStorage.setItem('_current_price_order', p);
            localStorage.setItem('_current_comment_order', n);
            
            document.location = '#client__map';

            return;
          }
              
          target = target.parentNode;
        }
        
      });
