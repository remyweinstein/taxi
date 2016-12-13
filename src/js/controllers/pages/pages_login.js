define(['Ajax', 'Dom'], function (Ajax, Dom) {
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.click === 'form-submit') {
              var _el = target;
              
              _el.disabled = true;

              var phone = Dom.selAll('input[name="phone"]')[0].value;
              var token = User.token ? User.token : "";

              Ajax.request('POST', 'register', token, '&phone=7' + phone, '', function(response) {

                if (response && response.ok) {
                  localStorage.setItem('_my_token', response.token);
                  User.token = response.token;
                  window.location.hash = '#sms';
                }
                _el.disabled = false;

              }, function() {
                _el.disabled = false;
                alert('Ошибка связи с сервером');
              });

            return;
            }

            target = target.parentNode;
          }
        };

    Dom.sel('.content').addEventListener('click', Event.click);
  }
  
  function start() {
    addEvents();
  }
  
  return {
    start: start
  };
  
});