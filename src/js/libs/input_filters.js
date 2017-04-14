define(['Dom'], function(Dom) {
  
    function only_digits(e) {
      if(e.ctrlKey || e.altKey || e.metaKey) return;
      
      var chr = getChar(e);
      
      if (chr < '0' || chr > '9') {
        e.preventDefault();
      }
      
      return;
    }
    
    function count_digits(e, target) {
      var count = parseInt(target.dataset.count_digits),
          value = target.value;
        
      if (value) {
        if (value.length > (count-1)) {
          e.preventDefault();
        }
      }

    }

    function only_date(e, target) {
      var text = target.value,
          chr  = getChar(e);

      if (e.ctrlKey || e.altKey || e.metaKey || e.key === "Backspace") {
        return;
      }
      
      if (text.length > 9) {
        e.preventDefault();
      }
      
      if ( (text.length === 0 && chr > '3') || 
           ( (text.length === 3 || text.length === 2) && chr > '1' ) || 
           ( (text.length === 5 || text.length === 6) && chr > '2' ) ||
           (text.length === 4 && text[3] === "1" && chr > '2')) {
            e.preventDefault();
          }
      
      if (text.length === 2 || text.length === 5) {
        target.value += ".";
      }
      
      if (chr < '0' || chr > '9') {
        e.preventDefault();
      }
      
    }

    function getChar (event) {
      if (event.which === null) {
        if (event.keyCode < 32) return null;
        
        return String.fromCharCode(event.keyCode);
      }
      if (event.which !== 0) {
              // && event.charCode !== 0){
          if (event.which < 32) return null;
          
          return String.fromCharCode(event.which);
      }
      
      return null;
    }

  
  var InputFilters = {
    init: function() {
            Dom.sel('.content').addEventListener('keypress', function(e) {
              var target = e.target;

              while (target !== this) {
                    // = Input Filtering ONLY DIGITS =
                if (target.dataset.keypress === 'input_only_digits') {
                  only_digits(e);
                }
                    // = Input Filtering COUNT DIGITS =
                if (target.dataset.count_digits !== '') {
                  count_digits(e, target);
                }
                    // = Input Filtering ONLY DATE =
                if (target.dataset.keypress === 'input_only_date') {
                  only_date(e, target);
                }

                target = target.parentNode;
              }
            });
          }
  };
  
  return InputFilters;
  
});
