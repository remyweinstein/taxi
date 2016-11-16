var tabs;
var lasturl='',sublasturl='';
var lastsection='';
var map, map_choice, marker, geocoder;
var google, placeSearch, autocomplete, directionsService;
var my_position = ["x","y"];
var server_uri = '192.168.20.90';
var my_city,my_country,my_token,is_auth=false;
var my_name, my_phone, my_avatar;
var default_avatar = 'images/no_avatar.png';

document.addEventListener('DOMContentLoaded', function(){

    if(localStorage.getItem('_is_auth')==="true"){
        is_auth = true;
    }
    my_token = localStorage.getItem('_my_token');
        
    geoFindMe();
    
    //=Main Menu Events=
    var menu = document.querySelectorAll('.menu')[0];
    new Hammer(menu,{domEvents: true});
    menu.addEventListener('swipeleft', function(){
        swipeMenu('-');
    });
    
        //= Main menu event click item =
        menu.addEventListener('click', function(event) {
            var target = event.target;
            while (target !== this) {
                    //= Change Item menu =
                if(target.tagName === 'A') {
                    var li = target.parentNode;
                    var lis = li.parentNode.querySelectorAll('li');
                    for(var i=0; i<lis.length; i++){
                        lis[i].className = 
                            lis[i].className.replace(/^menu__list--active$/, '');
                        //lis[i].classList.remove('menu__list--active');
                    }
                    li.className += 'menu__list--active';
                    //li.classList.add('menu__list--active');
                    swipeMenu('-');
                }
                    //= Click edit profile =
                if(target.dataset.click === 'edit_profile'){
                    swipeMenu('-');
                    document.location = '#pages__edit_profile';
                    return;
                }
                target = target.parentNode;
            }
        });
    
    document.querySelectorAll('.header__burger')[0].addEventListener('click', function(){
        swipeMenu('+');
    });
    //=================
    var content = document.querySelectorAll('.content')[0];
        content.addEventListener('click', function(event){
            var target = event.target;
            while(target !== this){
                    //=  Tabs Events  =
                if(target.dataset.tab > 0) {
                    changeTab(target.dataset.tab);
                    return;
                }
                    //= Click choose location =
                if(target.dataset.click === 'choice_location'){
                    document.location= '#client__choice_location_map';
                    setTempRequestLS(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
                    return;
                }
                    //= Form add new point order =
                if(target.dataset.click === 'field_add'){
                    var just_add = document.querySelectorAll('.icon-record').length;
                    if(just_add < 3) {
                        var el = document.querySelectorAll('.order-city-to')[0];                        
                        var new_field = document.createElement('div');
                            new_field.className += 'form-order-city__field order-city-from';
                            new_field.innerHTML = '<i class="icon-record form-order-city__label"></i><span class="form-order-city__wrap"><input type="text" name="from_plus[]" value="" placeholder="Заезд"/></span><span data-click="field_delete" class="form-order-city__field_delete"><i class="icon-trash"></i></span>';
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
                    var jqxhr = $.post("https://"+server_uri+"/clear-photo?token="+my_token, {}, function() {}, "json");
                    jqxhr.done(function(data){
                        if(data.ok){
                            $('.avatar').prop('src', default_avatar);
                        }
                    }, "json");
                }
                
                    //= I choose location =
                if(target.dataset.click === 'i_choice_location'){
                    document.location = '#client__city';
                    var name = getTempRequestLS();
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
                            localStorage.setItem('_address_'+name, getStreenFromGoogle(results));
                            $('input[name="from"]').val(localStorage.getItem('_address_from'));
                            $('input[name="to"]').val(localStorage.getItem('_address_to'));
                        }
                      });
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
                    var from_address = document.querySelectorAll('.adress_from')[0].value;
                    var to_address = document.querySelectorAll('.adress_to')[0].value;
                    var price = document.querySelectorAll('[name="cost"]')[0].value;
                    var comment = document.querySelectorAll('[name="description"]')[0].value;
                    
                    saveAddress(from_address, to_address);
                    
                    var data = new FormData();
                        data.append('fromCity', my_city);
                        data.append('fromAddress', from_address);
                        data.append('toCity0', my_city);
                        data.append('toAddress0', to_address);
                        //data.append('toAddress1', '');
                        //data.append('toAddress2', '');
                        //data.append('toAddress3', '');
                        data.append('isIntercity', 0);
                        //data.append('bidId', '');
                        data.append('price', price);
                        data.append('comment', comment);
                        data.append('minibus', 0);
                        data.append('babyChair', 0);
                    $.ajax({
                        processData: false,
                        enctype: 'multipart/form-data',
                        dataType: 'json',
                        contentType: false, 
                        url: 'https://'+server_uri+'/order?token='+my_token,
                        type: 'POST',
                        data: data,
                        success: function(data){
                            console.log(data.messages);
                            if(data.ok){
                                console.log('id='+data.id);
                                document.location= '#client__map';
                            }
                        }
                    });
                    
                    return;
                }
                
                    //= Form auth login =
                if(target.dataset.submit === 'form-auth'){
                    var jqxhr = $.post("https://"+server_uri+"/register?phone=7"+$('input[name="phone"]').val(), function(){}, "json");
                    jqxhr.done(function(data){
                        if(data.ok){
                            localStorage.setItem('_my_token', data.token);
                            my_token = data.token;
                            document.location= '#pages__sms';
                            //loadPage('#pages__sms');
                        }
                    }, "json");
                        //.fail(function(){})
                        //.always(function(){});
                }
                
                    //= Form auth SMS =
                if(target.dataset.submit === 'form-auth-sms'){
                    var jqxhr = $.post("https://"+server_uri+"/confirm?token="+my_token+"&smsCode="+$('input[name="sms"]').val(), function() {}, "json");
                    jqxhr.done(function(data){ 
                        if(data.ok){
                            localStorage.setItem('_is_auth', 'true');              
                            document.location= '/';
                        }
                    }, "json");
                }
                
                    //= Form edit profile = 
                if(target.dataset.submit === 'form-edit-profile'){
                    var file = $('input[name=ava_file]').prop('files')[0];
                    var data = new FormData();
                    data.append('photo', file, file.name);
                    data.append('name', $('input[name=name]').val());
                    data.append('birthday', dateToBase($('input[name=dob]').val()));
                    data.append('city', $('select[name=city]').val());
                    data.append('sex', $('select[name=sex]').val());

                    $.ajax({
                        processData: false,
                        enctype: 'multipart/form-data',
                        dataType: 'json',
                        contentType: false, 
                        url: 'https://'+server_uri+'/profile?token='+my_token,
                        type: 'POST',
                        data: data,
                        success: function(data){
                            if(data.ok){
                                document.location= '/';
                                //checkURL(sublasturl);
                                //loadPage(sublasturl);
                            }

                        }
                    });
                }
                
                    //= Form edit auto =
                if(target.dataset.submit === 'form-edit-auto'){
                    var jqxhr = $.post("https://"+server_uri+"/profile?token="+my_token, 
                        { color: $('input[name="color"]').val(), number: $('input[name="number"]').val(), model: $('input[name="model"]').val(), tonnage: $('input[name="tonnage"]').val(), brand: $('select[name="brand"] option:selected').text() }, 
                        function() {}, "json");
                    jqxhr.done(function(data) {
                        if(data.ok){
                            //document.location= '/';
                        }
                    }, "json");
                    var jqxhr2 = $.post("https://"+server_uri+"/auto?token="+my_token, 
                        { conditioner: $('input[name="conditioner"]:checked').val(), type: $('select[name="type"] option:selected').val() }, 
                        function() {}, "json");
                    jqxhr2.done(function(data) {
                        if(data.ok){
                            document.location= '/';
                        }
                    }, "json");
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
                    var chr = getChar(e);
                    if(chr < '0' || chr > '9'){
                        e.preventDefault();
                    }
                    return;
                }

                    //= Input Filtering ONLY DATE =
                if(target.dataset.keypress === 'input_only_date'){
                    var text = target.value;
                    console.log(text);
                    if(text.length>9){
                        e.preventDefault();
                    }
                    if(e.ctrlKey || e.altKey || e.metaKey) return;
                    var chr = getChar(e);
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
                    searchCityForIntercity(target.value, parent);
                    
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
    init();
    
});

function init(){
    if(my_token !=="" ){
        $.get("https://"+server_uri+"/profile?token="+my_token,
            function(data) {
                if(!data.ok && lasturl !== "#pages__sms"){
                    is_auth = false;
                    my_token = "";
                    localStorage.removeItem('_is_auth');
                    localStorage.removeItem('_my_token');
                } else {
                    my_phone = data.profile.phone;
                    my_name = data.profile.name;
                    my_city = data.profile.city;
                    my_avatar = data.profile.photo;
                    if($('.jq_my_name').length){
                        $('.jq_my_name').html(my_name);
                        $('.jq_my_phone').html(my_phone);
                        if(!my_avatar){
                            my_avatar = default_avatar;
                        }
                        $('.menu__desc_avatar').prop('src', my_avatar);
                    }
                }
            }, "json");
    }

    if(document.querySelectorAll('[data-id="driver_city_orders"]').length){
        $.get("https://"+server_uri+"/orders?token="+my_token+"&isIntercity=0&fromCity="+my_city,
            function(data) {
                console.log('Ok?: ' + data.ok + ', orders='+data.orders);
                console.log('Messages: ' + data.messages);
                var toAppend = document.querySelectorAll('.list-orders')[0];
                for(var i=0; i<data.orders.length; i++){
                    show('LI','<div class="list-orders_personal"><img src="'+data.orders[i].agent.photo+'" alt="" /><br/>'+data.orders[i].agent.name+'<br/>'+datetimeForPeople(data.orders[i].created)+'</div><div class="list-orders_route"><div class="list-orders_route_from">'+data.orders[i].fromAddress+'</div><div class="list-orders_route_to">'+data.orders[i].toAddress0+'</div><div class="list-orders_route_info"><span>'+data.orders[i].price+' руб.</span> <i class="icon-direction-outline"></i>? км</div><div class="list-orders_route_additional">'+data.orders[i].comment+'</div></div>');
                }
                if(data.orders.length<1){
                    show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                }
                function show(nod, a){
                    var node = document.createElement(nod);
                    node.innerHTML = a;
                    toAppend.appendChild(node);                    
                }
            }, "json");
    }
    if(document.querySelectorAll('[data-id="client_my_orders"]').length){
        $.get("https://"+server_uri+"/orders?token="+my_token+"&isIntercity=0&my=1",
            function(data) {
                console.log('Ok?: ' + data.ok + ', orders='+data.orders);
                console.log('Messages: ' + data.messages);
                var toAppend = document.querySelectorAll('.myorders')[0];
                for(var i=0; i < data.orders.length; i++){
                    show('LI','<p class="myorders__time">'+datetimeForPeople(data.orders[i].created)+'</p><p class="myorders__from">'+data.orders[i].fromAddress+'</p><p class="myorders__to">'+data.orders[i].toAddress0+'</p><p class="myorders__summa">'+data.orders[i].price+'</p><p class="myorders__info">'+data.orders[i].comment+'</p>');
                }
                if(data.orders.length < 1){
                    show('DIV','<div class="list-orders_norecords">Нет заказов</div>');
                }
                function show(nod, a){
                    var node = document.createElement(nod);
                    node.innerHTML = a;
                    toAppend.appendChild(node);                    
                }
            }, "json");
    }

    //= Form edit auto =
    if($('.jq_form-edit-auto').length){
        $.get("https://"+server_uri+"/profile?token="+my_token,
            function(data){
                $('input[name="color"]').val(data.profile.color);
                $('input[name="number"]').val(data.profile.number);
                $('input[name="model"]').val(data.profile.model);
                $('input[name="tonnage"]').val(data.profile.tonnage);
                var brand = $('select[name="brand"] option[value="'+data.profile.brand+'"]');
                    brand.attr('selected', 'true');
            }, "json");
        $.get("https://"+server_uri+"/auto?token="+my_token,
            function(data){
                var conditioner = (data.auto.conditioner)?$('input[name="conditioner"][value="1"]'):$('input[name="conditioner"][value="0"]');
                    conditioner.attr('checked', 'checked');
                var type = $('select[name="type"] option[value="'+data.auto.type+'"]');
                    type.attr('selected', 'true');
            }, "json");
    }  

    //= Form edit profile =
    if($('.jq_form-edit-profile').length){
        $.get("https://"+server_uri+"/profile?token="+my_token,
            function(data) {
                $('input[name="name"]').val(data.profile.name);
                $('input[name="dob"]').val(dateFromBase(data.profile.birthday));
                var sex = (data.profile.sex)?$('select[name="sex"] option[value="1"]'):$('select[name="sex"] option[value="0"]');
                    sex.attr('selected', 'true');
                var city = $('select[name="city"] option[value="'+data.profile.city+'"]');
                    city.attr('selected', 'true');
                $('.avatar').prop('src', my_avatar);
            }, "json");
    }  

   //=Change height '.content'=
   $('.content').css('height',$(window).outerHeight() - $('.header').outerHeight());
   //==========================
   
    tabs = $('.tabs ul li');
    
    if(tabs.length){
        var tab_count = tabs.length;
        tabs.css('width',(100/tab_count-1)+'%');
        $('.tabs__viewport').css('width', tab_count*$(window).width()+'px');
        $('.tabs_content').css('width', $(window).width());

        new Hammer($('.tabs__wrapper')[0],{domEvents: true});
    }
    if($('.form-order-city').length){
        $('input[name="from"]').val(localStorage.getItem('_address_from'));
        $('input[name="to"]').val(localStorage.getItem('_address_to'));
    }
    
    if($('#map_canvas_choice').length){
        //google.maps.event.addDomListener(window, 'load', initialize_choice);
        initialize_choice();
    }
    
    if($('#map_canvas').length){
        //google.maps.event.addDomListener(window, 'load', initialize);
        initialize();
    }

    $('.tabs_content').on('swipeleft', function(){
        swipeTabs(1);
    });
    $('.tabs_content').on('swiperight', function(){
        swipeTabs(-1);
    });
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
                    if(obj[key].types[0]==="locality" && my_city !== "") {
                        my_city = obj[key].long_name;
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

function swipeMenu(route){
    $('.menu').animate({
                    left: route+'=80%'
                  }, 250);
}

function swipeTabs(route){
    var current_tab = $('.tab--active').data('tab');
    if((current_tab + route) < (tabs.length + 1) && (current_tab + route) > 0){
        changeTab(current_tab + route);
    }
}
function changeTab(tab){
    step = $(window).width();//document.querySelectorAll
    $('.tabs_content').css('left', (step-step*tab)+'px');
    tabs.removeClass('tab--active');
    $('*[data-tab="'+tab+'"]').addClass('tab--active');
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
    var data = url.split('__');
    document.querySelectorAll(".loading")[0].style.visibility = "visible";
    $.ajax({
        dataType: 'json',
        url: 'routes.php',
        type: 'POST',
        data: {
            section: data[0],
            page: data[1]
        },
        success: function(response){
            if(parseInt(response) !== 0){
                document.querySelectorAll('.header__title')[0].innerHTML = response.title;
                document.querySelectorAll('.content')[0].innerHTML = response.content;
                if(data[0] !== lastsection || lastsection === '') {
                    document.querySelectorAll('.menu__response')[0].innerHTML = response[0].menu;
                }
                lastsection = data[0];
                
                document.querySelectorAll(".loading")[0].style.visibility = "hidden";
                init();
            }
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
    directionsService = new google.maps.DirectionsService();
    var address = loadAddress();
    requestDirections(address[0], address[1], { strokeColor:'#ff0000' });
}

//= Google maps =
function initialize_choice(){
    zoom = 18;
    if(my_position.x===undefined || my_position.y===undefined){
        var x = 48.4;
        var y = 135.07;
        var zoom = 12;
    } else {
        //undefined
        var x = my_position.x;
        var y = my_position.y;
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
    var center_marker = document.querySelectorAll('.centerMarker')[0];

    google.maps.event.addListener(map_choice, 'drag', function(){
        var coords = point2LatLng(center_marker.offsetLeft, center_marker.offsetTop, map_choice);
        localStorage.setItem('_choice_coords', coords);
    }); 
}

function renderDirections(result, polylineOpts) {
    var directionsRenderer = new google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);
    if(polylineOpts) {
        directionsRenderer.setOptions({
            polylineOptions: polylineOpts
        });
    }
    directionsRenderer.setDirections(result);
}
function requestDirections(start, end, polylineOpts) {
    directionsService.route({
        origin: start,
        destination: end,
        travelMode: google.maps.DirectionsTravelMode.DRIVING
    }, function(result) {
        renderDirections(result, polylineOpts);
    });
}
 
function getChar(event){
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
}

function setTempRequestLS(val){
    localStorage.setItem('_temp_request', val);
    return true;
}
function getTempRequestLS(){
    var val = localStorage.getItem('_temp_request');
    localStorage.removeItem('_temp_request');
    return val;
}
function saveAddress(adr_from, adr_to){
    localStorage.setItem('_address_from', adr_from);
    localStorage.setItem('_address_to', adr_to);
    return true;
}

function loadAddress(){
    var adr_from = my_city+','+localStorage.getItem('_address_from');
    var adr_to = my_city+','+localStorage.getItem('_address_to');
    
    return [adr_from, adr_to];
}

function point2LatLng(x, y, map) {
  var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());
  var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());
  var scale = Math.pow(2, map.getZoom());
  var worldPoint = new google.maps.Point(x / scale + bottomLeft.x, y / scale + topRight.y);
  return map.getProjection().fromPointToLatLng(worldPoint);
}

function getStreenFromGoogle(results){
    var obj = results[0].address_components,key,address;
    for(key in obj) {
        if(obj[key].types[0]==="street_number") address = obj[key].long_name;
        if(obj[key].types[0]==="route") address = obj[key].long_name + ',' + address;
    }
    return address;
}

function searchCityForIntercity(city, parent){
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
}

function dateFromBase(dob){
    if(dob === "0000-00-00") {
        dob = "";
    } else {
        dob = dob.split("-");
        dob = dob[2]+'.'+dob[1]+'.'+dob[0];
    }
    return dob;
}
function dateToBase(dob){
    dob = dob.split('.');
    dob = dob[2]+'-'+dob[1]+'-'+dob[0];
    return dob;
}
function datetimeForPeople(date,options){
    if(options===undefined){
        options = "TIME_AND_TODAY";
    }
    date = date.split(" ");
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).valueOf();
    var other = date[0].valueOf();
    if (other < today - 86400000) {
        var dater = date[0].split("-");
        today_text = dater[2]+'.'+dater[1]+'.'+dater[0];
    } else if (other < today) {
        today_text = "Вчера";
    } else {
        today_text = "Сегодня";
    }
    var dater = date[1].split(":");
    time_text = dater[0]+':'+dater[1];
    
    
    if(options==="ONLY_TIME"){
        date = time_text;
    }
    if(options==="ONLY_TIME_IF_TODAY"){
        date = (today_text==="Сегодня")?time_text:today_text+', '+time_text;
    }
    if(options==="TIME_AND_TODAY"){
        date = today_text+', '+time_text;
    }
    
    return date;
}