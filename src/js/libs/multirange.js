define(['hammer', 'Funcs'], function (Hammer, Funcs) {

  function enable_multirange(parent, el) {
    var new_field = document.createElement('div');

    Object.defineProperty(el, "value", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this.setAttribute("value", value);
      },
      get: function () {
        return this.getAttribute("value");
      }
    });
    new_field.className += 'range-input';
    new_field.innerHTML = '<input type="text" data-order="min" data-name="' + el.name + '" value="" class="range-input__text" />' +
      '<input type="text" data-order="max" data-name="' + el.name + '" value="" class="range-input__text" />' +
      '<div class="range-input__wrap">' +
      '<div class="range-input__wrap__line">' +
      '<div data-value data-name="' + el.name + '" class="range-input__wrap__line__toddler"></div>' +
      '<div data-value data-name="' + el.name + '" class="range-input__wrap__line__toddler"></div>' +
      '</div>' +
      '</div>';
    el.parentNode.insertBefore(new_field, el);
    addEvents(parent);
    onstartValues(el.name);
  }

  function enable_range(parent, el) {
    var new_field = document.createElement('div');
      
    Object.defineProperty(el, "value", {
      configurable: true,
      enumerable: true,
      set: function (value) {
        this.setAttribute("value", value);
      },
      get: function () {
        return this.getAttribute("value");
      }
    });
    new_field.className += 'range-input';
    new_field.innerHTML = '<div class="range-input__wrap">' +
      '<div class="range-input__wrap__line">' +
      '<div data-value data-name="' + el.name + '" class="range-input__wrap__line__toddler"></div>' +
      '</div>' +
      '</div>';
    el.parentNode.insertBefore(new_field, el);
    addEvents(parent);
    onstartValuesOne(el.name);
  }

  function whatDo(e) {
    var type = e.gesture.srcEvent.type,
        isF = e.gesture.srcEvent.changedPointers,
        el_left = parseFloat(e.target.parentNode.offsetLeft),
        el_width = parseFloat(e.target.offsetWidth),
        whatdo;
      
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
      moveShariki(e.target, (e.gesture.changedPointers[0].clientX - el_left - el_width));
    }
  }

  function moveShariki(el, delta) {
    if (el.dataset.name) {
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
    }
  }

  function handleStart(el) {
    el.classList.add('active');
  }

  function handleEnd(el) {
    if (el.classList) {
      if (el === "document") {
        //e.target.classList.remove('active');
      } else {
        el.classList.remove('active');
      }
    }
  }

  function onstartValues(name) {
    var input = document.querySelector("input[type=range][name=" + name + "][multiple]:not(.multirange)"),
        texts = document.querySelectorAll("input[type=text][data-name=" + name + "]"),
        toggies = document.querySelectorAll("div.range-input__wrap__line__toddler[data-name=" + name + "]"),
        values = input.value.split(',');

    for (var i = 0; i < toggies.length; i++) {
      var width = parseFloat(toggies[i].parentNode.offsetWidth) - parseFloat(toggies[i].offsetWidth),
          position = parseFloat((values[i] / (input.max - input.min)) * width);

      texts[i].value = values[i];
      toggies[i].dataset.value = values[i];
      toggies[i].style.left = position + 'px';
    }

  }

  function onstartValuesOne(name) {
    var input = document.querySelector("input[type=range][name=" + name + "]:not([multiple])"),
        toggies = document.querySelector("div.range-input__wrap__line__toddler[data-name=" + name + "]"),
        width = parseFloat(toggies.parentNode.offsetWidth) - parseFloat(toggies.offsetWidth),
        position = parseFloat((input.value / (input.max - input.min)) * width);

    toggies.dataset.value = input.value;
    toggies.style.left = position + 'px';
  }

  function changeFromClick(event) {
    var el = event.target, element, distance = event.layerX,
        toddlers = el.childNodes;

    if (toddlers[0]) {
      if (!toddlers[1]) {
        element = toddlers[0];
      } else {
        var first_distance = Math.abs(event.layerX - toddlers[0].offsetLeft);
        var second_distance = Math.abs(event.layerX - toddlers[1].offsetLeft);

        if (first_distance < second_distance) {
          element = toddlers[0];
        } else {
          element = toddlers[1];
        }
      }
    }

    handleStart(element);
    moveShariki(element, distance);
    handleEnd(element);
  }

  function changeFromTexts(el) {
    var name = el.target.dataset.name,
        order = el.target.dataset.order,
        value = el.target.value,
        all_shariks = document.querySelectorAll("div.range-input__wrap__line__toddler[data-name=" + name + "]"),
        input = document.querySelector("input[type=range][name=" + name + "][multiple]:not(.multirange)"),
        sharik_min_values = all_shariks[0].dataset.value,
        sharik_max_values = all_shariks[1].dataset.value,
        max = 1, min = 0;

    if (sharik_min_values > sharik_max_values) {
      max = 0;
      min = 1;
    }

    if (order === "max") {
      if (value > input.max) {
        value = input.max;
      }
      all_shariks[max].dataset.value = value;
    } else {
      if (value < input.min) {
        value = input.min;
      }
      all_shariks[min].dataset.value = value;
    }

    changeValueInput(name);
    Multirange.reinit();
  }

  function changeValues(el) {
    if (el.dataset.name) {
      var input = document.querySelector("input[type=range][name=" + el.dataset.name + "][multiple]:not(.multirange)"),
          multi = true;

      if (!input) {
        input = document.querySelector("input[type=range][name=" + el.dataset.name + "]:not([multiple])");
        multi = false;
      }
      
      var max = input.max,
          min = input.min,
          position = parseFloat(el.offsetLeft),
          width = parseFloat(el.parentNode.offsetWidth) - parseFloat(el.offsetWidth),
          chast = position / width,
          value = Math.round((max - min) * chast);

      el.dataset.value = value;

      if (multi) {
        changeValueInput(el.dataset.name);
      } else {
        changeValueOneInput(el.dataset.name);
      }
    }
  }

  function changeValueInput(name) {
    var inputa = document.querySelector("input[type=range][name=" + name + "][multiple]:not(.multirange)"),
        els = document.querySelectorAll("div.range-input__wrap__line__toddler[data-name=" + name + "]"),
        max = parseFloat(els[0].dataset.value),
        min = parseFloat(els[1].dataset.value),
        texts = document.querySelectorAll("input[type=text][data-name=" + name + "]");

    if (min > max) {
      max = [min, min = max][0];
    }
    texts[0].value = min;
    texts[1].value = max;
    inputa.value = min + ',' + max;
  }

  function addEvents(el) {
      var shariki = el.querySelectorAll(".range-input__wrap__line__toddler"),
          texts = el.querySelectorAll("input.range-input__text"),
          lines = el.querySelectorAll(".range-input__wrap");
      document.addEventListener('mouseleave', handleEnd);
      for (i = 0; i < shariki.length; i++) {
        var ev = new Hammer(shariki[i], {domEvents: true});
        shariki[i].addEventListener('hammer.input', whatDo);
      }
      for (i = 0; i < texts.length; i++) {
        texts[i].addEventListener('change', changeFromTexts);
      }
      for (i = 0; i < lines.length; i++) {
        lines[i].addEventListener('click', changeFromClick);
      }
  }

  function changeValueOneInput(name) {
    var inputa = document.querySelector("input[type=range][name=" + name + "]:not([multiple])"),
        els = document.querySelector("div.range-input__wrap__line__toddler[data-name=" + name + "]");

    inputa.value = els.dataset.value;
    Funcs.trigger('change', inputa);
  }

  var Multirange = {
    init: function (el) {
      var inputs = el.querySelectorAll("input[type=range][multiple]:not(.multirange)"),
          input_one = el.querySelectorAll("input[type=range]:not([multiple])"),
          i;

      for (i = 0; i < inputs.length; i++) {
        enable_multirange(el, inputs[i]);
      }
      for (i = 0; i < input_one.length; i++) {
        enable_range(el, input_one[i]);
      }
    },

    reinit: function (el) {
      var inputs = el.querySelectorAll("input[type=range][multiple]:not(.multirange)");

      for (var i = 0; i < inputs.length; i++) {
        onstartValues(inputs[i].name);
      }
    },

    clear: function (el) {
      var i, shariki = el.querySelectorAll(".range-input__wrap__line__toddler"),
          texts = el.querySelectorAll("input.range-input__text"),
          lines = el.querySelectorAll(".range-input__wrap");

      document.removeEventListener('mouseleave', handleEnd);
      for (i = 0; i < shariki.length; i++) {
        shariki[i].removeEventListener('hammer.input', whatDo);
      }
      for (i = 0; i < texts.length; i++) {
        texts[i].removeEventListener('change', changeFromTexts);
      }
      for (i = 0; i < lines.length; i++) {
        lines[i].removeEventListener('click', changeFromClick);
      }
    }
  };

  return Multirange;

});
