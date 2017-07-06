/* global Conn, Event */

define(['Storage', 'react', 'ReactDOM', 'jsx!components/MessagePage'], function (Storage, React, ReactDOM, MessagePage) {
  var FactoryMessagePage, storeMessagePage;

  function renderMessagePage() {
    ReactDOM.render(
      FactoryMessagePage({message: storeMessagePage}),
      document.querySelector('.dynamic')
    );
  }

  function cbReadOpenNotify(response) {
    Conn.clearCb('cbReadOpenNotify');
    Storage.clearOpenNotify();
    
    storeMessagePage = response.result.notification;
    renderMessagePage();
  }
  
  function cbAcceptInvite(resp) {
    Conn.clearCb('cbAcceptInvite');
    
    if (!resp.error) {
      goToPage = '#messages';
    }
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === 'accept-invite') {
          Conn.request('acceptInviteSosAgent', target.dataset.id, cbAcceptInvite);
        }

        if (target.dataset.click === 'recept-invite') {
          goToPage = '#messages';
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
    Storage.clearOpenNotify();
  }
  
  function start() {
    var id = Storage.getOpenNotify();
    
    if (id) {
      Conn.request('readNotification', id, cbReadOpenNotify);
      FactoryMessagePage = React.createFactory(MessagePage);
      addEvents();
    } else {
      goToPage = '#messages';
    }
  }
  
  return {
    start: start,
    clear: stop
  };
  
});