define(['Dom', 'hammer', 'Geo'], function (Dom, Hammer, Geo) {
  
  var polygon = [];
  var safety_route;
  
  function swipeLeft() {
    var safe_win = Dom.sel('.safety-window');
    safe_win.classList.remove('safety-window--closed');
    safe_win.classList.remove('safety-window--opened');
    safe_win.classList.add('safety-window--closed');
    safe_win.addEventListener('tap', swipeRight);
  };
  
  function swipeRight() {
    var safe_win = Dom.sel('.safety-window');
    safe_win.removeEventListener('tap', swipeRight);
    if (safe_win.classList.contains('safety-window--closed')) {
      safe_win.classList.remove('safety-window--closed');
      safe_win.classList.remove('safety-window--opened');
      safe_win.classList.add('safety-window--opened');
    }
  };
  
  function longPress(event) {
    var target = event.target;

    while (target !== this) {
      if (target) {
        if (target.dataset.click === "runSos") {
          alert('Включен режим SOS');
        }
      }

      target = target.parentNode;
    }
  };
  
  function gotoNewZone() {
    window.location.hash = '#zones';
  };
  
  function selectZone(event) {
    var target = event.target;

    while (target !== this) {
      if (target) {
        
        if (target.dataset.click === "zone") {
          var el = target;
          var id = el.dataset.id;
          
          var arr = Dom.sel('[data-click="runZone"]').dataset.active;
          arr = arr.split(',');
          for (var i = 0; i < arr.length; i++) {
            if (arr[i] === "") {
              arr.splice(i, 1);
            }
          }
          
          if (Dom.toggle(el, 'active-bg')) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] === id) {
                arr.splice(i, 1);
              }
            }
          } else {
            if (id !== "") {
              arr.push(id);
            }
          }
                    
          Dom.sel('[data-click="runZone"]').dataset.active = arr.join(',');
        }
      }

      target = target.parentNode;
    }
  };
  
  function runZone(el) {
    el = el.target;
    var active = el.dataset.active;
    var arr = active.split(',');

    if (Dom.toggle(el, 'active')) {
      if (polygon) {
        for (var i = 0; i < polygon.length; i++) {
          polygon[i].setMap(null);
        }
        polygon = [];
      }
    } else {
      if (active !== "") {
        for (var i = 0; i < arr.length; i++) {
          polygon[i] = Geo.drawPoly(Zones[arr[i]], SafeWin.map);
        }
      } else {
        Dom.toggle(el, 'active');
      }
    }
  }
        
  function runRoute(el) {
    el = el.target;
    if (Dom.toggle(el, 'active')) {
      safety_route.setMap(null);
    } else {
      safety_route = Geo.showPoly(SafeWin.overviewPath, SafeWin.map);
    }
  }
  
  function onInputRange() {
    var val = parseInt(this.value);
    Settings.safeRadius = val;
    Dom.sel('.safety-window__view-radius').innerHTML = val + ' м.';
  }
  
  var SafeWin = {
    map: null,
    overviewPath: [],
    init: function() {
      var safe_win = Dom.sel('.safety-window');
      safe_win.classList.add('safety-window--closed');
      var zones = '<span><button class="button_short--green" data-click="new_zone">Новая</button></span>';
      
      for (var i = 0; i < Zones.length; i++) {
        zones += '<span><button class="button_short--grey" data-click="zone" data-id="' + i + '">' + (i + 1) + '</button></span>';
      }
      safe_win.innerHTML = '<div class="safety-window__grid-all">\
                              <div data-click="runSos" class="safety-window__round">SOS</div>\n\
                            </div>\n\
                            <div class="safety-window__grid">\n\
                              <div data-click="runZone" data-active="" class="safety-window__round">Зона</div>\n\
                              ' + zones + '\n\
                            </div>\n\
                            <div class="safety-window__grid">\n\
                              <div data-click="runRoute" class="safety-window__round">Маршрут</div>\n\
                              <form>\n\
                                <input name="safeRadius" type="range" min="0" max="2000" step="50" value="' + Settings.safeRadius + '">\n\
                                <div class="safety-window__view-radius">' + Settings.safeRadius + ' м.</div>\n\
                              </form>\n\
                            </div>';

      var hammer = new Hammer(safe_win, {domEvents: true});
      var longpress = new Hammer.Press({event: 'press', time: 3000});
      var tap = new Hammer.Tap({event: 'tap'});
      hammer.add([longpress],[tap]);
      
      safe_win.addEventListener('swipeleft', swipeLeft);
      safe_win.addEventListener('swiperight', swipeRight);
      safe_win.addEventListener('tap', swipeRight);
      safe_win.addEventListener('press', longPress);
      safe_win.addEventListener('click', selectZone);
      Dom.sel('[data-click="runZone"]').addEventListener('click', runZone);
      Dom.sel('[data-click="runRoute"]').addEventListener('click', runRoute);
      Dom.sel('[data-click="new_zone"]').addEventListener('click', gotoNewZone);
      Dom.sel('input[name="safeRadius"]').addEventListener('input', onInputRange);
      
    },
    
    clear: function() {
      var safe_win = Dom.sel('.safety-window');
      safe_win.innerHTML = '';
      safe_win.removeEventListener('swipeleft', swipeLeft);
      safe_win.removeEventListener('swiperight', swipeRight);
      safe_win.removeEventListener('tap', swipeRight);
      safe_win.removeEventListener('press', longPress);
      safe_win.removeEventListener('click', selectZone);
      Dom.sel('[data-click="runZone"]').removeEventListener('click', runZone);
      Dom.sel('[data-click="runRoute"]').removeEventListener('click', runRoute);
      Dom.sel('[data-click="new_zone"]').removeEventListener('click', gotoNewZone);
      Dom.sel('input[name="safeRadius"]').removeEventListener('input', onInputRange);
    }

  };
  
  return SafeWin;
  
});