    Ajax.request(server_uri, 'GET', 'orders', User.token, '&isIntercity=1', '', function(response) {
      if (response && response.ok) {
        var toAppend = Dom.sel('[data-controller="taxi_driver_intercity_list_orders"]');
         toAppend.innerHTML = '';

        var ords = response.orders;

        for (var i=0; i < ords.length; i++) {
          show('LI','<div class="list-extended__personal"><img src="'+ords[i].agent.photo+'" alt="" /></div><div class="list-extended__route"><div class="list-extended__route_name">'+ords[i].agent.name+'</div><div class="list-extended__route_time">'+Dates.datetimeForPeople(ords[i].created, "ONLY_TIME")+'</div><div class="list-extended__route_from">'+ords[i].fromCity+'</div><div class="list-extended__route_to">'+ords[i].toCity0+'</div><div class="list-extended__route_sum">'+ords[i].price+' руб.</div><div class="list-extended__route_info">'+ords[i].comment+'</div></div>');
        }

        if (ords.length < 1) {
          show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
        }

        function show(el, a) {
          var n = document.createElement(el);
           // n.classList.add('myorders__item');
           n.innerHTML = a;

          toAppend.appendChild(n);
        }
      }
    });
    
        

    Dom.sel('.content').addEventListener('keyup', function(e) {
      var target = e.target;
      
      while (target !== this) {
            // = Filter Intercity Orders =
        if (target.dataset.keyup === 'filter_intercity_to') {
          var parent_id = target.parentNode.parentNode.parentNode.dataset.tabcontent;
          var parent = Dom.selAll('[data-tabcontent="' + parent_id + '"]')[0];
          
          Funcs.searchCityForIntercity(target.value, parent);

          return;
        }

        target = target.parentNode;
      }
    });
