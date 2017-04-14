/* global User, Car, average_speed, Event, MapElements, Conn, Maps */

define(['Dom', 'Dates', 'ModalWindows', 'HideForms', 'Storage', 'ClientOrder', 'Destinations', 'DriverOffer'], 
function (Dom, Dates, Modal, HideForms, Storage, clClientOrder, Destinations, clDriverOffer) {

  var active_bid = false, points = [], name_points =[],
      fromAddress, toAddress, fromCoords, toCoords, waypoints, price, order_id, distanse, ag_distanse, duration,
      name_client, photo_client, travelTime, agIndexes, cargo_info = '',
      global_el,
      MyOrder;
  
  function cbAgreeOrder(response) {
    Conn.clearCb('cbAgreeOrder');
    
    if (!response.error) {
      var checkOffer = new clDriverOffer;
      
      checkOffer.getByID(response.result.id, function () {});
    }
  }
  
  function cbDisagreeOrder(response) {
    Conn.clearCb('cbDisagreeOrder');
    
    if (!response.error) {
      global_el.classList.remove('active');
      active_bid = false;
      setRoute();
    } else {
      window.location.hash = "#driver_city";
    }
  }

  function cbGetOrderById(response) {
    Conn.clearCb('cbGetOrderById');
    
    var ords = response.result.order;
    
    if (!response.error) {
      if (ords) {
        MyOrder.setModel(response);
        order_id = ords.id;
        fromAddress = ords.fromAddress;
        toAddress = ords.toAddress;
        fromCoords = ords.fromLocation.split(",");
        toCoords = ords.toLocation.split(",");
        price = Math.round(ords.price);
        name_client = ords.agent.name || User.default_name;
        photo_client = ords.agent.photo || User.default_avatar;
        distanse = (ords.length / 1000).toFixed(1);
        duration = ords.duration;
        agIndexes = parseObj(getAgentIndexes(ords.agent));

        if (ords.weight) {
          cargo_info += ' Вес: ' + ords.weight;
        }

        if (ords.volume) {
          cargo_info += ' Объем: ' + ords.volume;
        }

        if (ords.stevedores) {
          cargo_info += ' Грузчики: ' + ords.stevedores;
        }


        for (var y = 0; y < ords.bids.length; y++) {
          var agid = ords.bids[y].offer.agent.id,
              approve = ords.bids[y].approved;

          if (agid === User.id && approve) {
            active_bid = true;
            break;
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
        points = [];
        name_points = [];

        if (ords.points) {
          for (var i = 0; i < ords.points.length; i++) {
            var _wp = ords.points[i].location.split(",");

            waypoints.push(Maps.convertWayPointsForRoutes(_wp[0], _wp[1]));
            name_points.push({address: ords.points[i].address, time: ords.points[i].stopTime});
            Maps.addMarker(_wp[0], _wp[1], ords.points[i].address, '//maps.google.com/mapfiles/kml/paddle/' + (i + 1) + '.png', [32,32],
              function (mark) {
                Maps.addInfoForMarker(ords.points[i].stopTime + 'мин.', true, mark);
                MapElements.points.push(mark);
              });
          }
        }

        Maps.addMarker(fromCoords[0], fromCoords[1], fromAddress, '//maps.google.com/mapfiles/kml/paddle/A.png', [32,32],
          function (mark) {
            MapElements.marker_to = mark;
          });
        Maps.addMarker(toCoords[0], toCoords[1], toAddress, '//maps.google.com/mapfiles/kml/paddle/B.png', [32,32],
          function (mark) {
            MapElements.marker_from = mark;
          });

        setRoute();
        Maps.drawRoute(MyOrder, false, function(){});
        HideForms.init();
      }
    } else {
      window.location.hash = '#driver_city';
    }
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
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

  function setRoute() {
    var _active_bid = active_bid ? ' active' : '',
        price_minus = !active_bid ? '<i class="icon-minus-circled for-click" data-click="price_minus"></i>' : '',
        price_plus  = !active_bid ? '<i class="icon-plus-circle for-click" data-click="price_plus"></i>' : '',
        time_minus  = !active_bid ? '<i class="icon-minus-circled for-click" data-click="time_minus"></i>' : '',
        time_plus   = !active_bid ? '<i class="icon-plus-circle for-click" data-click="time_plus"></i>' : '',
        add_button = '<i data-click="taxi_bid" class="font4 icon-ok-circled' + _active_bid + '"></i>',
        intt = Dom.selAll('.wait-order-approve__route-info__cancel')[0],
        el_route = Dom.sel('.wait-order-approve__route-info__route'),
        _addrPoints = "",
        el_price = Dom.sel('.wait-order-approve__route-info__price'),
        el = Dom.sel('.wait-bids-approve');
      
    if (intt) {
      intt.innerHTML = add_button;
    }
    
    el_route.children[0].innerHTML = fromAddress;
    el_route.children[2].innerHTML = toAddress;
    el_route.children[3].innerHTML = cargo_info;
    
    for (var i = 0; i < name_points.length; i++) {
      _addrPoints += '<p>' + name_points[i].address + ', ' + name_points[i].time + ' мин.</p>';
    }
    
    if (_addrPoints === "") {
      _addrPoints = "Заездов нет";
    }
    
    el_route.children[1].innerHTML = _addrPoints;
      
    el_price.innerHTML = price_minus + '<span>' + price + '</span> руб.' + price_plus;
    el.innerHTML = '<div class="wait-bids-approve__item">' +
                      '<div class="wait-bids-approve__item__distance">' +
                        '<p>До: <span data-view="distance_to_car">' + ag_distanse + '</span> км.</p>' +
                        '<p>Буду: ' + time_minus + '<span data-view="while_car">' + travelTime + '</span> мин.' + time_plus + '</p>' +
                        '<p>Маршрут: <span>' + distanse + ' км.</span> / <span>' + Dates.minToHours(duration) + '</span></p>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__driver">' +
                        '<div>' +
                          '<img src="' + photo_client + '" alt="" />' +
                        '</div>' +
                        '<div>' +
                          name_client +
                        '</div>' +
                        '<div>' + agIndexes + '</div>' +
                      '</div>' +
                      '<div class="wait-bids-approve__item__approve"></div>' +
                    '</div>';
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target, el;

      while (target !== this && target) {

            // Click taxi_bid
        if (target.dataset.click === "taxi_bid") {
          el = target,
          global_el = target;

          if (el.classList.contains('active')) {
              Conn.request('disagreeOrder', order_id, cbDisagreeOrder);
          } else {
            if (!User.is_auth) {
              Modal.show('<p>Для совершения заказов необходимо авторизоваться</p>' +
                         '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                         '<button class="button_rounded--green" data-response="yes">Войти</button></p>', 
                        function (response) {
                          if (response === "yes") {
                            window.location.hash = '#login';
                          }
                        });
            } else if (Car.inGarage === 0) {
              Modal.show('<p>Для совершения заказов необходимо добавить автомобиль</p>' +
                         '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                         '<button class="button_rounded--green" data-response="yes">Перейти</button></p>',
                        function (response) {
                          if (response === "yes") {
                            window.location.hash = '#driver_my_auto';
                          }
                        });
            } else if (!Car.id) {
                Modal.show('<p>Для совершения заказов необходимо выбрать автомобиль из списка</p>' +
                          '<p><button class="button_rounded--yellow" data-response="no">Отмена</button>' +
                          '<button class="button_rounded--green" data-response="yes">Перейти</button></p>',
                        function (response) {
                          if (response === "yes") {
                            window.location.hash = '#driver_my_auto';
                          }
                        });
              } else {
              var li        = el.parentNode.parentNode,
                  pricer    = li.querySelector('.wait-order-approve__route-info__price span'),
                  timer     = li.querySelector('span[data-view="while_car"]'),
                  get_price = pricer.split(' '),
                  data      = {};

              data.id = order_id;
              data.price = get_price[0];
              data.travelTime = timer;
              Conn.request('agreeOrder', data, cbAgreeOrder);
              active_bid = true;
              el.classList.remove('active');
              setRoute();
            }
          }
        }
          
        if (target.dataset.click === "time_minus") {
          el = target;

          var time_el = el.parentNode.children[1],
              time = time_el.innerHTML;
          
          time = time.split(" ");
          time = parseInt(time[0]) - 5;
          
          if (time < 5) {
            time = 5;
          }
          travelTime = time;
          time_el.innerHTML = time;
        }

        if (target.dataset.click === "time_plus") {
          el = target;

          var time_el = el.parentNode.children[1],
              time = time_el.innerHTML;
            
          time = time.split(" ");
          time = parseInt(time[0]) + 5;

          travelTime = time < 0 ? 0 : time;
          time_el.innerHTML = travelTime;
        }

        if (target.dataset.click === "price_minus") {
          el = target;

          var price_el = el.parentNode.children[1];
          var _price = price_el.innerHTML;
          
          _price = _price.split(" ");
          _price = parseInt(_price[0]) - 10;
          if (_price < 0) {
            _price = 0;
          }
          price = _price;
          price_el.innerHTML = _price;
        }

        if (target.dataset.click === "price_plus") {
          el = target;

          var price_el = el.parentNode.children[1],
              _price = price_el.innerHTML;
            
          _price = _price.split(" ");
          _price = parseInt(_price[0]) + 10;
          price = _price;
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
    Destinations.clear();
    Storage.lullModel(MyOrder);
  }
  
  function start() {
    var _id = localStorage.getItem('_open_order_id');
    
    MyOrder = new clClientOrder();
    MyOrder.activateCurrent();
    Maps.mapOn();
    initMap();
    Conn.request('getOrderById', _id, cbGetOrderById);
    Conn.request('stopGetOrder');
    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});