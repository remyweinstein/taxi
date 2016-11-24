var Geo = (function() {
    var old_lat, old_lng;
    
    function updateUserCoord(){
        if(my_position.x!==old_lat || my_position.y!==old_lng){
            Ajax.request(server_uri, 'POST', 'location', my_token, '&latitude='+my_position.x+'&longitude='+my_position.y, '', function(response){
                if(response && response.ok){
                    console.log('change your coord');
                }
            });
        }
    }

    function geoFindMe(){
        if(!navigator.geolocation){
            alert("К сожалению, геолокация не поддерживается в вашем браузере");
            return;
        }
        var options = {
            enableHighAccuracy: true, 
            maximumAge        : 30000, 
            timeout           : 27000
        };
        function success(position) {
            var latitude  = position.coords.latitude;
            var longitude = position.coords.longitude;
            old_lat = my_position.x;
            old_lng = my_position.y;
            my_position.x = latitude;
            my_position.y = longitude;
            localStorage.setItem('_my_pos_lat', latitude);
            localStorage.setItem('_my_pos_lon', longitude);
            updateUserCoord();
            
            if(!my_city){ // TRY FIND CITY, IF !MY_CITY
                geocoder = new google.maps.Geocoder();
                var latlng = new google.maps.LatLng(latitude,longitude);
                geocoder.geocode({
                    'latLng': latlng
                    },function (results, status) {
                        if(status === google.maps.GeocoderStatus.OK){
                            var obj = results[0].address_components,key;
                            for(key in obj) {
                                if(obj[key].types[0]==="locality" && !my_city) {
                                    my_city = obj[key].long_name;
                                    localStorage.setItem('_my_city', my_city);
                                        var data = new FormData();
                                            data.append('name', my_name);
                                            data.append('city', my_city);
                                        Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(response){
                                            console.log('after geofind = '+response.ok);
                                            if(response && response.ok) {
                                                init();
                                            }
                                        });
                                }
                                if(obj[key].types[0]==="country") my_coutry = obj[key].long_name;
                            }
                        }
                    });
            }
        };
        function error() {
            alert("На вашем устройстве не разрешен доступ к местоположению.");
        };
        navigator.geolocation.getCurrentPosition(success, error);
        //navigator.geolocation.watchPosition(success, error, options);
    }

    
    return{
        
        init: function(){
            timerUpdateCoords = setInterval(geoFindMe, 5000);
            geoFindMe();
        }
        
    };
})();
