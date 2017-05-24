/* global User, Event, default_city, Conn, Car */

define(['Dom', 'Storage'], function (Dom, Storage) {
  var global_li;
  
  
  function cbGetAutos(response) {
    Conn.clearCb('cbGetAutos');
    
    var cars = response.result.cars;
        
    if (cars) {
      var ul = Dom.sel('.list-cars');
      
      ul.innerHTML = '';
      
      for (var i = 0; i < cars.length; i++) {
        var li = document.createElement('li'),
            active = cars[i].isActive ? ' active' : '';
        
        li.innerHTML = '<div data-click="edit_auto" data-id="' + cars[i].id + '">' +
                          cars[i].brand + ' ' + cars[i].model +
                          '<span>Гос. номер: ' + cars[i].number + '</span>' +
                       '</div>' +
                       '<div>' +
                        '<i data-id="' + cars[i].id + '" data-click="set-drive" class="icon-steering-wheel' + active + '"></i>' +
                        '<i data-id="' + cars[i].id + '" data-click="delete-auto" class="icon-block"></i>' +
                       '</div>';
        ul.appendChild(li);
      }
    }
  }
  
  
  function cbDeleteAuto(response) {
    Conn.clearCb('cbDeleteAuto');
    
    if (!response.error) {
      var li = global_li.parentNode.parentNode;
      
      li.parentNode.removeChild(li);
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
          goToPage = '#driver_edit_auto';
        }
        
        if (target.dataset.click === "add_new_auto") {
          goToPage = '#driver_edit_auto';
        }
        
        if (target.dataset.click === "set-drive") {
          var elka = Dom.selAll('i[data-click="set-drive"]');
          
          for (var i = 0; i < elka.length; i++) {
            elka[i].classList.remove('active');
          }
          
          Dom.toggle(target, 'active');
          Car.setData();
          Car.id = target.dataset.id;
          Conn.request('setActiveAuto', target.dataset.id);
        }
        
        if (target.dataset.click === "delete-auto") {
          global_li = target;
          Conn.request('deleteAuto', target.dataset.id, cbDeleteAuto);
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