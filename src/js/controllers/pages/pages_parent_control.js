/* global Event, Conn */

define(['Storage', 'react', 'ReactDOM', 'jsx!components/ParentPage'], function (Storage, React, ReactDOM, List) {
  var FactoryList, storeList;

  function renderList() {
    ReactDOM.render(
      FactoryList({list: storeList}),
      document.querySelector('.dynamic')
    );
  }

  function cbGetSosAgents(response) {
    Conn.clearCb('cbGetSosAgents');
    storeList = response.result.sosAgents;
    renderList();
  }

  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              if (target.dataset.click === 'open-map') {
                var el = target;
                
                Storage.setZoneSosAgent(el.dataset.id);
                goToPage = "#parent_map";
                
                return;
              }
            }

            if (target) {
              target = target.parentNode;
            } else {
              break;
            }
          }
          
          return;
        };

    content.addEventListener('click', Event.click);
  }
  
  function stop() {
    
  }
  
  function start() {
    FactoryList = React.createFactory(List);
    addEvents();
    Conn.request('getSosAgents', '', cbGetSosAgents);
    Conn.request('stopGetSosAgents');
  }
  
  return {
    start: start,
    clear: stop
  };
  
});