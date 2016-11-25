var InpFlt = (function() {

    function only_digits(e){
        if(e.ctrlKey || e.altKey || e.metaKey) return;
        var chr = getChar(e);
        if(chr < '0' || chr > '9'){
            e.preventDefault();
        }
        return;
    };

    function only_date(e, target){
        var text = target.value;
        if(text.length>9){
            e.preventDefault();
        }
        if(e.ctrlKey || e.altKey || e.metaKey) return;
        var chr = getChar(e);
        if((text.length===0 && chr>'3') || ((text.length===3||text.length===2) && chr>'1') || ((text.length===5||text.length===4) && chr>'2')){
            e.preventDefault();
        }
        if(text.length===2 || text.length===5){
            target.value += ".";
        }
        if(chr < '0' || chr > '9'){
            e.preventDefault();
        }
    };

    
    function getChar (event){
        if (event.which === null){
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode);
        }
        if (event.which !== 0){
                // && event.charCode !== 0){
            if (event.which < 32) return null;
            return String.fromCharCode(event.which);
        }
        return null;
    };

    
    return{
        init: function(){
                document.querySelector('.content').addEventListener('keypress', function(e){
                    var target = e.target;
                    while(target !== this){
                            // = Input Filtering ONLY DIGITS =
                        if (target.dataset.keypress === 'input_only_digits') { only_digits(e); }
                            // = Input Filtering ONLY DATE =
                        if (target.dataset.keypress === 'input_only_date') { only_date(e, target); }
                        target = target.parentNode;
                    }
                });
            }
    };
})();
