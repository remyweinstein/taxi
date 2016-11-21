var Funcs = (function() {
    
    
    return{
        
        getChar: function (event){
          if (event.which === null){
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode);
          }
          if (event.which !== 0){
                  //&& event.charCode !== 0){
            if (event.which < 32) return null;
            return String.fromCharCode(event.which);
          }
          return null;
        },
        
        setTempRequestLS: function (val){
            localStorage.setItem('_temp_request', val);
            return true;
        },
        
        getTempRequestLS: function (){
            var val = localStorage.getItem('_temp_request');
            localStorage.removeItem('_temp_request');
            return val;
        },
        
        searchCityForIntercity: function (city, parent){
            var currentCity;
            var li = parent.children[1].children;
            for(var i=0; i<li.length; i++){
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
            var style = getComputedStyle(el);
            height += parseInt(style.marginTop) + parseInt(style.marginBottom);
            return height;
        }
    };
})();

