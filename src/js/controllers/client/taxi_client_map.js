/* global User, SafeWin, Event, Conn, Maps */

define(['Dom', 'Dates', 'HideForms', 'Destinations', 'GetPositions', 'Lists', 'Storage', 'ClientOrder'], 
function (Dom, Dates, HideForms, Destinations, GetPositions, Lists, Storage, clClientOrder) {
  
  var global_el, MyOrder;
  
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
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
    Maps.drawRoute(MyOrder, true, function(){});
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
        
        if (target && target.dataset.click === "automat") {
          var elem = Dom.sel('button[data-click="automat"]');
          
          global_el = target;
          if (localStorage.getItem('_automat_client_approve')) {
            localStorage.removeItem('_automat_client_approve');
            elem.classList.remove('button_rounded--green');
            elem.classList.add('button_rounded--grey');
          } else {
            localStorage.setItem('_automat_client_approve', true);
            elem.classList.remove('button_rounded--grey');
            elem.classList.add('button_rounded--green');
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
    Destinations.clear();
    GetPositions.clear();
    Lists.clear();
    Conn.clearCb('cbGetBids');
    //Storage.removeActiveTypeModelTaxi();
    Storage.lullModel(MyOrder);
  }
  
  function start() {
    MyOrder = new clClientOrder();
    MyOrder.activateCurrent();
    Lists.init(MyOrder);

    if (MyOrder.id > 0) {
      var el_price = Dom.sel('.wait-order-approve__route-info__price'),
          el_cancel = Dom.sel('.wait-order-approve__route-info__cancel'),
          el_routes = Dom.selAll('.wait-order-approve__route-info__route'),
          color_automat = localStorage.getItem('_automat_client_approve') ? 'green' : 'grey';
      
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
      el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--green">Отмена</button>' + 
                            '<button data-click="automat" class="button_rounded--' + color_automat + '">Автомат</button>';
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