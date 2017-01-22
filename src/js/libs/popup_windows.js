define(['Dom', 'Multirange'], function(Dom, Multirange) {
  
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
    var val = parseInt(this.value), intext;
    
    if (val === 0) {
      intext = '';
    } else {
      intext = val;
    }
    this.parentNode.querySelector('span').innerHTML = intext;
  };
  
  function changeValuesFilterArray() {
    var win = Dom.sel('.popup-window');
    var inputs = document.querySelectorAll("input[type=range][multiple]:not(.multirange)");

    for (var i = 0; i < inputs.length; i++) {
      var temp_el = win.querySelector("input[type=range][name=" + inputs[i].name + "][multiple]:not(.multirange)").value;

      var temp = temp_el.split(',');

      switch(inputs[i].name) {
        case 'price':
          actives_filter.filter.price.min = temp[0];
          actives_filter.filter.price.max = temp[1];
          break;
        case 'distance':
          actives_filter.filter.distance.min = temp[0];
          actives_filter.filter.distance.max = temp[1];
          break;
        case 'length':
          actives_filter.filter.length.min = temp[0];
          actives_filter.filter.length.max = temp[1];
          break;
        case 'stops':
          actives_filter.filter.stops.min = temp[0];
          actives_filter.filter.stops.max = temp[1];
          break;
        default:
          break;
      }      
    }
    
    return actives_filter;
  };
  
  function clearValuesFilterArray() {
    var temp_min, temp_max;

    var inputs = document.querySelectorAll("input[type=range][multiple]:not(.multirange)");

    for (var i = 0; i < inputs.length; i++) {
      temp_min = inputs[i].min;
      temp_max = inputs[i].max;
      inputs[i].value = temp_min + ',' + temp_max;

      switch(inputs[i].name) {
        case 'price':
          actives_filter.filter.price.min = temp_min;
          actives_filter.filter.price.max = temp_max;
          break;
        case 'distance':
          actives_filter.filter.distance.min = temp_min;
          actives_filter.filter.distance.max = temp_max;
          break;
        case 'length':
          actives_filter.filter.length.min = temp_min;
          actives_filter.filter.length.max = temp_max;
          break;
        case 'stops':
          actives_filter.filter.stops.min = temp_min;
          actives_filter.filter.stops.max = temp_max;
          break;
        default:
          break;
      }
    }

    return actives_filter;
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
                          
                          Multirange.clear();
                          callback(actives_sort);
                          close();
                        }
                        
                        actives_filter = {filter:{price:{},distance:{},length:{},stops:{}}};
                        
                        if (target.dataset.click === "clearfilters") {
                          
                          actives_filter = clearValuesFilterArray();
                          localStorage.setItem('_filters_active', JSON.stringify(actives_filter));

                          callback(actives_filter);
                          Multirange.reinit();
                          //close();
                        }
                        
                        if (target.dataset.click === "getfilters") {
                          
                          actives_filter = changeValuesFilterArray();
                          localStorage.setItem('_filters_active', JSON.stringify(actives_filter));

                          callback(actives_filter);
                          close();
                        }
                      }

                      target = target.parentNode;
                    }
                  });
                  
                  var i_ranges = Dom.selAll('.popup-window__double-range input');
                  if (i_ranges) {
                    Multirange.init();
                  }
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
