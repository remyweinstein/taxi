/* global Event */

define(['Dom'], function (Dom) {
  var current_agent;

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        
        if (target.dataset.view === "star") {
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
        
        if (target.dataset.click === "save_rating") {
          if (current_agent === 'driver') {
            window.location.hash = '#driver_city';
          }
          if (current_agent === 'client') {
            window.location.hash = '#client_city';
          }
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };

    Dom.sel('.content').addEventListener('click', Event.click);
    
    Event.hover = function (event) {
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

    Dom.sel('.content').addEventListener('mouseenter', Event.hover);
    
  }

  var Stars = {

    init: function(agent) {
      current_agent = agent;
      
      addEvents();
    }
};

return Stars;
  
});