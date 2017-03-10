/* global Event, User, Conn */

define(['Dom', 'Stars'], function (Dom, Stars) {  
  var order_id, offer_id, agent_id, global_el;
  
  function cbAddFavorites() {
    var stars = Dom.selAll('[data-view="star"]');
    
    for (var i = 0; i < stars.length; i++) {
      stars[i].classList.add('active');
    }
    inActive(global_el);
    Conn.clearCb('cbAddFavorites');
  }
  
  function cbAddToBlackList() {
    var stars = Dom.selAll('[data-view="star"]');
    
    for (var i = 0; i < stars.length; i++) {
      stars[i].classList.remove('active');
    }
    inActive(global_el);
    Conn.clearCb('cbAddToBlackList');
  }
  
  function inActive(el) {
    el.classList.add('inactive');
    el.dataset.click = '';
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target,
          el;

      while (target !== this) {
        if (target && target.dataset.click === "tofavorites") {
          global_el = target;
          
          if (confirm('Добавить в Избранные?')) {
            Conn.request('addFavorites', agent_id, cbAddFavorites);
          }
          break;
        }
        
        if (target && target.dataset.click === "toblacklist") {
          global_el = target;
          
          if (confirm('Добавить в Черный список?')) {
            Conn.request('addBlackList', agent_id, cbAddToBlackList);
          }
          break;
        }
        
        if (target && target.dataset.click === "sharecard") {
          el = target;
          
          if (confirm('Поделиться контактами?')) {
            
          }
          break;
        }

        if (target && target.dataset.click === "tofeedback") {
          el = target;
          
          if (confirm('Хотите пожаловаться?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "peoplescontrol") {
          el = target;
          
          if (confirm('Перейти в Народный контроль?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "claimcheck") {
          el = target;
          
          if (confirm('Нужен чек?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "save_rating") {
          el = target;
          
          //localStorage.setItem('_rating_bid', '');
          break;
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
    offer_id = localStorage.getItem('_rating_offer');
    localStorage.removeItem('_rating_offer');
    
    if (offer_id && offer_id !== "") {
      var bl = Dom.sel('.score-agent__but-box'),
          innertext = '<i class="icon-star" data-click="tofavorites"></i>' +
                      '<i class="icon-block" data-click="toblacklist"></i>' +
                      '<i class="icon-address-card-o" data-click="sharecard"></i>' +
                      '<i class="icon-attention" data-click="tofeedback"></i>' +
                      '<i class="icon-eye" data-click="peoplescontrol"></i>' +
                      '<i class="icon-clipboard" data-click="claimcheck"></i>';
      Stars.init('driver');
      bl.innerHTML = innertext;
      addEvents();
    } else {
      window.location.hash = '#driver_city';
    }
  }
  
  return {
    start: start,
    clear: stop
  };
  
});