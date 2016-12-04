        // = Form auth SMS =
    Event.submit = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.submit === 'form-auth-sms') {
              var sms = Dom.sel('input[name="sms"]').value;

              Ajax.request(server_uri, 'POST', 'confirm', User.token, '&smsCode=' + sms, '', function(response) {
                if (response && response.ok) {
                  localStorage.setItem('_is_auth', 'true');              
                  document.location= '/';
                }
              });

              return;
            }

            target = target.parentNode;
          }
        }

    content.addEventListener('submit', Event.submit);