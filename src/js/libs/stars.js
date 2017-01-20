/* global Event */

define(['Dom'], function (Dom) {
  var current_agent;

  function addEvents() {
    Event.click = function () {
      var target = event.target;

      while (target !== this) {
        
        if (target.dataset.view === "star") {
          var el = target;
          var id = parseInt(el.dataset.id);
          current_rating = id + 1;
          
          var topLev = el.parentNode;
          var els = topLev.querySelectorAll('i');
          for (var i = 0; i < els.length; i++) {
            els[i].classList.remove('active');
          }
          for (var i = 0; i <= id; i++) {
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
          var el = target;
          var id = el.dataset.id;
            console.log(id);
          
          for (var i = 0; i < id; i++) {
            console.log(i);
          }
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