define(['Dom'], function(Dom) {
  
  var clPopupWindow = function () {
    var self = this;
    var block = 'content';
    
    this.actives_sort = '';
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
                  
                  var buts = new_field.querySelectorAll('[data-sort]');
                  for (var i = 0; i < buts.length; i++) {
                    if (buts[i].dataset.sort === self.actives_sort) {
                      buts[i].classList.add('active');
                    }
                  }

                  new_field.addEventListener('click', function(event) {
                    var target = event.target;

                    while (target !== this) {
                      if (target) {
                        if(target.dataset.sort) {
                          var _el = target;
                          for (var i = 0; i < buts.length; i++) {
                            buts[i].classList.remove('active');
                          }
                          if (Dom.toggle(_el, 'active')) {
                            self.actives_sort = '';
                          } else {
                            self.actives_sort = _el.dataset.sort;
                            _el.classList.add('active');
                          }
                          
                          callback(self.actives_sort);
                          self.close();
                        }
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
