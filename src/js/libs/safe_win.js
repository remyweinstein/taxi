define(['Dom', 'hammer', 'Geo'], function (Dom, Hammer, Geo) {
  
  var polygon = [];
  var s_route_to_Zone = [];
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
        
        if (target.dataset.click === "add_to_zones") {
          if (s_route_to_Zone.length > 0) {
            Zones.push(s_route_to_Zone);
            localStorage.setItem('_my_zones', JSON.stringify(Zones));
            SafeWin.init();
          }
        }
        
        target = target.parentNode;
      
      }

    }
  };
  
  function runZone(event) {
    var el = event.target;
    if (!el) {
      el = event;
    }
    var active = el.dataset.active;
    var arr = active.split(',');

    if (Dom.toggle(el, 'active')) {
      localStorage.removeItem('_enable_safe_zone');
      if (polygon) {
        for (var i = 0; i < polygon.length; i++) {
          polygon[i].setMap(null);
        }
        polygon = [];
      }
    } else {
      localStorage.setItem('_enable_safe_zone', active);
      if (active !== "") {
        for (var i = 0; i < arr.length; i++) {
          polygon[i] = Geo.drawPoly(Zones[arr[i]], SafeWin.map);
        }
      } else {
        Dom.toggle(el, 'active');
      }
    }
  }
  
  function runRoute(event) {
    var el = event.target;
    
    if (!el) {
      el = event;
    }
    if (Dom.toggle(el, 'active')) {
      safety_route.setMap(null);
      localStorage.removeItem('_enable_safe_route');
    } else {
      localStorage.setItem('_enable_safe_route', Settings.safeRadius);
      safety_route = Geo.showPoly(SafeWin.overviewPath, SafeWin.map);
      var path = safety_route.getPath();
      if (path) {
        for (var i = 0; i < path.b.length; i++) {
          s_route_to_Zone.push({"lat":path.b[i].lat(),"lng":path.b[i].lng()});
        }
      }
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
                              <div><button class="button_short--grey" data-click="add_to_zones">Добавить в Зоны</button></div>\n\
                            </div>';

      var hammer = new Hammer(safe_win, {domEvents: true});
      var longpress = new Hammer.Press({event: 'press', time: 3000});
      var tap = new Hammer.Tap({event: 'tap'});
      hammer.add([longpress],[tap]);
      
      var enable_safe_zone = localStorage.getItem('_enable_safe_zone');
      
      if (enable_safe_zone) {
        var button_zone = Dom.sel('[data-click="runZone"]');
        
        button_zone.dataset.active = enable_safe_zone;
        var arr_active = enable_safe_zone.split(',');
        var dom_arr = Dom.selAll('[data-click="zone"]');
        
        for (var i = 0; i < arr_active.length; i++) {
          for (var y = 0; y < dom_arr.length; y++) {
            if (dom_arr[y].dataset.id === arr_active[i]) {
              Dom.toggle(dom_arr[y], 'active-bg');
            }
          }
        }
        
        runZone(button_zone);
      }
      
      var enable_safe_route = localStorage.getItem('_enable_safe_route');
      
      if (enable_safe_route) {
        var button_route = Dom.sel('[data-click="runRoute"]');

        runRoute(button_route);
      }
      
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