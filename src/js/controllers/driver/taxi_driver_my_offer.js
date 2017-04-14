/* global User, Maps, SafeWin, Event, Conn */

define(['Dom', 'Dates', 'HideForms', 'Destinations', 'GetPositions', 'Lists', 'Storage', 'DriverOffer'], 
function (Dom, Dates, HideForms, Destinations, GetPositions, Lists, Storage, clDriverOffer) {
  var MyOffer;
  
  function cbOnApproveOrder(response) {
    Conn.clearCb('cbOnApproveOrder');
    
    if (!response.error) {
      MyOffer.getByID(response.result.id, function () {});
    }
  }
  
  function cbOnCancelOffer() {
    Conn.clearCb('cbOnCancelOffer');
    window.location.hash = '#client_city';
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
    Maps.drawRoute(MyOffer, false, function(){});
  }
  
  function addCargo() {
    var additional_info = Dom.sel('div[data-block="additional_info"]'),
        innerText = '<i class="icon-box form-order-city__label"></i><span>Объем ' + MyOffer.volume + 'м3</span>' +
                    '<i class="icon-balance-scale form-order-city__label"></i><span>Вес ' + MyOffer.weight + 'кг</span>' +
                    '<i class="icon-hand-peace-o form-order-city__label"></i><span>Грузчики: ' + MyOffer.stevedores + '</span>';

    additional_info.innerHTML = innerText;
  }
  
  function addInterCity() {
    var additional_info = Dom.sel('div[data-block="additional_info"]'),
        innerText = '<i class="icon-accessibility form-order-city__label"></i><span>Мест: ' + MyOffer.seats + '</span>' + 
                    '<i class="icon-shopping-bag form-order-city__label"></i><span>Багаж: ' + MyOffer.bags + '</span>';
    
    additional_info.innerHTML = innerText;
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
    //Storage.removeActiveTypeModelTaxi();
  }
  
  function start() {
    //Storage.getActiveTypeTaxi();
    MyOffer = new clDriverOffer();
    MyOffer.activateCurrent();

    if (MyOffer.id > 0) {
      var addCityFrom = '',
          addCityTo = '';
        
      Lists.init(MyOffer);
      
      if (Storage.getActiveTypeTaxi() === "intercity") {
        addInterCity();
        addCityFrom = MyOffer.fromCity + ', ',
        addCityTo = MyOffer.toCity + ', ';
      }

      if (Storage.getActiveTypeTaxi() === "trucking") {
        addCargo();
      }

      var el_price  = Dom.sel('.wait-order-approve__route-info__price'),
          el_cancel = Dom.sel('.wait-order-approve__route-info__cancel'),
          el_routes = Dom.selAll('.wait-order-approve__route-info__route');
      
      Maps.mapOn();
      SafeWin.overviewPath = [];
      initMap();
      GetPositions.my();
      el_routes[0].children[0].innerHTML = addCityFrom + MyOffer.fromAddress;
      el_routes[0].children[2].innerHTML = addCityTo + MyOffer.toAddress;
      el_routes[0].children[3].innerHTML = 'В пути: ' +
                                           (MyOffer.length / 1000).toFixed(1) +
                                           ' км / ' +
                                           Dates.minToHours(MyOffer.duration);

      el_price.innerHTML = Math.round(MyOffer.price) + ' руб';
      el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--green">Отмена</button>';
      HideForms.init();
      Lists.getBidsClient();
    } else {
      var targetLink = Storage.getActiveTypeTaxi();
      
      targetLink = targetLink==="taxi" ? "city" : targetLink;
      targetLink = targetLink==="trucking" ? "cargo" : targetLink;
      window.location.hash = "#driver_" + targetLink;
    }
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});