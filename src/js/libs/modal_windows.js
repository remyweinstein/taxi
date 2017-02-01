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

  
  var ModalWindow = {

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
