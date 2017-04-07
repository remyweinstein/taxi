/* global Event, User, Conn, Car */

define(['Dom', 'Storage'], function (Dom, Storage) {

  function cbConfirmSms(response) {
    User.token = response.result.token;
    User.id = response.result.id;             
    User.is_auth = true;
    User.save();    
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
              
              data.authToken = User.authToken;
              data.code = sms;
              User.save();    
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