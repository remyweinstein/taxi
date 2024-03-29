/* global Maps, User */

define(['Dom', 'Storage', 'DriverOffer', 'ClientOrder'], function (Dom, Storage, clDriverOffer, clClientOrder) {
  
  var _timer, Model, city;
    
  function onchange() {
    var list_results = Dom.sel('.choice-location__results-search'),
        input = Dom.sel('input[name="enter-address"]'),
        query = input.value,
        innText = '',
        currentCity = city || User.city;
    
    list_results.innerHTML = "";
    _timer = clearTimeout(_timer);    

    if (query !== "") {
      _timer = setTimeout(startSearch, 1000);
    } else {
      Maps.searchPlaces('', 500, currentCity, callback);
    }

    function startSearch() {
      Maps.searchStreet(query, 5000, currentCity, callback);
    }

    function callback(results) {
      if (results) {
        var temp_arr = [];

        for (var i = 0; i < results.length; i++) {
          if (temp_arr.indexOf(results[i].name) < 0) {
            temp_arr.push(results[i].name);
            innText += '<p data-city="' + results[i].city + '" data-latlng="' + results[i].lat + ',' + results[i].lng + '"><span>' + results[i].name + '</span><span>' + results[i].address + '</span></p>';
          }
        }
        
        list_results.innerHTML = innText;
      }
    }

  }
  
  function addEvents() {
    Dom.sel('.choice-location__results-search').addEventListener('click', function(e) {
      var target = e.target;

      while (target !== this) {
        if (target.tagName === 'P') {
          var _route = Storage.getTemporaryRoute();
          if (_route === "from") {
            Model.fromAddress = target.children[0].innerHTML;
            Model.fromCoords = target.dataset.latlng;
            Model.fromCity = target.dataset.city;
          }

          if (_route === "to") {
            Model.toAddress = target.children[0].innerHTML;
            Model.toCoords = target.dataset.latlng;
            Model.toCity = target.dataset.city;
          }

          var substr = _route.substring(0, 7);
          
          if (substr === "to_plus") {
            var _index = _route.replace("to_plus", "");
            
            Model.points[_index].address = target.children[0].innerHTML;
            Model.points[_index].location = target.dataset.latlng;
          }
          
          var linkaType  = Storage.getActiveTypeTaxi()==="taxi"  ? "city" : Storage.getActiveTypeTaxi(),
              linka = Storage.getActiveTypeModelTaxi()==="order" ? "client_" + linkaType : Storage.getUserRole()==="driver" ? "driver_new_offer" : "client_offer";
          
          goToPage = '#' + linka;
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    });
  }
  
  function findChanges() {
    var old_Model,
        model = Storage.getActiveTypeModelTaxi();
    
    if (model === "offer") {
      old_Model = new clDriverOffer();
    } else if (model === "order") {
      old_Model = new clClientOrder();
    }
    
    old_Model.activateCurrent();
    
    if (old_Model.fromCoords !== Model.fromCoords || old_Model.toCoords !== Model.toCoords) {
      Storage.setChangeLocations();
    }
  }
  
  function stop() {
    Storage.lullModel(Model);
    Storage.removeTemporaryAddress();
    Storage.removeTemporaryRoute();
    findChanges();
    Storage.removeUserRole();
    //Storage.removeActiveTypeModelTaxi();
  }
  
  function start() {
    var input = Dom.sel('input[name="enter-address"]'),
        event,
        model = Storage.getActiveTypeModelTaxi();
      
    if (model === "offer") {
      Model = new clDriverOffer();
    } else if (model === "order") {
      Model = new clClientOrder();
    }
    
    if (Storage.getUserRole() === "client" && model === "offer") {
      Model = new clClientOrder();
    }
    
    Model.activateCurrent();
    city = Storage.getTemporaryRoute()==="from" ? Model.fromCity : Model.toCity;
    input.value = Storage.getTemporaryAddress();
    input.addEventListener('input', onchange);
    input.addEventListener('touchstart', function() {
      this.focus();
    });
    
    try {
      event = new Event("touchstart");
    }
    catch (e) {
      event = document.createEvent('Event');
      event.initEvent("touchstart", true, true);
    }

    //input.dispatchEvent(event);
    onchange();
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});