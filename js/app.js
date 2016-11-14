var tabs;
var lasturl='';
var lastsection='';
var map, map_choice, marker, geocoder;
var google, placeSearch, autocomplete, directionsService;
var my_position = ["x","y"];
var server_uri = '192.168.20.90';
var my_city,my_country,my_token,is_auth=false;
var my_name, my_phone, my_avatar;

$(document).ready(function(){
           
    /*
    $.post("test.php", { name: "John", time: "2pm" })
        .done(function(data) {
          //======
        }, "json");    
    */
   
    if(localStorage.getItem('_is_auth')==="true"){
        is_auth = true;
    }
    my_token = localStorage.getItem('_my_token');
    
    /*
    $.get("https://"+server_uri+"/orders?token="+my_token,
        function(data) {
            console.log('Ok?: ' + data.ok);
            console.log('Orders: ' + data.orders);
            console.log('Messages: ' + data.messages);
        }, "json");
    */
   
    geoFindMe();
    
    //=Main Menu Events=
    new Hammer($('.menu')[0],{domEvents: true});
    $('.menu').on("swipeleft", function(){
        swipeMenu('-');
    });
    
    $('.menu').on('click', '.menu__list li', function(){
        $('.menu__list li').removeClass('menu__list--active');
        $(this).addClass('menu__list--active');
        swipeMenu('-');
    });
    
    $('body').on('click', '.header__burger', function(){
        swipeMenu('+');
        //if(!parseInt($('.menu').css('left'), 2)){
        //  swipeMenu('+');
        //}
    });
   //=================
   
   //=  Tabs Events  =
    $('.content').on('click', '.tabs ul li', function(){
        changeTab($(this).data('tab'));
    });
   //=================
   $('.content').on('click', '.jq_choice_location', function(){
       document.location= '#client__choice_location_map';
       setTempRequestLS($(this).parent('div').children('span').children('input').attr('name'));
   });
   //=Form add new city order=
    $('.content').on('click', '.form-order-city__field_add', function(){
        $('.order-city-from:last').after('<div class="form-order-city__field order-city-from"><i class="icon-record form-order-city__label"></i><span class="form-order-city__wrap"><input type="text" name="from_plus[]" value="" placeholder="Заезд"/></span><span class="form-order-city__field_delete"><i class="icon-trash"></i></span></div>');
        $('.form-order-city__field_delete').click(function(){
            $(this).parent('div.order-city-from').remove();
        });
    });
   //=================
   
   //= Form order city =
    $('.content').on('submit', '.form-order-city', function(){
        saveAddress($('.adress_from').val(), $('.adress_to').val());
        document.location= '#client__map';
        return false;
    });
   //=================
   //
   //= Form auth =
    $('.content').on('submit', '.jq_form-auth', function(){
        var jqxhr = $.post("https://"+server_uri+"/register?phone=7"+$('input[name="phone"]').val(), function(){}, "json");
        jqxhr.done(function(data){
            if(data.ok){
                localStorage.setItem('_my_token', data.token);
                my_token = data.token;
                document.location= '#pages__sms';
            }
        }, "json");
            //.fail(function(){})
            //.always(function(){});
        return false;
    });
   //=================
   //
   //= Form auth SMS =
    $('.content').on('submit', '.jq_form-auth-sms', function(){
        var jqxhr = $.post("https://"+server_uri+"/confirm?token="+my_token+"&smsCode="+$('input[name="sms"]').val(), function() {}, "json");
        jqxhr.done(function(data){ 
            if(data.ok){
                localStorage.setItem('_is_auth', 'true');              
                document.location= '/';
            }
        }, "json");
        return false;
    });    
   //=================
   //
   //= Form edit profile = 
    $('.content').on('submit', '.jq_form-edit-profile', function(){
        var jqxhr = $.post("https://"+server_uri+"/profile?token="+my_token, { photo: $('input[name=ava_file]').prop('files')[0], name: $('input[name=name]').val(), birthday: dateToBase($('input[name=dob]').val()), city: $('select[name=city]').val(), sex: $('select[name=sex]').val() }, function() {}, "json");
        jqxhr.done(function(data){
                console.log(data.ok);
                console.log(data);
            if(data.ok){
                document.location= '/';
            }
        }, "json");

        return false;
    });
    $('body').on('click','.menu__desc', function(){
        swipeMenu('-');
        document.location = '#pages__edit_profile';
    });
   //=====================
   //
   //= Form edit auto =
    $('.content').on('submit', '.jq_form-edit-auto', function(){
        var jqxhr = $.post("https://"+server_uri+"/profile?token="+my_token, 
            { color: $('input[name="color"]').val(), number: $('input[name="number"]').val(), model: $('input[name="model"]').val(), tonnage: $('input[name="tonnage"]').val(), brand: $('select[name="brand"] option:selected').text() }, 
            function() {}, "json");
        jqxhr.done(function(data) {
            if(data.ok){
                document.location= '/';
            }
        }, "json");

        return false;
    });
   //=====================
   //
   //= Form edit auto cog =
    $('.content').on('submit', '.jq_form-edit-auto-cog', function(){
        var jqxhr = $.post("https://"+server_uri+"/auto?token="+my_token, 
            { conditioner: $('input[name="conditioner"]:checked').val(), type: $('select[name="type"] option:selected').val() }, 
            function() {}, "json");
        jqxhr.done(function(data) {
            if(data.ok){
                document.location= '/';
            }
        }, "json");

        return false;
    });
   //=====================


    
   //=====================
   //=====================
    $('body').on('click','.menu__desc', function(){
        swipeMenu('-');
        document.location = '#pages__edit_profile';
    });
   //=====================
   

    $('.content').on('click','.jq_location_choice',function(){
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
    });
   
   //= Input Filtering =
    $('.content').on('keypress', '.input_only_digits', function(e){ // ONLY DIGITS
      e = e || event;
      if(e.ctrlKey || e.altKey || e.metaKey) return;
      var chr = getChar(e);
      if(chr === null) return;
      if(chr < '0' || chr > '9'){
        return false;
      }
    });
   //====================

    $('.content').on('keypress', '.input_only_date', function(e) { // ONLY DATE
        var text = $(this).val();
        if(text.length>9){
            return false;
        }
        e = e || event;
        if(e.ctrlKey || e.altKey || e.metaKey) return;
        var chr = getChar(e);
        if((text.length===0 && chr>'3') || ((text.length===3||text.length===2) && chr>'1') || ((text.length===5||text.length===4) && chr>'2')){
            return false;
        }
        if(text.length===2 || text.length===5){
            $(this).val($(this).val()+".");
        }

        if(chr === null) return;
        if(chr < '0' || chr > '9'){
            return false;
        }    
    });
    
   //= Filter Intercity Orders =
    $('.content').on('keyup', '.filter_intercity_to', function(){
        searchCityForIntercity($(this).val(),$(this).parent().parent().parent('.tabs_content'));
    });
   //==========================
   
   //= On Resize Window =
    $(window).resize(function() {
        init();
    });

    checkURL();        
    setInterval('checkURL()',250);
    init();
    
});

function init(){
    $.get("https://"+server_uri+"/profile?token="+my_token,
        function(data) {
            if(!data.ok && lasturl !== "#pages__sms"){
                is_auth = false;
                my_token = "";
                localStorage.removeItem('_is_auth');
                localStorage.removeItem('_my_token');
            } else {
                //console.log(data.profile.photoId);
                my_phone = data.profile.phone;
                my_name = data.profile.name;
                my_city = data.profile.city;
                //console.log('messages: ' + data.messages);
                if($('.jq_my_name').length){
                    $('.jq_my_name').html(my_name);
                    $('.jq_my_phone').html(my_phone);
                }
            }
        }, "json");

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
    }  

    //= Form edit auto cog =
    if($('.jq_form-edit-auto-cog').length){
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
                var sex = (data.profile.sex) ? $('select[name="sex"] option[value="1"]'):$('select[name="sex"] option[value="0"]');
                    sex.attr('selected', 'true');
                var city = $('select[name="city"] option[value="'+data.profile.city+'"]');
                    city.attr('selected', 'true');
                //$('input[name="city"]').val(data.city);             
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

function searchCityForIntercity(city, parent){
    var currentCity;
    parent.children().children('.list-extended li').each(function (index, el){
        currentCity = $(el).children('.list-extended__route').children('.list-extended__route_to').text();
        if(currentCity === city || city === '') {
            $(el).css('display', 'flex');
        } else {
            $(el).css('display', 'none');
        }
    });
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
    step = $(window).width();
    $('.tabs_content').css('left', (step-step*tab)+'px');
    tabs.removeClass('tab--active');
    $('*[data-tab="'+tab+'"]').addClass('tab--active');
}

function checkURL(hash){
    if(!hash) {
        if(!window.location.hash) hash='#driver__city';
            else hash = window.location.hash;
    }
    if(hash !== lasturl){
        lasturl=hash;
        loadPage(hash);
    }
}

function loadPage(url){
    if(!is_auth && url!=="#pages__sms") {
        url = "#pages__login";
        document.location = url;
    }
    url = url.replace('#','');
    var data = url.split('__');
    $('.loading').css('visibility','visible');
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
                $('.header__title').html(response.title);
                $('.content').html(response.content);
                if(data[0] !== lastsection || lastsection === '') {
                    $('.menu__response').html(response[0].menu);
                }
                lastsection = data[0];
                $('.loading').css('visibility','hidden');
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
    var center_marker = $('<div/>').addClass('centerMarker').appendTo(map_choice.getDiv());

    google.maps.event.addListener(map_choice, 'drag', function(){
        var coords = point2LatLng(center_marker[0].offsetLeft, center_marker[0].offsetTop, map_choice);
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
  if (event.which !== 0 && event.charCode !== 0){
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
