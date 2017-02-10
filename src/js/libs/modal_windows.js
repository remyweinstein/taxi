/* global Event */

define(['Dom'], function(Dom) {
  
  var block = 'content',
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
                        '</table>', function (datetime) {
                                      callback(datetime);
                                    });
                addEvents();
                Calendar(new Date().getFullYear(), new Date().getMonth());
                Dom.sel('.calendar thead tr:nth-child(1) td:nth-child(1)').onclick = function () {
                  Calendar(Dom.sel('.calendar thead td:nth-child(2)').dataset.year, parseFloat(Dom.sel('.calendar thead td:nth-child(2)').dataset.month)-1);
                };
                Dom.sel('.calendar thead tr:nth-child(1) td:nth-child(3)').onclick = function () {
                  Calendar(Dom.sel('.calendar thead td:nth-child(2)').dataset.year, parseFloat(Dom.sel('.calendar thead td:nth-child(2)').dataset.month)+1);
                };
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
