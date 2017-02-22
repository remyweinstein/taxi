/* global Event */

define(['Dom'], function (Dom) {

  function addEvents() {
    Event.submit = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.submit === 'form-auth-sms') {
              //example
              return;
            }

            if (target) {
              target = target.parentNode;
            } else {
              break;
            }
          }
        };

    content.addEventListener('submit', Event.submit);
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