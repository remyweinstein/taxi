/* global User */

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
      
      if (window.location.search !== '') {
        var params = window.location.search;

        params = (params.substr(1)).split('&');
        
        var first_param = params[0].split('=')[0];
        
        if (first_param === "offer") {
          Storage.setWatchingHash(params[1].split('=')[1]);
          Storage.setWatchingTrip(params[0].split('=')[1]);
          goToPage = '#watching';
          Storage.setLastPage('#watching');
          Storage.addHistoryPages('#watching');
        }
        
        if (first_param === "authToken") {
          User.authToken = params[0].split('=')[1];
          localStorage.setItem('_temp_code', params[1].split('=')[1]);
          goToPage = '#sms';
          Storage.setLastPage('#sms');
          Storage.addHistoryPages('#sms');
        } 
        
        window.location.search = '';
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