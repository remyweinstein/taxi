define(['Ajax', 'Dom', 'Geo', 'Dates', 'Stars'], function (Ajax, Dom, Geo, Dates, Stars) {

  
  var order_id, agent_id, bid_id;
  
  function inActive(el) {
    el.classList.add('inactive');
    el.dataset.click = '';
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target && target.dataset.click === "tofavorites") {
          var el = target;
          
          if (confirm('Добавить в Избранные?')) {
            Ajax.request('POST', 'favorites', User.token, '&id=' + agent_id, '', function(response) {
              if (response && response.ok) {
                var stars = Dom.selAll('[data-view="star"]');
                for (var i = 0; i < stars.length; i++) {
                  stars[i].classList.add('active');
                }
                inActive(el);
              }
            }, function() {});
          }
          break;
        }
        
        if (target && target.dataset.click === "toblacklist") {
          var el = target;
          
          if (confirm('Добавить в Черный список?')) {
            Ajax.request('POST', 'black-list', User.token, '&id=' + agent_id, '', function(response) {
              if (response && response.ok) {
                var stars = Dom.selAll('[data-view="star"]');
                for (var i = 0; i < stars.length; i++) {
                  stars[i].classList.remove('active');
                }
                inActive(el);
              }
            }, function() {});
          }
          break;
        }
        
        if (target && target.dataset.click === "sharecard") {
          var el = target;
          
          if (confirm('Поделиться контактами?')) {
            
          }
          break;
        }

        if (target && target.dataset.click === "tofeedback") {
          var el = target;
          
          if (confirm('Хотите пожаловаться?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "peoplescontrol") {
          var el = target;
          
          if (confirm('Перейти в Народный контроль?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "claimcheck") {
          var el = target;
          
          if (confirm('Нужен чек?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "save_rating") {
          var el = target;
          
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

  function start() {
    bid_id = localStorage.getItem('_rating_bid');
    
    if (bid_id && bid_id !== "") {
      Ajax.request('GET', 'bid', User.token, '&id=' + bid_id, '', function(response) {
        if (response && response.ok) {
          var ords = response.bid.order;
          order_id = ords.id;
          agent_id = response.bid.order.agent.id;

          Stars.init('client');
          var bl = Dom.sel('.score-agent__but-box');
          var innertext = '';
          innertext = '<i class="icon-star" data-click="tofavorites"></i>\n\
                       <i class="icon-block" data-click="toblacklist"></i>\n\
                       <i class="icon-address-card-o" data-click="sharecard"></i>\n\
                       <i class="icon-attention" data-click="tofeedback"></i>\n\
                       <i class="icon-eye" data-click="peoplescontrol"></i>\n\
                       <i class="icon-clipboard" data-click="claimcheck"></i>';
          bl.innerHTML = innertext;

          addEvents();
        }

      }, function() {});
    } else {
      window.location.hash = '#client_city';
    }
  }
  
  return {
    start: start
  };
  
});