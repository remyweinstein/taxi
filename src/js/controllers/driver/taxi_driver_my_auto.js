/* global User, Event, default_city, default_vehicle, Conn */

define(['Dom', 'Storage'], function (Dom, Storage) {
  
  function cbGetAutos(response) {
    var cars = response.result.cars;
    
    Conn.clearCb('cbGetAutos');
    
    if (cars) {
      var ul = Dom.sel('.list-cars');
      
      for (var i = 0; i < cars.length; i++) {
        var li = document.createElement('li'),
            active = cars[i].isActive ? ' active' : ' inactive';
        
        li.innerHTML = '<div data-click="edit_auto" data-id="' + cars[i].id + '">' +
                          cars[i].brand + ' ' + cars[i].model +
                          '<span>Гос. номер: ' + cars[i].number + '</span>' +
                       '</div>' +
                       '<div>' +
                        '<i data-id="' + cars[i].id + '" data-click="set-drive" class="icon-steering-wheel' + active + '"></i>' +
                       '</div>';
        ul.appendChild(li);
      }
    }
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target,
          el;
      
      while (target !== this) {
        if (target.dataset.click === "edit_auto") {
          el = target;
          var id = el.dataset.id;
          
          Storage.setIdEditCar(id);
          window.location.hash = '#driver_edit_auto';
        }
        
        if (target.dataset.click === "add_new_auto") {
          window.location.hash = '#driver_edit_auto';
        }
        
        if (target.dataset.click === "set-drive") {
          var elka = Dom.selAll('i[data-click="set-drive"]');
          
          for (var i = 0; i < elka.length; i++) {
            elka[i].classList.remove('active');
          }
          
          Dom.toggle(target, 'active');
          Conn.request('setActiveAuto', target.dataset.id);
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

  }
  
  function start() {
    Conn.request('getAuto', '', cbGetAutos);      
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };

});