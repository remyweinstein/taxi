/* global MapElements, Maps, User, Conn, Parameters */

define(['Dom', 'ModalWindows', 'Storage', 'Dates'], 
function (Dom, Modal, Storage, Dates) {

  var Model, price, comment;

  function AddNewZaezd(just_add) {
    var time = Model.times[just_add] ? Model.times[just_add] + " мин" : "",
        addr = Model.toAddresses[just_add] || "",
        el,
        new_field = document.createElement('div'),
        activeTypeTaxi = Storage.getActiveTypeTaxi();

    if (activeTypeTaxi==="intercity" || activeTypeTaxi==="tourism") {
      el = Dom.sel('.order-Namecity-from');
    } else {
      el = Dom.sel('.order-city-to');
    }
    
    var parentDiv = el.parentNode;
    
    new_field.className += 'form-order-city__field order-city-to_z';
    new_field.innerHTML = '<i class="icon-record form-order-city__label"></i>' +
                          '<span class="form-order-city__wrap">' +
                            '<input type="text" data-click="choose_address" name="to_plus' + just_add + '" value="' + addr + '" placeholder="Заезд"/>' +
                          '</span>' +
                          '<span data-click="field_add_time" data-id="' + just_add + '" class="form-order-city__field_add_time">' +
                            '<i class="icon-clock"></i><span class="top-index">' + time + '</span>' +
                          '</span>' +
                          '<span data-click="field_delete" data-id="' + just_add + '" class="form-order-city__field_delete">' +
                            '<i class="icon-trash"></i>' +
                          '</span>' +
                          '<i data-click="choice_location" class="icon-street-view form-order-city__add-button"></i>';

    parentDiv.insertBefore(new_field, el);
  }

  function reloadPoints(Model) {
    var rem_old_stops = Dom.selAll('.order-city-to_z'),
        i;

    for (i = 0; i < rem_old_stops.length; i++) {
      rem_old_stops[i].parentNode.removeChild(rem_old_stops[i]);
    }
    
    if (Model.toAddresses) {
      for (i = 0; i < Model.toAddresses.length; i++) {
        AddNewZaezd(i);
      }
    }
  }

  function SaveOrderOffer(type, typeOf, callback) {
    var _price = Dom.sel('[name="cost"]').value,
        weight = Dom.sel('input[name="weight"]'),
        volume = Dom.sel('input[name="volume"]'),
        seats  = Dom.sel('input[name="seats"]'),
        bags   = Dom.sel('input[name="bags"]'),
        stevedores = Dom.sel('input[name="loaders"]'),
        now   = new Date();
      
    if (now.valueOf() > Date.parse(Model.start)) {
      Model.start = now.getFullYear() + '-' + (now.getMonth()+ 1)   + '-' + now.getDate() + ' ' +  now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds();
    }
    
    Model.stevedores = stevedores ? stevedores.value : null;
    Model.volume     = volume ? volume.value : null;
    Model.weight     = weight ? weight.value : null;
    Model.seats      = seats ? seats.value : null;
    Model.occupiedSeats = 0;
    Model.bags       = bags ? bags.value : null;
    //event.preventDefault();
    Dom.sel('[data-click="save-order"]').disabled = true;
    Model.type    = typeOf || 'taxi';
    Model.price   = _price === "" ? Model.recommended_cost : _price;
    Model.comment = Dom.sel('[name="description"]').value;
    Model.save(callback);
    Storage.lullModel(Model);
  }

  function cleanField(_field, type) {
    if (_field === "from") {
      Model.fromAddress = null;
      Model.fromCity = null;
      Model.fromCoords = null;
      Model.fromFullAddress = null;
    }

    if (_field === "to") {
      Model.toAddress = null;
      Model.toCity = null;
      Model.toCoords = null;
      Model.toFullAddress = null;
    }

    Dom.selAll('.adress_' + _field)[0].value = "";
    Destinations.clear();
    init(Model);
    Storage.lullModel(Model);
  }
  
  function compareTime(datetime) {
    var currentday   = new Date(),
        seldateV     = new Date(datetime).valueOf(),
        sel_year  = currentday.getFullYear(),
        sel_month = currentday.getMonth(),
        sel_day   = currentday.getDate(),
        sel_hour  = currentday.getHours(),
        sel_min   = currentday.getMinutes(),
        check_min = roundFive(currentday.getMinutes()) + Parameters.t3;
      
    function roundFive(a) {
      var b = a % 5;
      b && (a = a - b + 5);

      return a;
    }
    
    sel_month++;
    sel_month = '0' + sel_month;
    
    if (check_min > 60) {
      check_min = '00';
      sel_hour++;
      
      if (sel_hour > 23) {
        sel_hour = '00';
        sel_day++;
      }
    }
    
    if (check_min < 10) {
      check_min = '0' + check_min;
    }
    
    var guess_time = new Date(sel_year + '-' + sel_month + '-' + sel_day + ' ' + sel_hour + ':' + check_min + ':00').valueOf();
      
    if (seldateV < guess_time) {
      return false;
    } else {
      return true;
    }
    
  }
  
  function addStartTime (datetime) {
    var buttonierro = Dom.sel('button[data-click="date_order"]') || Dom.sel('button[data-click="date_offer"]'),
        text = Dates.datetimeForPeople(datetime);
    
    if (!compareTime(datetime)) {
      datetime = null;
      text = 'Сейчас';
    }
    
    Model.start = datetime;
    buttonierro.innerHTML = text;
  }

  function addTime(id) {
    Modal.show('<p><button class="button_rounded--green" data-response="0">Без задержки</button></p>' +
      '<p><button class="button_rounded--green" data-response="5">5 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="10">10 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="15">15 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="20">20 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="30">30 мин</button></p>',
      function (response) {
        eval("Model.times[" + id + "] = " + response);
        Destinations.clear();
        init(Model);
        Storage.lullModel(Model);
      });
  }

  function init(model) {
    Model = model;
    price = Dom.sel('[name="cost"]').value;
    comment = Dom.sel('[name="description"]').value;
    price.value = Model.price;
    comment.value = Model.comment;
    Dom.selAll('input[name="from"]')[0].value = Model.fromAddress;
    Dom.selAll('input[name="to"]')[0].value = Model.toAddress;
    
    if (Dom.sel('input[name="city_from"]')) {
      Dom.sel('input[name="city_from"]').value = Model.fromCity || User.city;
      Dom.sel('input[name="city_from"]').dataset.location = Model.fromCityLocation || User.lat + ',' + User.lng;
      Dom.sel('input[name="city_to"]').value = Model.toCity || User.city;
      Dom.sel('input[name="city_from"]').dataset.location = Model.toCityLocation || User.lat + ',' + User.lng;
      Dom.sel('input[name="seats"]').value = Model.seats;
      Dom.sel('input[name="bags"]').value = Model.bags;
    }

    reloadPoints(Model);

    var from_value = Dom.selAll('input[name="from"]')[0].value,
        to_value = Dom.selAll('input[name="to"]')[0].value;

    if (from_value !== '' && to_value === '') {
      var _addr_from = Model.fromCoords.split(",");

      MapElements.marker_a = Maps.addMarker(_addr_from[0], _addr_from[1], from_value, '//www.google.com/mapfiles/markerA.png', [32,32], function () {});
    }

    if (to_value !== '' && from_value === '') {
      var _addr_to = Model.toCoords.split(",");

      MapElements.marker_b = Maps.addMarker(_addr_to[0], _addr_to[1], to_value, '//www.google.com/mapfiles/markerB.png', [32,32], function () {});
    }
    
    if (Model.start) {
      var buttonierro = Dom.sel('button[data-click="date_order"]'),
          now_time    = new Date().valueOf(),
          ord_time    = new Date(Model.start).valueOf();
      
      if (now_time < ord_time) {
        buttonierro.innerHTML = Dates.datetimeForPeople(Model.start);
      }
    }
    
    if (from_value !== '' && to_value !== '') {
      
      var line = false;
      
      if (Storage.getActiveTypeTaxi() === "tourism" && Model.route) {
        line = true;
      }
      
      Maps.drawRoute(Model, false, false, line, function (recomended, arrRoi) {
        Dom.selAll('[name="cost"]')[0].placeholder = 'Рекомендуем ' + recomended + ' руб.';
        
        if (arrRoi) {
          Model.route = JSON.stringify(arrRoi);
        }
        
        Model.recommended_cost = recomended;
        
        return Model;
      });
    }
  }

  var Destinations = {

    init: function (model) {
      init(model);
    },

    clear: function () {
      Modal.close();
      MapElements.clear();
    },

    saveOrder: function (callback) {
      SaveOrderOffer('order', null, callback);
    },
    
    saveOrderIntercity: function (callback) {
      SaveOrderOffer('order', 'intercity', callback);
    },
    
    saveOrderTourism: function (callback) {
      SaveOrderOffer('order', 'tourism', callback);
    },
    
    saveOrderTrucking: function (callback) {
      SaveOrderOffer('order', 'trucking', callback);
    },

    saveOffer: function (callback) {
      SaveOrderOffer('offer', null, callback);
    },

    saveOfferTrucking: function (callback) {
      SaveOrderOffer('offer', 'trucking', callback);
    },
    
    saveOfferIntercity: function (callback) {
      SaveOrderOffer('offer', 'intercity', callback);
    },
    
    saveOfferTourism: function (callback) {
      SaveOrderOffer('offer', 'tourism', callback);
    },
    
    addNewInterpoint: function (add) {
      AddNewZaezd(add);
    },

    addTimeOffer: function (id) {
      addTime(id, 'offer');
    },

    addTimeOrder: function (id) {
      addTime(id, 'order');
    },
    
    addStartTimeOffer: function (datetime) {
      addStartTime(datetime, 'offer');
    },

    addStartTimeOrder: function (datetime) {
      addStartTime(datetime, 'order');
    },

    deleteField: function (target) {
      var be_dead = target.parentNode,
          id = target.dataset.id;

      Model.toAddresses.splice(id, 1);
      Model.toCoordses.splice(id, 1);
      Model.times.splice(id, 1);
      be_dead.parentNode.removeChild(be_dead);
      Storage.lullModel(Model);
      MapElements.clear();
      Maps.drawRoute(Model, false, false, false, function (recomended, arrRoi) {
        Dom.selAll('[name="cost"]')[0].placeholder = 'Рекомендуем ' + recomended + ' руб.';
        Model.route = JSON.stringify(arrRoi);
        Model.recommended_cost = recomended;
        return Model;
      });
      reloadPoints(Model);
    },

    cleanFieldOrder: function (_field) {
      cleanField(_field, 'order');
    },

    cleanFieldOffer: function (_field) {
      cleanField(_field, 'offer');
    }

  };

  return Destinations;

});