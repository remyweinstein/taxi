/* global safe_zone_polygons, Zones, Settings, Maps, Conn, User */

define(['Dom', 'hammer', 'Funcs', 'Multirange', 'ModalWindows', 'Storage'], function (Dom, Hammer, Funcs, Multirange, Modal, Storage) {
  
  var s_route_to_Zone = [],
      safety_route, 
      safe_win, 
      list_active_zone,
      safe_zone_polygons = [];
  
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
          Conn.request('requestSos');
          alert('Сигнал SOS отправлен');
        }
      }

      target = target.parentNode;
    }
  }
  
  function gotoNewZone() {
    goToPage = '#edit_zone';
  }
  
  function drawPolygon(ids) {
    SafeWin.clearPolygonZones(ids);
    for (var i = 0; i < ids.length; i++) {
      var arr_id = Funcs.findIdArray(Zones.list, ids[i]);
      
      safe_zone_polygons[i] = Maps.drawPoly(Zones.list[arr_id].polygon);
      Maps.addElOnMap(safe_zone_polygons[i]);
    }  
  }

  function selectZone(event) {
    var target = event.target;

    while (target !== this) {
      if (target) {
        
        if (target.dataset.click === "zone") {
          var el = target,
              id = el.dataset.id,
              but_run_zone = Dom.sel('[data-click="runZone"]'),
              isActiveRunZone = but_run_zone.classList.contains('active'),
              arr = but_run_zone.dataset.active,
              arr_id = false;

          list_active_zone = arr !== "" ? arr.split(',') : [];
            
          if (isActiveRunZone) {
            return;
          }
          
          for (var i = 0; i < list_active_zone.length; i++) {
            if (list_active_zone[i] === id) {
              arr_id = i;
              break;
            }
          }

          if (Dom.toggle(el, 'active-bg')) {
            list_active_zone.splice(arr_id, 1);
            Maps.removeElement(safe_zone_polygons[arr_id]);
            safe_zone_polygons.splice(arr_id, 1);            
          } else {
            if (id !== "") {
              list_active_zone.push(id);
              drawPolygon(list_active_zone);
            }
          }
          
          but_run_zone.dataset.active = list_active_zone.join(',');
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
  
  function runZone(event) {
    var el = false;
      
    if (event) {
        el = event.target;
    }
    
    if (!el) {
      el = event;
    }
    
    var active = el.dataset.active,
        disableZones = function () {
          for (var i = 0; i < list_active_zone.length; i++) {
            Zones.inactive(list_active_zone[i]);
          }
          Storage.removeActiveZones();
        },
        cbCheckPin = function (response) {
          if (!response.error) {
            disableZones();
            Dom.toggle(el, 'active');
          }
          Conn.clearCb('cbCheckPin');
        };
    
    list_active_zone = [];

    if (active !== "") {
      list_active_zone = active.split(',');
      if (Dom.toggle(el, 'active')) {
        if (!User.hasPin) {
          disableZones();
        } else {
          Dom.toggle(el, 'active');
          Modal.checkPin(function(response) {
            Conn.request('checkPin', response.pin, cbCheckPin);
          });
        }
      } else {
        for (var i = 0; i < list_active_zone.length; i++) {
          Zones.active(list_active_zone[i]);
        }
        Storage.setActiveZones(active);
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
      Maps.removeElement(safety_route);
    }
    
    Storage.clearSafeRoute();
    Storage.removeActiveRoute();
    
  }
  
  function enableZoneForRoute () {
    Storage.setActiveRoute(Settings.safeRadius);
    safety_route = Maps.showPoly(SafeWin.overviewPath);
    
    var path = safety_route.getPath();
    
    if (path) {
      for (var i = 0; i < path.b.length; i++) {
        s_route_to_Zone.push({"lat":path.b[i].lat(),"lng":path.b[i].lng()});
      }
      
      Storage.setSafeRoute(s_route_to_Zone);
    }
  }
  
  function onInputRange() {
    var val = parseInt(this.value);
    
    disableZoneForRoute();
    Settings.safeRadius = val;
    Dom.sel('.safety-window__view-radius').innerHTML = val + ' м.';
  }
  
  var SafeWin = {
    overviewPath: [],
    
    initial: function () {
      var enable_safe_route = Storage.getActiveRoute();
      
      safe_win = Dom.sel('.safety-window');
      safe_win.classList.add('safety-window--closed');
      
      if (enable_safe_route) {
        Settings.safeRadius = enable_safe_route;
      }
      
      this.render();
      Multirange.init(Dom.sel('.safety-window'));
            
      var hammer = new Hammer(safe_win, {domEvents: true, preventDefault: true}),
          longpress = new Hammer.Press({event: 'press', time: 3000}),
          tap = new Hammer.Tap({event: 'tap'}),
          enable_safe_zone = Storage.getActiveZones();
      
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
        
        drawPolygon(arr_active);
        runZone(button_zone);
      }

      if (enable_safe_route) {
        runRoute(Dom.sel('[data-click="runRoute"]'));
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
      var wrap = document.createElement('div'),
          zones = '<span><button class="button_short--green" data-click="new_zone">Новая</button></span>';

      wrap.classList.add('safety-window__wrap');

      for (var v = 0; v < Zones.list.length; v++) {
        zones += '<span><button class="button_short--grey" data-click="zone" data-id="' + Zones.list[v].id + '">' + (v + 1) + '</button></span>';
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
      Dom.selAll('.safety-window')[0].appendChild(wrap);
      
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
        var active_bg = Zones.list[i].isActive ? ' active-bg' : '',
            span = document.createElement('span');
          
        span.innerHTML = '<button class="button_short--grey' + active_bg + '" data-click="zone" data-id="' + Zones.list[i].id + '">' + (i + 1) + '</button>';
        list.appendChild(span);
      }
    },
    
    reinit: function() {
      this.clear();
      this.initial();
    },
    
    clear: function() {
      safe_win = Dom.sel('.safety-window');
      Multirange.clear(Dom.sel('.safety-window'));
      safe_win.removeEventListener('swiperight', swipeRight);
      //safe_win.removeEventListener('tap', swipeRight);
      safe_win.removeEventListener('press', longPress);
      safe_win.removeEventListener('click', selectZone);      
      Dom.sel('[data-click="openSafe"]').removeEventListener('click', swipeDown);
      Dom.sel('[data-click="runZone"]').removeEventListener('click', runZone);
      Dom.sel('[data-click="runRoute"]').removeEventListener('click', runRoute);
      Dom.sel('[data-click="new_zone"]').removeEventListener('click', gotoNewZone);
      Dom.sel('input[name="safeRadius"]').removeEventListener('change', onInputRange);
      safe_win.innerHTML = '';
    },
    
    toggleButton: function() {
      runZone();
    },
    
    clearPolygonZones: function() {
      if (safe_zone_polygons) {
        for (var i = 0; i < safe_zone_polygons.length; i++) {
          Maps.removeElement(safe_zone_polygons[i]);
        }
        safe_zone_polygons = [];
      }
    }

  };
  
  return SafeWin;
  
});