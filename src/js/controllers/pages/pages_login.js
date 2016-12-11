define(['Ajax', 'Dom'], function (Ajax, Dom) {
  
  function addEvents() {
    Event.submit = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.submit === 'form-auth') {
              var button = Dom.sel('[data-click="form-submit"]');
              button.disabled = true;

              var phone = Dom.sel('input[name="phone"]').value;
              var token = User.token ? User.token : "";

              Ajax.request('POST', 'register', token, '&phone=7'+phone, '', function(response) {

                if (response && response.ok) {
                  localStorage.setItem('_my_token', response.token);
                  User.token = response.token;
                  window.location.hash = '#sms';
                }
                button.disabled = false;

              }, function(){
                button.disabled = false;
              });

            return;
            }

            if (target) {
              target = target.parentNode;
            } else {
              break;
            }
          }
        };

    content.addEventListener('submit', Event.submit);
  }
  
  function start() {
    addEvents();
  }
  
  return {
    start: start
  };
  
});