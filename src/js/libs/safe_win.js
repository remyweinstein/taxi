/* global safe_zone_polygons, Zones, Settings */

define(['Dom', 'hammer', 'Geo', 'Funcs', 'Multirange'], function (Dom, Hammer, Geo, Funcs, Multirange) {
  
  var s_route_to_Zone = [],
      safety_route, safe_win, safe_win_wrap;
  
  function swipeRight() {
    var safe_win = Dom.sel('.safety-window');
    
    safe_win.classList.remove('safety-window--closed');
    safe_win.classList.remove('safety-window--opened');
    safe_win.classList.add('safety-window--closed');
    //safe_win.removeEventListener('tap', swipeRight);
        
    Dom.sel('[data-click="openSafe"]').addEventListener('click', swipeDown);
  }
  
  function swipeDown() {
    var safe_win = Dom.sel('.safety-window');
    
    //safe_win.addEventListener('tap', swipeRight);
        
    Dom.sel('[data-click="openSafe"]').removeEventListener('click', swipeDown);
    if (safe_win.classList.contains('safety-window--closed')) {
      safe_win.classList.remove('safety-window--closed');
      safe_win.classList.remove('safety-window--opened');
      safe_win.classList.add('safety-window--opened');
    }
  }
  
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
  }
  
  function gotoNewZone() {
    window.location.hash = '#edit_zone';
  }
  
  function selectZone(event) {
    var target = event.target;

    while (target !== this) {
      if (target) {
        
        if (target.dataset.click === "zone") {
          var a = false,
              el = target,
              id = el.dataset.id,
              but_run_zone = Dom.sel('[data-click="runZone"]'),
              isActiveRunZone = but_run_zone.classList.contains('active'),
              arr = but_run_zone.dataset.active,
              list_active_zone = [],
              arr_id = false;
          
          if (arr !== "") {
            if (arr.indexOf(',') > -1) {
              list_active_zone = arr.split(',');
            } else {
              list_active_zone.push(arr);
            }
          }

          for (var i = 0; i < list_active_zone.length; i++) {
            if (list_active_zone[i] === id) {
              arr_id = i;
            }
          }

          if (Dom.toggle(el, 'active-bg')) {
            Zones.inactive(id);
            list_active_zone.splice(arr_id, 1);
            
            safe_zone_polygons[arr_id].setMap(null);
            safe_zone_polygons.splice(arr_id, 1);
            
            if (list_active_zone.length < 1 && isActiveRunZone) {
              localStorage.removeItem('_enable_safe_zone');
              Dom.toggle(but_run_zone, 'active');
            }
            
          } else {
            if (id !== "") {
              list_active_zone.push(id);
              if (isActiveRunZone) {
                safe_zone_polygons.push(Geo.drawPoly(Zones.list[(list_active_zone.length - 1)].polygon, SafeWin.map));
                Zones.active(id);
              } else {
                a = true;
              }
            }
          }
          
          but_run_zone.dataset.active = list_active_zone.join(',');
          if (a) {
            runZone(but_run_zone, true);
          }
        }
        
        if (target.dataset.click === "add_to_zones") {
          if (s_route_to_Zone.length > 0) {
            Zones.add(s_route_to_Zone);
          }
        }
        
        target = target.parentNode;
      
      }

    }
  }
  
  function runZone(event, enable) {
    var el = event.target;
    
    if (!el) {
      el = event;
    }
    
    var active = el.dataset.active,
        list_active_zone = [];

    if (active !== "") {
      list_active_zone = active.split(',');
    }
    
    
    
    if (!enable) { // IF THIS CLICK
      if (Dom.toggle(el, 'active')) {
        clearPolygonZones();
      } else {
        if (active !== "") {
          drawPolygon();
        } else {
          Dom.toggle(el, 'active');
        }
      }
    } else { // IF THIS FROM THE OUTSIDE
        runZone(el);
    }
    
    function drawPolygon() {
      localStorage.setItem('_enable_safe_zone', active);
      for (var i = 0; i < list_active_zone.length; i++) {
        var arr_id = Funcs.findIdArray(Zones.list, list_active_zone[i]);
        
        Zones.active(list_active_zone[i]);
        safe_zone_polygons[i] = Geo.drawPoly(Zones.list[arr_id].polygon, SafeWin.map);
      }  
    }
    
    function clearPolygonZones() {
      var i;
      
      for (i = 0; i < list_active_zone.length; i++) {
        Zones.inactive(list_active_zone[i]);
      }
      localStorage.removeItem('_enable_safe_zone');
      if (safe_zone_polygons) {
        for (i = 0; i < safe_zone_polygons.length; i++) {
          safe_zone_polygons[i].setMap(null);
        }
        safe_zone_polygons = [];
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
      disableZoneForRoute();
    } else {
      enableZoneForRoute();
    }
  }

  function disableZoneForRoute() {
    Dom.sel('[data-click=runRoute]').classList.remove('active');
    if (safety_route) {
      safety_route.setMap(null);
    }
    localStorage.removeItem('_enable_safe_route');
  }
  
  function enableZoneForRoute () {
    localStorage.setItem('_enable_safe_route', Settings.safeRadius);
    safety_route = Geo.showPoly(SafeWin.overviewPath, SafeWin.map);
    
    var path = safety_route.getPath();
    
    if (path) {
      for (var i = 0; i < path.b.length; i++) {
        s_route_to_Zone.push({"lat":path.b[i].lat(),"lng":path.b[i].lng()});
      }
    }
  }
  
  function onInputRange() {
    var val = parseInt(this.value);
    
    disableZoneForRoute();
    Settings.safeRadius = val;
    Dom.sel('.safety-window__view-radius').innerHTML = val + ' м.';
  }
  
  var SafeWin = {
    map: null,
    
    overviewPath: [],
    
    init: function () {
      var safewin = this;
      Zones.get(function () {
        safewin.initial();
      });
    },
    
    initial: function () {
      var enable_safe_route = localStorage.getItem('_enable_safe_route');
      
      safe_win = Dom.sel('.safety-window');
      safe_win.classList.add('safety-window--closed');
      
      if (enable_safe_route) {
        Settings.safeRadius = enable_safe_route;
      }
      
      this.render();
      Multirange.init(safe_win);
            
      var hammer = new Hammer(safe_win, {domEvents: true, preventDefault: true}),
          longpress = new Hammer.Press({event: 'press', time: 3000}),
          tap = new Hammer.Tap({event: 'tap'}),
          enable_safe_zone = localStorage.getItem('_enable_safe_zone');
      
      hammer.add([longpress],[tap]);
      
      if (enable_safe_zone) {
        var button_zone = Dom.sel('[data-click="runZone"]'),
            arr_active = enable_safe_zone.split(','),
            dom_arr = Dom.selAll('[data-click="zone"]');
        
        button_zone.dataset.active = enable_safe_zone;
        
        for (var i = 0; i < arr_active.length; i++) {
          for (var y = 0; y < dom_arr.length; y++) {
            if (dom_arr[y].dataset.id === arr_active[i]) {
              Dom.toggle(dom_arr[y], 'active-bg');
            }
          }
        }
        
        runZone(button_zone);
      }

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
      Dom.sel('input[name="safeRadius"]').addEventListener('change', onInputRange);
    },
    
    render: function() {
      
      safe_win_wrap = Dom.selAll('.safety-window')[0];
      
      var wrap = document.createElement('div'),
          zones = '<span><button class="button_short--green" data-click="new_zone">Новая</button></span>';

      wrap.classList.add('safety-window__wrap');

      for (var v = 0; v < Zones.list.length; v++) {
        zones += '<span><button class="button_short--grey" data-click="zone" data-id="' + v + '">' + (v + 1) + '</button></span>';
      }
      wrap.innerHTML = '<div class="safety-window__grid">' + 
                          '<div data-click="runSos" class="safety-window__round">SOS</div>' + 
                        '</div>' + 
                        '<div class="safety-window__grid list-zones">' + 
                          '<div data-click="runZone" data-active="" class="safety-window__round">Зона</div>' + 
                            zones + 
                        '</div>' + 
                        '<div class="safety-window__grid-all safe_by_route">' + 
                          '<div data-click="runRoute" class="safety-window__round--left">Маршрут</div>' + 
                          '<form>' + 
                            '<input name="safeRadius" type="range" min="0" max="2000" step="50" value="' + Settings.safeRadius + '">' +
                            '<div class="safety-window__view-radius">' + Settings.safeRadius + ' м.</div>' + 
                          '</form>' + 
                          '<div><button class="button_short--grey" data-click="add_to_zones">Добавить в Зоны</button></div>' + 
                        '</div>';
      safe_win_wrap.appendChild(wrap);
      
      return;
    },
    
    reload: function() {
      var list = Dom.selAll('.list-zones')[0],
          spans = list.querySelectorAll('span'),
          i;
      
      for (i = 1; i < spans.length; i++) {
        spans[i].parentNode.removeChild(spans[i]);
      }

      for (i = 0; i < Zones.list.length; i++) {
        var active_bg = '';
        if (Zones.list[i].isActive) {
          active_bg = ' active-bg';
        }
        var span = document.createElement('span');
            span.innerHTML = '<button class="button_short--grey' + active_bg + '" data-click="zone" data-id="' + Zones.list[i].id + '">' + (i + 1) + '</button>';

        list.appendChild(span);
      }
    },
    
    clear: function() {
      safe_win = Dom.sel('.safety-window');
      
      Multirange.clear(safe_win);
      
      safe_win.removeEventListener('swiperight', swipeRight);
      //safe_win.removeEventListener('tap', swipeRight);
      safe_win.removeEventListener('press', longPress);
      safe_win.removeEventListener('click', selectZone);
      
      Dom.sel('[data-click="openSafe"]').removeEventListener('click', swipeDown);
      
      Dom.sel('[data-click="runZone"]').removeEventListener('click', runZone);
      Dom.sel('[data-click="runRoute"]').removeEventListener('click', runRoute);
      Dom.sel('[data-click="new_zone"]').removeEventListener('click', gotoNewZone);
      Dom.sel('input[name="safeRadius"]').removeEventListener('change', onInputRange);
      
      //safe_win_wrap = Dom.selAll('.safety-window__wrap')[0];
      //safe_win_wrap.innerHTML = '';
    }

  };
  
  return SafeWin;
  
});