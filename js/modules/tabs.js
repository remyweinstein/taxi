var Tabs = (function() {

    var active_tab_class = 'tab--active';
    var window_width = window.innerWidth;
    var window_height = window.innerHeight;

    // SWIPE TAB CONTENT
    function swipeTabs(route,tabs){
        var current_tab = document.querySelector('.'+active_tab_class).dataset.tab;
        var val_route = parseInt(current_tab) + parseInt(route);
        if(val_route <= tabs.length &&  val_route > 0){
            changeTabs(val_route);
        }
    }

    //CHANGE TAB
    function changeTabs(tab,tabs,tabs_content){
        step = window.innerWidth;
            for(var i=0; i<tabs_content.length; i++){
                tabs_content[i].style.left = (step-step*tab)+'px';
            }
            for(var i=0; i<tabs.length; i++){
                tabs[i].classList.remove(active_tab_class);
            }
        document.querySelector('[data-tab="'+tab+'"]').classList.add(active_tab_class);
    }

    return {

        init: function(){
                var tab,tabs,tabs_wrapper,tabs_viewport,tabs_content;
                    tab = document.querySelector('.tabs');
                    tabs = document.querySelectorAll('.tabs ul li');
                    tabs_wrapper = document.querySelector('.tabs__wrapper');
                    tabs_viewport = document.querySelector('.tabs__viewport');
                    tabs_content = document.querySelectorAll('.tabs_content');

                // CHANGE WIDTH TABS
                var tab_count = tabs.length;
                for(var i=0; i<tab_count; i++){
                    tabs[i].style.width = (100/tab_count-1)+'%';
                }

                // CHANGE WIDTH AND HEIGHT CONTENTS
                tabs_viewport.style.width = (tab_count * window_width)+'px';
                tabs_wrapper.style.height = (window_height - Funcs.outerHeight(document.querySelector('.header')) - Funcs.outerHeight(tab))+'px';
                
                // EVENT ON CLICK TAB => ChangeTab()
                tab.addEventListener('click', function(event){
                    var target = event.target;
                        while(target !== this){
                            if(target.dataset.tab > 0) {
                                changeTabs(target.dataset.tab,tabs,tabs_content);
                                return;
                            }
                            target = target.parentNode;
                        }
                });
                
                //EVENTS ON SWIPE CONTENT => SwipeTabs()
                new Hammer(tabs_wrapper,{domEvents: true});
                for(var i=0;i<tabs_content.length; i++){
                    tabs_content[i].style.width = window_width+'px';
                    tabs_content[i].addEventListener('swipeleft', function(){
                        swipeTabs(1,tabs);
                    });
                    tabs_content[i].addEventListener('swiperight', function(){
                        swipeTabs(-1,tabs);
                    });
                }
        }

    };

})();