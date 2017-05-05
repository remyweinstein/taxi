/* global Event, User, Conn, Car */

define(['Dom'], function (Dom) {

  function cbConfirmSms(response) {
    Conn.clearCb('cbConfirmSms');
    
    if (!response.error) {
      User.token   = response.result.token;
      User.id      = response.result.id;             
      User.is_auth = true;
      User.reloadData();
      goToPage = '#client_city';
    }
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
    var params = window.location.search;
    
    addEvents();
    
    if (params !== "") {
      params = (params.substr(1)).split('&');
      
      var authToken = params[0].split('='),
          code      = params[1].split('=');
      
      User.authToken = authToken[1];
      Dom.sel('input[name="sms"]').value = code[1];  
    }
  }
  
  return {
    start: start,
    clear: stop
  };
});