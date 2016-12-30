define(['Dom', 'ModalWindows'], function (Dom, Modal) {
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === "number") {
          var el = target;
          var _key = el.dataset.key;
          
          Modal.show('<input type="text" name="val" value="' + Settings.safeRadius + '" />\n\
                      <button class="button_rounded--green" data-getvalue="val">Сохранить</button>', 
            function (response) {
              eval('Settings.' + _key + ' = ' + response);
              eval('el.querySelectorAll(\'span\')[0].innerHTML = Settings.' + _key);
            });

        }
        
        if (target.dataset.click === "link") {
          var el = target;
          
          window.location.hash = el.dataset.link;
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    content.addEventListener('click', Event.click);
  }
  
  function start() {
    var _el_settings = Dom.sel('.settings');
    var _obj = Settings;
    var _innerText = '';
    
    for (var key in _obj) {
      var _ins;
      var _click;
      if (typeof _obj[key] !== "function" && key !== "label" && key !== "type") {
        if (Settings.type[key]) {
          if (Settings.type[key] !== "link") {
            _ins = ' <span>' + _obj[key] + '</span>';
            _click = ' data-click="' + Settings.type[key]  + '"';
        } else {
            _ins = ' <span></span>';
            _click = ' data-click="' + Settings.type[key]  + '" data-link="' + _obj[key] + '"';
            
            if (_obj[key] === "#zones") {
              console.log('i am find');
            }            
          }
        }
        _innerText += '<p data-key="' + key + '"' + _click + '>' + Settings.label[key] + _ins + '</p>';
      }
    }

    _el_settings.innerHTML = _innerText;
    
    addEvents();

  }
  
  return {
    start: start
  };
    
});

