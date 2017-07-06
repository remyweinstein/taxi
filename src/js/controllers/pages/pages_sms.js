/* global Event, User, Conn, Car */

define(['Storage', 'react', 'ReactDOM', 'jsx!components/SmsPage'], function (Storage, React, ReactDOM, SmsPage) {
  var FactorySmsPage, storeSmsCode;

  function renderSmsPage() {
    ReactDOM.render(
      FactorySmsPage({code: storeSmsCode}),
      document.querySelector('.dynamic')
    );
  }

  function cbConfirmSms(response) {
    var params = window.location.search;
    
    Conn.clearCb('cbConfirmSms');
    
    if (!response.error) {
      User.token   = response.result.token;
      User.id      = response.result.id;             
      User.is_auth = true;
      User.reloadData();
    } else {
      alert('Ошибка авторизации');
    }
    
    Storage.clearHistoryPages();
    Storage.clearLastPage();
    Storage.clear();
    goToPage = '#client_city';
    
    if (params !== "") {
      //window.location.search = '';
      //window.location.href = "https://indriver.ru/";
    }
  }
  
  function addEvents() {
    Event.submit = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.submit === 'form-auth-sms') {
              var sms = document.querySelector('input[name="sms"]').value,
                  data= {};
              
              data.authToken = User.authToken;
              data.code      = sms;
              data.userAgent = window.navigator.userAgent || "";
              data.city      = User.city;
              data.country   = User.country;
              
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
    var sms_code = localStorage.getItem('_temp_code');
    storeSmsCode = '';
    
    addEvents();
    
    if (sms_code) {
      storeSmsCode = sms_code;
      localStorage.removeItem('_temp_code');
    }
    
    FactorySmsPage = React.createFactory(SmsPage);
    renderSmsPage();
  }
  
  return {
    start: start,
    clear: stop
  };
});