        Ajax.request(server_uri, 'GET', 'profile', my_token, '', '', function(response){
            console.log(JSON.stringify(response));
            if (response && response.ok) {
                Dom.sel('input[name="myname"]').value = (my_name)?my_name:response.profile.name;
                Dom.sel('input[name="dob"]').value = Dates.dateFromBase(response.profile.birthday);
                var sex = (response.profile.sex)?Dom.sel('select[name="sex"] option[value="1"]'):Dom.sel('select[name="sex"] option[value="0"]');
                    sex.selected = true;
                var city = Dom.sel('select[name="city"] option[value="'+response.profile.city+'"]');
                    city.selected = true;
                Dom.sel('.avatar').src = my_avatar;
            }
        });

    var content = Dom.sel('.content');
        content.addEventListener('click', function(event){
            var target = event.target;
            while(target !== this){
                if(target.dataset.click === 'clear_photo'){
                    Ajax.request(server_uri, 'POST', 'clear-photo', my_token, '', '', function(response){
                        if(response && response.ok){
                            Dom.sel('.avatar').src = default_avatar;
                        }
                    });
                }
                target = target.parentNode;
            }
        });
        
        content.addEventListener('submit', function(event){
            var target = event.target;
            while(target !== this){
                if(target.dataset.submit === 'form-edit-profile'){
                    // = Form edit profile = 
                    var file = Dom.sel('input[name=ava_file]').files[0];
                    var data = new FormData();
                        data.append('photo', file);
                        data.append('name', Dom.sel('input[name=myname]').value);
                        data.append('birthday', Dates.dateToBase(Dom.sel('input[name=dob]').value));
                        data.append('city', Dom.sel('select[name=city]').value);
                        data.append('sex', Dom.sel('select[name=sex]').value);
                    Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(response){
                        //console.log(response.messages);
                        if(response && response.ok) {
                            //document.location= '/';
                            window.history.back();
                        }
                    });
                }
                target = target.parentNode;
            }
        });