/* global User */

define(['Storage'], function (Storage) {
  
  function stop() {

  }
  
  function start() {
    User.is_auth = false;
    User.token = '';
    User.save();
    window.location.hash = '#client_city';
  }
  
  return {
    start: start,
    clear: stop
  };

});