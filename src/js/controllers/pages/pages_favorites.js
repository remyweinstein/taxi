define(['Ajax', 'Dom'], function (Ajax, Dom) {

  function addEvents() {

  }
  
  function getFavorites() {
    Ajax.request('GET', 'favorites', User.token, '', '', function(response) {
      if (response && response.ok) {
        console.log(response);
        /*
         * Dom.sel('[data-view="favorites"]');
         * 
         * 
         */
      }
    }, function() {alert('Ошибка связи с сервером');});
  }
  
  function getBlacklist() {
    Ajax.request('GET', 'black-list', User.token, '', '', function(response) {
      if (response && response.ok) {
        console.log(response);
        /*
         * Dom.sel('[data-view="blacklist"]');
         */
      }
    }, function() {alert('Ошибка связи с сервером');});
  }
  
  function start() {

    getFavorites();
    getBlacklist();

    addEvents();
  }
  
  return {
    start: start
  };
});