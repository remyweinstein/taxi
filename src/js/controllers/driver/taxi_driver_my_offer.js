/* global User, Maps, SafeWin, Event, MyOffer, Conn */

define(['Dom', 'Dates', 'HideForms', 'Destinations', 'GetPositions', 'Lists'], function (Dom, Dates, HideForms, Destinations, GetPositions, Lists) {
  
  function cbOnApproveOrder() {
    localStorage.setItem('_current_id_order', MyOffer.id);
    localStorage.setItem('_active_offer_id', MyOffer.id);
    window.location.hash = "#driver_go";
    Conn.clearCb('cbOnApproveOrder');
  }
  
  function cbOnCancelOffer() {
    window.location.hash = '#client_city';
    Conn.clearCb('cbOnCancelOffer');
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
    Maps.drawRoute('offer', true, function(){});
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target, el;

      while (target !== this) {
        if (target && target.dataset.click === "taxi_client_bid") {
          Conn.request('approveOrder', target.dataset.id, cbOnApproveOrder);
        }
        
        if (target && target.dataset.click === "cancel-order") {
          el = target;
          Conn.request('cancelOffer', MyOffer.id, cbOnCancelOffer);
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
    MyOffer.clear();
    Destinations.clear();
    GetPositions.clear();
    Lists.clear();
    
    localStorage.removeItem('_active_model');
  }
  
  function start() {
        
    if (MyOffer.id > 0) {
      if (localStorage.getItem('_active_offer_id') > 0) {
        window.location.hash = '#driver_go';
      }
      var _count_waypoint = MyOffer.toAddresses.length,
          el_price = Dom.sel('.wait-order-approve__route-info__price'),
          el_cancel = Dom.sel('.wait-order-approve__route-info__cancel'),
          el_routes = Dom.selAll('.wait-order-approve__route-info__route');
      
      Maps.mapOn();
      SafeWin.overviewPath = [];
      initMap();
      
      GetPositions.my();
      
      el_routes[0].children[0].innerHTML = MyOffer.fromAddress;
      el_routes[0].children[2].innerHTML = MyOffer.toAddress;
      el_routes[0].children[3].innerHTML = 'В пути: ' + 
                                           (MyOffer.length / 1000).toFixed(1) + 
                                           ' км / ' + 
                                           Dates.minToHours(MyOffer.duration);

      if (_count_waypoint > 0) {
        el_routes[0].children[1].innerHTML = 'Заездов ' + _count_waypoint;
      } else {
        el_routes[0].children[1].style.display = 'none';
      }

      el_price.innerHTML = Math.round(MyOffer.price) + ' руб';
      el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--green">Отмена</button>';
        
      HideForms.init();
      Lists.getBidsClient();

    } else {
      window.location.hash = "#driver_city";
    }
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});