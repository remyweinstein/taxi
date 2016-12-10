define(['Ajax', 'Dom'], function (Ajax, Dom) {
  
  Event.submit = function (event) {
        var target = event.target;

        while (target !== this) {
          if (target.dataset.submit === 'form-auth-sms') {
            var sms = Dom.sel('input[name="sms"]').value;

            Ajax.request('POST', 'confirm', User.token, '&smsCode=' + sms, '', function(response) {
              if (response && response.ok) {
                localStorage.setItem('_is_auth', 'true');              
                window.location.hash = '#client_city';
              }
            });

            return;
          }

          target = target.parentNode;
        }
      };

  content.addEventListener('submit', Event.submit);
  
});