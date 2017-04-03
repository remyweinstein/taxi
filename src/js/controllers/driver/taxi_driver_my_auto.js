/* global User, Event, default_city, default_vehicle, Conn */

define(['Dom', 'Storage'], function (Dom, Storage) {
  
  function cbGetAutos(response) {
    var cars = response.result.cars;
    
    if (cars) {
      var ul = Dom.sel('.list-cars');
      
      for (var i = 0; i < cars.length; i++) {
        var li = document.createElement('li');
        
        li.dataset.click = "edit_auto";
        li.dataset.id = cars[i].id;
        li.innerHTML = cars[i].brand + ' ' + cars[i].model + '<span>' + cars[i].number + '</span>';
        ul.appendChild(li);
      }
    }
    
    Conn.clearCb('cbGetAutos');
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
        if (target.dataset.click === 'edit_auto') {
          var el = target,
              id = el.dataset.id;
          
          Storage.setIdEditCar(id);
          window.location.hash = '#driver_edit_auto';
        }
        
        if (target.dataset.click === 'add_new_auto') {
          window.location.hash = '#driver_edit_auto';
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