  var Funcs = (function() { //nothing

    return {
      searchCityForIntercity: function (city, parent) {
        var currentCity;
        var li = parent.children[1].children;

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
        var height = el.offsetHeight;
        var styles = getComputedStyle(el);
         height += parseInt(styles.marginTop) + parseInt(styles.marginBottom);
        
        return height;
      }
      
    };
  })();

