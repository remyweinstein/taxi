/* global map, User, google, MyOrder, SafeWin, default_vehicle, driver_icon, Event, MyOffer, MapElements */

define(['Ajax', 'Dom', 'Dates', 'Maps', 'HideForms', 'Destinations', 'GetPositions', 'Lists'], function (Ajax, Dom, Dates, Maps, HideForms, Destinations, GetPositions, Lists) {
  
  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    
    map.setCenter(MyLatLng);
    map.setZoom(12);

    Maps.drawRoute('offer', true, function(){});
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target, el;

      while (target !== this) {
        if (target && target.dataset.click === "taxi_client_bid") {
          el = target;

          Ajax.request('POST', 'approve-bid', User.token, '&id=' + el.dataset.id, '', function(response) {
            if (response && response.ok) {
              MyOffer.bid_id = el.dataset.id;
              localStorage.setItem('_current_id_bid', MyOffer.bid_id);
              localStorage.setItem('_current_id_order', MyOffer.id);
              
                window.location.hash = "#client_go";
            }
          }, Ajax.error);
        }
        
        if (target && target.dataset.click === "cancel-order") {
          el = target;
          
          Ajax.request('POST', 'cancel-order', User.token, '&id=' + MyOffer.id, '', function(response) {
            if (response && response.ok) {
              window.location.hash = '#client_city';
            }
          }, Ajax.error);
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
      Maps.mapOn();
      SafeWin.overviewPath = [];
      initMap();
      
      GetPositions.my();
      
      Dom.selAll('.wait-order-approve__route-info__route')[0].children[0].innerHTML = MyOffer.fromAddress;
      Dom.selAll('.wait-order-approve__route-info__route')[0].children[2].innerHTML = MyOffer.toAddress;
      Dom.selAll('.wait-order-approve__route-info__route')[0].children[3].innerHTML = 'В пути: ' + (MyOffer.length / 1000).toFixed(1) + ' км / ' + Dates.minToHours(MyOffer.duration);

      var _count_waypoint = MyOffer.toAddresses.length;

      if (_count_waypoint > 0) {
        Dom.selAll('.wait-order-approve__route-info__route')[0].children[1].innerHTML = 'Заездов ' + _count_waypoint;
      } else {
        Dom.selAll('.wait-order-approve__route-info__route')[0].children[1].style.display = 'none';
      }

      var el_price = Dom.sel('.wait-order-approve__route-info__price');
        el_price.innerHTML = Math.round(MyOffer.price) + ' руб';

      var el_cancel = Dom.sel('.wait-order-approve__route-info__cancel');
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