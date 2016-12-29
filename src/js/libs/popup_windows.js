define(['Dom'], function(Dom) {
  
  var actives_sort = '';
  var actives_filter = {filter:{price:{min:0,max:0},distance:{min:0,max:0},length:{min:0,max:0},stops:{min:0,max:0}}};
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
                    if (buts[i].dataset.sort === actives_sort.sort && buts[i].dataset.r === actives_sort.r) {
                      buts[i].classList.add('active');
                    }
                  }
                  
                  var inputs = new_field.querySelectorAll('input');
                  if (localStorage.getItem('_filters_active')) {
                    actives_filter = JSON.parse(localStorage.getItem('_filters_active'));
                  }
                  for (var i = 0; i < inputs.length; i++) {
                    if (actives_filter.filter.distance.max !== "0" && inputs[i].name === "distance_max") {
                      inputs[i].value = actives_filter.filter.distance.max;
                    }
                    if (actives_filter.filter.distance.min !== "0" && inputs[i].name === "distance_min") {
                      inputs[i].value = actives_filter.filter.distance.min;
                    }
                    if (actives_filter.filter.length.max !== "0" && inputs[i].name === "length_max") {
                      inputs[i].value = actives_filter.filter.length.max;
                    }
                    if (actives_filter.filter.length.min !== "0" && inputs[i].name === "length_min") {
                      inputs[i].value = actives_filter.filter.length.min;
                    }
                    if (actives_filter.filter.price.max !== "0" && inputs[i].name === "price_max") {
                      inputs[i].value = actives_filter.filter.price.max;
                    }
                    if (actives_filter.filter.price.min !== "0" && inputs[i].name === "price_min") {
                      inputs[i].value = actives_filter.filter.price.min;
                    }
                    if (actives_filter.filter.stops.min !== "0" && inputs[i].name === "stops_min") {
                      inputs[i].value = actives_filter.filter.stops.min;
                    }
                    if (actives_filter.filter.stops.max !== "0" && inputs[i].name === "stops_max") {
                      inputs[i].value = actives_filter.filter.stops.max;
                    }
                  }

                  new_field.addEventListener('click', function(event) {
                    var target = event.target;

                    while (target !== this) {
                      if (target) {
                        
                        if (target.dataset.sort) {
                          var _el = target;
                          
                          if (Dom.toggle(_el, 'active')) {
                            actives_sort = '';
                            console.log('click, active, el = ' + _el);
                            for (var i = 0; i < buts.length; i++) {
                              buts[i].classList.remove('active');
                            }
                            
                            //_el.classList.add('active');
                          } else {
                            console.log('click, inactive, el = ' + _el);
                            actives_sort = {sort: _el.dataset.sort, r: _el.dataset.r};
                            //_el.classList.add('active');
                          }
                          
                          callback(actives_sort);
                          close();
                        }
                        
                        actives_filter = {filter:{price:{},distance:{},length:{},stops:{}}};
                        
                        if (target.dataset.click === "getfilters") {
                          var win = Dom.sel('.popup-window');
                          
                          var price_min = parseInt(win.querySelector('[name="price_min"]').value);
                          var price_max = parseInt(win.querySelector('[name="price_max"]').value);
                          if (price_max < price_min) {
                            var t = price_max;
                            price_max = price_min;
                            price_min = t;
                          }
                          actives_filter.filter.price.min = price_min;
                          actives_filter.filter.price.max = price_max;
                          
                          var distance_min = parseInt(win.querySelector('[name="distance_min"]').value);
                          var distance_max = parseInt(win.querySelector('[name="distance_max"]').value);
                          if (distance_max < distance_min) {
                            var t = distance_max;
                            distance_max = distance_min;
                            distance_min = t;
                          }
                          actives_filter.filter.distance.min = distance_min;
                          actives_filter.filter.distance.max = distance_max;
                          
                          var length_min = parseInt(win.querySelector('[name="length_min"]').value);
                          var length_max = parseInt(win.querySelector('[name="length_max"]').value);
                          if (length_max < length_min) {
                            var t = length_max;
                            length_max = length_min;
                            length_min = t;
                          }
                          actives_filter.filter.length.min = length_min;
                          actives_filter.filter.length.max = length_max;
                          
                          var stops_min = parseInt(win.querySelector('[name="stops_min"]').value);
                          var stops_max = parseInt(win.querySelector('[name="stops_max"]').value);
                          if (stops_max < stops_min) {
                            var t = stops_max;
                            stops_max = stops_min;
                            stops_min = t;
                          }
                          actives_filter.filter.stops.min = stops_min;
                          actives_filter.filter.stops.max = stops_max;
                          
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
