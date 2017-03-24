/* global MyOrder, Maps */

define(['Dom'], function (Dom) {
  
  var _timer, Model, model;
    
  function onchange() {
    var list_results = Dom.sel('.choice-location__results-search'),
        input = Dom.sel('input[name="enter-address"]'),
        query = input.value,
        innText = '';
    
    list_results.innerHTML = "";
    clearTimeout(_timer);    

    if (query !== "") {
      _timer = setTimeout(startSearch, 1000);
    } else {
      Maps.searchPlaces('', 500, callback);
    }

    function startSearch() {
      Maps.searchStreet(query, 5000, callback);
    }

    function callback(results) {
      if (results) {
        for (var i = 0; i < results.length; i++) {
          innText += '<p data-latlng="' + results[i].lat + ',' + results[i].lng + '"><span>' + results[i].name + '</span><span>' + results[i].address + '</span></p>';
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
          var _route = localStorage.getItem('_address_temp');

          if (_route === "from") {
            Model.fromAddress = target.children[0].innerHTML;
            Model.fromCoords = target.dataset.latlng;
          }

          if (_route === "to") {
            Model.toAddress = target.children[0].innerHTML;
            Model.toCoords = target.dataset.latlng;
          }

          var substr = _route.substring(0, 7);
          if (substr === "to_plus") {
            var _index = _route.replace("to_plus", "");

            Model.toAddresses[_index] = target.children[0].innerHTML;
            Model.toCoordses[_index] = target.dataset.latlng;
          }

          Dom.historyBack();
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
    model = localStorage.getItem('_active_model');

    if (model === "offer") {
      MyOffer = Model;
    } else {
      MyOrder = Model;
    }
    
    localStorage.removeItem('_active_model');
  }
  
  function start() {
    var input = Dom.sel('input[name="enter-address"]'),
        event;

    model = localStorage.getItem('_active_model');
    
    if (model === "offer") {
      Model = MyOffer;
    } else {
      Model = MyOrder;
    }
  
    input.value = localStorage.getItem('_address_string_temp');
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