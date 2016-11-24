var lasturl='',sublasturl='';
var lastsection='';
var map, map_choice, marker, geocoder;
var google, placeSearch, autocomplete, directionsService;
var my_position = ["x","y"];
var server_uri = 'https://192.168.20.90';
//var home_server = 'https://indriver.ru';
var home_server = 'https://192.168.20.29';
var agent_id,my_city,my_country,my_token,is_auth=false;
var my_name, my_phone, my_avatar;
var bid_id;
var default_avatar = 'asset/images/no_avatar.png';
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


document.addEventListener('DOMContentLoaded', function(){
    
    my_city = localStorage.getItem('_my_city');
    agent_id = localStorage.getItem('_agent_id');
    
    MainMenu.init();
    
    my_position.x = localStorage.getItem('_my_pos_lat');
    my_position.y = localStorage.getItem('_my_pos_lon');    

    if(localStorage.getItem('_is_auth')==="true"){
        is_auth = true;
    }
    my_token = localStorage.getItem('_my_token');
    if(!my_token){
        Ajax.request(server_uri, 'GET', 'token', '', '', '', function(response){
            //console.log('try get token... response: ' + JSON.stringify(response));
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
    
    // =================
    var content = Dom.sel('.content');
        content.addEventListener('click', function(event){
            var target = event.target;
            while(target !== this){
                
                    // Click taxi_driver arrived
                if(target.dataset.click==="driver-arrived"){
                    var el = target;
                    Ajax.request(server_uri, 'POST', 'arrived-bid', my_token, '&id='+bid_id, '', function(response){
                        Ajax.request(server_uri, 'GET', 'bid', my_token, '&id='+bid_id, '', function(response){
                            //console.log('click driver arrived = '+JSON.stringify(response));
                        });
                    });
                }

                    // Click taxi_client in car
                if(target.dataset.click==="client-incar"){
                    var el = target;
                    Ajax.request(server_uri, 'POST', 'in-car-bid', my_token, '&id='+bid_id, '', function(response){
                        Ajax.request(server_uri, 'GET', 'bid', my_token, '&id='+bid_id, '', function(response){
                            //console.log('click client incar = '+JSON.stringify(response));
                        });
                    });
                }
                
                    // Click taxi_bid
                if(target.dataset.click==="taxi_bid"){
                    var el = target;
                    if(el.classList.contains('active')) {
                        Ajax.request(server_uri, 'POST', 'delete-bid', my_token, '&id='+el.dataset.id, '', function(response){
                            if(response && response.ok){
                                el.classList.remove('active');
                            }
                        });
                    } else {
                        Ajax.request(server_uri, 'POST', 'bid', my_token, '&id='+el.dataset.id, '', function(response){
                            //console.log(JSON.stringify('mess = '+response.messages));
                            if(response && response.ok){
                                el.classList.add('active');
                            }
                        });
                    }
                }
                
                    // Click Client BID
                if(target.dataset.click==="taxi_client_bid"){
                    var el = target;
                    Ajax.request(server_uri, 'POST', 'approve-bid', my_token, '&id='+el.dataset.id, '', function(response){
                        //console.log(response);
                        if(response && response.ok){
                            localStorage.setItem('_current_id_bid',el.dataset.id);
                            document.location = "#client__go";
                        }
                    });
                }
                
                    // = Click choose location =
                if(target.dataset.click === 'choice_location'){
                    document.location = '#client__choice_location_map';
                    Funcs.setTempRequestLS(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
                    return;
                }
                    // = Form add new point order =
                if(target.dataset.click === 'field_add'){
                    var just_add = Dom.selAll('.icon-record').length;
                    if(just_add < 3) {
                        var el = Dom.sel('.order-city-to');                        
                        var new_field = document.createElement('div');
                            new_field.className += 'form-order-city__field order-city-from';
                            new_field.innerHTML = '<i class="icon-record form-order-city__label"></i><span class="form-order-city__wrap"><input type="text" name="to_plus'+(just_add+1)+'" value="" placeholder="Заезд"/></span><span data-click="field_delete" class="form-order-city__field_delete"><i class="icon-trash"></i></span>';
                            var parentDiv = el.parentNode;
                            parentDiv.insertBefore(new_field, el);


                    }
                    return;
                }
                        // = Form delete point order =
                    if(target.dataset.click === 'field_delete'){
                        var be_dead = target.parentNode;
                        be_dead.parentNode.removeChild(be_dead);
                        return;
                    }

                    // = Delete Photo Edit Profile =
                if(target.dataset.click === 'clear_photo'){
                    Ajax.request(server_uri, 'POST', 'clear-photo', my_token, '', '', function(response){
                        if(response && response.ok){
                            Dom.sel('.avatar').src = default_avatar;
                        }
                    });
                    return;
                }
                
                    // = I choose location =
                if(target.dataset.click === 'i_choice_location'){
                    document.location = '#client__city';
                    var name = Funcs.getTempRequestLS();
                    geocoder = new google.maps.Geocoder();
                    var latl = localStorage.getItem('_choice_coords');
                        latl = latl.replace("(","");
                        latl = latl.replace(")","");
                        latl = latl.replace(" ","");
                        latl = latl.split(",");
                    var latlng = new google.maps.LatLng(latl[0],latl[1]);

                    geocoder.geocode({
                        'latLng': latlng
                    },function (results, status){
                        if(status === google.maps.GeocoderStatus.OK){
                            localStorage.setItem('_address_'+name, Maps.getStreetFromGoogle(results));
                            Dom.sel('input[name="from"]').value = localStorage.getItem('_address_from');
                            Dom.sel('input[name="to"]').value = localStorage.getItem('_address_to');
                        }
                      });
                    return;
                }
                
                    // = Menu my Orders Item =
                if(target.dataset.click === 'myorders_item_menu'){
                    var menu = target.parentNode.children[1];
                    var currentState = menu.style.display;
                    if(currentState === 'none' || currentState === ''){
                        menu.style.display = 'inline-block';
                    } else {
                        menu.style.display = 'none';
                    }
                    return;
                }
                        // = Menu my Orders Item DELETE order =
                    if(target.dataset.click === 'myorders_item_menu_delete'){
                        Ajax.request(server_uri, 'GET', 'delete-order', my_token, '&id='+target.dataset.id, '', function(response){
                            if(response && response.ok){
                                var item = target.parentNode.parentNode.parentNode;
                                    item.style.display = 'none';
                            }
                        });
                    return;
                    }

                target = target.parentNode;
            }
        });
   //
   // =================
   
        content.addEventListener('submit', function(event){
            var target = event.target;
            while(target !== this){
                
                    // = Form Taxy Client City =
                if(target.dataset.submit === 'taxy-client-city'){
                    var from_address = Dom.sel('.adress_from').value;
                    var to_address = Dom.sel('.adress_to').value;
                    var price = Dom.sel('[name="cost"]').value;
                    var comment = Dom.sel('[name="description"]').value;
                    var to1="",to2="",to3="";
                    var data = new FormData();
                    
                    Address.saveAddress(from_address, to_address);

                    if(Dom.sel('[name="to_plus1"]')){
                        to1 = Dom.sel('[name="to_plus1"]').value;
                        data.append('toAddress1', to1);
                    }
                    if(Dom.sel('[name="to_plus2"]')){
                        to2 = Dom.sel('[name="to_plus2"]').value;
                        data.append('toAddress2', to2);
                    }
                    if(Dom.sel('[name="to_plus3"]')){
                        to3 = Dom.sel('[name="to_plus3"]').value;
                        data.append('toAddress3', to3);
                    }
                    Address.saveWaypoints(to1,to2,to3);
                    
                        data.append('fromCity', my_city);
                        data.append('fromAddress', from_address);
                        data.append('toCity0', my_city);
                        data.append('toAddress0', to_address);
                        data.append('isIntercity', 0);
                        //data.append('bidId', '');
                        data.append('price', price);
                        data.append('comment', comment);
                        data.append('minibus', 0);
                        data.append('babyChair', 0);
                    Ajax.request(server_uri, 'POST', 'order', my_token, '', data, function(response){
                        //console.log(response);
                        if(response && response.ok){
                            localStorage.setItem('_id_current_taxy_order', response.id);
                            document.location= '#client__map';
                        } else alert('Укажите в профиле ваш город');
                    });
                    return;
                }
                
                    // = Form auth login =
                if(target.dataset.submit === 'form-auth'){
                    var phone = Dom.sel('input[name="phone"]').value;
                    var token = (my_token)?my_token:"";
                    Ajax.request(server_uri, 'POST', 'register', token, '&phone=7'+phone, '', function(response){
                        if (response && response.ok) {
                            localStorage.setItem('_my_token', response.token);
                            my_token = response.token;
                            document.location= '#pages__sms';
                        }
                    });
                    return;
                }
                
                    // = Form auth SMS =
                if(target.dataset.submit === 'form-auth-sms'){
                    var sms = Dom.sel('input[name="sms"]').value;
                    Ajax.request(server_uri, 'POST', 'confirm', my_token, '&smsCode='+sms, '', function(response){
                        if(response && response.ok){
                            localStorage.setItem('_is_auth', 'true');              
                            document.location= '/';
                        }
                    });
                    return;
                }
                
                    // = Form edit profile = 
                if(target.dataset.submit === 'form-edit-profile'){
                    var file = Dom.sel('input[name=ava_file]').files[0];
                    var data = new FormData();
                        data.append('photo', file);
                        data.append('name', Dom.sel('input[name=myname]').value);
                        data.append('birthday', Dates.dateToBase(Dom.sel('input[name=dob]').value));
                        data.append('city', Dom.sel('select[name=city]').value);
                        data.append('sex', Dom.sel('select[name=sex]').value);
                    Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(response){
                        //console.log(response.messages);
                        if(response && response.ok) {
                            //document.location= '/';
                            window.history.back();
                        }
                    });
                    return;
                }
                
                    // = Form edit auto =
                if(target.dataset.submit === 'form-edit-auto'){
                    var sel_brand = Dom.sel('select[name="brand"]');
                    var sel_type = Dom.sel('select[name="type"]');
                    var sel_model = Dom.sel('select[name="model"]');
                    var data = new FormData();
                        data.append('color', Dom.sel('input[name="color"]').value);
                        data.append('number', Dom.sel('input[name="number"]').value);
                        //data.append('model', Dom.sel('input[name="model"]').value);
                        data.append('tonnage', Dom.sel('input[name="tonnage"]').value);
                        data.append('brand', sel_brand.options[sel_brand.selectedIndex].text);
                        data.append('model', sel_model.options[sel_model.selectedIndex].text);
                    Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(){});
                    var data2 = new FormData();
                        data2.append('conditioner', Dom.sel('input[name="conditioner"]:checked').value);
                        data2.append('type', sel_type.options[sel_type.selectedIndex].text);
                    Ajax.request(server_uri, 'POST', 'auto', my_token, '', data2, function(response){
                        if(response && response.ok){
                            //document.location= '/';
                            window.history.back();
                        }
                    });
                    return;
                }
                
                    // = Client Order Intercity =
                if(target.dataset.submit === 'client_order_intercity'){
                    var from_city = Dom.sel('[name="city_from"]').value;
                    var to_city = Dom.sel('[name="city_to"]').value;
                    var from_address = Dom.sel('[name="adress_from"]').value;
                    var to_address = Dom.sel('[name="adress_to"]').value;
                    var price = Dom.sel('[name="cost"]').value;
                    var comment = Dom.sel('[name="description"]').value;
                    var to1="",to2="",to3="";
                    var data = new FormData();
                    
                    Address.saveAddress(from_address, to_address);

                    if(Dom.sel('[name="to_plus1"]')){
                        to1 = Dom.sel('[name="to_plus1"]').value;
                        data.append('toAddress1', to1);
                    }
                    if(Dom.sel('[name="to_plus2"]')){
                        to2 = Dom.sel('[name="to_plus2"]').value;
                        data.append('toAddress2', to2);
                    }
                    if(Dom.sel('[name="to_plus3"]')){
                        to3 = Dom.sel('[name="to_plus3"]').value;
                        data.append('toAddress3', to3);
                    }
                    Address.saveWaypoints(to1,to2,to3);
                    
                        data.append('fromCity', from_city);
                        data.append('fromAddress', from_address);
                        data.append('toCity0', to_city);
                        data.append('toAddress0', to_address);
                        data.append('isIntercity', 1);
                        //data.append('bidId', '');
                        data.append('price', price);
                        data.append('comment', comment);
                        data.append('minibus', 0);
                        data.append('babyChair', 0);
                    Ajax.request(server_uri, 'POST', 'order', my_token, '', data, function(response){
                        if(response && response.ok){
                            //console.log('id='+response.id);
                            changeTab(3);
                        }
                    });
                    return;
                }
                

                target = target.parentNode;
            }
        });

   // =====================

        content.addEventListener('keypress', function(e){
            var target = e.target;
            while(target !== this){
                
                    // = Input Filtering ONLY DIGITS =
                if (target.dataset.keypress === 'input_only_digits') { InpFlt.only_digits(e); }

                    // = Input Filtering ONLY DATE =
                if (target.dataset.keypress === 'input_only_date') { InpFlt.only_date(e, target); }
                
                target = target.parentNode;
            }
        });


        content.addEventListener('keyup', function(e){
            var target = e.target;
            while(target !== this){
                
                    // = Filter Intercity Orders =
                if(target.dataset.keyup === 'filter_intercity_to'){
                    var parent_id = target.parentNode.parentNode.parentNode.dataset.tabcontent;
                    var parent = Dom.selAll('[data-tabcontent="'+parent_id+'"]')[0];
                    Funcs.searchCityForIntercity(target.value, parent);
                    
                    return;
                }
                
                target = target.parentNode;
            }
        });
    
   // = On Resize Window =
    window.addEventListener('resize', function() {
        init();
    });

    checkURL();        
    setInterval('checkURL()',250);

});

function init(){
    clearInterval(timerSearchDriver);
    clearInterval(timerGetBidsTaxy);
    clearInterval(timerGetBidGo);
    clearInterval(timerUpdateTaxiDriverOrder);
    
    Tabs.init();
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
    if(Dom.selAll('[data-controller="logout"]').length){
        localStorage.removeItem('_my_token');
        is_auth = false;
        window.history.back();
    }
    
    if(Dom.selAll('[data-controller="driver_city_orders"]').length){
        
        update_taxi_order();
        
        timerUpdateTaxiDriverOrder = setInterval(update_taxi_order, 3000);
        
        function update_taxi_order(){
            Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=0&fromCity='+my_city, '', function(response){
                // alert(response.ok);
                if (response && response.ok) {
                    var toAppend = Dom.sel('.list-orders');
                        toAppend.innerHTML = '';
                    var ords = response.orders;
                    for(var i=0; i<ords.length; i++){
                        
                        //console.log('order '+i+': '+JSON.stringify(response.orders[i]));
                        
                        var photo_img = (ords[i].agent.photo)?ords[i].agent.photo:default_avatar;
                        var price = (ords[i].price)?ords[i].price:0;
                        var bidId = ords[i].bidId;
                        var active_bid = '';
                        for(var y=0;y<ords[i].bids.length;y++){
                            var agidbid = ords[i].bids[y].id;
                            if(agidbid===bidId){
                                localStorage.setItem('_current_id_bid', bidId);
                                document.location = '#driver__go';
                                break;
                            }
                        }
                        for(var y=0;y<ords[i].bids.length;y++){
                            var agidbid = ords[i].bids[y].agentId;
                            if(agidbid===agent_id){
                                active_bid = ' active';
                                break;
                            }
                        }
                        var long = ords[i].agent.distance.toFixed(1);

                        show('LI','<div class="list-orders_personal"><img src="'+photo_img+'" alt="" /><br/>'+ords[i].agent.name+'<br/>'+Dates.datetimeForPeople(ords[i].created, 'TIME_AND TODAY_ONLY')+'</div><div class="list-orders_route"><div class="list-orders_route_from">'+ords[i].fromAddress+'</div><div class="list-orders_route_to">'+ords[i].toAddress0+'</div><div class="list-orders_route_info"><span>'+price+' руб.</span> <i class="icon-direction-outline"></i>'+long+' км</div><div class="list-orders_route_additional">'+ords[i].comment+'</div></div><div class="list-orders_phone"><i data-click="taxi_bid" data-id="'+ords[i].id+'" class="icon-ok-circled'+active_bid+'"></i></div>');
                    }
                    if(ords.length<1){
                        show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                    }
                    function show(el, a){
                        var n = document.createElement(el);
                        n.innerHTML = a;
                        toAppend.appendChild(n);                    
                    }
                }
            });
        }
    }
    
    if(Dom.selAll('[data-controller="taxy_client_intercity_myorders"]').length){
        Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=1&my=1', '', function(response){
            if (response && response.ok) {
                //console.log('Ok?: ' + response.ok + ', orders='+response.orders);
                //console.log('Messages: ' + response.messages);
                var t = Dom.sel('.myorders');
                    t.innerHTML = '';
                var ords = response.orders;
                for(var i=0; i < ords.length; i++){
                    show('LI','<div><p class="myorders__item__time">'+Dates.datetimeForPeople(ords[i].created)+'</p><p class="myorders__item__from">'+ords[i].fromCity+'</p><p class="myorders__item__to">'+ords[i].toCity0+'</p><p class="myorders__item__summa">'+ords[i].price+'</p><p class="myorders__item__info">'+ords[i].comment+'</p></div><div class="myorders__item__menu"><i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i><span><a href="#" data-id="'+ords[i].id+'" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a></span></div>');
                }
                if(ords.length < 1){
                    show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                }
                function show(el, a){
                    var n = document.createElement(el);
                        n.classList.add('myorders__item');
                        n.innerHTML = a;
                        t.appendChild(n);      
                }
            }
        });
    }

    if(Dom.selAll('[data-controller="go-order-driver"]').length){
            bid_id = localStorage.getItem('_current_id_bid');
        var LatLng = new google.maps.LatLng(48.49, 135.07);
        var mapCanvas = document.getElementById('map_canvas_go_driver');
        var mapOptions = {
            center: LatLng,
            zoom: 12,
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var markers = new Array;
        var show_route = false;
        var address,address_clear,waypoints;

            Ajax.request(server_uri, 'GET', 'bid', my_token, '&id='+bid_id, '', function(response){
                //console.log(JSON.stringify(response.bid.order));
                if(response && response.ok){
                    var ords = response.bid.order;

                    address = [ords.toCity0+', '+ords.fromAddress, ords.toCity0+', '+ords.toAddress0];
                    address_clear = [ords.fromAddress, ords.toAddress0];
                    var waypoints = [];
                    if(ords.toAddress1){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress1, stopover:true});
                    }
                    if(ords.toAddress2){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress2, stopover:true});
                    }
                    if(ords.toAddress3){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress3, stopover:true});
                    }
                    if(!show_route) setRoute();
                }
            });


            function setRoute(){
                    var el_route = Dom.sel('.wait-order-approve__route-info__route');
                    var el_price = Dom.sel('.wait-order-approve__route-info__price');
                        el_route.children[0].innerHTML = address_clear[0];
                        el_route.children[2].innerHTML = address_clear[1];

                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer();

                var request = {
                    origin: address[0],
                    destination: address[1],
                    waypoints: waypoints,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };

                directionsService.route(request, function(response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {            
                        directionsDisplay.setDirections(response);
                        //mapCanvas.insertAdjacentHTML('beforebegin', '<div class="map_order_info"><p>Расстояние: '+response.routes[0].legs[0].distance.text+'</p></div>');
                    }
                });

                directionsDisplay.setMap(map);
                show_route = true;
            }
        
        function get_pos_driver(){
            if(!markers[0]){
                var VLatLng = new google.maps.LatLng(my_position.x, my_position.y);
                markers[0] = new google.maps.Marker({
                        position: VLatLng,
                        map: map,
                        icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png',
                        title: 'Я'
                      });
            } else {
                markers[0].setPosition(new google.maps.LatLng(response.bid.agent.latitude, response.bid.agent.longitude));
            }
        }
        
        timerGetBidGo=setInterval(get_pos_driver,3000);//get_bids_driver
        
        

    }
    
    if(Dom.selAll('[data-controller="go-order-client"]').length){
            bid_id = localStorage.getItem('_current_id_bid');
            
        var LatLng = new google.maps.LatLng(48.49, 135.07);
        var mapCanvas = document.getElementById('map_canvas_go');
        var mapOptions = {
            center: LatLng,
            zoom: 12,
            streetViewControl: false,
            mapTypeControl: false,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(mapCanvas, mapOptions);
        var markers = new Array;              
        var show_route = false;
        var address,address_clear,waypoints;
                
            function setRoute(){
                    var el_route = Dom.sel('.wait-order-approve__route-info__route');
                    var el_price = Dom.sel('.wait-order-approve__route-info__price');
                        el_route.children[0].innerHTML = address_clear[0];
                        el_route.children[2].innerHTML = address_clear[1];

                directionsService = new google.maps.DirectionsService();
                directionsDisplay = new google.maps.DirectionsRenderer();

                var request = {
                    origin: address[0],
                    destination: address[1],
                    waypoints: waypoints,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };

                directionsService.route(request, function(response, status) {
                    if (status === google.maps.DirectionsStatus.OK) {            
                        directionsDisplay.setDirections(response);
                        //mapCanvas.insertAdjacentHTML('beforebegin', '<div class="map_order_info"><p>Расстояние: '+response.routes[0].legs[0].distance.text+'</p></div>');
                    }
                });

                directionsDisplay.setMap(map);
                show_route = true;
            }
        
        get_pos_driver();
        
        function get_pos_driver(){
            Ajax.request(server_uri, 'GET', 'bid', my_token, '&id='+bid_id, '', function(response){
                //console.log(JSON.stringify(response.bid.order));
                if(response && response.ok){
                    var ords = response.bid.order;
                    var agnt = response.bid.agent;
                    
                    address = [ords.toCity0+', '+ords.fromAddress, ords.toCity0+', '+ords.toAddress0];
                    address_clear = [ords.fromAddress, ords.toAddress0];
                    var waypoints = [];
                    if(ords.toAddress1){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress1, stopover:true});
                    }
                    if(ords.toAddress2){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress2, stopover:true});
                    }
                    if(ords.toAddress3){
                        waypoints.push({location:ords.toCity0+', '+ords.toAddress3, stopover:true});
                    }
                    
                    if(!show_route) setRoute();
                    
                    if(response.bid.arrived){
                        //console.log('driver arrived');
                        Dom.sel('button[data-click="client-incar"]').disabled = false;
                    }
                    if(!markers[0]){
                        var VLatLng = new google.maps.LatLng(agnt.latitude, agnt.longitude);
                        markers[0] = new google.maps.Marker({
                                position: VLatLng,
                                map: map,
                                icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/cabs.png',
                                title: 'Водитель'
                              });
                    } else {
                        markers[0].setPosition(new google.maps.LatLng(agnt.latitude, agnt.longitude));
                    }
                }
            });
        }
        
        timerGetBidGo=setInterval(get_pos_driver,3000);//get_bids_driver

    }
    
    if(Dom.selAll('[data-controller="taxy_driver_list_orders_intercity"]').length){
        Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=1', '', function(response){
            if (response && response.ok) {
                //console.log('Ok?: ' + response.ok + ', orders='+response.orders);
                //console.log('Messages: ' + response.messages);
                var toAppend = Dom.sel('[data-controller="taxy_driver_list_orders_intercity"]');
                    toAppend.innerHTML = '';
                var ords = response.orders;
                for(var i=0; i < ords.length; i++){
                    show('LI','<div class="list-extended__personal"><img src="'+ords[i].agent.photo+'" alt="" /></div><div class="list-extended__route"><div class="list-extended__route_name">'+ords[i].agent.name+'</div><div class="list-extended__route_time">'+Dates.datetimeForPeople(ords[i].created, "ONLY_TIME")+'</div><div class="list-extended__route_from">'+ords[i].fromCity+'</div><div class="list-extended__route_to">'+ords[i].toCity0+'</div><div class="list-extended__route_sum">'+ords[i].price+' руб.</div><div class="list-extended__route_info">'+ords[i].comment+'</div></div>');
                }
                if(ords.length < 1){
                    show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                }
                function show(el, a){
                    var n = document.createElement(el);
                    // n.classList.add('myorders__item');
                    n.innerHTML = a;
                    toAppend.appendChild(n);
                }
            }
        });
    }
    
    if(Dom.selAll('[data-controller="client_my_orders"]').length){
        Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=0&my=1', '', function(response){
            if (response && response.ok) {
                //console.log('Ok?: ' + response.ok + ', orders='+response.orders);
                //console.log('Messages: ' + response.messages);
                var toAppend = Dom.sel('.myorders');
                    toAppend.innerHTML = '';
                var ords = response.orders;
                for(var i=0; i < ords.length; i++){
                    show('LI','<div><p class="myorders__item__time">'+Dates.datetimeForPeople(ords[i].created)+'</p><p class="myorders__item__from">'+ords[i].fromAddress+'</p><p class="myorders__item__to">'+ords[i].toAddress0+'</p><p class="myorders__item__summa">'+ords[i].price+'</p><p class="myorders__item__info">'+ords[i].comment+'</p></div><div class="myorders__item__menu"><i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i><span><a href="#" data-id="'+ords[i].id+'" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a></span></div>');
                }
                if(response.orders.length < 1){
                    show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                }
                function show(nod, a){
                    var node = document.createElement(nod);
                    node.classList.add('myorders__item');
                    node.innerHTML = a;
                    toAppend.appendChild(node);                    
                }
            }
        });
    }

    // = Form edit auto =
    if(Dom.selAll('[data-controller="form-edit-auto"]').length){
        Ajax.request(server_uri, 'GET', 'profile', my_token, '', '', function(response){
            if (response && response.ok) {
                Dom.sel('input[name="color"]').value = response.profile.color;
                Dom.sel('input[name="number"]').value = response.profile.number;
                Dom.sel('input[name="tonnage"]').value = response.profile.tonnage;
                var brand = Dom.sel('select[name="brand"] option[value="'+response.profile.brand+'"]');
                    brand.selected = true;
                changeModel(response.profile.brand, response.profile.model);
            }
        });
        Ajax.request(server_uri, 'GET', 'auto', my_token, '', '', function(response){
            if (response && response.ok) {
                var conditioner = (response.auto.conditioner)?Dom.sel('input[name="conditioner"][value="1"]'):Dom.sel('input[name="conditioner"][value="0"]');
                    conditioner.checked = true;
                var type = Dom.sel('select[name="type"] option[value="'+response.auto.type+'"]');
                    type.selected = true;
            }
        });
        var brand_el = Dom.sel('select[name="brand"]');
            brand_el.addEventListener('change', function(){
                changeModel(brand_el.options[brand_el.selectedIndex].text);
            });
        function changeModel(brand, model){
            var model_el = Dom.sel('select[name="model"]', model);
            Ajax.request(server_uri, 'GET', 'models', my_token, '&brand='+brand, '', function(response){
                model_el.options.length = 0;
                for(var i=0;i<response.length;i++){
                    model_el.options[i] = new Option(response[i], response[i]);
                }
                if(model){
                    var current = Dom.sel('select[name="model"] option[value="'+model+'"]');
                        current.selected = true;
                }
            });
        }
    }

    // = Form edit profile =
    if(Dom.selAll('[data-controller="form-edit-profile"]').length){
        Ajax.request(server_uri, 'GET', 'profile', my_token, '', '', function(response){
            if (response && response.ok) {
                Dom.sel('input[name="myname"]').value = (my_name)?my_name:response.profile.name;
                Dom.sel('input[name="dob"]').value = Dates.dateFromBase(response.profile.birthday);
                var sex = (response.profile.sex)?Dom.sel('select[name="sex"] option[value="1"]'):Dom.sel('select[name="sex"] option[value="0"]');
                    sex.selected = true;
                var city = Dom.sel('select[name="city"] option[value="'+response.profile.city+'"]');
                    city.selected = true;
                Dom.sel('.avatar').src = my_avatar;
            }
        });
    }  

    // =Change height '.content'=
    Dom.sel('.content').style.height = (window.innerHeight - Funcs.outerHeight(Dom.sel('.header')))+'px';
    // ==========================
    if(Dom.selAll('[data-controller="choose_address"]').length){
        var input = Dom.sel('input[name="enter-address"]');
        var result_block = Dom.sel('.choice-location__results-search');
        input.addEventListener('input', onchange);
        onchange();
        
        function onchange(){
            var query = my_city + ',' + input.value;
            var pyrmont = {lat: my_position.x, lng: my_position.y};
            var map = new google.maps.Map(document.getElementById('hide_map'), {
              center: pyrmont,
              zoom: 12
            });
            var service = new google.maps.places.PlacesService(map);
            var requestSt = {
                location: pyrmont,
                radius: 50000,
                query: query
            };
            var request = {
                location: pyrmont,
                radius: 1000
            };
            if(input.value && input.value !== ""){
                service.textSearch(requestSt, callbackSt);
            } else {
                service.nearbySearch(request, callback);
            }

            function callbackSt(results, status) {
                result_block.innerHTML = "";
                for(var i=0;i<results.length;i++){
                    
                    var addr = results[i].formatted_address;
                    var addr_arr = addr.split(',');
                    for(var y= 0;y<addr_arr.length;y++){
                        addr_arr[y] = addr_arr[y].trim();
                    }
                    var idx_city = addr_arr.indexOf(my_city);
                    var address = addr_arr[idx_city-2]?addr_arr[idx_city-2]+', '+addr_arr[idx_city-1]:addr_arr[idx_city-1];
                    
                    result_block.innerHTML += '<p>' + results[i].name + '<span>' + address + '</span></p>';
                }
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    //console.error('status='+status);
                    return;
                }
            }
            
            function callback(results, status) {
                result_block.innerHTML = "";
                for(var i=0;i<results.length;i++){
                    var addr = results[i].vicinity;
                    var addr_arr = addr.split(',');
                    for(var y= 0;y<addr_arr.length;y++){
                        addr_arr[y] = addr_arr[y].trim();
                    }
                    delete addr_arr[y-1];
                    
                    var address = addr_arr.join(',');
                    if(address.slice(-1)===','){
                        address = address.slice(0, -1);
                    }
                    if(address!=="") result_block.innerHTML += '<p>' + results[i].name + '<span>' + address + '</span></p>';
                }
                if (status !== google.maps.places.PlacesServiceStatus.OK) {
                    //console.error('status='+status);
                    return;
                }
            }

            
            result_block.addEventListener('click', function(e){
                var target = e.target;
                while(target !== this){
                    if(target.tagName === 'P'){
                        localStorage.setItem('_address_'+localStorage.getItem('_address_temp'), target.children[0].innerHTML);
                        document.location = '#client__city';
                    }
                    target = target.parentNode;
                }
            });
            
        }
    }
    
    if(Dom.selAll('[data-controller="taxy-client-city"]').length){
        
        var from = Dom.sel('input[name="from"]');
        var to = Dom.sel('input[name="to"]');
        
        from.value = localStorage.getItem('_address_from');
        to.value = localStorage.getItem('_address_to');
        
        from.addEventListener('click', function(event){
            //var target = event.target;
            localStorage.setItem('_address_temp', 'from');
            document.location = '#client__choose_address';
        });
        to.addEventListener('click', function(event){
            //var target = event.target;
            localStorage.setItem('_address_temp', 'to');
            document.location = '#client__choose_address';
        });

            initialize_iam();        
    }
    
    if(Dom.selAll('#map_canvas_choice').length){
        //google.maps.event.addDomListener(window, 'load', initialize_choice);
        initialize_choice();
    }
    
    if(Dom.selAll('#map_canvas').length){
        //google.maps.event.addDomListener(window, 'load', initialize);
        
        initialize();
    }
    
    if(is_auth){
        Dom.sel('.menu__list__item_login').style.display = 'none';
        Dom.sel('.menu__list__item_logout').style.display = 'block';
    } else {
        Dom.sel('.menu__list__item_login').style.display = 'block';
        Dom.sel('.menu__list__item_logout').style.display = 'none';
    }
        
}

function checkURL(hash){
    sublasturl = lasturl;
    if(!hash) {
        if(!window.location.hash) hash='#client__city';
            else hash = window.location.hash;
    }
    if(hash !== lasturl){
        lasturl=hash;
        loadPage(hash);
    }
}

function loadPage(url){
    /*
    if(!is_auth && url!=="#pages__sms") {
        url = "#pages__login";
        document.location = url;
    }
    */
    url = url.replace('#','');
    var datar = url.split('__');
    
    Dom.sel(".loading").style.visibility = "visible";
    
    var data = new FormData();
        data.append('section', datar[0]);
        data.append('page', datar[1]);
    Ajax.request(home_server, 'POST', 'routes.php', '', '', data, function(response){
        if(response){
            Dom.sel('.header__title').innerHTML = response.title;
            Dom.sel('.content').innerHTML = response.content;

            if(datar[0] !== lastsection || lastsection === '') {
                Dom.sel('.menu__response').innerHTML = response[0].menu;
            }
            lastsection = datar[0];
            Dom.sel(".loading").style.visibility = "hidden";
            if(response.pageType === "back-arrow"){
                Dom.sel('[data-click="menu-burger"]').style.display = "none";
                Dom.sel('[data-click="back-burger"]').style.display = "block";
                //Dom.sel('.header__link').innerHTML = '<a href="#" onclick="document.forms[0].submit(); return false;"><i class="icon-ok"></i></a>';
            } else {
                Dom.sel('[data-click="menu-burger"]').style.display = "block";
                Dom.sel('[data-click="back-burger"]').style.display = "none";
                //Dom.sel('.header__link').innerHTML = '<i class="icon-share"></i>';
            }
            Dom.sel('.header__link').innerHTML = '<i class="icon-share"></i>';
            init();
        }
    });
}

// = Google maps =
function initialize(){
    var LatLng = new google.maps.LatLng(48.49, 135.07);
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
        center: LatLng,
        zoom: 12,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
   
    var address = Address.loadAddress(my_city);
    var waypoints = Address.loadWaypoints(my_city);
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();

    var request = {
        origin: address[0],
        destination: address[1],
        waypoints: waypoints,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    };

    directionsService.route(request, function(response, status) {
        if (status === google.maps.DirectionsStatus.OK) {            
            directionsDisplay.setDirections(response);
            mapCanvas.insertAdjacentHTML('beforebegin', '<div class="map_order_info"><p>Расстояние: '+response.routes[0].legs[0].distance.text+'</p></div>');
        }
    });
    
    directionsDisplay.setMap(map);
    
    function get_bids_driver(){
        Ajax.request(server_uri, 'GET', 'bids', my_token, '&id='+localStorage.getItem('_id_current_taxy_order'), '', function(response){
                //console.log('try get bids... order '+localStorage.getItem('_id_current_taxy_order'));
            if(response && response.ok){
                var el = Dom.sel('.wait-bids-approve');
                    el.innerHTML = "";
                var bids = response.bids;
                //console.log(bids);
                for(var i=0;i<bids.length;i++){
                    var photo;
                        photo = bids[i].agent.photo?bids[i].agent.photo:default_avatar;
                    el.innerHTML += '<div class="wait-bids-approve__item"><div>' + bids[i].agent.distance.toFixed(1) + 'км</div><div>' + bids[i].agent.name + '</div><div>' + bids[i].agent.brand + ' ' + bids[i].agent.model + '</div><div><img src="' + photo + '" alt="" /></div><div><i data-click="taxi_client_bid" data-id="' + bids[i].id + '" class="icon-ok-circled"></i></div></div>';
                }
            }
        });
    }

    timerGetBidsTaxy = setInterval(get_bids_driver, 3000);
    var route = Address.loadAddress();
    var el_route = Dom.sel('.wait-order-approve__route-info__route');
    var el_price = Dom.sel('.wait-order-approve__route-info__price');
    el_route.children[0].innerHTML = route[0];
    el_route.children[2].innerHTML = route[1];
    //el_price.innerHTML = ;
    
}

// = Google maps =
function initialize_choice(){
    var x,y,zoom = 18;
    if(!my_position.x || !my_position.y){
        x = 48.4;
        y = 135.07;
        zoom = 12;
    } else {
        x = my_position.x;
        y = my_position.y;
    }
    var LatLng = new google.maps.LatLng(x,y);
    var mapCanvas = document.getElementById('map_canvas_choice');
    var mapOptions = {
        center: LatLng,
        zoom: zoom, 
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map_choice = new google.maps.Map(mapCanvas, mapOptions);
    map_choice.getDiv().insertAdjacentHTML('beforeend', '<div class="centerMarker"></div>');
    var center_marker = Dom.sel('.centerMarker');

    google.maps.event.addListener(map_choice, 'drag', function(){
        var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
        localStorage.setItem('_choice_coords', coords);
    }); 
}

// Google maps TAXY CLIENT CITY ORDER 
function initialize_iam(){
    var x,y,zoom = 15;
        x = my_position.x;
        y = my_position.y;
    var MyLatLng = new google.maps.LatLng(x,y);
    var mapCanvas = document.getElementById('map_canvas_iam');
    var mapOptions = {
        center: MyLatLng,
        zoom: zoom,
        streetViewControl: false,
        mapTypeControl: false,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map_choice = new google.maps.Map(mapCanvas, mapOptions);
    var marker = new google.maps.Marker({
      position: MyLatLng,
      map: map_choice,
      title: 'Я здесь!'
    });
    
    if(Dom.sel('.adress_from').value!==''){
        Maps.addressToLatLng(Dom.sel('.adress_from').value+','+my_city, function(latlng){
            addMarker(latlng, Dom.sel('.adress_from').value, 'https://yastatic.net/doccenter/images/tech-ru/maps/doc/freeze/s-eX54MUgq4nSFXzzxVYZ7SfVis.png',map_choice);
        });
    }
    if(Dom.sel('.adress_to').value!==''){
        Maps.addressToLatLng(Dom.sel('.adress_to').value+','+my_city, function(latlng){
            addMarker(latlng, Dom.sel('.adress_to').value, 'https://yastatic.net/doccenter/images/tech-ru/maps/doc/freeze/Lg_lnltSypbyZteO0rX5V4E9Nzk.png',map_choice);
        });
    }
    
    function addMarker(location, title, icon, map) {
        var marker = new google.maps.Marker({
          position: location,
          animation: google.maps.Animation.DROP,
          icon: icon,
          title: title,
          map: map
        });
    }
    google.maps.event.addListener(map_choice, 'drag', function(){
        //var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
        //localStorage.setItem('_choice_coords', coords);
    }); 
}