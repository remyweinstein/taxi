/* global Event, MayLoading */

define(['Dom'], function (Dom) {

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
    timerCheckLoading = setInterval(checkLoading, 100);
  }
  
  return {
    start: start,
    clear: stop
  };
});