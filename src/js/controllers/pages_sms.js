        // = Form auth SMS =
    Dom.sel('[data-submit="form-auth-sms"]').addEventListner('submit', function() {
      var sms = Dom.sel('input[name="sms"]').value;
      
      Ajax.request(server_uri, 'POST', 'confirm', User.token, '&smsCode='+sms, '', function(response) {
        if (response && response.ok) {
          localStorage.setItem('_is_auth', 'true');              
          document.location= '/';
        }
      });
      
      return;
    });
