define(['Dom'], function(Dom) {
  
  var clPopupWindow = function () {
    var self = this;
    var block = 'content';
    
    this.layer;
    this.cur_win;

    this.show = function (el, content, callback) {
                  self.layer = showLayer();
                  var new_field = document.createElement('div');
                    new_field.className += 'popup-window';
                    new_field.innerHTML = content;

                  var parentDiv = el.parentNode;
                    parentDiv.insertBefore(new_field, el);
                    
                  var height = new_field.offsetHeight;
                  //new_field.style.top = -height + 'px';
                  //new_field.style.display = 'block';
                  new_field.style.top = '0';

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

                  self.cur_win = new_field;

    };

    this.close = function () {
      clearLayer(self.layer);
      self.cur_win.parentNode.removeChild(self.cur_win);
      self.cur_win = null;
    };

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
  
  return clPopupWindow;
  
});
