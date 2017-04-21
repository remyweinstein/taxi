/* global Event, User, Conn */

define(['Dom'], function (Dom) {
  
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
            if (target.dataset.click === 'form-submit-phone') {
              var _el = target,
                  data = {},
                  code = Dom.sel('.phone_code').innerHTML,
                  phone = Dom.selAll('input[name="phone"]')[0].value;
              
              code = code === "7" ? 8 : code;
              data.phone = code + phone;
              
              _el.disabled = true;
              Conn.request('registerUser', data, cbRegisterUser);

            return;
            }

            if (target.dataset.click === 'form-submit-email') {
              var _el = target,
                  data = {};
                
              data.email = Dom.selAll('input[name="email"]')[0].value;
              
              _el.disabled = true;
              Conn.request('registerUser', data, cbRegisterUser);

            return;
            }

            target = target.parentNode;
          }
        };

    Dom.sel('.content').addEventListener('click', Event.click);
    
    Event.change = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.change === 'country') {
              var _el = target;
              
              Dom.sel('.phone_code').innerHTML = _el.value;
              return;
            }

            target = target.parentNode;
          }
        };

    Dom.sel('.content').addEventListener('change', Event.change);  
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