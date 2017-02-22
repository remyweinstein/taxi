/* global Event, User */

define(['Ajax', 'Dom', 'Dates'], function (Ajax, Dom, Dates) {
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target.dataset.click === 'clear_photo') {
          //examples
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
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});
