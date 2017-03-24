/* global Event */

define(['Dom'], function(Dom) {
  
  var block = 'dynamic',
      layer,
      cur_win;
    
  function close() {
    clearLayer();
    cur_win.parentNode.removeChild(cur_win);
    cur_win = null;
  }

  function moveCenter(el) {
    var height = getHeight(el),
        height_window = window.innerHeight,
        margin = (height_window - height) / 2;

    el.style.top = margin + 'px';
  }

  function getHeight(el) {
    var height = el.offsetHeight,
        styles = getComputedStyle(el);
    
    height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);

    return height;
  }

  function showLayer() {
    var el = Dom.sel('.' + block),
        new_field = document.createElement('div'),
        parentDiv = el.parentNode;
      
    new_field.className += 'grey-layer';
    parentDiv.insertBefore(new_field, el);
    new_field.addEventListener('click', function() {
      close();
    });

    return new_field;
  }

  function clearLayer() {
    layer.parentNode.removeChild(layer);
  }
  
  function Clock() {
    var currentdate = new Date(),
        hour = currentdate.getHours(),
        min = currentdate.getMinutes(),
        newDiv = document.createElement('div');
      
    hour = hour < 10 ? '0' + hour : hour;
    min = min < 10 ? '0' + min : min;
          
    newDiv.innerHTML =  '<div class="clock">' + 
                          '<span class="clock__hour">' + 
                            '<span class="clock__hour__value">' + hour + '</span>' + 
                            '<span data-click="hour-up" class="clock__hour__up"></span>' + 
                            '<span data-click="hour-down" class="clock__hour__down"></span>' + 
                          '</span>' + 
                          '<span>:</span>' + 
                          '<span class="clock__min">' + 
                            '<span class="clock__min__value">' + min + '</span>' + 
                            '<span data-click="min-up" class="clock__min__up"></span>' + 
                            '<span data-click="min-down" class="clock__min__down"></span>' + 
                          '</span>' + 
                        '</div>';
    
    return newDiv;
  }
  
  function hourUp() {
    Dom.sel('.clock__hour__value').innerHTML = checkHours(parseInt(Dom.sel('.clock__hour__value').innerHTML) + 1);
    return;
  }
  
  function hourDown() {
    Dom.sel('.clock__hour__value').innerHTML = checkHours(parseInt(Dom.sel('.clock__hour__value').innerHTML) - 1);
    return;
  }
  
  function minUp() {
    Dom.sel('.clock__min__value').innerHTML = checkMinutes(parseInt(Dom.sel('.clock__min__value').innerHTML) + 1);
    return;
  }
  
  function minDown() {
    Dom.sel('.clock__min__value').innerHTML = checkMinutes(parseInt(Dom.sel('.clock__min__value').innerHTML) - 1);
    return;
  }
  
  function checkMinutes(value) {
    value = value > 59 ? 0 : value;
    value = value < 0 ? 59 : value;
    value = value < 10 ? '0' + value : value;
    
    return value;
  }
  
  function checkHours(value) {
    value = value > 23 ? 0 : value;
    value = value < 0 ? 23 : value;
    value = value < 10 ? '0' + value : value;
    
    return value;
  }
  
  function Calendar(year, month) {
    var Dlast = new Date(year, month + 1, 0).getDate(),
        D = new Date(year, month, Dlast),
        YearCurrent = new Date().getFullYear(),
        MonthCurrent = new Date().getMonth(),
        DNlast = new Date(D.getFullYear(), D.getMonth(), Dlast).getDay(),
        DNfirst = new Date(D.getFullYear(), D.getMonth(), 1).getDay(),
        calendar = '<tr>', i,
        months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];
      
    if (MonthCurrent > month && YearCurrent.toString() === year.toString()) {
      return;
    }
    if (DNfirst !== 0) {
      for (i = 1; i < DNfirst; i++) {
        calendar += '<td data-click="get-date">';
      }
    } else {
      for (i = 0; i < 6; i++) {
        calendar += '<td data-click="get-date">';
      }
    }
    
    for (i = 1; i <= Dlast; i++) {
      if (i === new Date().getDate() && D.getFullYear() === new Date().getFullYear() && D.getMonth() === new Date().getMonth()) {
        calendar += '<td data-click="get-date" class="today">' + i;
      } else if (i < new Date().getDate() && D.getFullYear() === new Date().getFullYear() && D.getMonth() === new Date().getMonth()) {
        calendar += '<td>&nbsp;';
      } else {
        calendar += '<td data-click="get-date">' + i;
      }
      if (new Date(D.getFullYear(), D.getMonth(), i).getDay() === 0) {
        calendar += '<tr>';
      }
    }
    
    for (i = DNlast; i < 7; i++) {
      calendar += '<td>&nbsp;';
    }
    
    Dom.sel('.calendar tbody').innerHTML = calendar;
    
    Dom.sel('.calendar thead td:nth-child(2)').innerHTML = months[D.getMonth()] + ' ' + D.getFullYear();
    Dom.sel('.calendar thead td:nth-child(2)').dataset.month = D.getMonth();
    Dom.sel('.calendar thead td:nth-child(2)').dataset.year = D.getFullYear();
    if (Dom.selAll('.calendar tbody tr').length < 6) {
      Dom.sel('.calendar tbody').innerHTML += '<tr><td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;<td>&nbsp;';
    }
  }
  
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
        if (target) {          
          if (target.dataset.click === 'get-date') {
            var value = target.innerHTML;
            if (value) {
              var tds = Dom.selAll('.calendar tbody td');
              
              for (var i = 0; i < tds.length; i++) {
                if (tds[i].classList.contains('today')) {
                  tds[i].classList.remove('today');
                }
              }
              target.classList.add('today');
            }
            
            break;
          }
          
          if (target.dataset.click === 'hour-up') {
            hourUp();
            break;
          }
          
          if (target.dataset.click === 'hour-down') {
            hourDown();
            break;
          }
          
          if (target.dataset.click === 'min-up') {
            minUp();
            break;
          }
          
          if (target.dataset.click === 'min-down') {
            minDown();
            break;
          }
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    
    Dom.sel('.modal-window').addEventListener('click', Event.click);
  }
  
  var ModalWindow = {
    calendar: function (callback) {
                this.show('<table class="calendar">' +
                            '<thead>' +
                              '<tr><td><<td colspan="5"><td>>' +
                              '<tr><td>Пн<td>Вт<td>Ср<td>Чт<td>Пт<td>Сб<td>Вс' +
                            '<tbody>' +
                          '</table>' +
                          '<div style="position:relative;top:-1em;">' +
                            '<button data-getvalue="datetime" class="button_short--green">Сохранить</button>' +
                          '</div>', function (datetime) {
                                        callback(datetime);
                                      });
                Dom.sel('.calendar').parentNode.insertBefore(Clock(), null);
                addEvents();
                Calendar(new Date().getFullYear(), new Date().getMonth());
                Dom.sel('.calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function () {
                  Calendar(Dom.sel('.calendar thead td:nth-child(2)').dataset.year, parseFloat(Dom.sel('.calendar thead td:nth-child(2)').dataset.month)-1);
                };
                Dom.sel('.calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function () {
                  Calendar(Dom.sel('.calendar thead td:nth-child(2)').dataset.year, parseFloat(Dom.sel('.calendar thead td:nth-child(2)').dataset.month)+1);
                };
    },
    checkPin: function (callback) {
                this.show('<h4>Введите PIN</h4>' +
                          '<div class="pin_window">' +
                            '<input type="text" data-count_digits="4" data-keypress="input_only_digits" name="pin"/>' +
                          '</div>' +
                          '<div style="position:relative;">' +
                            '<button data-click="check-pin" class="button_short--green">Отправить</button>' +
                          '</div>', function (response) {
                                        callback(response);
                                      });
    },
    createPin: function (callback) {
                this.show('<h4>Новый PIN</h4>' +
                          '<div class="pin_window">' +
                            '<input type="text" data-count_digits="4" data-keypress="input_only_digits" name="new_pin"/>' +
                          '</div>' +
                          '<div style="position:relative;">' +
                            '<button data-click="create-pin" class="button_short--green">Сохранить</button>' +
                          '</div>', function (response) {
                                        callback(response);
                                      });
    },
    changePin: function (callback) {
                this.show('<h4>Новый PIN</h4>' +
                          '<div class="pin_window">' +
                            '<input type="text" data-count_digits="4" data-keypress="input_only_digits" name="old_pin"/>' +
                          '</div>' +
                          '<h4>Старый PIN</h4>' +
                          '<div class="pin_window">' +
                            '<input type="text" data-count_digits="4" data-keypress="input_only_digits" name="new_pin"/>' +
                          '</div>' +
                          '<div style="position:relative;">' +
                            '<button data-click="change-pin" class="button_short--green">Сохранить</button>' +
                          '</div>', function (response) {
                                        callback(response);
                                      });
    },
    show: function (content, callback) {
                  layer = showLayer();
                  var el = Dom.sel('.' + block),
                      parentDiv = el.parentNode,
                      new_field = document.createElement('div');
                  
                  new_field.className += 'modal-window';
                  new_field.innerHTML = content;
                  parentDiv.insertBefore(new_field, el);

                  new_field.addEventListener('click', function(event) {
                    var target = event.target, _el;

                    while (target !== this) {
                      if (target.dataset.response) {
                        _el = target;
                        
                        callback(_el.dataset.response);
                        close();
                      }
                      
                      if (target.dataset.click === "check-pin") {
                        callback({pin:Dom.sel('input[name="pin"]').value});
                        close();
                      }
                      
                      if (target.dataset.click === "change-pin") {
                        callback({newPin:Dom.sel('input[name="new_pin"]').value, oldPin:Dom.sel('input[name="old_pin"]').value});
                        close();
                      }
                      
                      if (target.dataset.click === "create-pin") {
                        callback({newPin:Dom.sel('input[name="new_pin"]').value});
                        close();
                      }
                      
                      if (target.dataset.getvalue === "datetime") {
                        var min = Dom.sel('.clock__min__value').innerHTML,
                            hour = Dom.sel('.clock__hour__value').innerHTML,
                            day = Dom.sel('.today').innerHTML,
                            month = parseInt(Dom.sel('.calendar thead td:nth-child(2)').dataset.month) + 1,
                            year = Dom.sel('.calendar thead td:nth-child(2)').dataset.year;
                          
                        month = parseInt(month) < 10 ? '0' + month : month;
                        callback(year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':00');
                        close();
                      }
                      
                      if (target.dataset.getvalue === "select") {
                        _el = target;

                        callback(_el.dataset.value);
                        close();
                      }

                      if (target.dataset.getvalue === "val") {
                        _el = target;
                        
                        callback(_el.parentNode.querySelectorAll('[name="val"]')[0].value);
                        close();
                      }

                      if (target.dataset.getvalue === "boolean") {
                        _el = target;

                        callback(_el.dataset.value);
                        close();
                      }
                        
                      target = target.parentNode;
                    }
                  });  

                  moveCenter(new_field);

                  cur_win = new_field;

    }

  };
  
  return ModalWindow;
  
});
