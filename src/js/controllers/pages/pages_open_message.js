/* global Conn, Event */

define(['Storage', 'Dom'], function (Storage, Dom) {

  function cbReadOpenNotify(response) {
    Storage.clearOpenNotify();
    Conn.clearCb('cbReadOpenNotify');
    
    var ul = Dom.sel('ul.list-message'),
        message = response.result.notification,
        li = document.createElement('li'),
        type = message.type,
        text = message.text,
        body = '';
    
    if (type === "invite") {
      var id = message.id;
      
      body = '<div>' +
              '<button class="button_rounded--grey" data-click="recept-invite">Отказать</button>' +
              '<button class="button_rounded--green" data-id="' + id + '" data-click="accept-invite">Принять</button>' +
             '</div>';
    }
    
    li.dataset.id = message.id;
    li.dataset.click = "open-notify";
    li.innerHTML = text + body;
    ul.appendChild(li);
  }
  
  function cbAcceptInvite(resp) {
    if (!resp.error) {
      Conn.clearCb('cbAcceptInvite');
      window.location.hash = '#messages';
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
          window.location.hash = '#messages';
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
      addEvents();
    } else {
      window.location.hash = '#messages';
    }
  }
  
  return {
    start: start,
    clear: stop
  };
  
});