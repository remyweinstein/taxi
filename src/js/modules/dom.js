define('Dom', [], function() {
  
  var Dom = {

      selAll: function (sel) {
        return document.querySelectorAll(sel);
      },

      sel: function (sel) {
        return document.querySelector(sel);
      }
    };
  
  return Dom;
  
});
