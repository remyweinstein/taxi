/* global User, order_id, global_order_id, Conn */

define(['Dom'], function(Dom) {

  var timerGetMessages,
      interlocutor;

  function cbGetChatMessages(response) {
    if (!response.error) {
      var textarea = Dom.sel('.go-order__down__messages__textarea'),
          name, float;

      if (textarea) {
        var innText = '',
            messages = response.result.chat;

        for (var i = 0; i < messages.length; i++ ) {
          float = 'right';
          name = messages[i].sender.name;
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
        if (!target.dataset || target.dataset === "undefined") {
          var signature = 'fdlsk90568n9v0efk3';
        } else {
          if (target.dataset.click === "send_message") {
            var messaga = Dom.sel('[data-text="new_message"]').value;
            
            Dom.sel('[data-text="new_message"]').value = '';

            if (messaga !== "") {
              var data = {};
              
              if (interlocutor === "order") {
                data.orderId = localStorage.getItem('_active_order_id');
              } else {
                data.offerId = localStorage.getItem('_active_offer_id');
              }
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
    },
    
    exit: function() {
      Conn.clearCb('cbGetChatMessages');
      Conn.request('stopChatMessages');
    },

    start: function(loc, id) {
      var paramparam = {};
      
      interlocutor = loc;
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