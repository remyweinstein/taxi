define(['Dom'], function(Dom) {
  
  var clModalWindow = function () {
    var self = this;
    var block = 'content';
    var layer, cur_win;

    this.show = function (content, callback) {
                  layer = showLayer();
                  var el = Dom.sel('.' + block);
                  var new_field = document.createElement('div');
                    new_field.className += 'modal-window';
                    new_field.innerHTML = content;

                  var parentDiv = el.parentNode;
                    parentDiv.insertBefore(new_field, el);

                  new_field.addEventListener('click', function(event) {
                    var target = event.target;

                    while (target !== this) {
                      if(target.dataset.response) {
                        var _el = target;
                        callback(target.dataset.response);
                        self.close();
                      }

                      if(target.dataset.getvalue === "val") {
                        var _el = target;
                        callback(_el.parentNode.querySelectorAll('[name="val"]')[0].value);
                        self.close();
                      }

                      target = target.parentNode;
                    }
                  });  

                  moveCenter(new_field);

                  cur_win = new_field;

    };

    this.close = function () {
      clearLayer(layer);
      cur_win.parentNode.removeChild(cur_win);
      cur_win = null;
    };

    function moveCenter(el) {
      var height = getHeight(el);
      var height_window = window.innerHeight;
      var margin = (height_window - height) / 2;

      el.style.top = margin + 'px';
    }

    function getHeight(el) {
      var height = el.offsetHeight;
      var styles = getComputedStyle(el);
        height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);

      return height;
    }

    function showLayer() {
      var el = Dom.sel('.' + block);
      var new_field = document.createElement('div');
        new_field.className += 'grey-layer';

      var parentDiv = el.parentNode;
        parentDiv.insertBefore(new_field, el);

      new_field.addEventListener('click', function() {
        self.close();
      });

      return new_field;
    }

    function clearLayer(el) {
      el.parentNode.removeChild(el);
    }

  };
  
  return clModalWindow;
  
});
