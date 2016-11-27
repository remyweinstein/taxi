var lasturl='',sublasturl='';
var lastsection='';
var map, map_choice, marker, geocoder;
var google, placeSearch, autocomplete, directionsService;
var my_position = ["x","y"];
var server_uri = 'https://192.168.20.90';
//var home_server = 'https://indriver.ru';
var home_server = 'https://192.168.20.29';
var agent_id,my_city,my_country,my_token,is_auth=false;
var my_name, my_phone, my_avatar, my_vehicle;
var bid_id;
var default_avatar = 'asset/images/no_avatar.png';
var default_vehicle = 'asset/images/no_vehicle.png';
var google_api_key = 'AIzaSyC-BLqmxD2e02-BpXmG5McwKx6P1sH4nC4';
var timerSearchDriver,timerGetBidsTaxy,timerGetBidGo,timerUpdateTaxiDriverOrder;

//= modules/dom.js
//= modules/ajax.js
//= modules/inputfilter.js
//= modules/geo.js
//= modules/address.js
//= modules/dates.js
//= modules/funcs.js
//= modules/maps.js
//= modules/menu.js
//= modules/tabs.js
//= modules/router.js


document.addEventListener('DOMContentLoaded', function(){
    
    my_city = localStorage.getItem('_my_city');
    agent_id = localStorage.getItem('_agent_id');
    my_position.x = localStorage.getItem('_my_pos_lat');
    my_position.y = localStorage.getItem('_my_pos_lon');    
        
    if(localStorage.getItem('_is_auth')==="true"){
        is_auth = true;
    }
    my_token = localStorage.getItem('_my_token');
    if(!my_token){
        Ajax.request(server_uri, 'GET', 'token', '', '', '', function(response){
            if(response && response.ok){
                localStorage.setItem('_my_token', response.token);
                my_token = response.token;
                localStorage.setItem('_agent_id', response.id);
                agent_id = response.id;
                my_name = 'Гость';
                    var data = new FormData();
                        data.append('name', my_name);
                    Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(response){
                        if(response && response.ok){
                            init();
                        }
                    });
            }
        });
    }
        
    Geo.init();
    MainMenu.init();
    InpFlt.init();
    Router.init();

    // = On Resize Window =
    window.addEventListener('resize', function() {
        init();
    });

});

function init(){
    
    clearInterval(timerSearchDriver);
    clearInterval(timerGetBidsTaxy);
    clearInterval(timerGetBidGo);
    clearInterval(timerUpdateTaxiDriverOrder);
    
    Tabs.init();
    
    // =Change height '.content'=
    Dom.sel('.content').style.height = (window.innerHeight - Funcs.outerHeight(Dom.sel('.header')))+'px';
    // ==========================
    if(Dom.sel('.menu__list__item_login')){
        if(is_auth){
            Dom.sel('.menu__list__item_login').style.display = 'none';
            Dom.sel('.menu__list__item_logout').style.display = 'block';
        } else {
            Dom.sel('.menu__list__item_login').style.display = 'block';
            Dom.sel('.menu__list__item_logout').style.display = 'none';
        }
    }

    if(my_token){
        Ajax.request(server_uri, 'GET', 'profile', my_token, '', '', function(response){
            if(response){
                if(!response.ok && lasturl !== "#pages__sms"){
                    is_auth = false;
                    my_token = "";
                    localStorage.removeItem('_is_auth');
                    // localStorage.removeItem('_my_token');
                } else {
                    var prfl = response.profile
                    localStorage.setItem('_agent_id', prfl.id);
                    agent_id = prfl.id;
                    //console.log('from profile ... ' + JSON.stringify(response));
                    my_phone = prfl.phone;
                    my_name = prfl.name!==""?prfl.name:my_name;
                    my_city = prfl.city!==""?prfl.city:my_city;
                    localStorage.setItem('_my_city', my_city);
                    my_avatar = prfl.photo;
                    my_vehicle = prfl.vehicle;
                    if(Dom.selAll('.jq_my_name').length){
                        Dom.sel('.jq_my_name').innerHTML = my_name;
                        Dom.sel('.jq_my_phone').innerHTML = my_phone;
                        if(!my_avatar){
                            my_avatar = default_avatar;
                        }
                        Dom.sel('.menu__desc_avatar').src = my_avatar;
                    }
                }
            }
        });
    }
    
    // = Form edit profile =
    if(Dom.selAll('[data-controller="pages_edit_profile"]').length){
        //= controllers/pages_edit_profile.js
    }  

    if(Dom.sel('[data-controller="pages_login"]')){
        //= controllers/pages_login.js
    }

    if(Dom.selAll('[data-controller="pages_logout"]').length){
        //= controllers/pages_logout.js
    }
    
    if(Dom.sel('[data-controller="pages_sms"]')){
        //= controllers/pages_sms.js
    }
    
    if(Dom.selAll('[data-controller="taxi_client_intercity"]').length){
        //= controllers/taxi_client_intercity.js
    }

    if(Dom.selAll('[data-controller="taxi_client_go"]').length){
        //= controllers/taxi_client_go.js
    }
    
    if(Dom.selAll('[data-controller="taxi_client_my_orders"]').length){
        //= controllers/taxi_client_my_orders.js
    }

    if(Dom.selAll('[data-controller="taxi_client_choose_address"]').length){
        //= controllers/taxi_client_choose_address.js
    }
    
    if(Dom.selAll('[data-controller="taxi_client_city"]').length){
        //= controllers/taxi_client_city.js
    }
    
    if(Dom.selAll('[data-controller="taxi_client_choice_location_map"]').length){
        //= controllers/taxi_client_choice_location_map.js
    }
    
    if(Dom.selAll('[data-controller="taxi_client_map"]').length){
        //= controllers/taxi_client_map.js
    }
    // = Form edit auto =
    if(Dom.selAll('[data-controller="taxi_driver_my_auto"]').length){
        //= controllers/taxi_driver_my_auto.js
    }

    if(Dom.selAll('[data-controller="taxi_driver_go"]').length){
        //= controllers/taxi_driver_go.js
    }
    
    if(Dom.selAll('[data-controller="taxi_driver_city"]').length){
        //= controllers/taxi_driver_city.js
    }
    
    if(Dom.selAll('[data-controller="taxi_driver_intercity"]').length){
        //= controllers/taxi_driver_intercity.js
    }
    
}