/* global google, map, cost_of_km, MyOffer, MyOrder, MapElements, Maps */

define(['Dom', 'ModalWindows'], function (Dom, Modal) {

  var Model, recommended_cost = 0, price, comment;

  function AddNewZaezd(just_add) {
    var time = Model.times[just_add] ? Model.times[just_add] + " мин" : "",
      addr = Model.toAddresses[just_add] || "",
      el = Dom.sel('.order-city-to'),
      new_field = document.createElement('div'),
      parentDiv = el.parentNode;

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

  function SaveOrderOffer(type) {
    var _price = Dom.sel('[name="cost"]').value;

    if (type === "order") {
      Model = MyOrder;
    } else {
      Model = MyOffer;
    }
    //event.preventDefault();
    Dom.sel('[data-click="order-taxi"]').disabled = true;

    Model.price = _price === "" ? Model.recommended_cost : _price;
    Model.comment = Dom.sel('[name="description"]').value;

    Model.save(MapElements.points);
  }

  function cleanField(_field, type) {
    if (type === "order") {
      Model = MyOrder;
    } else {
      Model = MyOffer;
    }

    if (_field === "from") {
      Model.fromAddress = "";
      Model.fromCity = "";
      Model.fromCoords = "";
      Model.fromFullAddress = "";
    }

    if (_field === "to") {
      Model.toAddress = "";
      Model.toCity = "";
      Model.toCoords = "";
      Model.toFullAddress = "";
    }

    Dom.selAll('.adress_' + _field)[0].value = "";

    if (type === "order") {
      MyOrder = Model;
    } else {
      MyOffer = Model;
    }
    Destinations.clear();
    Destinations.init();

  }

  function addTime(id, type) {
    if (type === "order") {
      Model = MyOrder;
    } else {
      Model = MyOffer;
    }
    Modal.show('<p><button class="button_rounded--green" data-response="0">Без задержки</button></p>' +
      '<p><button class="button_rounded--green" data-response="5">5 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="10">10 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="15">15 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="20">20 мин</button></p>' +
      '<p><button class="button_rounded--green" data-response="30">30 мин</button></p>',
      function (response) {
        eval("Model.times[" + id + "] = " + response);
        Destinations.clear();
        Destinations.init();
        if (type === "order") {
          MyOrder = Model;
        } else {
          MyOffer = Model;
        }
      });
  }

  function init(type) {
    if (type === 'order') {
      Model = MyOrder;
    } else {
      Model = MyOffer;
    }
    price = Dom.sel('[name="cost"]').value;
    comment = Dom.sel('[name="description"]').value;
    price.value = Model.price;
    comment.value = Model.comment;

    Dom.selAll('input[name="from"]')[0].value = Model.fromAddress;
    Dom.selAll('input[name="to"]')[0].value = Model.toAddress;

    reloadPoints(Model);

    var from_value = Dom.selAll('input[name="from"]')[0].value,
      to_value = Dom.selAll('input[name="to"]')[0].value;

    if (from_value !== '' && to_value === '') {
      var _addr_from = Model.fromCoords.split(",");

      MapElements.marker_a = Maps.addMarker(_addr_from[0], _addr_from[1], from_value, '//www.google.com/mapfiles/markerA.png', function () {});
    }

    if (to_value !== '' && from_value === '') {
      var _addr_to = Model.toCoords.split(",");

      MapElements.marker_b = Maps.addMarker(_addr_to[0], _addr_to[1], to_value, '//www.google.com/mapfiles/markerB.png', function () {});
    }

    if (from_value !== '' && to_value !== '') {
      Maps.drawRoute(type, false, function (recomended) {
        Dom.selAll('[name="cost"]')[0].placeholder = 'Рекомендуемая цена ' + recomended + ' руб.';
        if (type === 'order') {
          MyOrder.recommended_cost = recomended;
        } else {
          MyOffer.recommended_cost = recomended;
        }
      });

    }
  }

  var Destinations = {

    initOrder: function () {
      init('order');
    },

    initOffer: function () {
      init('offer');
    },

    setModel: function (model) {
      if (model === "clDriverOffer") {
        MyOffer = Model;
      }
      if (model === "clClientOrder") {
        MyOrder = Model;
      }

    },

    getModel: function (model) {
      if (model === "clDriverOffer") {
        Model = MyOffer;
      }
      if (model === "clClientOrder") {
        Model = MyOrder;
      }
    },

    clear: function () {
      MapElements.clear();
    },

    saveOrder: function () {
      SaveOrderOffer('order');
    },

    saveOffer: function () {
      SaveOrderOffer('offer');
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

    deleteField: function (target) {
      var be_dead = target.parentNode;

      var id = target.dataset.id;

      Model.toAddresses.splice(id, 1);
      Model.toCoordses.splice(id, 1);
      Model.times.splice(id, 1);

      be_dead.parentNode.removeChild(be_dead);

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