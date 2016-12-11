define(['Ajax', 'Dom', 'Funcs', 'Dates'], function (Ajax, Dom, Funcs, Dates) {
  
  function addEvents() {
    content.addEventListener('keyup', function(e) {
      var target = e.target;

      while (target !== this) {
            // = Filter Intercity Orders =
        if (target.dataset.keyup === 'filter_intercity_to') {
          var parent_id = target.parentNode.parentNode.parentNode.dataset.tabcontent;
          var parent = Dom.selAll('[data-tabcontent="' + parent_id + '"]')[0];

          Funcs.searchCityForIntercity(target.value, parent);

          return;
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    });
  }
  
  function start() {
    Ajax.request('GET', 'orders', User.token, '&isIntercity=1', '', function(response) {
      if (response && response.ok) {
        var toAppend = Dom.sel('[data-controller="taxi_driver_intercity_list_orders"]');
         toAppend.innerHTML = '';

        var ords = response.orders;

        for (var i=0; i < ords.length; i++) {
          show('LI','<div class="list-extended__personal">\n\
                      <img src="' + ords[i].agent.photo + '" alt="" />\n\
                    </div>\n\
                    <div class="list-extended__route">\n\
                      <div class="list-extended__route_name">\n\
                        ' + ords[i].agent.name + '\
                      </div>\n\
                      <div class="list-extended__route_time">\n\
                        ' + Dates.datetimeForPeople(ords[i].created, "ONLY_TIME") + '\
                      </div>\n\
                      <div class="list-extended__route_from">\n\
                        ' + ords[i].fromCity + '\
                      </div>\n\
                      <div class="list-extended__route_to">\n\
                        ' + ords[i].toCity0 + '\
                      </div>\n\
                      <div class="list-extended__route_sum">\n\
                        ' + ords[i].price + ' руб.\n\
                      </div>\n\
                      <div class="list-extended__route_info">\n\
                        ' + ords[i].comment + '\
                      </div>\n\
                    </div>');
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
    
    addEvents();
  }
  
  return {
    start: start
  };
  
});
