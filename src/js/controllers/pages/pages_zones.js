/* global Event, Zones */

define(['Dom'], function (Dom) {

  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              if (target.dataset.click === 'edit-zone') {
                var el = target;
                
                localStorage.setItem('_edit_zone', el.dataset.id);
                window.location.hash = '#edit_zone';
                
                return;
              }
              
              if (target.dataset.click === 'delete-zone') {
                var el = target;
                var parent = el.parentNode;
                var id = parent.dataset.id;
                
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
    var listZones = Dom.selAll('.zone-list')[0];

    for (var v = 0; v < Zones.list.length; v++) {
      var li = document.createElement('li');
      
      li.dataset.click = 'edit-zone';
      li.dataset.id = v;
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