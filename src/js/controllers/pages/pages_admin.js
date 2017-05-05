/* global Event, Parameters, Maps, SafeWin, User, Conn */

define(['Dom', 'ModalWindows'], function (Dom, Modal) {

  function addEvents() {
    Event.click = function (event) {
      var target = event.target,
          el,
          _key;

      while (target !== this && target) {
        if (target.dataset.click === "number") {
          el = target;
          _key = el.dataset.key;
          
          Modal.show('<input type="text" name="val" value="' + eval("Parameters." + _key) + '" />' + 
                     '<button class="button_rounded--green" data-getvalue="val">Сохранить</button>', 
            function (response) {
              var data= {};
              
              eval('Parameters.' + _key + ' = ' + response);
              
              if (_key === "safeRadius") {
                User.routeGuardZoneRadius = response;
                data.routeGuardZoneRadius = response;
                Conn.request('updateProfile', data);
              }

              if (_key === "distanceToPoint" || 
                  _key === "automatClientTime" ||
                  _key === "automatDriverTime" ||
                  _key === "blockDays" ||
                  _key === "indexInterval" ||
                  _key === "cancelCount0" ||
                  _key === "cancelCount1" ||
                  _key === "orderCostOfKm" ||
                  _key === "orderLandingPrice" ||
                  _key === "orderZoneRadius" ||
                  _key === "t0" ||
                  _key === "t1" ||
                  _key === "t2" ||
                  _key === "t3" ||
                  _key === "tSecurityProtocol"
                ) {
                data.id = _key;
                data.value = response;
                Conn.request('setSettings', data);
              }
              
              el.querySelectorAll('span')[0].innerHTML = response === 0 ? 'Выключено' : response;
            });

        }
        
        if (target.dataset.click === "link") {
          goToPage = target.dataset.link;
        }
        
        if (target.dataset.click === "func") {
          eval(target.dataset.func);
        }
        
        if (target.dataset.click === "boolean") {
          el = target;
          _key = el.dataset.key;
          
          Modal.show('<button class="button_rounded--green" data-getvalue=boolean data-value=true>Включить</button>' + 
                     '<button class="button_rounded--grey" data-getvalue=boolean data-value=false>Выключить</button>', 
            function (response) {
              var val = response === "true" ? true : false,
                  data = {};
              
              eval('Parameters.' + _key + ' = ' + val);
              
              if (_key === "disableSafeZoneByPIN") {
                User.isDisableZoneByPin = val;
                data.isDisableZoneByPin = val;
                Conn.request('updateProfile', data);
              }
              
              if (_key === "distributionNearestAgents") {
                User.isAllowSendSos = val;
                data.isAllowSendSos = val;
                Conn.request('updateProfile', data);
              }
              
              if (_key === "enableSosWithoutConn") {
                User.isActivateSosOnDisconnect = val;
                data.isActivateSosOnDisconnect = val;
                Conn.request('updateProfile', data);
              }
              
              el.querySelectorAll('span')[0].innerHTML = val ? 'Включено' : 'Выключено';
            });
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    
    content.addEventListener('click', Event.click);
  }
  
  function stop() {
    Modal.close();
  }
  
  function start() {
    var _el_settings = Dom.sel('.settings'),
        _obj = Parameters,
        _innerText = '';

    for (var key in _obj) {
      var _ins, _click, _res;
      
      if (typeof _obj[key] !== "function" && key !== "label" && key !== "type") {
        if (Parameters.type[key]) {
          
          if (Parameters.type[key] === "select") {
            _ins = ' <span>' + _obj[key] + '</span>';
            _click = ' data-click="' + Settings.type[key]  + '"';
          }
          
          if (Parameters.type[key] === "boolean") {
            _res = 'Выключено';
            
            if (_obj[key]) {
              _res = 'Включено';
            }
            _ins = ' <span>' + _res + '</span>';
            _click = ' data-click="' + Parameters.type[key]  + '"';
          }
          
          if (Parameters.type[key] === "func") {
            _ins = ' <span></span>';
            _click = ' data-click="' + Parameters.type[key]  + '" data-func="' + _obj[key] + '"';
          }
          
          if (Parameters.type[key] === "number") {
            _res = 'Выключено';
            
            if (_obj[key] > 0) {
              _res = _obj[key];
            }
            _ins = ' <span>' + _res + '</span>';
            _click = ' data-click="' + Parameters.type[key]  + '"';
          }
          
          if (Parameters.type[key] === "link") {
            _ins = ' <span></span>';
            _click = ' data-click="' + Parameters.type[key]  + '" data-link="' + _obj[key] + '"';
          }

        }
        
        _innerText += '<p data-key="' + key + '"' + _click + '>' + Parameters.label[key] + _ins + '</p>';
      }
    }

    _el_settings.innerHTML = _innerText;
    
    addEvents();

  }
  
  return {
    start: start,
    clear: stop
  };
    
});

