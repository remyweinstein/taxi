define(['Storage'], function(Storage) {
  
  var Redirect = {
    check: function (currentHash) {
      if (Storage.getTripClient() && currentHash !== "#client_go") {
        window.location.hash = "#client_go";
      }

      if (Storage.getTripDriver() && currentHash !== "#driver_go") {
        window.location.hash = "#driver_go";
      }

    }
  };
  
	return Redirect;
});