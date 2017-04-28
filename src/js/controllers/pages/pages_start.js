/* global Event, MayLoading, Conn, currentHash, Maps */

define(['Storage', 'Dom'], function (Storage, Dom) {

  function checkLoading() {
    var next_page;
    
    if (!MayLoading) {
      Dom.startLoading();
      var text;
      
      if (Maps.loading) {
        text = "Загружаем карты...";
      } else if (!Conn.is_connect) {
        text = "Подключаемся к серверу...";
      } else {
        text = "Определяем ваше местоположение...";
      }

      Dom.sel('.start_logo_state__text').innerHTML = text;
      
    } else {
      Conn.request('getProfile');
      timerCheckLoading = clearInterval(timerCheckLoading);
      
      if (Storage.getLastPage()) {
        next_page = Storage.getLastPage();
      } else {
        next_page = '#client_city';
      }
      
      goToPage = next_page;
    }
  }
  
  function getPosition(position) {
    console.log(position);
  }
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.click === 'again-location') {
              navigator.geolocation.getCurrentPosition(getPosition);
              
              return;
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
  
  function stop() {
    
  }
  
  function start() {
    timerCheckLoading = setInterval(checkLoading, 250);
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});