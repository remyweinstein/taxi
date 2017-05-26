/* global User, average_speed, Event, MapElements, Conn, Maps, Car */

define(['Dom', 'HideForms', 'Storage', 'ClientOrder', 'Destinations', 'Dates'], 
function (Dom, HideForms, Storage, clClientOrder, Destinations, Dates) {

  var active_bid = false,
      fromAddress, toAddress, fromCity, toCity, fromCoords, toCoords, waypoints, price, order_id, offerId, ag_distanse,
      name_client, photo_client, travelTime, agIndexes, agRating, auto_photo, auto_brand, auto_model,
      MyOrder, isConstant = false,
      activeTypeTaxi,
      seatsVal, startVal, offsetVal, occupiedSeatsVal, bagsVal;
  
  function cbChangeState(response) {
    Conn.clearCb('cbChangeState');
    
    if (!response.error) {
      MyOrder.id = response.result.id;
      active_bid = true;
    } else {
      active_bid = false;
    }
    
    //setRoute();
  }
  
  function cbDisagreeOffer(response) {
    Conn.clearCb('cbDisagreeOffer');
    
    if (!response.error) {
      MyOrder.id = null;
      active_bid = false;
    } else {
      active_bid = true;
    }
    
    //setRoute();
  }
    
  function cbGetOfferById(response) {
    //  var lists = Dom.sel('.wait-bids-approve__lists');
    //  for (var i = 0; i < response.order; i++) {
    //    
    //  }
    
    var offer = response.result.offer;

    //MyOrder.setModel(response, true);
    order_id     = offer.id;
    fromAddress  = offer.fromAddress;
    fromCity     = offer.fromCity;
    toAddress    = offer.toAddress;
    toCity       = offer.toCity;
    isConstant   = offer.isConstant;
    fromCoords   = offer.fromLocation.split(",");
    toCoords     = offer.toLocation.split(",");
    price        = Math.round(offer.price);
    name_client  = offer.agent.name  || User.default_name;
    photo_client = offer.agent.photo || User.default_avatar;
    agIndexes    = parseObj(getAgentIndexes(offer.agent));
    agRating     = offer.agent.rating;
    seatsVal         = offer.seats;
    startVal         = offer.start;
    offsetVal        = offer.offset ? ' ' + offer.offset + ' мин.' : '';
    occupiedSeatsVal = offer.occupiedSeats;
    bagsVal          = offer.bags;
    //distanse         = (offer.length / 1000).toFixed(1);
    //duration         = offer.duration;
    
    if (!isConstant) {
      var elChangeFromAddress = Dom.sel('div.order-city-from'),
          elChangeToAddress   = Dom.sel('div.order-city-to');
        
      if (elChangeFromAddress && elChangeToAddress) {
        elChangeFromAddress.classList.remove('hidden-forms');
        elChangeToAddress.classList.remove('hidden-forms');
      }
    }
    
    if (offer.agent.cars) {
      auto_photo   = offer.agent.cars[0].photo || Car.default_vehicle;
      auto_brand   = offer.agent.cars[0].brand;
      auto_model   = offer.agent.cars[0].model;  
    } else {
      auto_photo   = Car.default_vehicle;
      auto_brand   = '';
      auto_model   = '';  
    }
    
    if (offer.bids) {
      var bid_num = -1;
      
      for (var i = 0; i < offer.bids.length; i++) {
        if (offer.bids[i].order.agent.id === User.id) {
          bid_num = i;
          break;
        }
      }
      
      if (bid_num > -1) {
        active_bid          = true;
        MyOrder.price       = offer.bids[bid_num].order.price;
        price               = MyOrder.price;
        MyOrder.id          = offer.bids[bid_num].order.id;
        MyOrder.fromAddress = offer.bids[bid_num].order.fromAddress;
        MyOrder.fromCoords  = offer.bids[bid_num].order.fromLocation;
        MyOrder.fromCity    = offer.bids[bid_num].order.fromCity;
        MyOrder.toCity      = offer.bids[bid_num].order.toCity;
        MyOrder.toAddress   = offer.bids[bid_num].order.toAddress;
        MyOrder.toCoords    = offer.bids[bid_num].order.toLocation;
        MyOrder.seats       = offer.bids[bid_num].order.seats;
        MyOrder.bags        = offer.bids[bid_num].order.bags;
      }
    } else {
      if (MyOrder.price === 0) {
        MyOrder.price = price;
      } else {
        price = MyOrder.price;
      }

      if (!MyOrder.fromAddress) {
        MyOrder.fromAddress = fromAddress;
        MyOrder.fromCoords  = offer.fromLocation;
      }

      if (!MyOrder.toAddress) {
        MyOrder.toAddress = toAddress;
        MyOrder.toCoords  = offer.toLocation;
      }
    }
    
    var listsEl = Dom.sel('div.wait-bids-approve__lists'),
        innerTxt = '';

    for (var y = 0; y < offer.bids.length; y++) {
      if (offer.bids[y].approved) {
        innerTxt += '<div>' +
                      (offer.bids[y].order.agent.name || 'Гость') + ', ' +
                      'Мест: ' + offer.bids[y].order.seats +
                    '</div>';
      }
    }
    
    listsEl.innerHTML = innerTxt;
    
    MyOrder.route = offer.route;
    
    ag_distanse = offer.agent.distance.toFixed(1);
    travelTime = ((ag_distanse / average_speed) * 60).toFixed(0);

    if (travelTime < 5) {
      travelTime = 5;
    } else {
      travelTime = 5 * Math.ceil( travelTime / 5 );
    }
    
    waypoints = [];
    
    MapElements.marker_to_2   = Maps.addMarker(fromCoords[0], fromCoords[1], fromAddress, '//maps.google.com/mapfiles/kml/paddle/wht-circle.png', [32,32], function(){});
    MapElements.marker_from_2 = Maps.addMarker(toCoords[0], toCoords[1], toAddress, '//maps.google.com/mapfiles/kml/paddle/wht-circle.png', [32,32], function(){});
    
    setRoute();
    HideForms.init();
  }
  
  function getAgentIndexes(agent) {
    return {'flag-checkered':agent.driverAccuracyIndex, 'block':agent.driverCancelIndex, 'thumbs-up':agent.driverDelayIndex, 'clock':agent.driverFinishIndex};
  }
  
  function parseObj(obj) {
    var content = '';
    
    for (var key in obj) {
      content += '<span><i class="icon-' + key + '"></i> ' + obj[key] + ' </span>';
    }
    
    return content;
  }

  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
  }
  
  function addTourism() {
    var fields =  '<div>Мест: ' + seatsVal + ' / ' + occupiedSeatsVal + ', Багаж: ' + bagsVal + ' мест</div>' + 
                  '<div>Время старта: ' + Dates.datetimeForPeople(startVal) + offsetVal + '</div>' + 
                  '<i class="icon-accessibility form-order-city__label"></i>' +
                      '<span class="form-order-city__wrap_short3">' +
                          '<input type="text" name="seats" value="' + (MyOrder.seats || 1) + '" placeholder="" autocomplete="off">' +
                      '</span>' +
                  '<i class="icon-shopping-bag form-order-city__label"></i>' +
                      '<span class="form-order-city__wrap_short3">' + 
                          '<input type="text" name="bags" value="' + (MyOrder.bags || 0) + '" placeholder="" autocomplete="off">' +
                      '</span>',
        el_for_intercity = Dom.sel('div.add_for_intercity');
    
    if (el_for_intercity) {
      el_for_intercity.innerHTML = fields;
    }
  }

  function setRoute() {
    var _active_bid    = active_bid ? ' active' : '',
        price_minus    = !active_bid ? '<i class="icon-minus-circled for-click" data-click="price_minus"></i>' : '',
        price_plus     = !active_bid ? '<i class="icon-plus-circle for-click" data-click="price_plus"></i>' : '',
        time_minus     = !active_bid ? '<i class="icon-minus-circled for-click" data-click="time_minus"></i>' : '',
        time_plus      = !active_bid ? '<i class="icon-plus-circle for-click" data-click="time_plus"></i>' : '',
        add_button     = '<i data-click="taxi_bid" class="font2 icon-ok-circled' + _active_bid + '"></i>',
        intt           = Dom.selAll('.wait-order-approve__route-info__cancel')[0],
        el_route       = Dom.sel('.wait-order-approve__route-info__route'),
        el_price       = Dom.sel('.wait-order-approve__route-info__price'),
        el             = Dom.sel('.wait-bids-approve'),
        addCityFrom    = '',
        addCityTo      = '',
        activeTypeTaxi = Storage.getActiveTypeTaxi();
      
    if (intt) {
      intt.innerHTML = add_button;
    }
    
    if (activeTypeTaxi === "intercity") {
      //addInterCity();
      addCityFrom = fromCity + ', ',
      addCityTo   = toCity + ', ';
    }

    if (activeTypeTaxi === "tourism") {
      //addInterCity();
      addCityFrom = fromCity + ', ',
      addCityTo   = toCity + ', ';
    }
    
    if (activeTypeTaxi === "trucking") {
      addTrucking();
    }
    
    Dom.sel('div[data-route="from"]').innerHTML = addCityFrom + fromAddress;
    Dom.sel('div[data-route="to"]').innerHTML   = addCityTo + toAddress;
    Dom.sel('input.adress_from').value          = MyOrder.fromAddress;
    Dom.sel('input.adress_to').value            = MyOrder.toAddress;
    el_price.innerHTML = price_minus + '<span>' + price + '</span> руб.' + price_plus;
    
    el.innerHTML = '<div class="wait-bids-approve__item">' +
                      '<div class="wait-bids-approve__item__driver">' +
                        '<div>' +
                          '<img src="' + photo_client + '" alt="" />' +
                        '</div>' +
                        '<div>' +
                          name_client +
                        '</div>' +
                        '<div>Рейтинг: ' + agRating + '</div>' +
                        '<div>' + agIndexes + '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__approve">' +
                        '<img src="' + auto_photo + '" alt="' + auto_brand + ' ' + auto_model + '"><br/>' +
                        auto_brand + ' ' + auto_model +
                      '</div>' +
                    '</div>';
                  
    var line = false;
    
    if (activeTypeTaxi === "tourism" && MyOrder.route) {
      line = true;
    }
    
    if (activeTypeTaxi === "tourism" || activeTypeTaxi === "intercity") {
      addTourism();
    }

    Maps.drawRoute(MyOrder, false, false, line, function(){});

  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target, 
          el;

      while (target !== this && target) {

            // Click taxi_bid
        if (target.dataset.click === "taxi_bid") {
          var elSeats = Dom.sel('input[name="seats"]'),
              elBags  = Dom.sel('input[name="bags"]');
          
          el = target;
          
          if (el.classList.contains('active')) {
            Conn.request('disagreeOffer', MyOrder.id, cbDisagreeOffer);
          } else {
            var data = {};
            
            if (activeTypeTaxi !== "tourism" && !isConstant) {
              data.fromCity     = MyOrder.fromCity;
              data.fromAddress  = MyOrder.fromAddress;
              data.fromLocation = MyOrder.fromCoords;
              data.toCity       = MyOrder.toCity;
              data.toAddress    = MyOrder.toAddress;
              data.toLocation   = MyOrder.toCoords;
            }
            
            data.seats = elSeats ? elSeats.value : 1;
            data.bags  = elBags ? elBags : 0;
            data.price = MyOrder.price;
            data.id    = offerId;
            
            Conn.request('agreeOffer', data, cbChangeState);
          }
        }

        //  ============= EVENTS FOR DESTINATION FIELDS ============== 
        if (target.dataset.click === 'choose_address') {
          el = target;
          Storage.setTemporaryRoute(el.name);
          Storage.setTemporaryAddress(el.value);
          Storage.setActiveTypeModelTaxi('offer');
          goToPage = '#client_choose_address';
        }
        if (target.dataset.click === 'choice_location') {
          Storage.setTemporaryRoute(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
          Storage.setActiveTypeModelTaxi('offer');
          goToPage = '#client_choice_location_map';
          break;
        }

        if (target.dataset.click === "price_minus") {
          el = target;

          var price_el = el.parentNode.children[1],
              _price = price_el.innerHTML;
          
          _price = _price.split(" ");
          _price = parseInt(_price[0]) - 10;
          
          price = _price < 0 ? 0 : _price;
          MyOrder.price = price;
          price_el.innerHTML = price;
        }

        if (target.dataset.click === "price_plus") {
          el = target;

          var price_el = el.parentNode.children[1],
              _price = price_el.innerHTML;
            
          _price = _price.split(" ");
          _price = parseInt(_price[0]) + 10;
          price = _price;
          MyOrder.price = _price;
          price_el.innerHTML = _price;
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };

    content.addEventListener('click', Event.click);
  }
  
  function stop() {
    Conn.clearCb('cbGetOrders');
    Conn.request('stopOfferById');
    //GetPositions.clear();
    Destinations.clear();
    Storage.lullModel(MyOrder);
  }
  
  function start() {
    Storage.setUserRole('client');
    activeTypeTaxi = Storage.getActiveTypeTaxi();
    
    offerId = Storage.getOpenOfferId();
    
    if (activeTypeTaxi === "tourism") {
      Dom.sel('.order-city-from').style.display = 'none';
      Dom.sel('.order-city-to').style.display   = 'none';
    }
    
    MyOrder = new clClientOrder();
    MyOrder.activateCurrent();
    Maps.mapOn();
    initMap();
    Conn.request('startOfferById', offerId, cbGetOfferById);
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});