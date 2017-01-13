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
      },
      
      mapOff: function () {
        document.getElementById('map_canvas').classList.add("hidden");
      },
      
      mapOn: function () {
        document.getElementById('map_canvas').classList.remove("hidden");
        google.maps.event.trigger(map, 'resize'); 
      },
      
      startLoading: function () {
        document.querySelector(".loading").classList.add("active");
      },

      finishLoading: function () {
        document.querySelector(".loading").classList.remove("active");
      }
    };
  
  return Dom;
  
});
