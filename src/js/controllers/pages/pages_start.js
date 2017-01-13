define(['Ajax', 'Dom'], function (Ajax, Dom) {

  function addEvents() {
    Event.submit = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.submit === 'form-auth-sms') {

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
  
  function checkLoading() {
    if (!MayLoading) {
      Dom.startLoading();
      Dom.sel('.start_logo_state__text').innerHTML = "Определяем ваше местоположение...";
    } else {
      window.location.hash = '#client_city';
    }
  }
  
  function stop() {

  }
  
  function start() {
    addEvents();
    timerCheckLoading = setInterval(checkLoading, 100);
  }
  
  return {
    start: start,
    clear: stop
  };
});