  var Dom = (function() { // nothing

    return {
      selAll: function (sel) {
        return document.querySelectorAll(sel);
      },

      sel: function (sel) {
        return document.querySelector(sel);
      }
    };
  })();
