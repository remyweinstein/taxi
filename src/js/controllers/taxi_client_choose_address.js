    var input = Dom.sel('input[name="enter-address"]');
    var result_block = Dom.sel('.choice-location__results-search');
    input.addEventListener('input', onchange);
    onchange();

    function onchange() {
      var query = input.value;
      var pyrmont = {lat: User.lat, lng: User.lng};
      var map = new google.maps.Map(document.getElementById('hide_map'), {
        center: pyrmont,
        zoom: 12
      });
      var service = new google.maps.places.PlacesService(map);
      var requestSt = {
        location: pyrmont,
        radius: 500000,
        query: query
      };
      var request = {
        location: pyrmont,
        radius: 500
      };
      if (input.value && input.value !== "") {
        service.textSearch(requestSt, callbackSt);
      } else {
        service.nearbySearch(request, callback);
      }

      function callbackSt(results, status) {
        result_block.innerHTML = "";
        if (results.length) {
          var innText = '';
          for (var i = 0; i < results.length; i++) {
            var addr = results[i].formatted_address;
            var lat = results[i].geometry.location.lat();
            var lng = results[i].geometry.location.lng();
            innText += '<p data-latlng="' + lat + ',' + lng + '"><span>' + results[i].name + '</span><span>' + addr + '</span></p>';
          }
          
          result_block.innerHTML = innText;
        }
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
      }

      function callback(results, status) {
        result_block.innerHTML = "";

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
          result_block.innerHTML = innText;
        }
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
      }


      result_block.addEventListener('click', function(e) {
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
            
            if (_route === "to_plus1") {
              MyOrder.toAddress1 = target.children[0].innerHTML;
              MyOrder.toCoords1 = target.dataset.latlng;
            }
            
            if (_route === "to_plus2") {
              MyOrder.toAddress2 = target.children[0].innerHTML;
              MyOrder.toCoords2 = target.dataset.latlng;
            }
            
            if (_route === "to_plus3") {
              MyOrder.toAddress3 = target.children[0].innerHTML;
              MyOrder.toCoords3 = target.dataset.latlng;
            }
            
            document.location = '#client__city';
          }

          target = target.parentNode;
        }
      });

    }
