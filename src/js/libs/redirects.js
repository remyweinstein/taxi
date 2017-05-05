define(['Storage', 'Dom', 'ActiveOrder'], function(Storage, Dom, ActiveOrder) {
  
  function checkEnableActiveWindow() {
    var active_win = Dom.sel('.active_order_win'),
        arr = active_win.classList,
        is_closed = false;

    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === 'closed') {
        is_closed = true;
        break;
      }
    }
    
    if (is_closed) {
      ActiveOrder.enable();
    }
    
    return;
  }
  
  var Redirect = {
    check: function (currentHash) {
      if (Storage.getTripClient()) {
        checkEnableActiveWindow();
      }

      if (Storage.getTripDriver()) {
        checkEnableActiveWindow();
      }
      
      if (currentHash === "#client_city" && window.location.search !== '') {
        Storage.setLastPage('#client_city');
        Storage.clearHistoryPages();
        window.location.search = '';
      }

    }
  };
  
	return Redirect;
});