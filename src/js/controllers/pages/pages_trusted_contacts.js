/* global Event, Conn */

define(['ModalWindows', 'PopupWindows', 'Dom', 'Dates'], function (Modal, Popup, Dom, Dates) {
  
  function cbGetSosAgents(response) {
    var agents = response.result.sosAgents,
        ul = Dom.sel('ul.trusted-contacts');
    
    Conn.clearCb('cbGetSosAgents');
    
    for (var i = 0; i < agents.length; i++) {
      var li = document.createElement('li');

      li.dataset.id = agents[i].id;
      li.innerHTML = '<div>' +
                       '<span>' + agents[i].name + '</span><br/>' + 
                       agents[i].phone +
                      '</div>' +
                      '<div>' +
                       '<i class="icon-cancel-circled" data-click="remove-agent" data-id="' + agents[i].id + '"></i>' +
                     '</div>';
      ul.appendChild(li);
    }
  }
  
  function cbRemoveSosAgents() {
    Conn.clearCb('cbRemoveSosAgents');    
  }
  
  function cbAcceptSosAgents() {
    Conn.clearCb('cbAcceptSosAgents');
  }
  
  function cbInviteSosAgent(response) {
    Conn.clearCb('cbInviteSosAgent');
    
    if (response.error) {
      Modal.show('<h4>Агент не найден</h4>', function(){});
    } else {
      Modal.show('<h4>Приглашение отправлено</h4>', function(){});
    }
  }
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this && target) {
            if (target.dataset.click === 'invite-agent') {
              Modal.enterPhone(function (phone){
                Conn.request('inviteSosAgent', '8' + phone, cbInviteSosAgent);
              });
              
              return;
            }

            if (target.dataset.click === 'remove-agent') {
              Conn.request('removeSosAgent', target.dataset.id, cbRemoveSosAgents);
              
              return;
            }

            if (target.dataset.click === 'accept-agent') {
              Conn.request('acceptInviteSosAgent', target.dataset.id, cbAcceptSosAgents);
              return;
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
    Modal.close();
  }
  
  function start() {
    Conn.request('getSosAgents', '', cbGetSosAgents);
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});