/* global User, Conn */

define(['Lists', 'Dom', 'Funcs'], function (Lists, Dom, Funcs) {
  
  function cbGetOrders(response) {
    Lists.allOrders(response);
  }

  
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
  
  function stop() {
    Conn.clearCb('cbGetOrders');
    Conn.request('stopGetOrders');
  }
  
  function start() {
    Conn.request('startGetIntercityOrders', '', cbGetOrders);

    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
