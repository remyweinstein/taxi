//= modules/address.js
//= modules/ajax.js
//= modules/dates.js
//= modules/funcs.js
//= modules/maps.js
//= modules/menu.js
//= modules/tabs.js

var lasturl='',sublasturl='';
var lastsection='';
var map, map_choice, marker, geocoder;
var google, placeSearch, autocomplete, directionsService;
var my_position = ["x","y"];
var server_uri = 'https://192.168.20.90';
//var home_server = 'https://indriver.ru';
var home_server = 'https://192.168.20.29';
var my_city,my_country,my_token,is_auth=false;
var my_name, my_phone, my_avatar;
var default_avatar = 'asset/images/no_avatar.png';

document.addEventListener('DOMContentLoaded', function(){
    //Funcs.init();
    MainMenu.init();
    
    
    //localStorage.removeItem('_my_token');

    if(localStorage.getItem('_is_auth')==="true"){
        is_auth = true;
    }
    my_token = localStorage.getItem('_my_token');
    if(!my_token){
        Ajax.request(server_uri, 'GET', 'token', '', '', '', function(response){
            console.log('try get token... response: '+response.messages);
            if(response && response.ok){
                localStorage.setItem('_my_token', response.token);
                my_token = response.token;
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
        
    geoFindMe();
    
    //=================
    var content = document.querySelector('.content');
        content.addEventListener('click', function(event){
            var target = event.target;
            while(target !== this){
                
                    //= Click choose location =
                if(target.dataset.click === 'choice_location'){
                    document.location = '#client__choice_location_map';
                    Funcs.setTempRequestLS(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
                    return;
                }
                    //= Form add new point order =
                if(target.dataset.click === 'field_add'){
                    var just_add = document.querySelectorAll('.icon-record').length;
                    if(just_add < 3) {
                        var el = document.querySelector('.order-city-to');                        
                        var new_field = document.createElement('div');
                            new_field.className += 'form-order-city__field order-city-from';
                            new_field.innerHTML = '<i class="icon-record form-order-city__label"></i><span class="form-order-city__wrap"><input type="text" name="to_plus'+(just_add+1)+'" value="" placeholder="Заезд"/></span><span data-click="field_delete" class="form-order-city__field_delete"><i class="icon-trash"></i></span>';
                            var parentDiv = el.parentNode;
                            parentDiv.insertBefore(new_field, el);


                    }
                    return;
                }
                        //= Form delete point order =
                    if(target.dataset.click === 'field_delete'){
                        var be_dead = target.parentNode;
                        be_dead.parentNode.removeChild(be_dead);
                        return;
                    }

                    //= Delete Photo Edit Profile =
                if(target.dataset.click === 'clear_photo'){
                    Ajax.request(server_uri, 'POST', 'clear-photo', my_token, '', '', function(response){
                        if(response && response.ok){
                            document.querySelector('.avatar').src = default_avatar;
                        }
                    });
                    return;
                }
                
                    //= I choose location =
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
                            document.querySelector('input[name="from"]').value = localStorage.getItem('_address_from');
                            document.querySelector('input[name="to"]').value = localStorage.getItem('_address_to');
                        }
                      });
                    return;
                }
                
                    //= Menu my Orders Item =
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
                        //= Menu my Orders Item DELETE order =
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
   //=================
   
        content.addEventListener('submit', function(event){
            var target = event.target;
            while(target !== this){
                
                    //= Form Taxy Client City =
                if(target.dataset.submit === 'taxy-client-city'){
                    var from_address = document.querySelector('.adress_from').value;
                    var to_address = document.querySelector('.adress_to').value;
                    var price = document.querySelector('[name="cost"]').value;
                    var comment = document.querySelector('[name="description"]').value;
                    var to1="",to2="",to3="";
                    var data = new FormData();
                    
                    Address.saveAddress(from_address, to_address);

                    if(document.querySelector('[name="to_plus1"]')){
                        to1 = document.querySelector('[name="to_plus1"]').value;
                        data.append('toAddress1', to1);
                    }
                    if(document.querySelector('[name="to_plus2"]')){
                        to2 = document.querySelector('[name="to_plus2"]').value;
                        data.append('toAddress2', to2);
                    }
                    if(document.querySelector('[name="to_plus3"]')){
                        to3 = document.querySelector('[name="to_plus3"]').value;
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
                        console.log(response);
                        if(response && response.ok){
                            console.log('id='+response.id);
                            document.location= '#client__map';
                        } else alert('Укажите в профиле ваш город');
                    });
                    return;
                }
                
                    //= Form auth login =
                if(target.dataset.submit === 'form-auth'){
                    var phone = document.querySelector('input[name="phone"]').value;
                    var token = (my_token)?my_token:"";
                    Ajax.request(server_uri, 'POST', 'register', token, '?phone=7'+phone, '', function(response){
                        if (response && response.ok) {
                            localStorage.setItem('_my_token', response.token);
                            my_token = response.token;
                            document.location= '#pages__sms';
                        }
                    });
                    return;
                }
                
                    //= Form auth SMS =
                if(target.dataset.submit === 'form-auth-sms'){
                    var sms = document.querySelector('input[name="sms"]').value;
                    Ajax.request(server_uri, 'POST', 'confirm', my_token, '&smsCode='+sms, '', function(response){
                        if(response && response.ok){
                            localStorage.setItem('_is_auth', 'true');              
                            document.location= '/';
                        }
                    });
                    return;
                }
                
                    //= Form edit profile = 
                if(target.dataset.submit === 'form-edit-profile'){
                    var file = document.querySelector('input[name=ava_file]').files[0];
                    var data = new FormData();
                        data.append('photo', file);
                        data.append('name', document.querySelector('input[name=myname]').value);
                        data.append('birthday', Dates.dateToBase(document.querySelector('input[name=dob]').value));
                        data.append('city', document.querySelector('select[name=city]').value);
                        data.append('sex', document.querySelector('select[name=sex]').value);
                    Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(response){
                        console.log(response.messages);
                        if(response && response.ok) {
                            //document.location= '/';
                            window.history.back();
                        }
                    });
                    return;
                }
                
                    //= Form edit auto =
                if(target.dataset.submit === 'form-edit-auto'){
                    var sel_brand = document.querySelector('select[name="brand"]');
                    var sel_type = document.querySelector('select[name="type"]');
                    var data = new FormData();
                        data.append('color', document.querySelector('input[name="color"]').value);
                        data.append('number', document.querySelector('input[name="number"]').value);
                        data.append('model', document.querySelector('input[name="model"]').value);
                        data.append('tonnage', document.querySelector('input[name="tonnage"]').value);
                        data.append('brand', sel_brand.options[sel_brand.selectedIndex].text);                        
                    Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(){});
                    var data2 = new FormData();
                        data2.append('conditioner', document.querySelector('input[name="conditioner"]:checked').value);
                        data2.append('type', sel_type.options[sel_type.selectedIndex].text);
                    Ajax.request(server_uri, 'POST', 'auto', my_token, '', data2, function(response){
                        if(response && response.ok){
                            //document.location= '/';
                            window.history.back();
                        }
                    });
                    return;
                }
                
                    //= Client Order Intercity =
                if(target.dataset.submit === 'client_order_intercity'){
                    var from_city = document.querySelector('[name="city_from"]').value;
                    var to_city = document.querySelector('[name="city_to"]').value;
                    var from_address = document.querySelector('[name="adress_from"]').value;
                    var to_address = document.querySelector('[name="adress_to"]').value;
                    var price = document.querySelector('[name="cost"]').value;
                    var comment = document.querySelector('[name="description"]').value;
                    var to1="",to2="",to3="";
                    var data = new FormData();
                    
                    Address.saveAddress(from_address, to_address);

                    if(document.querySelector('[name="to_plus1"]')){
                        to1 = document.querySelector('[name="to_plus1"]').value;
                        data.append('toAddress1', to1);
                    }
                    if(document.querySelector('[name="to_plus2"]')){
                        to2 = document.querySelector('[name="to_plus2"]').value;
                        data.append('toAddress2', to2);
                    }
                    if(document.querySelector('[name="to_plus3"]')){
                        to3 = document.querySelector('[name="to_plus3"]').value;
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
                            console.log('id='+response.id);
                            changeTab(3);
                        }
                    });
                    return;
                }
                

                target = target.parentNode;
            }
        });

   //=====================

        content.addEventListener('keypress', function(e){
            var target = e.target;
            while(target !== this){
                
                    //= Input Filtering ONLY DIGITS =
                if(target.dataset.keypress === 'input_only_digits'){
                    if(e.ctrlKey || e.altKey || e.metaKey) return;
                    var chr = Funcs.getChar(e);
                    if(chr < '0' || chr > '9'){
                        e.preventDefault();
                    }
                    return;
                }

                    //= Input Filtering ONLY DATE =
                if(target.dataset.keypress === 'input_only_date'){
                    var text = target.value;
                    if(text.length>9){
                        e.preventDefault();
                    }
                    if(e.ctrlKey || e.altKey || e.metaKey) return;
                    var chr = Funcs.getChar(e);
                    if((text.length===0 && chr>'3') || ((text.length===3||text.length===2) && chr>'1') || ((text.length===5||text.length===4) && chr>'2')){
                        e.preventDefault();
                    }
                    if(text.length===2 || text.length===5){
                        target.value += ".";
                    }
                    if(chr < '0' || chr > '9'){
                        e.preventDefault();
                    }    
                }
                
                target = target.parentNode;
            }
        });


        content.addEventListener('keyup', function(e){
            var target = e.target;
            while(target !== this){
                
                    //= Filter Intercity Orders =
                if(target.dataset.keyup === 'filter_intercity_to'){
                    var parent_id = target.parentNode.parentNode.parentNode.dataset.tabcontent;
                    var parent = document.querySelectorAll('[data-tabcontent="'+parent_id+'"]')[0];
                    Funcs.searchCityForIntercity(target.value, parent);
                    
                    return;
                }
                
                target = target.parentNode;
            }
        });
    
   //= On Resize Window =
    window.addEventListener('resize', function() {
        init();
    });

    checkURL();        
    setInterval('checkURL()',250);

});

function init(){
    Tabs.init();
    if(my_token){
        Ajax.request(server_uri, 'GET', 'profile', my_token, '', '', function(response){
            if(response){
                if(!response.ok && lasturl !== "#pages__sms"){
                    is_auth = false;
                    my_token = "";
                    localStorage.removeItem('_is_auth');
                    //localStorage.removeItem('_my_token');
                } else {
                    my_phone = response.profile.phone;
                    my_name = (response.profile.name!=="")?response.profile.name:my_name;
                    my_city = (response.profile.city!=="")?response.profile.city:my_city;
                    my_avatar = response.profile.photo;
                    if(document.querySelectorAll('.jq_my_name').length){
                        document.querySelector('.jq_my_name').innerHTML = my_name;
                        document.querySelector('.jq_my_phone').innerHTML = my_phone;
                        if(!my_avatar){
                            my_avatar = default_avatar;
                        }
                        document.querySelector('.menu__desc_avatar').src = my_avatar;
                    }
                }
            }
        });
    }

    if(document.querySelectorAll('[data-controller="driver_city_orders"]').length){
        Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=0&fromCity='+my_city, '', function(response){
            //alert(response.ok);
            if (response && response.ok) {
                console.log('Ok?: ' + response.ok + ', orders='+response.orders);
                console.log('Messages: ' + response.messages);
                var toAppend = document.querySelector('.list-orders');
                    toAppend.innerHTML = '';
                for(var i=0; i<response.orders.length; i++){
                    var photo_img = (response.orders[i].agent.photo)?response.orders[i].agent.photo:default_avatar;
                    var price = (response.orders[i].price)?response.orders[i].price:0;
                    show('LI','<div class="list-orders_personal"><img src="'+photo_img+'" alt="" /><br/>'+response.orders[i].agent.name+'<br/>'+Dates.datetimeForPeople(response.orders[i].created, 'TIME_AND TODAY_ONLY')+'</div><div class="list-orders_route"><div class="list-orders_route_from">'+response.orders[i].fromAddress+'</div><div class="list-orders_route_to">'+response.orders[i].toAddress0+'</div><div class="list-orders_route_info"><span>'+price+' руб.</span> <i class="icon-direction-outline"></i>? км</div><div class="list-orders_route_additional">'+response.orders[i].comment+'</div></div>');
                }
                if(response.orders.length<1){
                    show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                }
                function show(nod, a){
                    var node = document.createElement(nod);
                    node.innerHTML = a;
                    toAppend.appendChild(node);                    
                }
            }
        });
    }
    
    if(document.querySelectorAll('[data-controller="taxy_client_intercity_myorders"]').length){
        Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=1&my=1', '', function(response){
            if (response && response.ok) {
                console.log('Ok?: ' + response.ok + ', orders='+response.orders);
                console.log('Messages: ' + response.messages);
                var toAppend = document.querySelector('.myorders');
                    toAppend.innerHTML = '';
                for(var i=0; i < response.orders.length; i++){
                    show('LI','<div><p class="myorders__item__time">'+Dates.datetimeForPeople(response.orders[i].created)+'</p><p class="myorders__item__from">'+response.orders[i].fromCity+'</p><p class="myorders__item__to">'+response.orders[i].toCity0+'</p><p class="myorders__item__summa">'+response.orders[i].price+'</p><p class="myorders__item__info">'+response.orders[i].comment+'</p></div><div class="myorders__item__menu"><i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i><span><a href="#" data-id="'+response.orders[i].id+'" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a></span></div>');
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
    
    if(document.querySelectorAll('[data-controller="taxy_driver_list_orders_intercity"]').length){
        Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=1', '', function(response){
            if (response && response.ok) {
                console.log('Ok?: ' + response.ok + ', orders='+response.orders);
                console.log('Messages: ' + response.messages);
                var toAppend = document.querySelector('[data-controller="taxy_driver_list_orders_intercity"]');
                    toAppend.innerHTML = '';
                for(var i=0; i < response.orders.length; i++){
                    show('LI','<div class="list-extended__personal"><img src="'+response.orders[i].agent.photo+'" alt="" /></div><div class="list-extended__route"><div class="list-extended__route_name">'+response.orders[i].agent.name+'</div><div class="list-extended__route_time">'+Dates.datetimeForPeople(response.orders[i].created, "ONLY_TIME")+'</div><div class="list-extended__route_from">'+response.orders[i].fromCity+'</div><div class="list-extended__route_to">'+response.orders[i].toCity0+'</div><div class="list-extended__route_sum">'+response.orders[i].price+' руб.</div><div class="list-extended__route_info">'+response.orders[i].comment+'</div></div>');
                }
                if(response.orders.length < 1){
                    show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                }
                function show(nod, a){
                    var node = document.createElement(nod);
                    //node.classList.add('myorders__item');
                    node.innerHTML = a;
                    toAppend.appendChild(node);                    
                }
            }
        });
    }
    
    if(document.querySelectorAll('[data-controller="client_my_orders"]').length){
        Ajax.request(server_uri, 'GET', 'orders', my_token, '&isIntercity=0&my=1', '', function(response){
            if (response && response.ok) {
                console.log('Ok?: ' + response.ok + ', orders='+response.orders);
                console.log('Messages: ' + response.messages);
                var toAppend = document.querySelector('.myorders');
                    toAppend.innerHTML = '';
                for(var i=0; i < response.orders.length; i++){
                    show('LI','<div><p class="myorders__item__time">'+Dates.datetimeForPeople(response.orders[i].created)+'</p><p class="myorders__item__from">'+response.orders[i].fromAddress+'</p><p class="myorders__item__to">'+response.orders[i].toAddress0+'</p><p class="myorders__item__summa">'+response.orders[i].price+'</p><p class="myorders__item__info">'+response.orders[i].comment+'</p></div><div class="myorders__item__menu"><i data-click="myorders_item_menu" class="icon-ellipsis-vert"></i><span><a href="#" data-id="'+response.orders[i].id+'" data-click="myorders_item_menu_delete" onclick="return false;">Удалить</a></span></div>');
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

    //= Form edit auto =
    if(document.querySelectorAll('[data-controller="form-edit-auto"]').length){
        Ajax.request(server_uri, 'GET', 'profile', my_token, '', '', function(response){
            if (response && response.ok) {
                document.querySelector('input[name="color"]').value = response.profile.color;
                document.querySelector('input[name="number"]').value = response.profile.number;
                document.querySelector('input[name="model"]').value = response.profile.model;
                document.querySelector('input[name="tonnage"]').value = response.profile.tonnage;
                var brand = document.querySelector('select[name="brand"] option[value="'+response.profile.brand+'"]');
                    brand.selected = true;
            }
        });
        Ajax.request(server_uri, 'GET', 'auto', my_token, '', '', function(response){
            if (response && response.ok) {
                var conditioner = (response.auto.conditioner)?document.querySelector('input[name="conditioner"][value="1"]'):document.querySelector('input[name="conditioner"][value="0"]');
                    conditioner.checked = true;
                var type = document.querySelector('select[name="type"] option[value="'+response.auto.type+'"]');
                    type.selected = true;
            }
        });
    }

    //= Form edit profile =
    if(document.querySelectorAll('[data-controller="form-edit-profile"]').length){
        Ajax.request(server_uri, 'GET', 'profile', my_token, '', '', function(response){
            if (response && response.ok) {
                document.querySelector('input[name="myname"]').value = (my_name)?my_name:response.profile.name;
                document.querySelector('input[name="dob"]').value = Dates.dateFromBase(response.profile.birthday);
                var sex = (response.profile.sex)?document.querySelector('select[name="sex"] option[value="1"]'):document.querySelector('select[name="sex"] option[value="0"]');
                    sex.selected = true;
                var city = document.querySelector('select[name="city"] option[value="'+response.profile.city+'"]');
                    city.selected = true;
                document.querySelector('.avatar').src = my_avatar;
            }
        });
    }  

   //=Change height '.content'=
   document.querySelector('.content').style.height = (window.innerHeight - Funcs.outerHeight(document.querySelector('.header')))+'px';
   //==========================
   
    if(document.querySelectorAll('[data-controller="taxy-client-city"]').length){
        document.querySelector('input[name="from"]').value = localStorage.getItem('_address_from');
        document.querySelector('input[name="to"]').value = localStorage.getItem('_address_to');
    }
    
    if(document.querySelectorAll('#map_canvas_choice').length){
        //google.maps.event.addDomListener(window, 'load', initialize_choice);
        initialize_choice();
    }
    
    if(document.querySelectorAll('#map_canvas').length){
        //google.maps.event.addDomListener(window, 'load', initialize);
        initialize();
    }
        
}

function geoFindMe(){
    if(!navigator.geolocation){
        alert("К сожалению, геолокация не поддерживается в вашем браузере");
        return;
    }
    function success(position) {
        var latitude  = position.coords.latitude;
        var longitude = position.coords.longitude;
        my_position.x = latitude;
        my_position.y = longitude;
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
                                var data = new FormData();
                                    data.append('name', my_name);
                                    data.append('city', my_city);
                                Ajax.request(server_uri, 'POST', 'profile', my_token, '', data, function(response){
                                    console.log('after geofind='+response.ok);
                                    if(response && response.ok) {
                                        init();
                                    }
                                });
                        }
                        if(obj[key].types[0]==="country") my_coutry = obj[key].long_name;
                    }
                }
            });    
    };
    function error() {
        alert("На вашем устройстве не разрешен доступ к местоположению.");
    };
    navigator.geolocation.getCurrentPosition(success, error);
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
    document.querySelector(".loading").style.visibility = "visible";
    
    var data = new FormData();
        data.append('section', datar[0]);
        data.append('page', datar[1]);
    Ajax.request(home_server, 'POST', 'routes.php', '', '', data, function(response){
        if(response){
            document.querySelector('.header__title').innerHTML = response.title;
            document.querySelector('.content').innerHTML = response.content;

            if(datar[0] !== lastsection || lastsection === '') {
                document.querySelector('.menu__response').innerHTML = response[0].menu;
            }
            lastsection = datar[0];
            document.querySelector(".loading").style.visibility = "hidden";
            if(response.pageType === "back-arrow"){
                document.querySelector('[data-click="menu-burger"]').style.display = "none";
                document.querySelector('[data-click="back-burger"]').style.display = "block";
                //document.querySelector('.header__link').innerHTML = '<a href="#" onclick="document.forms[0].submit(); return false;"><i class="icon-ok"></i></a>';
            } else {
                document.querySelector('[data-click="menu-burger"]').style.display = "block";
                document.querySelector('[data-click="back-burger"]').style.display = "none";
                //document.querySelector('.header__link').innerHTML = '<i class="icon-share"></i>';
            }
            document.querySelector('.header__link').innerHTML = '<i class="icon-share"></i>';
            init();
        }
    });
}

//= Google maps =
function initialize(){
    var LatLng = new google.maps.LatLng(48.49, 135.07);
    var mapCanvas = document.getElementById('map_canvas');
    var mapOptions = {
        center: LatLng,
        zoom: 12, 
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map = new google.maps.Map(mapCanvas, mapOptions);
    
    /*
    new google.maps.Polyline({
                                //path: [from, to],
                                geodesic: true,
                                strokeColor: '#FF0000',
                                strokeOpacity: 1.0,
                                strokeWeight: 2
                        });
        var polyline = new GPolyline([]);
        map.addOverlay(polyline);
        polyline.enableDrawing();
    */
    /*
    var marker = new google.maps.Marker({
      position: MyLatLng,
      map: map,
      title: 'Я здесь!'
    });
    */
   
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
            //order_info = new google.maps.Map(mapCanvas, mapOptions);
            
            //order_info.getDiv().insertAdjacentHTML('beforeend', '<div class="map_order_info"><p>Расстояние: '+response.routes[0].legs[0].distance.text+'</p></div>');
            //var info_block = document.querySelector('.map_order_info');
            //info_block.insertAdjacentHTML('beforeend', '<p>Расстояние: '+response.routes[0].legs[0].distance.text+'</p>');
        }
    });

    directionsDisplay.setMap(map);
    
}

//= Google maps =
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
    var KhabLatLng = new google.maps.LatLng(x,y);
    var mapCanvas = document.getElementById('map_canvas_choice');
    var mapOptions = {
        center: KhabLatLng,
        zoom: zoom, 
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    map_choice = new google.maps.Map(mapCanvas, mapOptions);
    map_choice.getDiv().insertAdjacentHTML('beforeend', '<div class="centerMarker"></div>');
    var center_marker = document.querySelector('.centerMarker');

    google.maps.event.addListener(map_choice, 'drag', function(){
        var coords = Maps.point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
        localStorage.setItem('_choice_coords', coords);
    }); 
}
