/* global User, order_id, global_order_id, Conn */

define(['Dom'], function(Dom) {

  var timerGetMessages,
      interlocutor,
      active_id;

  function cbGetChatMessages(response) {
    if (!response.error) {
      var textarea = Dom.sel('.go-order__down__messages__textarea'),
          name, float;

      if (textarea) {
        var innText = '',
            messages = response.result.chat;

        for (var i = 0; i < messages.length; i++ ) {
          float = 'right';
          name = messages[i].sender.name || "Гость";
          if (messages[i].sender.id === User.id) {
            float = 'left';
            name = 'Я';
          }
          innText += '<p class="text-' + float + '"><strong>' + name + '</strong>: ' + messages[i].text + '</p>';
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
  }

  function clickEvent(event) {
    var target = event.target;

    while (target !== this) {
      if (target) {
        if (target.dataset.click === "send_message") {
          var messaga = Dom.sel('[data-text="new_message"]').value;

          Dom.sel('[data-text="new_message"]').value = '';

          if (messaga !== "") {
            var data = {};

            if (interlocutor === "order") {
              data.orderId = active_id;
            } else {
              data.offerId = active_id;
            }
            
            data.text = messaga;
            Conn.request('sendMessageChat', data);
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
      timerGetMessages = clearInterval(timerGetMessages);
      content.removeEventListener('click', clickEvent);
    },
    
    exit: function() {
      Conn.clearCb('cbGetChatMessages');
      Conn.request('stopChatMessages');
    },

    start: function(loc, id) {
      var paramparam = {};
      
      interlocutor = loc;
      active_id = id;
      
      if (loc === "offer") {
        paramparam.offerId = id;
      } else {
        paramparam.orderId = id;
      }
      
      content.addEventListener('click', clickEvent);
      Conn.request('startChatMessages', paramparam, cbGetChatMessages);
    }
      
    };
  
	return Chat;
  
});