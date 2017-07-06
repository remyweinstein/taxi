/* global Event, Zones */

define(['Funcs', 'react', 'ReactDOM', 'jsx!components/ZoneList'], function (Funcs, React, ReactDOM, List) {
  var FactoryList, storeList;

  function renderList() {
    ReactDOM.render(
      FactoryList({list: storeList}),
      document.querySelector('.dynamic')
    );
  }

  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              if (target.dataset.click === 'edit-zone') {
                if (target.dataset.id) {
                  localStorage.setItem('_edit_zone', target.dataset.id);
                }
                goToPage = '#edit_zone';
                
                return;
              }
              
              if (target.dataset.click === 'delete-zone') {
                var parent = target.parentNode,
                    id = parent.dataset.id;
                  
                Zones.remove(id);
                storeList = Funcs.deleteArrayByID(Zones.list, id);
                renderList();
                
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
    FactoryList = React.createFactory(List);
    storeList = Zones.list;
    renderList();
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});