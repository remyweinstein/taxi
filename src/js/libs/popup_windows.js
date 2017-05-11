define(['Dom', 'Multirange', 'Storage'], function(Dom, Multirange, Storage) {
  /*
   * 

orderBy[price]=1 - DESC
orderBy[price]=0 - ASC
   * 
   */
  var actives_sort = {orderBy:{price:1}},
      actives_filter = {filter:{price:{min:0,max:0},distance:{min:0,max:0},length:{min:0,max:0},stops:{min:0,max:0}}},
      layer,
      cur_win,
      block = 'content';

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

  function clearLayer(el) {
    el.parentNode.removeChild(el);
  }

  function close() {
    clearLayer(layer);
    cur_win.parentNode.removeChild(cur_win);
    cur_win = null;
  }
  
  function onInputDoubleRange() {
    var first = this.parentNode.querySelectorAll('input')[0],
        second = this.parentNode.querySelectorAll('input')[1],
        max, min,
        intext;
        
    max = parseInt(second.value);
    min = parseInt(first.value);

    if (max < min) {
      max = parseInt(first.value);
      min = parseInt(second.value);
    }
    
    if (max === 0 && min === 0) {
      intext = '';
    } else {
      intext = min + ' - ' + max;
    }
    
    this.parentNode.querySelector('span').innerHTML = intext;
  }

  function onInputRange() {
    var val = parseInt(this.value), 
        intext;
    
    if (val === 0) {
      intext = '';
    } else {
      intext = val;
    }
    
    this.parentNode.querySelector('span').innerHTML = intext;
  }
  
  function changeValuesFilterArray() {
    var win = Dom.sel('.popup-window'),
        inputs = document.querySelectorAll("input[type=range][multiple]:not(.multirange)");

    for (var i = 0; i < inputs.length; i++) {
      var temp_el = win.querySelector("input[type=range][name=" + inputs[i].name + "][multiple]:not(.multirange)").value,
          temp = temp_el.split(',');

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
  }
  
  function clearValuesFilterArray() {
    var temp_min, 
        temp_max,
        inputs = document.querySelectorAll("input[type=range][multiple]:not(.multirange)");

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
  }


  var PopupWindow = {
    show: function (el, content, callback) {
                  var new_field = document.createElement('div'),
                      parentDiv = el.parentNode,
                      height = new_field.offsetHeight,
                      i, i_ranges;
                  
                  layer = showLayer();
                  new_field.className += 'popup-window';
                  new_field.innerHTML = content;
                  parentDiv.insertBefore(new_field, el);
                  //new_field.style.top = -height + 'px';
                  //new_field.style.display = 'block';
                  new_field.style.top = '1.5em';
                  
                  var buts = new_field.querySelectorAll('[data-sort]'),
                      keyka,
                      valeyka;
                  
                  if (Storage.getActiveSortFilters()) {
                    actives_sort = JSON.parse(Storage.getActiveSortFilters());
                  }
                  
                  for (var key in actives_sort.orderBy) {
                    keyka = key;
                    valeyka = actives_sort.orderBy[key];
                  }

                  for (i = 0; i < buts.length; i++) {
                    if (buts[i].dataset.sort === keyka && parseInt(buts[i].dataset.r) === valeyka) {
                      buts[i].classList.add('active');
                    }
                  }
                  
                  var inputs = new_field.querySelectorAll('input');
                  
                  if (Storage.getActiveFilters()) {
                    actives_filter = JSON.parse(Storage.getActiveFilters());
                  }
                  
                  for (i = 0; i < inputs.length; i++) {
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
                    var target = event.target, _el;

                    while (target !== this) {
                      if (target) {
                        
                        if (target.dataset.sort) {
                          _el = target;
                          
                          if (Dom.toggle(_el, 'active')) {
                            actives_sort = {orderBy:{created:0}};
                            for (var i = 0; i < buts.length; i++) {
                              buts[i].classList.remove('active');
                            }
                          } else {
                            actives_sort = JSON.parse('{"orderBy":{"' + _el.dataset.sort + '":' + _el.dataset.r + '}}');
                          }
                          
                          Multirange.clear(Dom.sel('.popup-window'));
                          Storage.setActiveSortFilters(JSON.stringify(actives_sort));
                          callback(actives_sort);
                          close();
                        }
                        
                        actives_filter = {filter:{price:{},distance:{},length:{},stops:{}}};
                        
                        if (target.dataset.click === "clearfilters") {
                          actives_filter = clearValuesFilterArray();
                          Storage.setActiveFilters(JSON.stringify(actives_filter));
                          callback(actives_filter);
                          Multirange.reinit(Dom.sel('.popup-window'));
                          //close();
                        }
                        
                        if (target.dataset.click === "getfilters") {
                          actives_filter = changeValuesFilterArray();
                          Storage.setActiveFilters(JSON.stringify(actives_filter));
                          callback(actives_filter);
                          close();
                        }
                      }

                      target = target.parentNode;
                    }
                  });
                  
                  i_ranges = Dom.selAll('.popup-window__double-range input');

                  if (i_ranges) {
                    Multirange.init(Dom.sel('.popup-window'));
                  }
                  
                  for (i = 0; i < i_ranges.length; i++) {
                    i_ranges[i].addEventListener('input', onInputDoubleRange);
                  }
                  
                  i_ranges = Dom.selAll('.popup-window__range input');
                  
                  for (i = 0; i < i_ranges.length; i++) {
                    i_ranges[i].addEventListener('input', onInputRange);
                  }
                  
                  cur_win = new_field;

    }

  };
  
  return PopupWindow;
  
});
