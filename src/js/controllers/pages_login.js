    // = Form auth login =
  document.addEventListener('DOMContentLoaded', function() {
    Dom.sel('[data-submit="form-auth"]').addEventListner('submit', function() {
      var phone = Dom.sel('input[name="phone"]').value;
      var token = User.token ? User.token : "";
      
      Ajax.request(server_uri, 'POST', 'register', token, '&phone=7'+phone, '', function(response) {
        if (response && response.ok) {
          localStorage.setItem('_my_token', response.token);
          User.token = response.token;
          document.location= '#pages__sms';
        }
      });
      
    });
  });
