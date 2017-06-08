/* global Maps, User, Event, Conn, men_icon, MapElements, SafeWin */

define(['Storage'], function (Storage) {
  var agentId, firstTime = true;

  function cbGetSosAgents(response) {
    if (!response.error) {
      var agents = response.result.sosAgents;
      
      for (var i = 0; i < agents.length; i++) {
        var loc   = agents[i].location.split(','),
            photo = agents[i].photo || User.avatar,
            info  = '<div style="text-align:center;">' + 
                      '<div style="width:100%;display:inline-block;float: left;">' + 
                        '<p>id' + agents[i].id + '<br>' + agents[i].name + '</p>' + 
                        '<p><img class="avatar" src="' + photo + '" alt=""/></p>' + 
                      '</div>' + 
                    '</div>',
             zoneIds = agents[i].sosZones || [];
        
        if (firstTime && zoneIds.length > 0) {
          DrawZones(zoneIds);
        }
        
        if (!MapElements.markers_agent_pos[agents[i].id]) {
          Maps.addMarker(loc[0], loc[1], agents[i].name, men_icon, [32,32], function(mark){
            Maps.addInfoForMarker(info, false, mark);
            MapElements.markers_agent_pos[agents[i].id] = mark;
          });
        } else {
          Maps.markerSetPosition(loc[0], loc[1], MapElements.markers_agent_pos[agents[i].id]);
        }

      }
      
      for (var key in MapElements.markers_agent_pos) {
          if (MapElements.markers_agent_pos.hasOwnProperty(key) &&
              /^0$|^[1-9]\d*$/.test(key) &&
              key <= 4294967294) {
                var sovp = false;

                for (var i = 0; i < agents.length; i++) {
                  if (agents[i].id  === key) {
                    sovp = true;
                  }
                }

                if (!sovp) {
                  Maps.removeElement(MapElements.markers_agent_pos[key]);
                  delete MapElements.markers_agent_pos[key];
                }
          }
      }            
    } 
  }
  
  function DrawZones(ids) {
    firstTime = false;
    
    SafeWin.markChildren(ids);
  }
  
  function initMap() {    
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
  }

  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target) {
              //if (target.dataset.click === 'save-zone') {
              //  return;
              //}
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
    Storage.removeZoneSosAgent();
    Conn.clearCb('cbGetSosAgents');
    Conn.request('stopGetSosAgents');
    MapElements.clear();
  }
  
  function start() {
    agentId = Storage.getZoneSosAgent();
    firstTime = true;
    
    if (agentId) {
      Maps.mapOn();
      initMap();
      addEvents();
      Conn.request('getSosAgentsById', agentId, cbGetSosAgents);
    } else {
      goToPage = "#parent_control";
    }
  }
  
  return {
    start: start,
    clear: stop
  };
  
});