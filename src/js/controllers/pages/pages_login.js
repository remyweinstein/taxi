                                                                     /* global Event, User, Conn */

define(['Dom', 'Storage'], function (Dom, Storage) {
  
  function cbRegisterUser(response) {
    Conn.clearCb('cbRegisterUser');
    
    if (response.result) {
      User.authToken = response.result.authToken;
      User.save();
      window.location.hash = '#sms';
    }
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