/* global Event, Zones */

define(['Dom'], function (Dom) {

  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              if (target.dataset.click === 'edit-zone') {
                localStorage.setItem('_edit_zone', target.dataset.id);
                window.location.hash = '#edit_zone';
                
                return;
              }
              
              if (target.dataset.click === 'delete-zone') {
                var parent = target.parentNode,
                    id = parent.dataset.id;
                  
                Zones.remove(id);
                parent.parentNode.removeChild(parent);
                
                return;
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
    
  }
  
  function start() {
    var listZones = Dom.selAll('.list-zone')[0];

    for (var v = 0; v < Zones.list.length; v++) {
      var li = document.createElement('li');
      
      li.dataset.click = 'edit-zone';
      li.dataset.id = Zones.list[v].id;
      li.innerHTML = Zones.list[v].name + '<i class="icon-trash" data-click="delete-zone"></i><span>' + (Zones.list[v].note || '') + '</span>';
      listZones.appendChild(li);
    }

    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});