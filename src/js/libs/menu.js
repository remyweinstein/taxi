/* global User, Conn */

define(['Dom', 'hammer', 'Storage'], function (Dom, Hammer, Storage) {
    
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
            isDriver = Storage.getIsDriverMenu(),
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
          Dom.historyBack();
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
                Storage.removeIsDriverMenu();
              } else {
                data.isDriver = 1;
                Storage.setIsDriverMenu();
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
              goToPage = '#edit_profile';
              
              return;
            }
            
            target = target.parentNode;
          }
        });
      },
      
      renderUserInfo: function() {
        if (Dom.sel('.menu__desc')) {
          Dom.sel('.jq_my_name').innerHTML = User.name;
          Dom.sel('.jq_my_phone').innerHTML = User.phone;

          if (!User.avatar) {
            User.avatar = User.default_avatar;
          }

          Dom.sel('.menu__desc_avatar').src = User.avatar;
          Dom.sel('.menu__desc_avatar').alt = User.name;
        }
      }

  };
  
  return MainMenu;
  
  });
