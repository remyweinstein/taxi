/* global map, User, google, MyOrder, SafeWin, default_vehicle, driver_icon, Event, MyOffer, MapElements, Conn */

define(['Dom', 'Dates', 'Maps', 'HideForms', 'Destinations', 'GetPositions', 'Lists'], 
  function (Dom, Dates, Maps, HideForms, Destinations, GetPositions, Lists) {
  
  var global_el;
  
  function cbApproveOffer() {
    Conn.clearCb('cbApproveOffer');
    MyOrder.bid_id = global_el.dataset.id;
    localStorage.setItem('_current_id_bid', MyOrder.bid_id);
    localStorage.setItem('_active_order_id', MyOrder.id);
    localStorage.setItem('_current_id_order', MyOrder.id);
    window.location.hash = "#client_go";
  }
  
  function cbCancelOrder() {
    window.location.hash = '#client_city';
  }
  
  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    
    map.setCenter(MyLatLng);
    map.setZoom(12);
    Maps.drawRoute('order', true, function(){});
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target && target.dataset.click === "taxi_client_bid") {
          global_el = target;
          Conn.request('approveOffer', global_el.dataset.id, cbApproveOffer);
        }
        
        if (target && target.dataset.click === "cancel-order") {
          global_el = target;
          Conn.request('cancelOrder', MyOrder.id, cbCancelOrder);
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
    MyOrder.clear();
    Destinations.clear();
    GetPositions.clear();
    Lists.clear();
    Conn.clearCb('cbGetBids');
    localStorage.removeItem('_active_model');
  }
  
  function start() {
    if (MyOrder.id > 0) {
      var el_price = Dom.sel('.wait-order-approve__route-info__price'),
          el_cancel = Dom.sel('.wait-order-approve__route-info__cancel'),
          el_routes = Dom.selAll('.wait-order-approve__route-info__route');
      
      Maps.mapOn();
      SafeWin.overviewPath = [];
      initMap();      
      GetPositions.my();
      el_routes[0].children[0].innerHTML = MyOrder.fromAddress;
      el_routes[0].children[2].innerHTML = MyOrder.toAddress;
      el_routes[0].children[3].innerHTML = 'В пути: ' + 
                                            (MyOrder.length / 1000).toFixed(1) + 
                                            ' км / ' + 
                                            Dates.minToHours(MyOrder.duration);

      if (MyOrder.toAddresses) {
        if (MyOrder.toAddresses.length > 0) {
          el_routes[0].children[1].innerHTML = 'Заездов ' + MyOrder.toAddresses.length;
        } else {
          el_routes[0].children[1].style.display = 'none';
        }
      }
      el_price.innerHTML = Math.round(MyOrder.price) + ' руб';
      el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--green">Отмена</button>';        
      HideForms.init();
      Lists.getBidsDriver();
    } else {
      window.location.hash = "#client_city";
    }
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});