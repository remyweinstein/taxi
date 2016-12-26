define(['Ajax', 'Dom', 'Geo', 'Dates', 'Stars'], function (Ajax, Dom, Geo, Dates, Stars) {

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target && target.dataset.click === "tofavorites") {
          var el = target;
          
          if (confirm('Добавить в Избранные?')) {
            
          }
          break;
        }
        
        if (target && target.dataset.click === "toblacklist") {
          var el = target;
          
          if (confirm('Добавить в Черный список?')) {
            
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
    Stars.init('driver');
    var bl = Dom.sel('.score-agent__but-box');
    var innertext = '';
    innertext = '<i class="icon-star" data-click="tofavorites">\n\
                 <i class="icon-block" data-click="toblacklist">\n\
                 <i class="icon-address-card-o" data-click="sharecard">\n\
                 <i class="icon-attention" data-click="tofeedback">\n\
                 <i class="icon-eye" data-click="peoplescontrol">\n\
                 <i class="icon-clipboard" data-click="claimcheck">';
    bl.innerHTML = innertext;
    
    addEvents();
  }
  
  return {
    start: start
  };
  
});