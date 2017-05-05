/* global User, SafeWin, Event, driver_icon, MapElements, Conn, Maps, Zones, Car, Parameters */

define(['Dom', 'Dates', 'Chat', 'Geo', 'HideForms', 'GetPositions', 'Destinations', 'ClientOrder', 'Storage'], 
function (Dom, Dates, Chat, Geo, HideForms, GetPositions, Destinations, clClientOrder, Storage) {
    
  var show_route   = false,
      isFollow     = Storage.getFollowOrder(),
      color_follow = isFollow ? 'green' : 'red',
      inCar        = false,
      fromCoords, toCoords, fromAddress, toAddress,
      price, 
      dr_model, dr_name, dr_color, dr_number, dr_distanse,
      dr_photo, dr_vehicle, dr_time, duration_time,
      MyOrder;

  function cbFinishOrder() {
    Conn.clearCb('cbFinishOrder');
    
    var active_zones = Storage.getActiveZones();
    
    color_follow = isFollow ? 'green' : 'red';
    localStorage.setItem('_rating_order', MyOrder.id);
    
    if (active_zones) {
      var list_active_zone = active_zones.split(',');
      
      for (var i = 0; i < list_active_zone.length; i++) {
        Zones.inactive(list_active_zone[i]);
      }
      
      SafeWin.toggleButton();
      Storage.removeActiveZones();
    }
    
    Storage.removeTripClient();
    Storage.removeActiveRoute();
    Storage.removeFollowOrder();
    goToPage = '#agent_rating';
  }
  
  function cbCancelOrder() {
    Conn.clearCb('cbCancelOrder');
    
    Storage.removeFollowOrder();
    Storage.removeTripClient();
    goToPage = '#client_city';
  }

  function cbGetOrderById(response) {
    var ords = response.result.order;
    
    if (!response.error && ords.bids) {
      if (!ords) {
        stop();
        Storage.removeTripClient();
        goToPage = '#client_city';
        alert('К сожалению, заказ не найден.');
      }
      
      if (ords.inCar) {
        inCar = true;
        color_follow = 'grey';
      }
      
      color_follow = isFollow ? 'green' : color_follow;

      if (ords.finished) {
        cbFinishOrder();
      }

      var but,
          offer                 = ords.bids[0].offer,
          agnt                  = offer.agent,
          car                   = agnt.cars[0],
          toLoc                 = ords.toLocation,
          loc                   = agnt.location.split(','),
          lost_diff             = Dates.diffTime(ords.bids[0].approved, offer.travelTime),
          field_distance_to_car = Dom.sel('[data-view="distance_to_car"]'),
          field_while_car       = Dom.sel('[data-view="while_car"]'),
          field_duration        = Dom.sel('[data-view="duration"]'),
          incar_but             = Dom.sel('button[data-click="client-incar"]'),
          but_came              = Dom.sel('[data-click="client-came"]');

      if (ords.finishedByDriver) { //Add check safe zones
        Conn.request('finishOrder', MyOrder.id, cbFinishOrder);
        
        return;
      } 
      
      if (ords.id) {
        MyOrder.id = ords.id;
      }
      
      dr_model    = car.brand + ' ' + car.model;
      dr_name     = agnt.name;
      dr_color    = car.color;
      dr_number   = car.number;
      dr_distanse = ords.agent.distance.toFixed(1);

      if (lost_diff >= 0) {
        dr_time = lost_diff;
      } else {
        dr_time = '<span style="color:black">Опоздание</span> ' + Math.abs(lost_diff);
        if (lost_diff < -10) {
          but = Dom.sel('[data-click="cancel-order"]');

          if (!ords.arrived) {
            if (but && but.classList.contains('button_rounded--red')) {
              but.classList.remove('button_rounded--red');
              but.classList.add('button_rounded--green');
            }
          } else {
            if (but && but.classList.contains('button_rounded--green')) {
              but.classList.remove('button_rounded--green');
              but.classList.add('button_rounded--red');
            }
          }
        }
      }
      
      if (ords.arrived) {
        dr_time = 'На месте';
      }
      
      dr_photo            = agnt.photo || User.avatar;
      dr_vehicle          = car.photo || Car.default_vehicle;
      fromCoords          = ords.fromLocation.split(",");
      toCoords            = ords.toLocation.split(",");
      fromAddress         = ords.fromAddress;
      toAddress           = ords.toAddress;
      price               = Math.round(ords.price);
      duration_time       = Dates.minToHours(ords.duration);
      MyOrder.fromCoords  = ords.fromLocation;
      MyOrder.toCoords    = ords.toLocation;
      MyOrder.toAddresses = ords.toAddresses;
      MyOrder.toCoordses  = ords.toLocationes;
      MyOrder.fromAddress = ords.fromAddress;
      MyOrder.toAddress   = ords.toAddress;
      MyOrder.times       = ords.toTimes;
      
      if (field_distance_to_car) {
        field_distance_to_car.innerHTML = dr_distanse;
      }
      
      if (field_while_car) {
        field_while_car.innerHTML = dr_time;
      }
      
      if (field_duration) {
        field_duration.innerHTML = duration_time;
      }

      if (!show_route) {
        setRoute();
      }
      
      if (ords.arrived) {
        if (incar_but) {
          incar_but.disabled = false;
          if (!isFollow) {
            var el = Dom.sel('button[data-click="follow-order"]');
            
            el.classList.remove('button_rounded--red');
            el.classList.add('button_rounded--grey');
          }
        }
      }
      
      toLoc = toLoc.split(',');
      var dist = Geo.distance(User.lat, User.lng, toLoc[0], toLoc[1]);

      if (but_came) {
        if(isFollow) {
          but_came.disabled = false;
        } else {
          if (dist < Parameters.distanceToPoint) {
            but_came.disabled = false;
          }
        }
      }
      
      if (ords.canceledByDriver || ords.canceledByClient) {
        stop();
        Storage.removeTripClient();
        goToPage = '#client_city';
        alert('К сожалению, заказ отменен.');
      }
      
      if (ords.inCar) {
        if (incar_but) {
          var disabla = isFollow ? '' : ' disabled';
          incar_but.parentNode.innerHTML = '<button data-click="client-came" class="button_wide--green"' + disabla + '>Приехали</button>';
        }
      }    

      if (!MapElements.driver_marker) {
        var favorite  = !agnt.isFavorite ? '<button data-id="' + agnt.id + '" data-click="addtofav">Избранное</button>' : '<button data-id="' + agnt.id + '" data-click="deltofav">Удалить из Избранного</button>',
            info      = '<div style="text-align:center;">' +
                          '<div style="width:50%;display:inline-block;float: left;">' +
                            '<p>id' + agnt.id + '<br>' + dr_name + '</p>' +
                            '<p><img class="avatar" src="' + dr_photo + '" alt=""/></p>' +
                            '<p>' + favorite + '</p>' +
                          '</div>' +
                          '<div style="width:50%;display:inline-block">' +
                            '<p>' + car.brand + '<br>' + car.model + '</p>' +
                            '<p><img class="avatar" src="' + dr_vehicle + '" alt=""/></p>' +
                            '<p><button data-id="' + agnt.id + '" data-click="addtoblack">Черный список</button></p>' +
                          '</div>' +
                        '</div>';

        Maps.addMarker(loc[0], loc[1], 'Водитель', driver_icon, [32,32], function(mark) {
          Maps.addInfoForMarker(info, false, mark);
          MapElements.driver_marker = mark;
        });
      } else {
        Maps.markerSetPosition(loc[0], loc[1], MapElements.driver_marker);
      }
      
    } else {
      Storage.removeTripClient();
    }
  }
  
  function initMap() {
    Maps.setCenter(User.lat, User.lng);
    Maps.setZoom(12);
  }

  function setRoute() {
    var el_route    = Dom.sel('.wait-order-approve__route-info__route'),
        el_price    = Dom.sel('.wait-order-approve__route-info__price'),
        el_cancel   = Dom.sel('.wait-order-approve__route-info__cancel'),
        el          = Dom.sel('.wait-bids-approve'),
        addCityFrom = '',
        addCityTo   = '',
        activeTypeTaxi = Storage.getActiveTypeTaxi();

      if (activeTypeTaxi === "intercity" || activeTypeTaxi === "tourism") {
        addCityFrom = MyOrder.fromCity + ', ',
        addCityTo = MyOrder.toCity + ', ';
      }
    
    el_route.children[0].innerHTML = addCityFrom + fromAddress;
    el_route.children[2].innerHTML = addCityTo + toAddress;
    el_price.innerHTML  = price + ' руб.';
    el_cancel.innerHTML = '<button data-click="cancel-order" class="button_rounded--red">Отмена</button>' + 
                          '<button data-click="follow-order" class="button_rounded--' + color_follow + '">Передать</button>';
    el.innerHTML        = '<div class="wait-bids-approve__item">' +
                            '<div class="wait-bids-approve__item__distance">' +
                              'Автомобиль:<br/>' +
                              'Цвет: ' + dr_color + '<br/>' +
                              'Рег.номер: ' + dr_number +
                            '</div>' +
                            '<div class="wait-bids-approve__item__car">' +
                              '<div>' +
                                '<img src="' + dr_vehicle + '" alt="" />' +
                              '</div>' +
                              '<div>' +
                                dr_model +
                              '</div>' +
                            '</div>' +
                            '<div class="wait-bids-approve__item__driver">' +
                              '<div>' +
                                '<img src="' + dr_photo + '" alt="" />' +
                              '</div>' +
                              '<div>' +
                                dr_name +
                              '</div>' +
                            '</div>' +
                          '</div>';
    Maps.drawRoute(MyOrder, true, function () {
      addEvents();
    });
    show_route = true;
  }

  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target && target !== this) {
        if (target.dataset.click === "client-came") {
          Conn.request('finishOrder', MyOrder.id, cbFinishOrder);
          break;
        }
        
        if (target.dataset.click === 'client-incar') {
          var el = Dom.sel('button[data-click="follow-order"]');
          
          el.classList.remove('button_rounded--red');
          el.classList.add('button_rounded--grey');
          Conn.request('inCarClient', MyOrder.id);
          break;
        }
        
        if (target.dataset.click === 'follow-order') {
          var el = target,
              stat = el.classList[0],
              status = stat.replace("button_rounded--", "");
          
          if (status === "red") {
            alert('Вы еще ничего не передали, нажмите "В машине"');
            break;
          }
          
          if (isFollow) {
            el.classList.remove('button_rounded--green');
            el.classList.add('button_rounded--grey');
            isFollow = false;
            Storage.removeFollowOrder();
          } else {
            el.classList.add('button_rounded--green');
            el.classList.remove('button_rounded--grey');
            isFollow = true;
            Storage.setFollowOrder();
          }
          
          break;
        }
        
        if (target.dataset.click === 'cancel-order') {
          if (confirm('Отменить заказ?')) {
            Conn.request('cancelOrder', MyOrder.id, cbCancelOrder);
          }
          
          break;
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
    GetPositions.clear();
    Destinations.clear();
    Conn.clearCb('cbGetOrderById');
    Conn.request('stopGetOrder');
    Chat.exit();
    Storage.lullModel(MyOrder);
    SafeWin.disableZoneForRoute();
  }
  
  function start() {
    var orderId = Storage.getTripClient();
    
    MyOrder = new clClientOrder();
    //MyOrder.activateCurrent();
    MyOrder.getByID(orderId, function () {
      if (orderId) {
        show_route = false;
        isFollow = Storage.getFollowOrder();
        Maps.mapOn();
        initMap();
        SafeWin.overviewPath = [];
        GetPositions.my();
        //Conn.request('startOrdersByOffer', MyOrder.id, cbGetOrderById);
        Conn.request('getOrderById', MyOrder.id, cbGetOrderById);
        Chat.start('order', MyOrder.id);
        HideForms.init();

        if (MyOrder.zone) {
          SafeWin.polyRoute = Maps.drawPoly(MyOrder.zone.polygon);
          SafeWin.enableButtonRoute();
          Maps.addElOnMap(SafeWin.polyRoute);
        }

      } else {
        Storage.removeTripClient();
        goToPage = "#client_city";
      }
    });
  }
  
  return {
    start: start,
    clear: stop
  };
  
});