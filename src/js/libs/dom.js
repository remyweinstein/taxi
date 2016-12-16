define(function() {
  
  var Dom = {

      selAll: function (sel) {
        return document.querySelectorAll(sel);
      },

      sel: function (sel) {
        return document.querySelector(sel);
      },
      
      toggle: function (el, cl) {
        if (el.classList.contains(cl)) {
          el.classList.remove(cl);
          return true;
        } else {
          el.classList.add(cl);
          return false;
        }
      }
    };
  
  return Dom;
  
});
