/* global Event, User, Conn */

define(['Dom', 'Storage', 'Dates'], function (Dom, Storage, Dates) {
  var id_li_delete;
  
  function cbGetNotify(response) {
    Conn.clearCb('cbGetNotify');
    
    var ul = Dom.sel('ul.list-message'),
        messages = response.result.notifications;
    
    for (var i = 0; i < messages.length; i++) {
      var li = document.createElement('li'),
          text = messages[i].text;
      //agentId, args.agentId, created, delivered, created, type
      
      text = messages[i].type==="invite" ? "Приглашение от агента" : text;
      
      if (!messages[i].read) {
        li.classList.add('unread');
      }
      
      li.dataset.id = messages[i].id;
      li.innerHTML = '<div data-click="open-notify" data-id="' + messages[i].id + '">' +
                       '<span>' + Dates.datetimeForPeople(messages[i].created) + '</span><br/>' + 
                       text +
                      '</div>' +
                      '<div>' +
                       '<i class="icon-cancel-circled" data-click="delete-notify" data-id="' + messages[i].id + '"></i>' +
                     '</div>';
      ul.appendChild(li);
    }
  }
  
  function cbDeleteNotify(response) {
    Conn.clearCb('cbDeleteNotify');
    
    if (!response.error) {
      var ul   = Dom.sel('ul.list-message'),
          elem = Dom.sel('li[data-id="' + id_li_delete + '"]');

      ul.removeChild(elem);
    }
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === 'open-notify') {
          Storage.setOpenNotify(target.dataset.id);
          goToPage = '#open_message';
        }
        
        if (target.dataset.click === 'delete-notify') {
          id_li_delete = target.dataset.id;
          Conn.request('removeNotification', id_li_delete, cbDeleteNotify);
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
    Conn.request('getNotifications', '', cbGetNotify);
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
