define(function() {
  
  var Funcs = {
      trigger: function (ev, el) {
        var event; // The custom event that will be created

        if (document.createEvent) {
          event = document.createEvent("HTMLEvents");
          event.initEvent(ev, true, true);
        } else {
          event = document.createEventObject();
          event.eventType = ev;
        }

        event.eventName = ev;

        if (document.createEvent) {
          el.dispatchEvent(event);
        } else {
          el.fireEvent("on" + event.eventType, event);
        }

      },
      
      searchCityForIntercity: function (city, parent) {
        var currentCity,
            li = parent.children[1].children;

        for (var i = 0; i < li.length; i++) {
          currentCity = li[i].children[1].children[3].innerHTML;
          
          if(currentCity === city || city === '') {
            li[i].style.display = 'flex';
          } else {
            li[i].style.display = 'none';
          }
          
        }
      },

      // HEIGHT ELEMENT WITH MARGINS
      outerHeight: function (el) {
        var height = el.offsetHeight,
            styles = getComputedStyle(el);
          
        height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);
        
        return height;
      },
      
      //SEARCH ELEMENT OF ARRAY FOR 'ID'
      findIdArray: function(arr, find) {
        for (var i = 0; i < arr.length; i++) {
          if (arr[i].id === find) {
            return i;
          }
        }
        
        return false;
      }
      
  };
  
    return Funcs;
  
  });

