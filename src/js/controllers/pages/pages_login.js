/* global Event, User, Conn */

define(['Dom'], function (Dom) {
  
  function cbRegisterUser(response) {
    localStorage.setItem('_auth_token', response.authToken);
    User.authToken = response.authToken;
    window.location.hash = '#sms';
    Conn.clearCb('cbRegisterUser');
  }
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.click === 'form-submit') {
              var _el = target,
                  phone = Dom.selAll('input[name="phone"]')[0].value;
              
              _el.disabled = true;
              Conn.request('registerUser', phone, cbRegisterUser);

            return;
            }

            target = target.parentNode;
          }
        };

    Dom.sel('.content').addEventListener('click', Event.click);
  }
  
  function stop() {

  }
  
  function start() {
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});