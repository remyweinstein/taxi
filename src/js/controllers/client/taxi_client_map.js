/* global User, SafeWin, Event, Conn, Maps */

define(['Dom', 'Dates', 'HideForms', 'Destinations', 'GetPositions', 'Lists', 'Storage', 'ClientOrder'], 
function (Dom, Dates, HideForms, Destinations, GetPositions, Lists, Storage, clClientOrder) {
  
  var global_el, MyOrder, global_id;
  
  function cbApproveOffer(resp) {
    Conn.clearCb('cbApproveOffer');
    if (!resp.error) {
      MyOrder.getByID(MyOrder.id, function () {});
    }
  }
  
  function cbCancelOrder(resp) {
    Conn.clearCb('cbCancelOrder');
    
    if (!resp.error) {      
      var add = Storage.getActiveTypeTaxi();
      
      Conn.request('deleteOrderById', global_id);
      
      if (add === "taxi") {
        add = 'city';
      }
      
      goToPage = '#client_' + add;
    }
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
    Maps.drawRoute(MyOrder, true, false, function(){});
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
        
        if (target && target.dataset.click === "edit_order") {
          global_el = target;
          global_id = MyOrder.id;
          Conn.request('cancelOrder', MyOrder.id, cbCancelOrder);
        }
        
        if (target && target.dataset.click === "automat") {
          var elem = Dom.sel('button[data-click="automat"]');
          
          global_el = target;
          
          if (Storage.getClientAutomat()) {
            Storage.removeClientAutomat();
            elem.classList.remove('button_rounded--green');
            elem.classList.add('button_rounded--grey');
          } else {
            Storage.setClientAutomat();
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
    SafeWin.disableZoneForRoute();
  }
  
  function start() {
    MyOrder = new clClientOrder();
    MyOrder.activateCurrent();
    
    if (MyOrder.id > 0) {
      var el_price       = Dom.sel('.wait-order-approve__route-info__price'),
          el_cancel      = Dom.sel('.wait-order-approve__route-info__cancel'),
          el_routes      = Dom.selAll('.wait-order-approve__route-info__route'),
          color_automat  = Storage.getClientAutomat() ? 'green' : 'grey',
          addCityFrom    = '', 
          addCityTo      = '',
          disabled       = MyOrder.canceled ? ' disabled' : '',
          activeTypeTaxi = Storage.getActiveTypeTaxi();
        
      if (activeTypeTaxi === "intercity" || activeTypeTaxi === "tourism") {
        addCityFrom = MyOrder.fromCity + ', ',
        addCityTo   = MyOrder.toCity + ', ';
      }
      
      Lists.init(MyOrder);
      Maps.mapOn();
      SafeWin.overviewPath = [];
      initMap();      
      GetPositions.my();
      el_routes[0].children[0].innerHTML = addCityFrom + MyOrder.fromAddress;
      el_routes[0].children[2].innerHTML = addCityTo + MyOrder.toAddress;
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
      
      el_price.innerHTML  = Math.round(MyOrder.price) + ' руб';
      el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--green"' + disabled + '>Отмена</button>' + 
                            '<button data-click="edit_order" class="button_rounded--green">Редактировать</button>' + 
                            '<button data-click="automat" class="button_rounded--' + color_automat + '">Автомат</button>';
      HideForms.init();
      Lists.getBidsDriver();
      
      if (MyOrder.zone) {
        var poly = Maps.drawPoly(MyOrder.zone.polygon);
        
        SafeWin.polyRoute.push(poly);
        SafeWin.enableButtonRoute();
        Maps.addElOnMap(poly);
      }
      
    } else {
      goToPage = "#client_city";
    }
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});