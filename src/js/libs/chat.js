/* global User, order_id, global_order_id, Conn */

define(['Dom'], function(Dom) {

  var timerGetMessages,
      interlocutor = "client";

  function cbGetChatMessages(response) {
    var textarea = Dom.sel('.go-order__down__messages__textarea'),
        name;

    if (textarea) {
      var innText = '';

      for (var i = 0; i < response.messages.length; i++ ) {
        var float = 'right';

        if (interlocutor === "client") {
          name = 'Клиент';
        } else {
          name = 'Водитель';
        }
        if (response.messages[i].sender.id === User.id) {
          float = 'left';
          name = 'Я';
          innText += '<p class="text-' + float + '"><strong>' + name + '</strong>: ' + response.messages[i].text + '</p>';
        } else {
          innText += '<p class="text-' + float + '"><strong>' + name + '</strong>: ' + response.messages[i].text + '</p>';
        }
      }
      if (innText) {
        var oldText = textarea.innerHTML;

        if (innText !== oldText) {
          textarea.innerHTML = innText;
          textarea.scrollTop = textarea.scrollHeight;
        }
      }
    }
  }

  function clickEvent(event) {
    var target = event.target;

    while (target !== this) {
      if (target) {
        if (!target.dataset || target.dataset === "undefined") {
          var signature = 'fdlsk90568n9v0efk3';
        } else {
          if (target.dataset.click === "send_message") {
            var messaga = Dom.sel('[data-text="new_message"]').value;
            
            Dom.sel('[data-text="new_message"]').value = '';

            if (messaga !== "") {
              var data = {};
              
              data.id = global_order_id;
              data.text = messaga;
              Conn.request('sendMessageChat', data);
            }
          }
        }
      }

      if (target) {
        target = target.parentNode;
      } else {
        break;
      }
    }
  }
  
  var Chat = {

    stop: function() {
      clearInterval(timerGetMessages);
      content.removeEventListener('click', clickEvent);
      Conn.clearCb('cbGetChatMessages');
      Conn.request('stopChatMessages');
    },

    start: function(loc) {
      interlocutor = loc;
      content.addEventListener('click', clickEvent);
      Conn.request('startChatMessages', global_order_id, cbGetChatMessages);    
    }
      
    };
  
	return Chat;
  
});