/* global User, Event, Maps */

define(['Destinations', 'GetPositions', 'HideForms', 'ModalWindows', 'Storage', 'DriverOffer'], 
function (Destinations, GetPositions, HideForms, Modal, Storage, clDriverOffer) {
  var MyOffer, type;
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(15);
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
            Storage.setActiveTypeModelTaxi('offer');
            window.location.hash = '#client_choose_address';
          }
          
          if (target.dataset.click === 'choice_location') {
            localStorage.setItem('_address_temp', target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
            Storage.setActiveTypeModelTaxi('offer');
            window.location.hash = '#client_choice_location_map';

            break;
          }
          
          if (target.dataset.click === 'date_offer') {
            Modal.calendar( function (datetime) {
                              Destinations.addStartTimeOffer(datetime);
                            });

            break;
          }
          
          if (target.dataset.click === 'clean-field') {
            Destinations.cleanFieldOffer(target.dataset.field);

            break;
          }
          
          if (target.dataset.click === 'save-order') {
            Storage.setActiveTypeModelTaxi('offer');
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

    type = Storage.getActiveTypeTaxi();
    MyOffer = new clDriverOffer();
    MyOffer.activateCurrent();
    Maps.mapOn();
    
    if (current_bid_id) {
      //Lists.getOrderByID(localStorage.getItem('_current_id_order'));
    }
    
    GetPositions.my();
    initMap();
    Destinations.init(MyOffer);
    HideForms.init();
    addEvents();
  }


  return {
    start: start,
    clear: stop
  };
  
});