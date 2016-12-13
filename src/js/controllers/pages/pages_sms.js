define(['Ajax', 'Dom'], function (Ajax, Dom) {

  function addEvents() {
    Event.submit = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.submit === 'form-auth-sms') {
              var sms = Dom.selAll('input[name="sms"]')[0].value;

              Ajax.request('POST', 'confirm', User.token, '&smsCode=' + sms, '', function(response) {
                if (response && response.ok) {
                  User.is_auth = true;
                  localStorage.setItem('_is_auth', 'true');              
                  window.location.hash = '#client_city';
                } else {
                  alert('Неверный код');
                }
              }, function() {
                alert('Ошибка связи с сервером');
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