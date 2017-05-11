/* global Event */

define(['Dom', 'Stars'], function(Dom, Stars) {
  
  var block = 'dynamic',
      layer,
      cur_win;
    
  function close() {
    clearLayer();
    if (cur_win) {
      cur_win.parentNode.removeChild(cur_win);
      cur_win = null;
    }
  }

  function moveCenter(el) {
    var height = getHeight(el),
        height_window = window.innerHeight,
        margin = (height_window - height) / 2 + window.pageYOffset;

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
    //var layer = Dom.selAll('.grey-layer')[0];
    //console.log('layer = ', layer);
    if (layer && layer !== "undefined" && layer.parentNode) {
      layer.parentNode.removeChild(layer);
    }
  }
  
  function Clock() {
    var currentdate = new Date(),
        hour = currentdate.getHours(),
        min = currentdate.getMinutes(),
        newDiv = document.createElement('div');
      
    hour = hour < 10 ? '0' + hour : hour;
    min  = min < 10 ? '0' + min : min;
          
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
  
  function roundFive(a) {
    var b = a % 5;
    b && (a = a - b + 5);
    
    return a;
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
    var minutes = parseInt(Dom.sel('.clock__min__value').innerHTML);
    
    if (minutes % 5 !== 0) {
      minutes = roundFive(minutes);
    }
    
    minutes = minutes >= 55 ? -5: minutes;
    
    if (minutes === -5) {
      hourUp();
    }
    
    Dom.sel('.clock__min__value').innerHTML = checkMinutes(minutes + 5);
    return;
  }
  
  function minDown() {
    var minutes = parseInt(Dom.sel('.clock__min__value').innerHTML);
    
    if (minutes % 5 !== 0) {
      minutes = roundFive(minutes);
    }
    
    minutes = minutes <= 5 ? 60: minutes;
    
    if (minutes === 60) {
      hourDown();
    }
    
    Dom.sel('.clock__min__value').innerHTML = checkMinutes(minutes - 5);
    return;
  }
  
  function checkMinutes(value) {
    var currentdate = new Date(),
        day         = currentdate.getDate(),
        month       = currentdate.getMonth(),
        year        = currentdate.getFullYear(),
        hour        = currentdate.getHours(),
        sel_hour    = parseInt(Dom.sel('.clock__hour__value').innerHTML),
        sel_day     = parseInt(Dom.sel('td.today').innerHTML),
        sel_month   = parseInt(Dom.sel('.calendar__date_selected').dataset.month),
        sel_year    = parseInt(Dom.sel('.calendar__date_selected').dataset.year),
        min         = currentdate.getMinutes();
          
    if (day === sel_day && month === sel_month && year === sel_year && hour === sel_hour && value < min) {
      value = min;
    }
    
    
    
    value = value > 59 ? 0 : value;
    value = value < 0 ? 30 : value;
    value = value < 10 ? '0' + value : value;
    
    return value;
  }
  
  function checkHours(value) {
    var currentdate = new Date(),
        day         = currentdate.getDate(),
        month       = currentdate.getMonth(),
        year        = currentdate.getFullYear(),
        sel_day     = parseInt(Dom.sel('td.today').innerHTML),
        sel_month   = parseInt(Dom.sel('.calendar__date_selected').dataset.month),
        sel_year    = parseInt(Dom.sel('.calendar__date_selected').dataset.year),
        hour        = currentdate.getHours();
    
    if (day === sel_day && month === sel_month && year === sel_year && value < hour) {
      value = hour;
    }
    
    value = value > 23 ? 23 : value;
    value = value < 0 ? 0 : value;
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
  
  function clock30(diff) {
    
  }

  function date30(diff) {
    
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
    plusTime: function (callback) {
                this.show('<table class="plusHalfHour">' +
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
                                      
                Dom.sel('.plusHalfHour').parentNode.insertBefore(Clock(), null);
                addEvents();
                date30();
                Dom.sel('.plusHalfHour .plus30').onclick = function () {
                  clock30(+30);
                };
                Dom.sel('.plusHalfHour .minus30').onclick = function () {
                  clock30(-30);
                };
    },
    ratingOrder: function (id, agentId, role, callback) {
                this.show('<div class="score-agent">' +
                              '<div class="score-agent__but-box"></div>' +
                              '<div class="score-agent__stars" data-view="stars">' +
                                  '<i class="icon-star score-agent__stars__star active" data-id="0" data-view="star"></i>' +
                                  '<i class="icon-star score-agent__stars__star active" data-id="1" data-view="star"></i>' +
                                  '<i class="icon-star score-agent__stars__star active" data-id="2" data-view="star"></i>' +
                                  '<i class="icon-star score-agent__stars__star active" data-id="3" data-view="star"></i>' +
                                  '<i class="icon-star score-agent__stars__star active" data-id="4" data-view="star"></i>' +
                              '</div>' +
                              '<textarea class="score-agent__text"></textarea>' +
                              '<button class="button_wide--yellow" data-agent-id="' + agentId + '" data-click="save_rating">Сохранить</button>' +
                          '</div>', function () {
                                        Stars.stop();
                                        callback();
                                      });

                var bl = Dom.sel('.score-agent__but-box'),
                    innertext = '<i class="icon-star" data-click="tofavorites"></i>' +
                                '<i class="icon-block" data-click="toblacklist"></i>' +
                                '<i class="icon-address-card-o" data-click="sharecard"></i>' +
                                '<i class="icon-attention" data-click="tofeedback"></i>' +
                                '<i class="icon-eye" data-click="peoplescontrol"></i>' +
                                '<i class="icon-clipboard" data-click="claimcheck"></i>';
                Stars.init(role);
                bl.innerHTML = innertext;

    },
    calendar: function (callback) {
                this.show('<table class="calendar">' +
                            '<thead>' +
                              '<tr><td><<td colspan="5" class="calendar__date_selected"><td>>' +
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
                            '<button data-click="save-create-pin" class="button_short--green">Сохранить</button>' +
                          '</div>', function (response) {
                                        callback(response);
                                        close();
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
                            '<button data-click="save-change-pin" class="button_short--green">Сохранить</button>' +
                          '</div>', function (response) {
                                        callback(response);
                                        close();
                                      });
    },
    enterPhone: function (callback) {
                this.show('<h4>Введите номер телефона:</h4>' +
                          '<div class="pin_window">' +
                            '+7 <input type="text" data-keypress="input_only_digits" name="invite-agent-phone"/>' +
                          '</div>' +
                          '<div style="position:relative;">' +
                            '<button data-click="invite-agent-send" class="button_short--green">Пригласить</button>' +
                          '</div>', function (response) {
                                        callback(response);
                                        close();
                                      });
    },
    show: function (content, callback) {
                  var el = Dom.sel('.' + block),
                      parentDiv = el.parentNode,
                      new_field = document.createElement('div');
                  
                  layer = showLayer();
                  new_field.className += 'modal-window';
                  new_field.innerHTML = content;
                  parentDiv.insertBefore(new_field, el);

                  new_field.addEventListener('click', function(event) {
                    var target = event.target;

                    while (target !== this) {
                      
                      if (target.dataset.response) {
                        callback(target.dataset.response);
                        close();
                        break;
                      }
                      
                      if (target.dataset.click === "close") {
                        callback(true);
                        close();
                        break;
                      }
                      
                      if (target.dataset.click === "invite-agent-send") {
                        callback(Dom.sel('input[name="invite-agent-phone"]').value);
                        close();
                        break;
                      }
                      
                      if (target.dataset.click === "check-pin") {
                        callback({pin:Dom.sel('input[name="pin"]').value});
                        close();
                        break;
                      }
                      
                      if (target.dataset.click === "save-change-pin") {
                        callback({newPin:Dom.sel('input[name="new_pin"]').value, oldPin:Dom.sel('input[name="old_pin"]').value});
                        close();
                        break;
                      }
                      
                      if (target.dataset.click === "save-create-pin") {
                        callback({newPin:Dom.sel('input[name="new_pin"]').value});
                        close();
                        break;
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
                        break;
                      }
                      
                      if (target.dataset.getvalue === "select") {
                        callback(target.dataset.value);
                        close();
                        break;
                      }

                      if (target.dataset.getvalue === "val") {
                        callback(target.parentNode.querySelectorAll('[name="val"]')[0].value);
                        close();
                        break;
                      }

                      if (target.dataset.getvalue === "boolean") {
                        callback(target.dataset.value);
                        close();
                        break;
                      }
                        
                      target = target.parentNode;
                    }
                  });  

                  moveCenter(new_field);

                  cur_win = new_field;

    },
    
    close: function() {
      close();
    }

  };
  
  return ModalWindow;
  
});
