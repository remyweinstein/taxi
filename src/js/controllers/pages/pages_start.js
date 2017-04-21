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