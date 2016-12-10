define(['Dom'], function (Dom) {
  
  var _el_settings = Dom.sel('.settings');
  var _obj = Settings;
  var _innerText = '';

  for (var key in _obj) {
    var _ins;
    var _click;
    if (typeof _obj[key] !== "function" && key !== "label" && key !== "type") {
      console.log('key = ' + key + ', value = ' + _obj[key]);
      if (Settings.type[key]) {
        _ins = ' <span>' + _obj[key] + '</span>';
        _click = ' data-click="number"';
      }
      _innerText += '<p data-key="' + key + '"' + _click + '>' + Settings.label[key] + _ins + '</p>';
    }
  }

  _el_settings.innerHTML = _innerText;

  Event.click = function (event) {
    var target = event.target;

    while (target !== this) {
      if (target.dataset.click === "number") {
        var el = target;
        var _key = el.dataset.key;

        Modal.show('<input type="text" name="val" value="" />\n\
                    <button class="button_rounded--green" data-getvalue="val">Сохранить</button>', 
          function (response) {
            eval('Settings.' + _key + ' = ' + response);
            eval('el.querySelectorAll(\'span\')[0].innerHTML = Settings.' + _key);
          });

      }

      target = target.parentNode;
    }
  };
  content.addEventListener('click', Event.click);

});