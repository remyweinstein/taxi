define(['Dom', 'hammer'], function (Dom, Hammer) {

  function swipeLeft() {
    var safe_win = Dom.sel('.safety-window');
    safe_win.classList.remove('safety-window--closed');
    safe_win.classList.remove('safety-window--opened');
    safe_win.classList.add('safety-window--closed');
  };
  
  function swipeRight() {
    var safe_win = Dom.sel('.safety-window');
    safe_win.classList.remove('safety-window--closed');
    safe_win.classList.remove('safety-window--opened');
    safe_win.classList.add('safety-window--opened');
  };
  
  var SafeWin = {
    init: function() {
      var safe_win = Dom.sel('.safety-window');
      safe_win.innerHTML = '<div class="safety-window__grid-all">\
                              <div data-click="runSos" class="safety-window__round">SOS</div>\n\
                            </div>\n\
                            <div class="safety-window__grid">\n\
                              <div data-click="runZone" class="safety-window__round">Зона</div>\n\
                            </div>\n\
                            <div class="safety-window__grid">\n\
                              <div data-click="runRoute" class="safety-window__round">Маршрут</div>\n\
                              <input name="safeRadius" type="range" min="0" max="1" step="0.1" value="0.1">\n\
                            </div>';

      
      //EVENT ON SWIPE THIS WINDOW => SwipeWin()
      new Hammer(safe_win, {domEvents: true});
      
      safe_win.addEventListener('swipeleft', swipeLeft);
      
      safe_win.addEventListener('swiperight', swipeRight);
    },
    
    clear: function() {
      var safe_win = Dom.sel('.safety-window');
      safe_win.innerHTML = '';
      safe_win.removeEventListener('swipeleft', swipeLeft);
      safe_win.removeEventListener('swiperight', swipeRight);
    }

  };
  
  return SafeWin;
  
});