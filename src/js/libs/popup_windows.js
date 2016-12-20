define(['Dom'], function(Dom) {
  
  var actives_sort = '';
  var actives_filter = {price_min:0,price_max:0,distance_min:0,distance_max:0,length_min:0,length_max:0,stops:0};
  var layer;
  var cur_win;
  var block = 'content';

  function showLayer() {
    var el = Dom.sel('.' + block);
    var new_field = document.createElement('div');
      new_field.className += 'grey-layer';

    var parentDiv = el.parentNode;
      parentDiv.insertBefore(new_field, el);

    new_field.addEventListener('click', function() {
      close();
    });

    return new_field;
  }

  function clearLayer(el) {
    el.parentNode.removeChild(el);
  }

  function close() {
    clearLayer(layer);
    cur_win.parentNode.removeChild(cur_win);
    cur_win = null;
  };
  
  function onInputDoubleRange() {
    
    var first = this.parentNode.querySelectorAll('input')[0];
    var second = this.parentNode.querySelectorAll('input')[1];
    var max, min;
        
      max = parseInt(second.value);
      min = parseInt(first.value);

    if (max < min) {
      max = parseInt(first.value);
      min = parseInt(second.value);
    }
    if (max === 0 && min === 0) {
      var intext = '';
    } else {
      var intext = min + ' - ' + max;
    }
    this.parentNode.querySelector('span').innerHTML = intext;

  };

  function onInputRange() {
    var val = parseInt(this.value);
    
    if (val === 0) {
      var intext = '';
    } else {
      var intext = val;
    }
    this.parentNode.querySelector('span').innerHTML = intext;

  };

  var PopupWindow = {
    
    show: function (el, content, callback) {
                  layer = showLayer();
                  var new_field = document.createElement('div');
                    new_field.className += 'popup-window';
                    new_field.innerHTML = content;

                  var parentDiv = el.parentNode;
                    parentDiv.insertBefore(new_field, el);
                    
                  var height = new_field.offsetHeight;
                  //new_field.style.top = -height + 'px';
                  //new_field.style.display = 'block';
                  new_field.style.top = '0';
                  
                  var buts = new_field.querySelectorAll('[data-sort]');
                  for (var i = 0; i < buts.length; i++) {
                    if (buts[i].dataset.sort === actives_sort) {
                      buts[i].classList.add('active');
                    }
                  }
                  
                  var inputs = new_field.querySelectorAll('input');
                  if (localStorage.getItem('_filters_active')) {
                    actives_filter = JSON.parse(localStorage.getItem('_filters_active'));
                  }
                  for (var i = 0; i < inputs.length; i++) {
                    if (actives_filter.distance_max !== "0" && inputs[i].name === "distance_max") {
                      inputs[i].value = actives_filter.distance_max;
                    }
                    if (actives_filter.distance_min !== "0" && inputs[i].name === "distance_min") {
                      inputs[i].value = actives_filter.distance_min;
                    }
                    if (actives_filter.length_max !== "0" && inputs[i].name === "length_max") {
                      inputs[i].value = actives_filter.length_max;
                    }
                    if (actives_filter.length_min !== "0" && inputs[i].name === "length_min") {
                      inputs[i].value = actives_filter.length_min;
                    }
                    if (actives_filter.price_max !== "0" && inputs[i].name === "price_max") {
                      inputs[i].value = actives_filter.price_max;
                    }
                    if (actives_filter.price_min !== "0" && inputs[i].name === "price_min") {
                      inputs[i].value = actives_filter.price_min;
                    }
                    if (actives_filter.stops !== "0" && inputs[i].name === "stops") {
                      inputs[i].value = actives_filter.stops;
                    }
                  }

                  new_field.addEventListener('click', function(event) {
                    var target = event.target;

                    while (target !== this) {
                      if (target) {
                        if (target.dataset.sort) {
                          var _el = target;
                          
                          for (var i = 0; i < buts.length; i++) {
                            buts[i].classList.remove('active');
                          }
                          if (Dom.toggle(_el, 'active')) {
                            actives_sort = '';
                          } else {
                            actives_sort = _el.dataset.sort;
                            _el.classList.add('active');
                          }
                          
                          callback(actives_sort);
                          close();
                        }
                        
                        actives_filter = {};
                        
                        if (target.dataset.click === "getfilters") {
                          var win = Dom.sel('.popup-window');
                          
                          var price_min = win.querySelector('[name="price_min"]').value;
                          actives_filter.price_min = price_min;
                          
                          var price_max = win.querySelector('[name="price_max"]').value;
                          actives_filter.price_max = price_max;
                          
                          var distance_min = win.querySelector('[name="distance_min"]').value;
                          actives_filter.distance_min = distance_min;
                          
                          var distance_max = win.querySelector('[name="distance_max"]').value;
                          actives_filter.distance_max = distance_max;
                          
                          var length_min = win.querySelector('[name="length_min"]').value;
                          actives_filter.length_min = length_min;
                          
                          var length_max = win.querySelector('[name="length_max"]').value;
                          actives_filter.length_max = length_max;
                          
                          var stops = win.querySelector('[name="stops"]').value;                          
                          actives_filter.stops = stops;
                          
                          localStorage.setItem('_filters_active', JSON.stringify(actives_filter));

                          callback(actives_filter);
                          close();
                        }
                      }

                      target = target.parentNode;
                    }
                  });
                  
                  var i_ranges = Dom.selAll('.popup-window__double-range input');
                  for (var i = 0; i < i_ranges.length; i++) {
                    i_ranges[i].addEventListener('input', onInputDoubleRange);
                  }
                  
                  var i_ranges = Dom.selAll('.popup-window__range input');
                  for (var i = 0; i < i_ranges.length; i++) {
                    i_ranges[i].addEventListener('input', onInputRange);
                  }
                  
                  cur_win = new_field;

    }

  };
  
  return PopupWindow;
  
});
