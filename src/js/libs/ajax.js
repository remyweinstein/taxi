define(['Uries', 'Dom'], function(Uries, Dom) {
  
  var Ajax = {

    request: function (crud, method, token, add_query, data, success, error) {
      //Dom.sel(".loading").style.visibility = "visible";
      token = token === '' ? '' : '?token=' + token;
      var xhr = new XMLHttpRequest();
        xhr.open(crud, Uries.server_uri + '/' + method + token + add_query, true);
        //xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = function() {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);

            success(response);
          }
          //Dom.sel(".loading").style.visibility = "hidden";
        };
        xhr.onerror = function() {            
          error();
          //Dom.sel(".loading").style.visibility = "hidden";
        };

        xhr.send(data);
    }

  };
  
	return Ajax;
  
});