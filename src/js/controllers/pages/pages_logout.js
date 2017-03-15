/* global User */

define(function () {
  
  function stop() {

  }
  
  function start() {
    localStorage.removeItem('_my_token');
    localStorage.removeItem('_auth_token');
    localStorage.removeItem('_is_auth');
    User.is_auth = false;
    User.token = '';
    window.location.hash = '#client_city';
  }
  
  return {
    start: start,
    clear: stop
  };

});