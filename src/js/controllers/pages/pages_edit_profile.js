/* global Event, User, Conn */

define(['Dom', 'Dates'], function (Dom, Dates) {
  
  function cbFillFields(response) {
    var sex = response.result.profile.sex ? Dom.sel('select[name="sex"] option[value="1"]') : Dom.sel('select[name="sex"] option[value="0"]'),
        city = response.result.profile.city ? Dom.sel('select[name="city"] option[value="' + response.result.profile.city + '"]') : Dom.sel('select[name="city"] option[value="' + User.city + '"]');

    Dom.sel('input[name="myname"]').value = User.name || response.result.profile.name;
    Dom.sel('input[name="dob"]').value = response.result.profile.birthday ? Dates.dateFromBase(response.result.profile.birthday) : '';
    sex.selected = true;
    city.selected = true;
    Dom.sel('.avatar').src = response.result.profile.photo || User.avatar;
    Conn.clearCb('cbFillFields');
  }
  
  function cbUpdateProfile() {
    Dom.historyBack();
    Conn.clearCb('cbUpdateProfile');
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === 'clear_photo') {
          Conn.request('deletePhoto');
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
      data.photo = window.btoa(file);
    }
    
    data.name = Dom.sel('input[name=myname]').value;
    data.birthday = Dates.dateToBase(Dom.sel('input[name=dob]').value);
    data.city = Dom.sel('select[name=city]').value;
    data.sex = Dom.sel('select[name=sex]').value;

    Conn.request('updateProfile', data, cbUpdateProfile);

  }
  
  function stop() {
    
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
