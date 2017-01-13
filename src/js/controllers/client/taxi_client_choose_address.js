define(['Dom'], function (Dom) {
  
  var _timer;
    
  function onchange() {
    clearTimeout(_timer);

    var query     = Dom.sel('input[name="enter-address"]').value;
    var MyLatLng  = new google.maps.LatLng(User.lat, User.lng);
    var service   = new google.maps.places.PlacesService(map);
    var requestSt = {
      location: MyLatLng,
      radius: 50000,
      query: query
    };
    var request   = {
      location: MyLatLng,
      radius: 500
    };

    if (Dom.sel('input[name="enter-address"]').value && Dom.sel('input[name="enter-address"]').value !== "") {
      _timer = setTimeout(startSearch, 1000);
    } else {
      service.nearbySearch(request, callback);
    }

    function startSearch() {
      service.textSearch(requestSt, callbackSt);
    }

    function callbackSt(results, status) {
      Dom.sel('.choice-location__results-search').innerHTML = "";
      if (results.length) {
        var innText = '';
        for (var i = 0; i < results.length; i++) {
          var addr = results[i].formatted_address;
          var lat = results[i].geometry.location.lat();
          var lng = results[i].geometry.location.lng();
          innText += '<p data-latlng="' + lat + ',' + lng + '"><span>' + results[i].name + '</span><span>' + addr + '</span></p>';
        }

        Dom.sel('.choice-location__results-search').innerHTML = innText;
      }
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
    }

    function callback(results, status) {
      Dom.sel('.choice-location__results-search').innerHTML = "";

      if (results.length) {
        var innText = '';
        for (var i = 0; i < results.length; i++) {
          var addr = results[i].vicinity;
          if (addr !== "") {
            var lat = results[i].geometry.location.lat();
            var lng = results[i].geometry.location.lng();
            innText += '<p data-latlng="' + lat + ',' + lng + '"><span>' + results[i].name + '</span><span>' + addr + '</span></p>';
          }
        }
        Dom.sel('.choice-location__results-search').innerHTML = innText;
      }
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
    }

  }
  
  function addEvents() {
    Dom.sel('.choice-location__results-search').addEventListener('click', function(e) {
      var target = e.target;

      while (target !== this) {
        if (target.tagName === 'P') {
          var _route = localStorage.getItem('_address_temp');

          if (_route === "from") {
            MyOrder.fromAddress = target.children[0].innerHTML;
            MyOrder.fromCoords = target.dataset.latlng;
          }

          if (_route === "to") {
            MyOrder.toAddress = target.children[0].innerHTML;
            MyOrder.toCoords = target.dataset.latlng;
          }

          var substr = _route.substring(0, 7);
          if (substr === "to_plus") {
            var _index = _route.replace("to_plus", "");

            MyOrder.toAddresses[_index] = target.children[0].innerHTML;
            MyOrder.toCoordses[_index] = target.dataset.latlng;
          }

          window.location.hash = '#client_city';
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    });
  }
  
  function stop() {

  }
  
  function start() {
    var input = Dom.sel('input[name="enter-address"]');
  
    input.value = localStorage.getItem('_address_string_temp');
    input.addEventListener('input', onchange);
    input.addEventListener('touchstart', function() {
      this.focus();
    });
    
    try {
      var event = new Event("touchstart");
    }
    catch (e) {
      var event = document.createEvent('Event');
      event.initEvent("touchstart", true, true);
    }

    input.dispatchEvent(event);

    onchange();
    
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});