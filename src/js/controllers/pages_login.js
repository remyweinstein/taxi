        // = Form auth login =
    Dom.sel('[data-submit="form-auth"]').addEventListner('submit', function(){
        var phone = Dom.sel('input[name="phone"]').value;
        var token = (my_token)?my_token:"";
        Ajax.request(server_uri, 'POST', 'register', token, '&phone=7'+phone, '', function(response){
            if (response && response.ok) {
                localStorage.setItem('_my_token', response.token);
                my_token = response.token;
                document.location= '#pages__sms';
            }
        });
    });
