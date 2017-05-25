/* global Event, Conn */

define(['Dom', 'Storage'], function (Dom, Storage) {

  function cbGetSosAgents(response) {
    Conn.clearCb('cbGetSosAgents');
    var ul = Dom.sel('ul.list-message');
    
    ul.innerHTML = '';
    
    if (!response.error) {
      var agents = response.result.sosAgents;

      for (var i = 0; i < agents.length; i++) {
        var li    = document.createElement('li'),
            name  = agents[i].name || 'Гость',
            zones = agents[i].sosZones ? '<i class="icon-ok active"></i>' : '';

        li.dataset.id = agents[i].id;
        li.innerHTML  = '<div data-click="open-map" data-id="' + agents[i].id + '">' +
                          name +
                        '</div>' +
                        '<div>' +
                          zones + 
                        '</div>';
                      
        ul.appendChild(li);
      }
      
      if (agents.length === 0) {
        var li = document.createElement('li');
        
        li.innerHTML  = '<div style="text-align: center">Агенты не найдены</div>';
        ul.appendChild(li);
      }
    } 
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
    addEvents();
    Conn.request('getSosAgents', '', cbGetSosAgents);
    Conn.request('stopGetSosAgents');
  }
  
  return {
    start: start,
    clear: stop
  };
  
});