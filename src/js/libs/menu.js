/* global User, Conn */

define(['Dom', 'hammer'], function (Dom, Hammer) {
    
  function swipeMenu(route) {
    var menu = Dom.sel('.menu'),
        state = route > 0 ? 'opened' : 'closed';
      
    menu.classList.remove('menu--closed');
    menu.classList.remove('menu--opened');
    menu.classList.add('menu--'+state);
  }

  var MainMenu = {

      init: function() {
        var menu = Dom.sel('.menu'),
            content = Dom.sel('.content'),
            isDriver = localStorage.getItem('_is_driver'),
            but = Dom.sel('.header__toggle__button');
          
        if (isDriver) {
          //Dom.toggle(but, 'active');
        }

        //EVENT ON CLICK BURGER MENU ICON
        Dom.sel('[data-click="menu-burger"]').addEventListener('click', function() {
          swipeMenu(1);
        });

        //EVENT ON CLICK BURGER BACK ICON
        Dom.sel('[data-click="back-burger"]').addEventListener('click', function() {
          window.history.back();
        });
        
        //EVENTS ON SWIPE MENU => SwipeMenu()
        new Hammer(menu, {domEvents: true});
        menu.addEventListener('swipeleft', function() {
          swipeMenu(-1);
        });

        //EVENTS ON CLICK CONTENT FOR CLOSE MENU
        Dom.sel('.header').addEventListener('click', function(event) {
          var target = event.target;

          while (target !== this) {
            
                //EVENT ON CLICK TOGGLE DRIVER
            if (target.dataset.click === "toggleIsDriver") {
              var el = target,
                  data = {};

              if (Dom.toggle(el, 'active')) {
                data.isDriver = 0;
                localStorage.removeItem('_is_driver');
              } else {
                data.isDriver = 1;
                localStorage.setItem('_is_driver', true);
              }
              Conn.request('updateProfile', data);
            }
            
            if (target) {
              target = target.parentNode;
            } else {
              break;
            }
          }
        });
        
        //EVENTS ON CLICK CONTENT FOR CLOSE MENU
        content.addEventListener('click', function(event) {
          var target = event.target;

          while (target !== this) {
                //=  Close Menu on Click body  =
            if(menu.classList.contains('menu--opened')) {
              swipeMenu(-1);
            }
            
            if (target) {
              target = target.parentNode;
            } else {
              break;
            }
          }
        });

        //EVENTS ON CLICK MENU
        menu.addEventListener('click', function(event) {
          var target = event.target;
          
          while (target !== this) {
                //= Change Item menu =
            if (target.tagName === 'A') {
              var li = target.parentNode,
                  lis = li.parentNode.querySelectorAll('li');
              
              for (var i = 0; i < lis.length; i++) {
                lis[i].classList.remove('menu__list--active');
              }
              
              li.classList.add('menu__list--active');
              
              swipeMenu(-1);
            }
                //= Click edit profile =
            if (target.dataset.click === 'edit_profile') {
              swipeMenu(-1);
              window.location.hash = '#edit_profile';
              
              return;
            }
            
            target = target.parentNode;
          }
        });
      }

  };
  
  return MainMenu;
  
  });
