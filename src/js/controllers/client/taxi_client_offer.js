/* global User, average_speed, Event, MapElements, Conn, Maps, Car */

define(['Dom', 'HideForms', 'Storage', 'ClientOrder', 'Destinations'], 
function (Dom, HideForms, Storage, clClientOrder, Destinations) {

  var active_bid = false,
      fromAddress, toAddress, fromCity, toCity, fromCoords, toCoords, waypoints, price, order_id, ag_distanse,
      name_client, photo_client, travelTime, agIndexes, auto_photo, auto_brand, auto_model,
      MyOrder;
  
  function cbChangeState(response) {
    Conn.clearCb('cbChangeState');
    
    if (!response.error) {
      MyOrder.id = response.result.id;
    }
  }
  
  function cbGetOfferById(response) {
    Conn.clearCb('cbGetOfferById');
    
    var ords = response.result.offer;
    
    //MyOrder.setModel(response, true);
    order_id     = ords.id;
    fromAddress  = ords.fromAddress;
    fromCity     = ords.fromCity;
    toAddress    = ords.toAddress;
    toCity       = ords.toCity;
    fromCoords   = ords.fromLocation.split(",");
    toCoords     = ords.toLocation.split(",");
    price        = Math.round(ords.price);
    name_client  = ords.agent.name || User.default_name;
    photo_client = ords.agent.photo || User.default_avatar;
    agIndexes    = parseObj(getAgentIndexes(ords.agent));
    //distanse     = (ords.length / 1000).toFixed(1);
    //duration     = ords.duration;
    if (ords.agent.cars) {
      auto_photo   = ords.agent.cars[0].photo || Car.default_vehicle;
      auto_brand   = ords.agent.cars[0].brand;
      auto_model   = ords.agent.cars[0].model;  
    } else {
      auto_photo   = Car.default_vehicle;
      auto_brand   = '';
      auto_model   = '';  
    }
    
    if (ords.bids) {
      var bid_num = -1;
      
      for (var i = 0; i < ords.bids.length; i++) {
        if (ords.bids[i].order.agent.id === User.id) {
          bid_num = i;
        }
      }
      
      if (bid_num > -1) {
        active_bid          = true;
        MyOrder.price       = ords.bids[bid_num].order.price;
        price               = MyOrder.price;
        MyOrder.id          = ords.bids[bid_num].order.id;
        MyOrder.fromAddress = ords.bids[bid_num].order.fromAddress;
        MyOrder.fromCoords  = ords.bids[bid_num].order.fromLocation;
        MyOrder.fromCity    = ords.bids[bid_num].order.fromCity;
        MyOrder.toCity      = ords.bids[bid_num].order.toCity;
        MyOrder.toAddress   = ords.bids[bid_num].order.toAddress;
        MyOrder.toCoords    = ords.bids[bid_num].order.toLocation;
      }
    } else {
      if (MyOrder.price === 0) {
        MyOrder.price = price;
      } else {
        price = MyOrder.price;
      }

      if (!MyOrder.fromAddress) {
        MyOrder.fromAddress = fromAddress;
        MyOrder.fromCoords  = ords.fromLocation;
      }

      if (!MyOrder.toAddress) {
        MyOrder.toAddress = toAddress;
        MyOrder.toCoords  = ords.toLocation;
      }
    }
    
    ag_distanse = ords.agent.distance.toFixed(1);
    travelTime = ((ag_distanse / average_speed) * 60).toFixed(0);

    if (travelTime < 5) {
      travelTime = 5;
    } else {
      travelTime = 5 * Math.ceil( travelTime / 5 );
    }
    
    waypoints = [];
    MapElements.marker_to_2   = Maps.addMarker(fromCoords[0], fromCoords[1], fromAddress, '//maps.google.com/mapfiles/kml/paddle/wht-blank.png', [32,32], function(){});
    MapElements.marker_from_2 = Maps.addMarker(toCoords[0], toCoords[1], toAddress, '//maps.google.com/mapfiles/kml/paddle/wht-blank.png', [32,32], function(){});
    setRoute();
    HideForms.init();
  }
  
  function getAgentIndexes(agent) {
    return {'flag-checkered':agent.accuracyIndex, 'block':agent.cancelIndex, 'thumbs-up':agent.delayIndex, 'clock':agent.finishIndex};
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

  function setRoute() {
    var _active_bid = active_bid ? ' active' : '',
        price_minus = !active_bid ? '<i class="icon-minus-circled for-click" data-click="price_minus"></i>' : '',
        price_plus  = !active_bid ? '<i class="icon-plus-circle for-click" data-click="price_plus"></i>' : '',
        time_minus  = !active_bid ? '<i class="icon-minus-circled for-click" data-click="time_minus"></i>' : '',
        time_plus   = !active_bid ? '<i class="icon-plus-circle for-click" data-click="time_plus"></i>' : '',
        add_button  = '<i data-click="taxi_bid" class="font2 icon-ok-circled' + _active_bid + '"></i>',
        intt        = Dom.selAll('.wait-order-approve__route-info__cancel')[0],
        el_route    = Dom.sel('.wait-order-approve__route-info__route'),
        el_price    = Dom.sel('.wait-order-approve__route-info__price'),
        el          = Dom.sel('.wait-bids-approve'),
        addCityFrom = '',
        addCityTo   = '',
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
                        '<div>' + agIndexes + '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__approve">' +
                        '<img src="' + auto_photo + '" alt="' + auto_brand + ' ' + auto_model + '"><br/>' +
                        auto_brand + ' ' + auto_model +
                      '</div>' +
                    '</div>';
    Maps.drawRoute(MyOrder, false, function(){});
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target, 
          el;

      while (target !== this && target) {

            // Click taxi_bid
        if (target.dataset.click === "taxi_bid") {
          el = target;

          if (el.classList.contains('active')) {
            Conn.request('disagreeOffer', MyOrder.id);
            el.classList.remove('active');
            active_bid = false;
            setRoute();
          } else {
            var data = {};
            
            data.fromCity     = MyOrder.fromCity;
            data.fromAddress  = MyOrder.fromAddress;
            data.fromLocation = MyOrder.fromCoords;
            data.toCity       = MyOrder.toCity;
            data.toAddress    = MyOrder.toAddress;
            data.toLocation   = MyOrder.toCoords;
            data.price        = MyOrder.price;
            data.offer        = order_id;
            
            Conn.request('agreeOffer', data, cbChangeState);
            active_bid = true;
            setRoute();
          }
        }

        //  ============= EVENTS FOR DESTINATION FIELDS ============== 
        if (target.dataset.click === 'choose_address') {
          el = target;
          Storage.setTemporaryRoute(el.name);
          Storage.setTemporaryAddress(el.value);
          Storage.setActiveTypeModelTaxi('order');
          goToPage = '#client_choose_address';
        }
        if (target.dataset.click === 'choice_location') {
          Storage.setTemporaryRoute(target.parentNode.querySelectorAll('input')[0].getAttribute('name'));
          Storage.setActiveTypeModelTaxi('order');
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
    //GetPositions.clear();
    Destinations.clear();
    Storage.lullModel(MyOrder);
  }
  
  function start() {
    var _id = localStorage.getItem('_open_offer_id');
    
    MyOrder = new clClientOrder();
    MyOrder.activateCurrent();
    Maps.mapOn();
    initMap();
    Conn.request('getOfferById', _id, cbGetOfferById);
    Conn.request('stopGetOffer');
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});