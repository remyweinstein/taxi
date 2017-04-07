/* global Event, Conn */

define(['ModalWindows', 'PopupWindows'], function (Modal, Popup) {
  
  function cbGetSosAgents(response) {
    Conn.clearCb('cbGetSosAgents');
    console.log('list sos agents ', response.result);
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
              Conn.request('removeSosAgent', '', cbRemoveSosAgents);
              
              return;
            }

            if (target.dataset.click === 'accept-agent') {
              Conn.request('acceptInviteSosAgent', '', cbAcceptSosAgents);
              //<p><button class="button_wide--green" data-click="invite-agent">Пригласить агента</button></p>
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