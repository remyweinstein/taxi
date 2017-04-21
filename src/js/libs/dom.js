define(['Storage'], function(Storage) {
  
  var Dom = {

      selAll: function (sel) {
        return document.querySelectorAll(sel);
      },

      sel: function (sel) {
        return document.querySelector(sel);
      },
      
      selAllIn: function (el, sel) {
        return el.querySelectorAll(sel);
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
      
      historyBack: function () {
        window.location.hash = Storage.getPreviousHistoryPages();
      },
      
      startLoading: function () {
        document.querySelector(".loading").classList.add("active");
        Storage.setStartLoading();
      },

      finishLoading: function () {
        if (Storage.getStartLoading()) {
          document.querySelector(".loading").classList.remove("active");
          Storage.clearStartLoading();
        }
      },
      
      startAgainConnection: function () {
        var el = document.querySelector(".loading");
        
        el.classList.add("active");
        el.innerHTML = '<p>Подождите...</p>';
        Storage.setStartLoading();
      },

      finishAgainConnection: function () {
        if (Storage.getStartLoading()) {
          var el = document.querySelector(".loading");
          
          el.classList.remove("active");
          el.innerHTML = '';
          Storage.clearStartLoading();
        }
      }
    };
  
  return Dom;
  
});
