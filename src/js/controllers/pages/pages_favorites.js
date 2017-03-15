/* global Event, User, Conn */

define(['Dom'], function (Dom) {

  function cbFillFavorites(response) {
    var parent = Dom.sel('[data-view="favorites"]'),
        favs = response.result.favorites,
        innertext = '',
        ul = document.createElement('ul');
  
    ul.className += 'list-favorites';

    if (favs.length > 0) {          
      for (var i = 0; i < favs.length; i++) {
        var name = favs[i].name || 'Гость',
            photo = favs[i].photo || User.default_avatar,
            id = favs[i].id;

        innertext += '<li class="list-favorites__fav">' +
                        '<div class="list-favorites__fav__photo">' +
                          '<img src="' + photo + '">' +
                        '</div>' +
                        '<div class="list-favorites__fav__desc">' +
                           name +
                        '</div>' +
                        '<div class="list-favorites__fav__action">' +
                          '<i class="icon-cancel-circled" data-click="remove-favorite" data-id="' + id + '"></i>' +
                        '</div>' +
                      '</li>';
      }
    } else {
      innertext = '<li><p>Нет избранных агентов</p></li>';
    }

    ul.innerHTML = innertext;
    parent.appendChild(ul);
    Conn.clearCb('cbFillFavorites');
  }
  
  function cbFillBlackList(response) {
    var parent = Dom.sel('[data-view="blacklist"]'),
        blacks = response.result.blackList,
        innertext = '',
        ul = document.createElement('ul');
      
    ul.className += 'list-favorites';

    if (blacks.length > 0) {          
      for (var i = 0; i < blacks.length; i++) {
        var name = blacks[i].name || 'Гость',
            photo = blacks[i].photo || User.default_avatar,
            id = blacks[i].id;

        innertext += '<li class="list-favorites__fav">' +
                        '<div class="list-favorites__fav__photo">' +
                          '<img src="' + photo + '">' +
                        '</div>' +
                        '<div class="list-favorites__fav__desc">' +
                          name +
                        '</div>' +
                        '<div class="list-favorites__fav__action">' +
                          '<i class="icon-cancel-circled" data-click="remove-black-list" data-id="' + id + '"></i>' +
                        '</div>' +
                      '</li>';
      }
    } else {
      innertext = '<li><p>Нет избранных агентов</p></li>';
    }

    ul.innerHTML = innertext;
    parent.appendChild(ul);
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
          
        if (target) {
          if (target.dataset.click === "remove-favorite") {
            var el = target;
            
            alert('Типа удалили агента с  id ' + el.dataset.id + ' из избранных');
          }
          
          if (target.dataset.click === "remove-black-list") {
            var el = target;
            
            alert('Типа удалили агента с  id ' + el.dataset.id + ' из черного списка');
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

    getFavorites();
    getBlacklist();

    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});