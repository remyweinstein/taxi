  var Router = (function() { //Ajax, Dom
    function checkURL(hash) {
      sublasturl = lasturl;
      if (!hash) {
        if (!window.location.hash) hash='#client__city';
            else hash = window.location.hash;
      }
      if (hash !== lasturl) {
        lasturl=hash;
        loadPage(hash);
      }
    }

    function loadPage(url) {
      url = url.replace('#','');
      var datar = url.split('__');

      Dom.sel(".loading").style.visibility = "visible";

      var data = new FormData();
        data.append('section', datar[0]);
        data.append('page', datar[1]);
        
      Ajax.request(home_server, 'POST', 'routes.php', '', '', data, function(response) {
        if (response) {
          Dom.sel('.header__title').innerHTML = response.title;
          Dom.sel('.content').innerHTML = response.content;

          if (datar[0] !== lastsection || lastsection === '') {
            Dom.sel('.menu__response').innerHTML = response[0].menu;
          }
          
          lastsection = datar[0];
          Dom.sel(".loading").style.visibility = "hidden";
          
          if (response.pageType === "back-arrow") {
            Dom.sel('[data-click="menu-burger"]').style.display = "none";
            Dom.sel('[data-click="back-burger"]').style.display = "block";
            //Dom.sel('.header__link').innerHTML = '<a href="#" onclick="document.forms[0].submit(); return false;"><i class="icon-ok"></i></a>';
          } else {
            Dom.sel('[data-click="menu-burger"]').style.display = "block";
            Dom.sel('[data-click="back-burger"]').style.display = "none";
            //Dom.sel('.header__link').innerHTML = '<i class="icon-share"></i>';
          }
          
          Dom.sel('.header__link').innerHTML = '<i class="icon-share"></i>';
          
          init();
        }
      });
    }

    return{
        init: function (){
            checkURL();
            setInterval(checkURL,250);
        }
    };
  })();