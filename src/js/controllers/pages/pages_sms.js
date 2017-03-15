/* global Event, User, Conn, Car */

define(['Dom'], function (Dom) {

  function cbConfirmSms(response) {
    localStorage.setItem('_my_token', response.result.token);
    User.token = response.result.token;
    localStorage.setItem('_my_id', response.result.id);
    User.id = response.result.id;
    localStorage.setItem('_is_auth', 'true');              
    User.is_auth = true;
    User.getData();
    window.location.hash = '#client_city';
    Conn.clearCb('cbConfirmSms');
  }
  
  function addEvents() {
    Event.submit = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.submit === 'form-auth-sms') {
              var sms = Dom.selAll('input[name="sms"]')[0].value,
                  data= {};
              
              User.authToken = localStorage.getItem('_auth_token');
              data.authToken = User.authToken;
              data.code = sms;
              Conn.request('confirmSms', data, cbConfirmSms);

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