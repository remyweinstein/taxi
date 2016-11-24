var Ajax = (function() {
    
    
    return{
        request: function (server, crud, method, token, add_query, data, success){
            token = token===''?'':'?token='+token;
            var xhr = new XMLHttpRequest();
                xhr.open(crud, server+'/'+method+token+add_query, true);
                //xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.onload = function() {
                    if (xhr.status === 200) {
                        var response = JSON.parse(xhr.responseText);
                        success(response);
                    }
                };
                xhr.send(data);
        }
    };
})();

