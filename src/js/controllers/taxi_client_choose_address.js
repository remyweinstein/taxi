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
            /*
            var addr_arr = addr.split(',');

            for (var y = 0; y < addr_arr.length; y++) {
              addr_arr[y] = addr_arr[y].trim();
            }
            var idx_city = addr_arr.indexOf(User.city);
            var address = addr_arr[idx_city-2] ? addr_arr[idx_city-2] + ', ' + addr_arr[idx_city-1] : addr_arr[idx_city-1];
            */
            var lat = results[i].geometry.location.lat();
            var lng = results[i].geometry.location.lng();
            innText += '<p data-latlng="' + lat + '-' + lng + '"><span>' + results[i].name + '</span><span>' + addr + '</span></p>';
          }
          
          result_block.innerHTML = innText;
        }
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          //console.error('status='+status);
          return;
        }
      }

      function callback(results, status) {
        result_block.innerHTML = "";

        if (results.length) {
          var innText = '';
          for (var i = 0; i < results.length; i++) {
            var addr = results[i].vicinity;
            /*
            var addr_arr = addr.split(',');

            for (var y = 0; y < addr_arr.length; y++) {
              addr_arr[y] = addr_arr[y].trim();
            }

            delete addr_arr[y-1];

            var address = addr_arr.join(',');

            if (address.slice(-1)===',') {
              address = address.slice(0, -1);
            }
            */
            if (addr !== "") {
              var lat = results[i].geometry.location.lat();
              var lng = results[i].geometry.location.lng();
              innText += '<p data-latlng="' + lat + '-' + lng + '"><span>' + results[i].name + '</span><span>' + addr + '</span></p>';
            }
          }
          result_block.innerHTML = innText;
        }
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          //console.error('status=' + status);
          return;
        }
      }


      result_block.addEventListener('click', function(e) {
        var target = e.target;

        while (target !== this) {
          if (target.tagName === 'P') {
            localStorage.setItem('_address_' + localStorage.getItem('_address_temp'), target.children[0].innerHTML);
            localStorage.setItem('_address_coord_' + localStorage.getItem('_address_temp'), target.dataset.latlng);
            document.location = '#client__city';
          }

          target = target.parentNode;
        }
      });

    }
