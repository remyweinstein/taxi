var MainMenu = (function() {

    var contentClass = 'content';

    function swipeMenu(route){
        var menu = document.querySelector('.menu');
        var state = (route>0)?'opened':'closed';
        menu.classList.remove('menu--closed');
        menu.classList.remove('menu--opened');
        menu.classList.add('menu--'+state);
    }

    return {
        init: function(){
            var menu = document.querySelector('.menu');

            //EVENT ON CLICK BURGER MENU ICON
            document.querySelector('[data-click="menu-burger"]').addEventListener('click', function(){
                swipeMenu(1);
            });
            
            //EVENT ON CLICK BURGER BACK ICON
            document.querySelector('[data-click="back-burger"]').addEventListener('click', function(){
                window.history.back();
            });

            //EVENTS ON SWIPE MENU => SwipeMenu()
            new Hammer(menu,{domEvents: true});
            menu.addEventListener('swipeleft', function(){
                swipeMenu(-1);
            });

            //EVENTS ON CLICK CONTENT FOR CLOSE MENU
            var content = document.querySelector('.'+contentClass);
            content.addEventListener('click', function(event){
                var target = event.target;
                while(target !== this){

                        //=  Close Menu on Click body  =
                    if(document.querySelector('.menu').classList.contains('menu--opened')){
                        console.log('try close');
                        swipeMenu(-1);
                    }
                    target = target.parentNode;
                }
            });

            //EVENTS ON CLICK MENU
            menu.addEventListener('click', function(event) {
                var target = event.target;
                while (target !== this) {
                        //= Change Item menu =
                    if(target.tagName === 'A') {
                        var li = target.parentNode;
                        var lis = li.parentNode.querySelectorAll('li');
                        for(var i=0; i<lis.length; i++){
                            lis[i].classList.remove('menu__list--active');
                        }
                        li.classList.add('menu__list--active');
                        swipeMenu(-1);
                    }
                        //= Click edit profile =
                    if(target.dataset.click === 'edit_profile'){
                        swipeMenu(-1);
                        document.location = '#pages__edit_profile';
                        return;
                    }
                    target = target.parentNode;
                }
            });
        }

    };
})();

