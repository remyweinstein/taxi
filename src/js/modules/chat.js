  var Chat = (function() { //Ajax Dom
    var timerGetMessages;
    var interlocutor = "client";

    function get_new_messages() {
      //console.log('try get list messages');
      Ajax.request(server_uri, 'GET', 'messages', User.token, '&id=' + bid_id, '', function(response) {
        //response;
        var textarea = Dom.sel('.go-order__down__messages__textarea');

        if (textarea) {
          var innText = '';
          for (var i = 0; i < response.messages.length; i++ ) {
            var float = 'right';
            if (interlocutor === "client") {
              var name = 'Клиент';
            } else {
              var name = 'Водитель';
            }
            if (response.messages[i].sender.id === User.id) {
              float = 'left';
              name = 'Я';
              innText += '<p class="text-' + float + '"><strong>' + name + '</strong>: ' + response.messages[i].text + '</p>\n\
                          ';
            } else {
              innText += '<p class="text-' + float + '"><strong>' + name + '</strong>: ' + response.messages[i].text + '</p>\n\
                          ';
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
      });
    }


    return {
      stop: function(){
        clearInterval(timerGetMessages);
      },
      
      start: function(loc) {
        interlocutor = loc;
        get_new_messages();
        timerGetMessages = setInterval(get_new_messages, 1000);
        
          content.addEventListener('click', clickEvent(event));
          function clickEvent(event) {
            var target = event.target;

            while (target !== this) {
              if (target.dataset.click === "send_message") {
                var messaga = Dom.sel('[data-text="new_message"]').value;
                Dom.sel('[data-text="new_message"]').value = '';

                if (messaga !== "") {
                  Ajax.request(server_uri, 'POST', 'message', User.token, '&id=' + bid_id + '&text=' + messaga, '', function () {});
                }
              }

              target = target.parentNode;
            }
          }
      }
      
    };
  })();
