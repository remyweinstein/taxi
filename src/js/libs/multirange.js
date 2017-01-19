define(['hammer'], function(Hammer) {

  function enable_multirange(el) {
    var parentDiv = el.parentNode;
    var name = el.name;
    
    Object.defineProperty( el, "value", {
      configurable: true,
      enumerable: true,
      set: function( value ) {
        this.setAttribute( "value", value );
      },
      get: function() {
        return this.getAttribute( "value" );
      }
    });
    
    var new_field = document.createElement('div');
    new_field.className += 'range-input';
    new_field.innerHTML = '<div class="range-input__line">\n\
                            <div data-value data-name="' + name + '" class="range-input__line__toddler"></div>\n\
                            <div data-value data-name="' + name + '" class="range-input__line__toddler"></div>\n\
                          </div>';
    
    parentDiv.insertBefore(new_field, el);
    onstartValues(name);
  };
  
  function whatDo(e) {
    var type = e.gesture.srcEvent.type;
    var isF = e.gesture.srcEvent.changedPointers;
    var whatdo;
    var el_left = parseFloat(e.target.parentNode.offsetLeft);
    var el_width = parseFloat(e.target.offsetWidth);
    
    if (type === "pointerdown" || type === "mousedown" || type === "touchstart") {
      handleStart(e.target);
    }
    
    if (type === "pointerup" || type === "mouseup" || type === "touchend") {
      handleEnd(e.target);
    }
    
    if (type === "pointermove" || type === "mousemove" || type === "touchmove") {
      whatdo = 'move';
      if (isF) { 
        if (isF[0].isFinal) {
          handleEnd(e.target);
        }
      }
    }
    
    if (whatdo === 'move') {
      moveSharik(e.target, (e.gesture.changedPointers[0].clientX - el_left - el_width));
    }
  };
  
  function moveSharik(el, delta) {
    var max_left = el.parentNode.offsetWidth - el.offsetWidth;
    
    if (el.classList.contains('active')) {
      if (delta < 0) {
        delta = 0;
      }
      
      if (delta > max_left) {
        delta = max_left;
      }
      
      el.style.left = delta + 'px';
      changeValues(el);
    }
  };
  
  function handleStart(el) {
    el.classList.add('active');
  };
  
  function handleEnd(el) {
    if (el === "document") {
      //e.target.classList.remove('active');
    } else {
      el.classList.remove('active');
    }
  };
  
  function onstartValues(name) {
    var input = document.querySelector("input[type=range][name=" + name + "][multiple]:not(.multirange)");
    var values = input.value;
        values = values.split(',');
    var max = input.max;
    var min = input.min;
    var toggies = document.querySelectorAll("div.range-input__line__toddler[data-name=" + name + "]");
    
    for (var i = 0; i < toggies.length; i++) {
      var width = parseFloat(toggies[i].parentNode.offsetWidth) - parseFloat(toggies[i].offsetWidth);
      var position = parseFloat((values[i] / (max - min)) * width);
      
      toggies[i].dataset.value = values[i];
      toggies[i].style.left = position + 'px';
    }
    
  };
  
  function changeValues(el) {
    var input = document.querySelector("input[type=range][name=" + el.dataset.name + "][multiple]:not(.multirange)");
    var max = input.max;
    var min = input.min;
    var position = parseFloat(el.offsetLeft);
    var width = parseFloat(el.parentNode.offsetWidth) - parseFloat(el.offsetWidth);
    var chast = position / width;
    var value = Math.round((max - min) * chast);
    
    el.dataset.value = value;
    
    changeValueInput(el.dataset.name);
  };
  
  function changeValueInput(name) {
    var inputa = document.querySelector("input[type=range][name=" + name + "][multiple]:not(.multirange)");
    var els = document.querySelectorAll("div.range-input__line__toddler[data-name=" + name + "]");
    var max = parseFloat(els[0].dataset.value);
    var min = parseFloat(els[1].dataset.value);
    
    if (min > max) {
      max = [min, min = max][0];
    }
    
    inputa.value = min + ',' + max;
  };

  var Multirange = {
    init: function() {
      var inputs = document.querySelectorAll("input[type=range][multiple]:not(.multirange)");
      
      for (var i = 0; i < inputs.length; i++) {
        enable_multirange(inputs[i]);
      }
      
      document.addEventListener('mouseleave', handleEnd);
      var shariki = document.querySelectorAll(".range-input__line__toddler");
      for (var i = 0; i < shariki.length; i++) {
        var ev = new Hammer(shariki[i], {domEvents: true});
        shariki[i].addEventListener('hammer.input', whatDo);
      }

    },
    
    clear: function() {
      document.removeEventListener('mouseleave', handleEnd);
      var shariki = document.querySelectorAll(".range-input__line__toddler");
      for (var i = 0; i < shariki.length; i++) {
        shariki[i].removeEventListener('hammer.input', whatDo);
      }
    }
  };
  
  return Multirange;

});
