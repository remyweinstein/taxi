/* global map, User, google, SafeWin, Event, MyOrder, default_vehicle, driver_icon */

define(['Ajax', 'Chat', 'Maps', 'HideForms', 'GetPositions', 'Destinations'], function (Ajax, Chat, Maps, HideForms, GetPositions, Destinations) {

  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    
    map.setCenter(MyLatLng);
    map.setZoom(12);
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
        
        if (target.dataset.click === "client-came") {
          Ajax.request('POST', 'finish-order', User.token, '&id=' + MyOrder.id, '', function() {
            localStorage.setItem('_rating_bid', bid_id);
            localStorage.removeItem('_enable_safe_zone');
            localStorage.removeItem('_enable_safe_route');
            
            window.location.hash = '#client_drivers_rating';
          }, Ajax.error);
        }
        
        if (target.dataset.click === 'client-incar') {          
          Ajax.request('POST', 'in-car-bid', User.token, '&id=' + MyOrder.bid_id, '', function() {}, Ajax.error);
        }

        if (target.dataset.click === 'cancel-order') {
          if (confirm('Отменить заказ?')) {
            Ajax.request('POST', 'cancel-order', User.token, '&id=' + MyOrder.id, '', function(response) {
              if (response && response.ok) {
                window.location.hash = '#client_city';
              }
            }, Ajax.error);
          }
        }
        
        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    content.addEventListener('click', Event.click);
        
  }

  function stop() {
    GetPositions.clear();
    Destinations.clear();
  }
  
  function start() {
    Maps.mapOn();
    initMap();
    SafeWin.overviewPath = [];
    
    bid_id = localStorage.getItem('_current_id_bid');
    global_order_id = localStorage.getItem('_current_id_order');
    MyOrder.bid_id = bid_id;
    MyOrder.id = global_order_id;

    GetPositions.my();
    GetPositions.driver();

    Chat.start('driver');
    
    HideForms.init();
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});