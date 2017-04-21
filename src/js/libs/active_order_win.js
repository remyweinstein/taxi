define(function () {

  function goToTrip() {
    console.log('i am click');

    if (localStorage.getItem('_redirect_trip_client')) {
      window.location.hash = '#client_go';
    }

    if (localStorage.getItem('_redirect_trip_driver')) {
      window.location.hash = '#driver_go';
    }
  }
  
  var ActiveOrder = {
    
    enable: function() {
      var active_win = document.querySelector('.active_order_win');
      
      active_win.classList.remove('closed');
      active_win.removeEventListener('click', goToTrip);
      active_win.addEventListener('click', goToTrip);
    },
    
    disable: function() {
      var active_win = document.querySelector('.active_order_win');
      
      active_win.removeEventListener('click', goToTrip);
      active_win.classList.add('closed');
    }

  };
  
  return ActiveOrder;
  
});