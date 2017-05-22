/* global User, Event, Maps, Conn, MapElements */

define(['Destinations', 'GetPositions', 'HideForms', 'ModalWindows', 'Storage', 'DriverOffer', 'Dom', 'Geo'], 
function (Destinations, GetPositions, HideForms, Modal, Storage, clDriverOffer, Dom, Geo) {
  var MyOffer,
      _timer,
      temp_lat, temp_lng, 
      eventOnClickMap = null,
      eventOnClickMarker,
      eventOnDragEndMarker,
      eventOnDragStartMarker,
      flightPath,
      routa = [],
      edit_route = false;
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(15);
  }
  
  function onchange(el) {
    var list_results = el.parentNode.querySelector('.form-order-city__hint'),
        input   = el,
        query   = input.value,
        route   = input.dataset.route,
        innText = '';
    
    list_results.style.display = 'none';
    list_results.innerHTML = "";
    clearTimeout(_timer);    

    if (query !== "") {
      _timer = setTimeout(startSearch, 1000);
    }

    function startSearch() {
      Conn.request('searchCity', query, cbSearchCity);
    }

    function cbSearchCity(results) {
      Conn.clearCb('cbSearchCity');
      var cities = results.result.city;
      
      if (cities) {
        for (var i = 0; i < cities.length; i++) {
          innText += '<p data-route="' + route + '" data-click="add_hint_city" data-latlng="' + cities[i].location + '">' + cities[i].city + '</p>';
        }
        
        list_results.innerHTML     = innText;
        list_results.style.display = 'block';
      }
    }
  }
  
  function addEvents() {
    
    Event.click = function (event) {
      var target = event.target;
      
      while (target !== this) {
        if (target) {
          var el;
        //  ============= EVENTS FOR DESTINATION FIELDS ============== 
          if (target.dataset.click === 'choose_address') {
            el = target;

            Storage.setTemporaryRoute(el.name);
            Storage.setTemporaryAddress(el.value);
            Storage.setActiveTypeModelTaxi('offer');
            goToPage = '#client_choose_address';
          }
          
          if (target.dataset.click === "add_hint_city") {
            var parent, route;

            el                          = target;
            el.parentNode.style.display = 'none';
            parent                      = el.parentNode.parentNode.querySelector('input');
            parent.value                = el.innerHTML;
            route                       = parent.dataset.route;
            
            if (route === "from") {
              MyOffer.fromCity         = el.innerHTML;
              MyOffer.fromCityLocation = el.dataset.latlng;
            } else {
              MyOffer.toCity           = el.innerHTML;
              MyOffer.toCityLocation   = el.dataset.latlng;
            }
          }

          if (target.dataset.click === 'choice_location') {
            Storage.setTemporaryRoute(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
            Storage.setActiveTypeModelTaxi('offer');
            goToPage = '#client_choice_location_map';

            break;
          }
          
          if (target.dataset.click === 'date_offer') {
            Modal.calendar( function (datetime) {
                              Destinations.addStartTimeOffer(datetime);
                            });
            break;
          }
          
          if (target.dataset.click === 'clean-field') {
            Destinations.cleanFieldOffer(target.dataset.field);

            break;
          }
          
          if (target.dataset.click === 'save-order') {
            var typer = Storage.getActiveTypeTaxi();
            
            if (typer === "intercity") {
              Destinations.saveOfferIntercity();
            } else if (typer === "trucking") {
              Destinations.saveOfferTrucking();
            } else if (typer === "taxi") {
              Destinations.saveOffer();
            } else if (typer === "tourism") {
              Destinations.saveOfferTourism();
            }

            break;
          }
          
          if (target.dataset.click === 'clear-route') {
            MyOffer.route = null;
            Storage.lullModel(MyOffer);
            MapElements.clear();
            Maps.removeElement(flightPath);
            flightPath = null;
            routa = [];
            Destinations.init(MyOffer);
          }
          
          if (target.dataset.click === 'edit-route') {
            el = target;
            if (MyOffer.fromAddress && MyOffer.toAddress) {
              if (!edit_route) {
                edit_route = true;
                el.innerHTML = 'Сохранить маршрут';
                enableEditRoute();
              } else {
                edit_route = false;
                el.innerHTML = 'Редакт.';
                MyOffer.route = JSON.stringify(routa);
                disableEditRoute();
                Storage.lullModel(MyOffer);
                reloadRoute();
              }
            }
          } 
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    
    content.addEventListener('click', Event.click);

    Event.input = function (event) {
      var target = event.target;

      while (target !== this) {
        if (target) {
          if (target.name === "city_from" || target.name === "city_to") {
            onchange(target);
          }
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };
    
    content.addEventListener('input', Event.input);
  }
  
  function disableEditRoute() {
    Maps.removeEvent(eventOnClickMap);
    Maps.removeEvent(eventOnClickMarker);
    Maps.removeEvent(eventOnDragEndMarker);
    Maps.removeEvent(eventOnDragStartMarker);
    eventOnClickMap = null;
    Maps.removeElement(flightPath);
    flightPath = null;
    
    for (var i = 0; i < MapElements.route_points.length; i++) {
      Maps.removeElement(MapElements.route_points[i]);
    }
    
    MapElements.route_points = [];
  }
  
  function enableEditRoute() {
    eventOnClickMap = Maps.addEvent(Maps.map, 'click', addMarker);
    
    for (i = 0; i < MapElements.routes.length; i++) {
      Maps.removeElement(MapElements.routes[i]);
    }
    
    MapElements.routes = [];
    
    if (MyOffer.route) {
      routa = JSON.parse(MyOffer.route);

      for (var i = 0; i < routa.length; i++) {
        routa[i][0] = Geo.roundCoords(routa[i][0]);
        routa[i][1] = Geo.roundCoords(routa[i][1]);
        
        var mark = Maps.addMarkerDrag(routa[i][0], routa[i][1], '', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==', [10,10], function(){});
        
        MapElements.route_points.push(mark);
        bindMarkerEvents(mark);

      }
    }
    
    reloadRoute();
  }
  
  function addMarker(e) {
    var LatLng = Maps.getLocationClick(e);
    
    LatLng[0] = Geo.roundCoords(LatLng[0]);
    LatLng[1] = Geo.roundCoords(LatLng[1]);
    
    var marker = Maps.addMarkerDrag(LatLng[0], LatLng[1], '', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAAJCAYAAADgkQYQAAAAi0lEQVR42mNgQIAoIF4NxGegdCCSHAMzEC+NijL7v3p1+v8zZ6rAdGCg4X+g+EyYorS0NNv////PxMCxsRYghbEgRQcOHCjGqmjv3kKQor0gRQ8fPmzHquj27WaQottEmxQLshubopAQI5CiEJjj54N8t3FjFth369ZlwHw3jQENgMJpIzSc1iGHEwB8p5qDBbsHtAAAAABJRU5ErkJggg==', [10,10], function(){});
    
    if (routa.length > 0) {
      var last_point = routa.length - 1,
          dist_first = Geo.distance(LatLng[0], LatLng[1], routa[0][0], routa[0][1]), 
          dist_last = Geo.distance(LatLng[0], LatLng[1], routa[last_point][0], routa[last_point][1]);
      
      if (dist_first > dist_last) {
        MapElements.route_points.push(marker);
        routa.push([LatLng[0], LatLng[1]]);
      } else {
        MapElements.route_points.splice(0, 0, marker);
        routa.splice(0, 0, [LatLng[0], LatLng[1]]);
      }
      
    } else {
      MapElements.route_points.push(marker);
      routa.push([LatLng[0], LatLng[1]]);
    }
    
    bindMarkerEvents(marker);
    reloadRoute();
  }
  
  function removeMarker(marker) {
    for (var i = 0; i < MapElements.route_points.length; i++) {
      if (Maps.getDistance(Maps.getMarkerCoords(marker), Maps.getMarkerCoords(MapElements.route_points[i])) < 0.1) {
        Maps.removeElement(MapElements.route_points[i]);
        MapElements.route_points.splice(i, 1);
        routa.splice(i, 1);
      }
    }
    
    reloadRoute();
  }
  
  function bindMarkerEvents(marker) {
    eventOnClickMarker = Maps.addEvent(marker, 'click', function () {
      removeMarker(marker);
    });
    
    eventOnDragStartMarker = Maps.addEventStartDrag(marker, function (point) {
      temp_lat = Geo.roundCoords(point[0]);
      temp_lng = Geo.roundCoords(point[1]);
      reloadRoute();
    });
    
    eventOnDragEndMarker = Maps.addEventDrag(marker, function (point) {
      point[0] = Geo.roundCoords(point[0]);
      point[1] = Geo.roundCoords(point[1]);
      Maps.markerSetPosition(point[0], point[1], marker);
      
      for (var i = 0; i < routa.length; i++) {
        console.log('temp_lat, routa[i][0], temp_lng, routa[i][1]', temp_lat, routa[i][0], temp_lng, routa[i][1]);
        
        if (temp_lat === routa[i][0] && temp_lng === routa[i][1]) {
          routa[i] = [point[0], point[1]];
          break;
        }
      }
      
      reloadRoute();
    });
  }
  
  function reloadRoute() {
    var flightPlanCoordinates = [];
    
    Maps.removeElement(flightPath);
    
    for (var i = 0; i < routa.length; i++) {
      flightPlanCoordinates.push({"lat":routa[i][0], "lng":routa[i][1]});
    }
    
    flightPath = Maps.drawLine(flightPlanCoordinates);
    Maps.addElOnMap(flightPath);
  }
  
  function addTrucking() {
    var innerAdditional = document.createElement('div'),
        elForm          = Dom.sel('.form-order-city__top'),
        elTo            = Dom.sel('.order-city-comment');
    
    innerAdditional.className += 'form-order-city__field';
    innerAdditional.innerHTML = '<i class="icon-box form-order-city__label"></i>' +
                                '<span class="form-order-city__wrap_short3"><input type="text" name="volume" value="" placeholder="Объем, м3"></span>' +
                                '<i class="icon-balance-scale form-order-city__label"></i>' +
                                '<span class="form-order-city__wrap_short3"><input type="text" name="weight" value="" placeholder="Вес, кг"></span>' +
                                '<i class="icon-hand-peace-o form-order-city__label"></i>' +
                                '<span class="form-order-city__wrap_short3"><input type="text" name="loaders" value="" placeholder="Грузчики"></span>';
    elForm.insertBefore(innerAdditional, elTo);
  }
  
  function addInterCity() {
    var innerCityFrom  = document.createElement('div'),
        innerCityTo    = document.createElement('div'),
        innerPlaces    = document.createElement('div'),
        elFrom         = Dom.sel('.order-city-from'),
        elTo           = Dom.sel('.order-city-to'),
        elForm         = Dom.sel('.form-order-city__top'),
        elFormChildren = Dom.sel('input[name="description"]').parentNode.parentNode;
    
    innerCityFrom.className += 'form-order-city__field';
    innerCityTo.className   += 'form-order-city__field';
    innerPlaces.className   += 'form-order-city__field';
    
    innerCityFrom.innerHTML  = '<i class="icon-commerical-building form-order-city__label"></i>' +
                               '<span class="form-order-city__wrap"><input data-route="from" type="text" name="city_from" value="" placeholder="Загрузка...">' +
                                  '<div class="form-order-city__hint"></div>' +
                               '</span>';
    innerCityTo.innerHTML    = '<i class="icon-commerical-building form-order-city__label"></i>' +
                               '<span class="form-order-city__wrap"><input data-route="to" type="text" name="city_to" value="" placeholder="Загрузка...">' +
                                  '<div class="form-order-city__hint"></div>' +
                               '</span>';
    innerPlaces.innerHTML    = '<i class="icon-accessibility form-order-city__label"></i>' +
                               '<span class="form-order-city__wrap_short3"><input type="text" name="seats" value="1" placeholder=""></span>' + 
                               '<i class="icon-shopping-bag form-order-city__label"></i>' +
                               '<span class="form-order-city__wrap_short3"><input type="text" name="bags" value="3" placeholder=""></span>';

    elForm.insertBefore(innerCityFrom, elFrom);
    elForm.insertBefore(innerCityTo, elTo);
    elForm.insertBefore(innerPlaces, elFormChildren);
  }
  
  function addTourism() {
    var innerPlaces    = document.createElement('div'),
        innerRouteInfo = document.createElement('div'),
        elForm         = Dom.sel('.form-order-city__top'),
        elFormChildren = Dom.sel('input[name="description"]').parentNode.parentNode;
    
    innerPlaces.className += 'form-order-city__field';
    innerPlaces.innerHTML  = '<i class="icon-accessibility form-order-city__label"></i>' +
                             '<span class="form-order-city__wrap_short3"><input type="text" name="seats" value="1" placeholder=""></span>' + 
                             '<i class="icon-shopping-bag form-order-city__label"></i>' +
                             '<span class="form-order-city__wrap_short3"><input type="text" name="bags" value="3" placeholder=""></span>';
    elForm.insertBefore(innerPlaces, elFormChildren);
    
    innerRouteInfo.className += 'form-order-city__field';
    innerRouteInfo.innerHTML  = '<button class="button_short--green" data-click="clear-route">Сбросить маршрут</button>' +
                                '<button class="button_short--green" data-click="edit-route">Редактировать маршрут</button>';
    elForm.insertBefore(innerRouteInfo, elFormChildren);
  }
  
  function stop() {
    disableEditRoute();
    GetPositions.clear();
    Destinations.clear();
    Storage.lullModel(MyOffer);
    Modal.close();
  }
  
  function start() {
    Storage.setUserRole('driver');
    
    var activeTypeTaxi = Storage.getActiveTypeTaxi();
    
    if (activeTypeTaxi === "intercity") {
      addInterCity();
    }
    
    if (activeTypeTaxi === "trucking") {
      addTrucking();
    }
    
    edit_route = false;
    
    Storage.setActiveTypeModelTaxi('offer');
    MyOffer = new clDriverOffer();
    MyOffer.activateCurrent();
    
    if (Storage.getChangeLocations()) {
      Storage.removeChangeLocations();
      MyOffer.route = null;
    }
    
    if (activeTypeTaxi === "tourism") {
      addTourism();
    }
    
    Maps.mapOn();
    GetPositions.my();
    initMap();
    Destinations.init(MyOffer);
    HideForms.init();
    addEvents();
  }


  return {
    start: start,
    clear: stop
  };
  
});