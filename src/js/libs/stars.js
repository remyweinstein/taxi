/* global Event */

define(['Dom'], function (Dom) {
  var current_agent;

  function addEvents() {
    clickEv = function (event) {
      var target = event.target;

      while (target !== this) {
        
        if (target && target.dataset.view === "star") {
          var el = target,
              id = parseInt(el.dataset.id),
              i,
              topLev = el.parentNode,
              els = topLev.querySelectorAll('i');
            
          current_rating = id + 1;
                    
          for (i = 0; i < els.length; i++) {
            els[i].classList.remove('active');
          }
          
          for (i = 0; i <= id; i++) {
            els[i].classList.add('active');
          }

        }
        
        if (target && target.dataset.click === "save_rating") {
          if (current_agent === 'driver') {
            goToPage = '#driver_city';
          }
          if (current_agent === 'client') {
            goToPage = '#client_city';
          }
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };

    Dom.sel('.content').addEventListener('click', clickEv);
    
    hoverEv = function (event) {
      var target = event.target;

      while (target !== this) {
        
        if (target.dataset.view === "star") {
          var el = target,
              id = el.dataset.id;

        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };

    Dom.sel('.content').addEventListener('mouseenter', hoverEv);
    
  }

  var Stars = {

      init: function(agent) {
        current_agent = agent;

        addEvents();
      },
      
      stop: function() {
        Dom.sel('.content').removeEventListener('click', clickEv);
        Dom.sel('.content').removeEventListener('mouseenter', hoverEv);
      }
  };

  return Stars;
  
});