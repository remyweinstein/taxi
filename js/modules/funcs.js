var Funcs = (function() {
    
    
    return{
        renderDirections: function (map, result, polylineOpts) {
            var directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            if(polylineOpts) {
                directionsRenderer.setOptions({
                    polylineOptions: polylineOpts
                });
            }
            directionsRenderer.setDirections(result);
        },
        requestDirections: function (directionsService, start, end, polylineOpts) {
            directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.DirectionsTravelMode.DRIVING
            }, function(result) {
                renderDirections(result, polylineOpts);
            });
        },
        getChar: function (event){
          if (event.which === null){
            if (event.keyCode < 32) return null;
            return String.fromCharCode(event.keyCode);
          }
          if (event.which !== 0){
                  //&& event.charCode !== 0){
            if (event.which < 32) return null;
            return String.fromCharCode(event.which);
          }
          return null;
        },
        setTempRequestLS: function (val){
            localStorage.setItem('_temp_request', val);
            return true;
        },
        getTempRequestLS: function (){
            var val = localStorage.getItem('_temp_request');
            localStorage.removeItem('_temp_request');
            return val;
        },
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
        },

        point2LatLng: function (x, y, map) {
          var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
          var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
          var scale = Math.pow(2, map.getZoom());
          var worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);
          return map.getProjection().fromPointToLatLng(worldPoint);
        },

        getStreetFromGoogle: function (results){
            var obj = results[0].address_components,key,address;
            for(key in obj) {
                if(obj[key].types[0]==="street_number") address = obj[key].long_name;
                if(obj[key].types[0]==="route") address = obj[key].long_name + ',' + address;
            }
            return address;
        },

        searchCityForIntercity: function (city, parent){
            var currentCity;
            var li = parent.children[1].children;
            for(var i=0; i<li.length; i++){
                currentCity = li[i].children[1].children[3].innerHTML;
                if(currentCity === city || city === '') {
                    li[i].style.display = 'flex';
                } else {
                    li[i].style.display = 'none';
                }
            }
        },
        // HEIGHT ELEMENT WITH MARGINS
        outerHeight: function (el) {
            var height = el.offsetHeight;
            var style = getComputedStyle(el);
            height += parseInt(style.marginTop) + parseInt(style.marginBottom);
            return height;
        }
    };
})();
