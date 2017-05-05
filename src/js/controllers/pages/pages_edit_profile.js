/* global Event, User, Conn, uLogin */

define(['Dom', 'Dates', 'ModalWindows'], function (Dom, Dates, Modal) {
  
  function cbFillFields(response) {
    Conn.clearCb('cbFillFields');
    
    var sex = response.result.profile.sex ? 1: 0,
        city = response.result.profile.city ? Dom.sel('select[name="city"] option[value="' + response.result.profile.city + '"]') : Dom.sel('select[name="city"] option[value="' + User.city + '"]'),
        listOfSocials =[],
        prof = response.result.profile;
    
    
    User.setData(response.result);

    sex = Dom.sel('select[name="sex"] option[value="' + sex + '"]');
    
    if (!prof.hasVkontakte) {
      listOfSocials.push("vkontakte");
    }
    if (!prof.hasOdnoklassniki) {
      listOfSocials.push("odnoklassniki");
    }
    if (!prof.hasMailru) {
      listOfSocials.push("mailru");
    }
    if (!prof.hasFacebook) {
      listOfSocials.push("facebook");
    }
    if (!prof.hasTwitter) {
      listOfSocials.push("twitter");
    }
    if (!prof.hasGoogle) {
      listOfSocials.push("google");
    }
    if (!prof.hasYandex) {
      listOfSocials.push("yandex");
    }
    if (!prof.hasGoogleplus) {
     listOfSocials.push("googleplus");
    }
    if (!prof.hasInstagram) {
      listOfSocials.push("instagram");
    }
    if (!prof.hasYoutube) {
      listOfSocials.push("youtube");
    }
    if (!prof.hasWargaming) {
      listOfSocials.push("wargaming");
    }

    Dom.sel('.pincode').innerHTML = response.result.profile.hasPin ? '<span data-click="change-pin">Сменить PIN</span>' : '<span data-click="create-pin">Установить PIN</span>';
    if (User.is_auth) {
      Dom.sel('.social_network').innerHTML += '<span style="display:block">Подтвердите соцсеть</span>' +
                                              '<div id="uLogin" data-ulogin="callback=reciveUlogin;display=small;fields=;providers=' + listOfSocials.join(',') + ';hidden=;redirect_uri=;mobilebuttons=0;">' +
                                              '</div>';
      uLogin.init();
    }
    Dom.sel('input[name="myname"]').value = User.name || response.result.profile.name;
    Dom.sel('input[name="dob"]').value = response.result.profile.birthday ? Dates.dateFromBase(response.result.profile.birthday) : '';
    sex.selected = true;
    city.selected = true;
    Dom.sel('.avatar').src = response.result.profile.photo || User.avatar;
  }
  
  function cbClearPhoto(result) {
    Conn.clearCb('cbClearPhoto');
    
    if (!result.error) {
      Dom.sel('.avatar').src = User.default_avatar;
    }
  }
  
  function cbUpdateProfile() {
    Conn.clearCb('cbUpdateProfile');
    User.getData();
    Dom.historyBack();
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target && target !== this) {
        if (target.dataset.click === 'clear_photo') {
          Conn.request('deletePhoto', '', cbClearPhoto);
        }
        
        if (target.dataset.click === "change-pin") {
          Modal.changePin(function(response) {
            var data = {};
            
            data.profile = {};
            data.profile.pin = response.newPin;
            data.pin = response.oldPin;
            Conn.request('changePin', data);
          });
            
        }

        if (target.dataset.click === "create-pin") {
          Modal.createPin(function(response) {
            var data = {};
            
            data.profile = {};
            data.profile.pin = response.newPin;
            Conn.request('changePin', data);
            Dom.sel('.pincode').innerHTML = '<span data-click="change-pin">Сменить PIN</span>';
            User.hasPin = true;
          });
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
          var file = Dom.sel('input[name=ava_file]').files[0],
              reader = new FileReader();
            
          reader.onabort = function() {
            
          };

          reader.onerror = function(event) {
            switch(event.target.error.code) {
                  case event.target.error.NOT_FOUND_ERR:
                    console.log('File not found');
                    break;
                  case event.target.error.NOT_READABLE_ERR:
                    console.log('File is not readable');
                    break;
                  case event.target.error.ABORT_ERR:
                    console.log('File upload aborted');
                    break;
                  default:
                    console.log('An error occurred reading the file.');
              };
          };
          reader.onloadend = function(event) {
            SaveProfile(event.target.result);
          };
          
          if (file) {
            reader.readAsBinaryString(file);
          } else {
            SaveProfile();
          }
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
  
  function SaveProfile(file) {
    var data = {};
    
    if (file) {
      if (file.length > 512000) {
        alert('Размер картинки превышает 500кБ');
        return;
      } else {
        data.photo = window.btoa(file);
      }
    }
    
    data.name = Dom.sel('input[name=myname]').value;
    data.birthday = Dates.dateToBase(Dom.sel('input[name=dob]').value);
    data.city = Dom.sel('select[name=city]').value;
    data.sex = Dom.sel('select[name=sex]').value;

    Conn.request('updateProfile', data, cbUpdateProfile);

  }
  
  function stop() {
    Modal.close();    
  }
  
  function start() {
    Conn.request('getProfile', '', cbFillFields);
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
