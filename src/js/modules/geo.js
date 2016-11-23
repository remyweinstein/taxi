var Geo = (function() {
    
    
    return{
        
        updateUserCoord: function(){
            Ajax.request(server_uri, 'POST', 'location', my_token, '&latitude='+my_position.x+'&longitude='+my_position.y, '', function(response){
                if(response && response.ok){}
            });
        }
        
    };
})();
