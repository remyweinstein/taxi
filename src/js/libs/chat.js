/* global User, order_id, global_order_id */

define(['Ajax', 'Dom'], function(Ajax, Dom) {

  var timerGetMessages,
      interlocutor = "client";

  function get_new_messages() {
    var name;
    
    Ajax.request('GET', 'messages', User.token, '&id=' + global_order_id, '', function(response) {
      if (response && response.ok) {
        var textarea = Dom.sel('.go-order__down__messages__textarea');
        
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
    }, Ajax.error);
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
              Ajax.request('POST', 'message', User.token, '&id=' + global_order_id + '&text=' + messaga, '', function () {});
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

    start: function(loc) {
      interlocutor = loc;
      get_new_messages();
      timerGetMessages = setInterval(get_new_messages, 1000);

      content.addEventListener('click', clickEvent);
    }
      
    };
  
	return Chat;
  
});