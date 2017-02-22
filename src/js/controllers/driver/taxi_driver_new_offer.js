/* global map, User, google, SafeWin, Event, MyOrder, default_vehicle, driver_icon, MyOffer */

define(['Destinations', 'GetPositions', 'Lists', 'Maps', 'HideForms', 'ModalWindows'], function (Destinations, GetPositions, Lists, Maps, HideForms, Modal) {

  function initMap() {
    var MyLatLng = new google.maps.LatLng(User.lat, User.lng);
    
    zoom = 15;
    map.setCenter(MyLatLng);
    map.setZoom(zoom);

  }
  
  function addEvents() {
    
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
          
        if (target) {
          
        //  ============= EVENTS FOR DESTINATION FIELDS ============== 
          if (target.dataset.click === 'choose_address') {
            var el = target;

            localStorage.setItem('_address_temp', el.name);
            localStorage.setItem('_address_string_temp', el.value);
            localStorage.setItem('_active_model', 'offer');
            window.location.hash = '#client_choose_address';
          }
          
          if (target.dataset.click === 'choice_location') {
            localStorage.setItem('_address_temp', target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
            localStorage.setItem('_active_model', 'offer');
            window.location.hash = '#client_choice_location_map';

            break;
          }
          
          if (target.dataset.click === 'date_offer') {
            Modal.calendar(function () {
                                      
                                    });
          }
          
          if (target.dataset.click === 'clean-field') {
            Destinations.cleanFieldOffer(target.dataset.field);

            break;
          }
          
          if (target.dataset.click === 'order-taxi') {
            localStorage.setItem('_active_model', 'offer');
            Destinations.saveOffer();

            break;
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
    var current_bid_id = localStorage.getItem('_current_id_bid');
    
    Maps.mapOn();
    
    if (current_bid_id) {
      //Lists.getOrderByID(localStorage.getItem('_current_id_order'));
    }
    
    GetPositions.my();
    initMap();
    Destinations.initOffer();
    HideForms.init();
    addEvents();
  }


  return {
    start: start,
    clear: stop
  };
  
});