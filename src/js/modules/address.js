var Address = (function(){
    
    
    return{
        saveAddress: function (adr_from, adr_to){
            localStorage.setItem('_address_from', adr_from);
            localStorage.setItem('_address_to', adr_to);
            return true;
        },

        loadAddress: function (my_city){
            var adr_from = my_city+','+localStorage.getItem('_address_from');
            var adr_to = my_city+','+localStorage.getItem('_address_to');

            return [adr_from, adr_to];
        },

        saveWaypoints: function (adr_to1,adr_to2,adr_to3){
            localStorage.setItem('_address_to1', adr_to1);
            localStorage.setItem('_address_to2', adr_to2);
            localStorage.setItem('_address_to3', adr_to3);

            return true;
        },

        loadWaypoints: function (my_city){
            var wp = [];

            var adr_to1 = localStorage.getItem('_address_to1');
            var adr_to2 = localStorage.getItem('_address_to2');
            var adr_to3 = localStorage.getItem('_address_to3');

            if(adr_to1 !== "") wp.push({location:my_city+','+adr_to1, stopover:true});
            if(adr_to2 !== "") wp.push({location:my_city+','+adr_to2, stopover:true});
            if(adr_to3 !== "") wp.push({location:my_city+','+adr_to3, stopover:true});

            localStorage.removeItem('_address_to1');
            localStorage.removeItem('_address_to2');
            localStorage.removeItem('_address_to3');

            return wp;
        }
    };
    
})();

