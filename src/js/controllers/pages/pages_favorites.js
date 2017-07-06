/* global Event, User, Conn */

define(['Funcs', 'react', 'ReactDOM', 'jsx!components/FavList'], function (Funcs, React, ReactDOM, List) {
 var FactoryList, storeFavList, storeBlackList;

  function cbFillFavorites(response) {
    Conn.clearCb('cbFillFavorites');
    storeFavList = response.result.favorites;
    renderFavorites();
  }
  
  function cbFillBlackList(response) {
    Conn.clearCb('cbFillBlackList');
    storeBlackList = response.result.blackList;
    renderBlackList();
  }
  
  function renderFavorites() {
    var data = {};
    data.list      = storeFavList;
    data.emptyText = 'Нет избранных агентов';
    data.remove = 'favorite';
    
    renderList(data, 'favorites');
  }
  
  function renderBlackList() {
    var data = {};
    data.list      = storeBlackList;
    data.emptyText = 'Нет агентов в черном списке';
    data.remove = 'black-list';
        
    renderList(data, 'blacklist');
  }
  
  function renderList(data, el) {
    ReactDOM.render(
      FactoryList({data: data}),
      document.querySelector('[data-view="' + el + '"]')
    );
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
          
        if (target) {
          if (target.dataset.click === "remove-favorite") {
            var id = target.dataset.id;
            
            storeFavList = Funcs.deleteArrayByID(storeFavList, id);
            renderFavorites();
            Conn.request('deleteFavorites', id);
          }
          
          if (target.dataset.click === "remove-black-list") {
            var id = target.dataset.id,
                    
            storeBlackList = Funcs.deleteArrayByID(storeBlackList, id);
            renderBlackList();
            Conn.request('deleteBlackList', id);
          }
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
  
  function getFavorites() {
    Conn.request('requestFavorites', '', cbFillFavorites);
  }
  
  function getBlacklist() {
    Conn.request('requestBlackList', '', cbFillBlackList);
  }
  
  function stop() {

  }
  
  function start() {
    FactoryList = React.createFactory(List);

    getFavorites();
    getBlacklist();

    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});