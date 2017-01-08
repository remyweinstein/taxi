define(['Dom', 'hammer'], function(Dom, Hammer) { // Dom, Hammer

  var tab, tabs, tabs_wrapper, tabs_viewport, tabs_content;
  var active_tab_class = 'tab--active';

  // SWIPE TAB CONTENT
  function swipeTabs(route) {
    var current_tab = Dom.sel('.' + active_tab_class).dataset.tab;
    var val_route = parseInt(current_tab) + parseInt(route);

    if (val_route <= tabs.length &&  val_route > 0) {
      changeTabs(val_route);
    }
  }

  //CHANGE TAB
  function changeTabs(tab){
    var step = window.innerWidth;

    for (var i = 0; i < tabs_content.length; i++) {
      tabs_content[i].style.left = (step - step * tab) + 'px';
    }

    for (var i = 0; i < tabs.length; i++) {
      tabs[i].classList.remove(active_tab_class);
    }

    Dom.sel('[data-tab="' + tab + '"]').classList.add(active_tab_class);
  }

  // HEIGHT ELEMENT WITH MARGINS
  function outerHeight(el) {
    var height = el.offsetHeight;
    var styles = getComputedStyle(el);
     height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);

    return height;
  }

  // CHANGE WIDTH AND HEIGHT CONTENTS
  function changeSizes() {
    var header = Dom.sel('.header');
    var tab_count = tabs.length;
    
    for (var i = 0; i < tab_count; i++) {
      tabs[i].style.width = (100 / tab_count - 1) + '%';
    }

    tabs_viewport.style.width = (tab_count * window.innerWidth) + 'px';
    tabs_wrapper.style.height = (window.innerHeight - outerHeight(header) - outerHeight(tab)) + 'px';
  }

  var Tabs = {

    init: function() {
            tab = Dom.sel('.tabs');

            if (tab) {
              tabs = Dom.selAll('.content .tabs ul li');
              tabs_wrapper = Dom.sel('.tabs__wrapper');
              tabs_viewport = Dom.sel('.tabs__viewport');
              tabs_content = Dom.selAll('.tabs_content');

              changeSizes();

              // EVENT ON CLICK TAB => ChangeTab()
              tab.addEventListener('click', function(event) {
                var target = event.target;

                while (target !== this) {
                  if (target.dataset.tab > 0) {
                    changeTabs(target.dataset.tab);

                    return;
                  }

                  target = target.parentNode;
                }
              });

              //EVENTS ON SWIPE CONTENT => SwipeTabs()
              new Hammer(tabs_wrapper,{domEvents: true});

              for (var i = 0; i < tabs_content.length; i++) {
                tabs_content[i].style.width = window.innerWidth + 'px';

                tabs_content[i].addEventListener('swipeleft', function() {
                    swipeTabs(1);
                });

                tabs_content[i].addEventListener('swiperight', function() {
                    swipeTabs(-1);
                });
              }

              //EVENTS ON RESIZE WINDOW
              window.addEventListener('resize', changeSizes);
            }
    }
};

return Tabs;

});
