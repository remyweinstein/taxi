/* global Event, User */

define(['Ajax', 'Dom'], function (Ajax, Dom) {

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
    Ajax.request('GET', 'favorites', User.token, '', '', function(response) {
      if (response && response.ok) {
        var parent = Dom.sel('[data-view="favorites"]');
        var favs =response.favorites;
        var innertext = '';
        var ul = document.createElement('ul');
          ul.className += 'list-favorites';
        
        if (favs.length > 0) {          
          for (var i = 0; i < favs.length; i++) {
            var name = favs[i].name || 'Гость';
            var photo = favs[i].photo || User.default_avatar;
            var id = favs[i].id;
            
            innertext += '<li class="list-favorites__fav">\n\
                            <div class="list-favorites__fav__photo">\n\
                              <img src="' + photo + '">\n\
                            </div>\n\
                            <div class="list-favorites__fav__desc">\n\
                              ' + name + '\
                            </div>\n\
                            <div class="list-favorites__fav__action">\n\
                              <i class="icon-cancel-circled" data-click="remove-favorite" data-id="' + id + '"></i>\n\
                            </div>\n\
                          </li>';
          }
        } else {
          innertext = '<li><p>Нет избранных агентов</p></li>';
        }
        
        ul.innerHTML = innertext;
        parent.appendChild(ul);
      }
    }, function() {alert('Ошибка связи с сервером');});
  }
  
  function getBlacklist() {
    Ajax.request('GET', 'black-list', User.token, '', '', function(response) {
      if (response && response.ok) {
        var parent = Dom.sel('[data-view="blacklist"]');
        var blacks = response.blackList;
        var innertext = '';
        var ul = document.createElement('ul');
          ul.className += 'list-favorites';
        
        if (blacks.length > 0) {          
          for (var i = 0; i < blacks.length; i++) {
            var name = blacks[i].name || 'Гость';
            var photo = blacks[i].photo || User.default_avatar;
            var id = blacks[i].id;
            
            innertext += '<li class="list-favorites__fav">\n\
                            <div class="list-favorites__fav__photo">\n\
                              <img src="' + photo + '">\n\
                            </div>\n\
                            <div class="list-favorites__fav__desc">\n\
                              ' + name + '\
                            </div>\n\
                            <div class="list-favorites__fav__action">\n\
                              <i class="icon-cancel-circled" data-click="remove-black-list" data-id="' + id + '"></i>\n\
                            </div>\n\
                          </li>';
          }
        } else {
          innertext = '<li><p>Нет избранных агентов</p></li>';
        }
        
        ul.innerHTML = innertext;
        parent.appendChild(ul);
      }
    }, Ajax.error('Ошибка связи с сервером'));
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