/* global User */

define(['Storage'], function (Storage) {
  
  function stop() {

  }
  
  function start() {
    User.clear();
    goToPage = '#client_city';
  }
  
  return {
    start: start,
    clear: stop
  };

});