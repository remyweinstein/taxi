define(['Dom', 'hammer', 'Geo'], function (Dom, Hammer, Geo) {
  
  var polygon = [];
  var s_route_to_Zone = [];
  var safety_route, safe_win, safe_win_wrap;
  
  function swipeRight() {
    var safe_win = Dom.sel('.safety-window');
        safe_win.classList.remove('safety-window--closed');
        safe_win.classList.remove('safety-window--opened');
        safe_win.classList.add('safety-window--closed');
        //safe_win.removeEventListener('tap', swipeRight);
        
    Dom.sel('[data-click="openSafe"]').addEventListener('click', swipeDown);
  };
  
  function swipeDown() {
    var safe_win = Dom.sel('.safety-window');
        //safe_win.addEventListener('tap', swipeRight);
        
    Dom.sel('[data-click="openSafe"]').removeEventListener('click', swipeDown);
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
    window.location.hash = '#edit_zone';
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
              arr.splice(arr[i], 1);
            }
          }
          
          if (Dom.toggle(el, 'active-bg')) {
            for (var i = 0; i < arr.length; i++) {
              if (arr[i] === id) {
                arr.splice(arr[i], 1);
                Zones.inactive(id);
              }
            }
          } else {
            if (id !== "") {
              arr.push(id);
            }
          }
                    
          var but = Dom.sel('[data-click="runZone"]');
              but.dataset.active = arr.join(',');
          
          runZone(but, true);
        }
        
        if (target.dataset.click === "add_to_zones") {
          if (s_route_to_Zone.length > 0) {
            Zones.add(s_route_to_Zone);
          }
        }
        
        target = target.parentNode;
      
      }

    }
  };
  
  function runZone(event, enabled) {
    var el = event.target;
    if (!el) {
      el = event;
    }
    var active = el.dataset.active;
    var arr = active.split(',');
    
    if (!enabled) {
      if (Dom.toggle(el, 'active')) {
        for (var i = 0; i < arr.length; i++) {
          Zones.inactive(arr[i]);
        }
        localStorage.removeItem('_enable_safe_zone');
        if (polygon) {
          for (var i = 0; i < polygon.length; i++) {
            polygon[i].setMap(null);
          }
          polygon = [];
        }
      } else {
        if (active !== "") {
          localStorage.setItem('_enable_safe_zone', active);
          for (var i = 0; i < arr.length; i++) {
            Zones.active(arr[i]);
            polygon[i] = Geo.drawPoly(Zones.list[arr[i]].polygon, SafeWin.map);
          }
        } else {
          Dom.toggle(el, 'active');
        }
      }
    } else {
      if (el.classList.contains('active')) {
        localStorage.removeItem('_enable_safe_zone');
        if (polygon) {
          for (var i = 0; i < polygon.length; i++) {
            polygon[i].setMap(null);
          }
          polygon = [];
        }
        if (active !== "") {
          localStorage.setItem('_enable_safe_zone', active);
          for (var i = 0; i < arr.length; i++) {
            Zones.active(i);
            polygon[i] = Geo.drawPoly(Zones.list[arr[i]].polygon, SafeWin.map);
          }
        } else {
          runZone(el);
        }
      } else {
        runZone(el);
      }
    }
  }
  
  function runRoute(event) {
    var el = event.target;
    
    if (!el) {
      el = event;
    }
    
    s_route_to_Zone = [];
    
    if (Dom.toggle(el, 'active')) {
      safety_route.setMap(null);
      localStorage.removeItem('_enable_safe_route');
    } else {
      localStorage.setItem('_enable_safe_route', Settings.safeRadius);
      //Geo.showPoly(SafeWin.overviewPath, SafeWin.map);
      safety_route = Geo.showPoly(SafeWin.overviewPath, SafeWin.map);
      //safety_route = Geo.bufferPoly(SafeWin.overviewPath, SafeWin.map);
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
    
    init: function () {
      var safewin = this;
      Zones.get(function(){
        safewin.initial();
      });
    },
    
    initial: function () {
      safe_win = Dom.sel('.safety-window');
      safe_win.classList.add('safety-window--closed');
      
      this.render();
      
      var hammer = new Hammer(safe_win, {domEvents: true, preventDefault: true});
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
      
      safe_win.addEventListener('swiperight', swipeRight);
      //safe_win.addEventListener('tap', swipeRight);
      safe_win.addEventListener('press', longPress);
      safe_win.addEventListener('click', selectZone);
      
      Dom.sel('[data-click="openSafe"]').addEventListener('click', swipeDown);
      
      Dom.sel('[data-click="runZone"]').addEventListener('click', runZone);
      Dom.sel('[data-click="runRoute"]').addEventListener('click', runRoute);
      Dom.sel('[data-click="new_zone"]').addEventListener('click', gotoNewZone);
      Dom.sel('input[name="safeRadius"]').addEventListener('input', onInputRange);
    },
    
    render: function() {
      
      safe_win_wrap = Dom.selAll('.safety-window')[0];
      
      var wrap = document.createElement('div');
          wrap.classList.add('safety-window__wrap');
      var zones = '<span><button class="button_short--green" data-click="new_zone">Новая</button></span>';
      
      for (var v = 0; v < Zones.list.length; v++) {
        zones += '<span><button class="button_short--grey" data-click="zone" data-id="' + v + '">' + (v + 1) + '</button></span>';
      }
      wrap.innerHTML = '<div class="safety-window__grid">\n\
                          <div data-click="runSos" class="safety-window__round">SOS</div>\n\
                        </div>\n\
                        <div class="safety-window__grid list-zones">\n\
                          <div data-click="runZone" data-active="" class="safety-window__round">Зона</div>\n\
                          ' + zones + '\n\
                        </div>\n\
                        <div class="safety-window__grid-all safe_by_route">\n\
                          <div data-click="runRoute" class="safety-window__round--left">Маршрут</div>\n\
                          <form>\n\
                            <input name="safeRadius" type="range" min="0" max="2000" step="50" value="' + Settings.safeRadius + '">\n\
                            <div class="safety-window__view-radius">' + Settings.safeRadius + ' м.</div>\n\
                          </form>\n\
                          <div><button class="button_short--grey" data-click="add_to_zones">Добавить в Зоны</button></div>\n\
                        </div>';
      safe_win_wrap.appendChild(wrap);
      
      return;
    },
    
    reload: function() {
      var list = Dom.selAll('.list-zones')[0];
      var spans = list.querySelectorAll('span');
      
      for (var i = 1; i < spans.length; i++) {
        spans[i].parentNode.removeChild(spans[i]);
      }

      for (var i = 0; i < Zones.list.length; i++) {
        var active_bg = '';
        if (Zones.list[i].isActive) {
          active_bg = ' active-bg';
        }
        var span = document.createElement('span');
            span.innerHTML = '<button class="button_short--grey' + active_bg + '" data-click="zone" data-id="' + i + '">' + (i + 1) + '</button>';

        list.appendChild(span);
      }
    },
    
    clear: function() {
      safe_win = Dom.sel('.safety-window');
      
      safe_win.removeEventListener('swiperight', swipeRight);
      //safe_win.removeEventListener('tap', swipeRight);
      safe_win.removeEventListener('press', longPress);
      safe_win.removeEventListener('click', selectZone);
      
      Dom.sel('[data-click="openSafe"]').removeEventListener('click', swipeDown);
      
      Dom.sel('[data-click="runZone"]').removeEventListener('click', runZone);
      Dom.sel('[data-click="runRoute"]').removeEventListener('click', runRoute);
      Dom.sel('[data-click="new_zone"]').removeEventListener('click', gotoNewZone);
      Dom.sel('input[name="safeRadius"]').removeEventListener('input', onInputRange);
      
      //safe_win_wrap = Dom.selAll('.safety-window__wrap')[0];
      //safe_win_wrap.innerHTML = '';
    }

  };
  
  return SafeWin;
  
});