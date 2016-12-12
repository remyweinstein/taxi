define(['Ajax', 'Dom', 'Dates'], function (Ajax, Dom, Dates) {
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === 'clear_photo') {
          Ajax.request('POST', 'clear-photo', User.token, '', '', function(response) {
            if (response && response.ok) {
              User.avatar = User.default_avatar;
              Dom.sel('.avatar').src = User.avatar;
            }
          }, function() {});
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };

    content.addEventListener('click', Event.click);

    Event.submit = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.submit === 'form-edit-profile') {
          // = Form edit profile = 
          var file = Dom.sel('input[name=ava_file]').files[0];
          var data = new FormData();
           data.append('photo', file);
           data.append('name', Dom.sel('input[name=myname]').value);
           data.append('birthday', Dates.dateToBase(Dom.sel('input[name=dob]').value));
           data.append('city', Dom.sel('select[name=city]').value);
           data.append('sex', Dom.sel('select[name=sex]').value);

          Ajax.request('POST', 'profile', User.token, '', data, function(response) {
            //console.log(response.messages);
            if (response && response.ok) {
              //window.location.hash = '/';
              window.history.back();
            }
          }, function() {});
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
  
  function start() {
    Ajax.request('GET', 'profile', User.token, '', '', function(response) {
      //console.log(JSON.stringify(response));
      if (response && response.ok) {
        Dom.sel('input[name="myname"]').value = User.name ? User.name : response.profile.name;
        Dom.sel('input[name="dob"]').value = response.profile.birthday ? Dates.dateFromBase(response.profile.birthday) : '';
        var sex = response.profile.sex ? Dom.sel('select[name="sex"] option[value="1"]') : Dom.sel('select[name="sex"] option[value="0"]');
         sex.selected = true;
        var city = response.profile.city ? Dom.sel('select[name="city"] option[value="' + response.profile.city + '"]') : Dom.sel('select[name="city"] option[value="' + User.city + '"]');
         city.selected = true;

        //console.log('response.profile = ' + JSON.stringify(response.profile));
        var photo = response.profile.photo ? response.profile.photo : User.avatar;
        Dom.sel('.avatar').src = photo;
      }
    }, function() {});
    addEvents();
  }
  
  return {
    start: start
  };
  
});
