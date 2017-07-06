/* global Event, User, Conn */

define(['Storage', 'Funcs', 'react', 'ReactDOM', 'jsx!components/MessageList'], function (Storage, Funcs, React, ReactDOM, List) {
  var id_li_delete, FactoryList, storeList;
  
  function cbGetNotify(response) {
    Conn.clearCb('cbGetNotify');
    
    storeList = response.result.notifications;
    renderList();
  }
  
  function cbDeleteNotify(response) {
    Conn.clearCb('cbDeleteNotify');
    
    if (!response.error) {
      storeList = Funcs.deleteArrayByID(storeList, id_li_delete);
      renderList();
    }
  }
  
  function renderList() {
    ReactDOM.render(
      FactoryList({list: storeList}),
      document.querySelector('.dynamic')
    );
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === 'open-notify') {
          Storage.setOpenNotify(target.dataset.id);
          goToPage = '#open_message';
        }
        
        if (target.dataset.click === 'delete-notify') {
          id_li_delete = target.dataset.id;
          Conn.request('removeNotification', id_li_delete, cbDeleteNotify);
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
    FactoryList = React.createFactory(List);
    Conn.request('getNotifications', '', cbGetNotify);
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
