define(['Dom', 'Maps'], function(Dom, Maps) {

  var tab, 
      tabs, 
      tabs_wrapper, 
      tabs_viewport, 
      tabs_content,
      is_map = [],
      active_tab_class = 'tab--active';

/*
  // SWIPE TAB CONTENT
  function swipeTabs(route) {
    var current_tab = Dom.sel('.' + active_tab_class).dataset.tab;
    var val_route = parseInt(current_tab) + parseInt(route);

    if (val_route <= tabs.length &&  val_route > 0) {
      changeTabs(val_route);
    }
  }
*/

  //CHANGE TAB
  function changeTabs(tab) {
    var step = window.innerWidth,
        i;

    for (i = 0; i < tabs_content.length; i++) {
      tabs_content[i].style.left = (step - step * tab) + 'px';
    }

    for (i = 0; i < tabs.length; i++) {
      var elem = Dom.sel('[data-tab-content="' + (i + 1) + '"]'),
          elems = elem.querySelectorAll('[data-hide-form="bottom"]');

      for (var y = 0; y < elems.length; y++) {
        //var position = elems[y].getAttribute('position');
        var position = window.getComputedStyle(elems[y]).getPropertyValue('position'),
            pos_style = elems[y].style.position;

        if (parseInt(i + 1) !== parseInt(tab) && (position === 'fixed' || pos_style === 'fixed')) {
          console.log('find fixed');
          elems[y].style.position = "static";
        }
        if (parseInt(i + 1) === parseInt(tab) && pos_style === 'static') {
          console.log('find static');
          elems[y].style.position = "fixed";
        }
      }
      tabs[i].classList.remove(active_tab_class);
    }

    Dom.sel('[data-tab="' + tab + '"]').classList.add(active_tab_class);
  }

  // HEIGHT ELEMENT WITH MARGINS
  function outerHeight(el) {
    var height = el.offsetHeight,
        styles = getComputedStyle(el);
      
    height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);

    return height;
  }

  // CHANGE WIDTH AND HEIGHT CONTENTS
  function changeSizes() {
    var header = Dom.sel('.header'),
        tab_count = tabs.length,
        i;
    
    for (i = 0; i < tab_count; i++) {
      tabs[i].style.width = (100 / tab_count - 1) + '%';
    }

    tabs_viewport.style.width = (tab_count * window.innerWidth) + 'px';
    tabs_wrapper.style.height = (window.innerHeight - outerHeight(header) - outerHeight(tab)) + 'px';
  }
  
  function changeOnClick(event) {
    var target = event.target;

    while (target !== this) {
      if (target.dataset.tab > 0) {
        changeTabs(target.dataset.tab);

        return;
      }

      target = target.parentNode;
    }
  }

  var Tabs = {

    init: function() {
            tab = Dom.sel('.tabs');

            if (tab) {
              tabs = Dom.selAll('.content .tabs ul li');
              tabs_wrapper = Dom.sel('.tabs__wrapper');
              tabs_viewport = Dom.sel('.tabs__viewport');
              tabs_content = Dom.selAll('.tabs_content');
              
              for (var i = 0; i < tabs_content.length; i++) {
                if (tabs_content[i].dataset.map) {
                  is_map[i] = true;
                  for (var y = 0; y < i; y++) {
                    is_map[y] = false;
                  }
                  Maps.mapMoveTab(tabs_content[i]);
                } else {
                  is_map[i] = false;
                }
              }

              changeSizes();

              // EVENT ON CLICK TAB => ChangeTab()
              tab.addEventListener('click', changeOnClick);


              //EVENTS ON SWIPE CONTENT => SwipeTabs()
              //new Hammer(tabs_wrapper,{domEvents: true});
              for (var i = 0; i < tabs_content.length; i++) {
                tabs_content[i].style.width = window.innerWidth + 'px';
                
                //tabs_content[i].addEventListener('swipeleft', function() {
                //  swipeTabs(1);
                //});
                //tabs_content[i].addEventListener('swiperight', function() {
                //  swipeTabs(-1);
                //});
              }

              //EVENTS ON RESIZE WINDOW
              window.addEventListener('resize', changeSizes);
            }
    },
    
    clear: function() {
            tab = Dom.sel('.tabs');

            if (tab) {
              tab.removeEventListener('click', changeOnClick);
              
              tabs_content = Dom.selAll('.tabs_content');
              
              for (var i = 0; i < tabs_content.length; i++) {
                if (tabs_content[i].dataset.map) {
                  Maps.mapBackTab();
                  
                  break;
                }
              }
            }
    }

};

return Tabs;

});
