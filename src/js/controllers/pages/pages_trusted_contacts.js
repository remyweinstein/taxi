/* global Event, Conn */

define(['ModalWindows', 'react', 'ReactDOM', 'jsx!components/AgentList'], function (Modal, React, ReactDOM, List) {
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
                Conn.request('inviteSosAgent', phone, cbInviteSosAgent);
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
    FactoryList = React.createFactory(List);

    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});