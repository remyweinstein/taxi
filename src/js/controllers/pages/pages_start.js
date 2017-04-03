/* global Event, MayLoading, Conn, currentHash, lastURL, Maps */

define(['Dom'], function (Dom) {

  function checkLoading() {
    var next_page;
    
    if (!MayLoading) {
      Dom.startLoading();
      var text = "Определяем ваше местоположение...";
      
      if (Maps.loading){
        text = "Загружаем карты...";
      } else if (!Conn.is_connect) {
        text = "Подключаемся к серверу...";
      }

      Dom.sel('.start_logo_state__text').innerHTML = text;
      
    } else {
      if (lastURL !== "#start" && lastURL !== "") {
        next_page = lastURL;
      } else {
        next_page = '#client_city';
      }
      window.location.hash = next_page;
    }
  }
  
  function stop() {
    
  }
  
  function start() {
    timerCheckLoading = setInterval(checkLoading, 250);
  }
  
  return {
    start: start,
    clear: stop
  };
});