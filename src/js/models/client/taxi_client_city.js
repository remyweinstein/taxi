define(['Ajax', 'Dom'], function (Ajax, Dom) {
  


  function addtofav(el) {
    Ajax.request('POST', 'favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltofav">Удалить из Избранного</button>';
      }
    }, function() {});
  };
  
  function delfav(el) {
    Ajax.request('POST', 'delete-favorites', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtofav">Избранное</button>';
      }
    }, function() {});
  };
  
  function addtoblack(el) {
    Ajax.request('POST', 'black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="deltoblack">Удалить из Черного списка</button>';
      }
    }, function() {}); 
  };
  
  function delblack(el) {
    Ajax.request('POST', 'delete-black-list', User.token, '&id=' + el.dataset.id, '', function(response) {
      if (response && response.ok) {
        el.parentNode.innerHTML = '<button data-id="' + el.dataset.id  + '" data-click="addtoblack">Черный список</button>';
      }
    }, function() {}); 
  };
  
  function chooseloc(el) {
    localStorage.setItem('_address_temp', el.parentNode.querySelectorAll('input')[0].getAttribute('name'));
    window.location.hash = '#client_choice_location_map';

    return;
  };
  
  function dropdown(_el) {
    var _top = Dom.selAll('[data-controller="taxi_client_city"]')[0];
    var _bottom = Dom.selAll('[data-controller="taxi_client_city_bottom"]')[0];

    if (_top.style.top === '4em' || _top.style.top === '') {
      _el.classList.remove('drop-down');
      _el.classList.add('drop-up');
      _top.style.top = '-10em';
      _bottom.style.bottom = '-10em';
      _el.style.opacity = 1;
      _el.style.top = '-3.5em';
    } else {
      _el.classList.remove('drop-up');
      _el.classList.add('drop-down');
      _top.style.top = '4em';
      _bottom.style.bottom = '1em';
      _el.style.top = '-0.5em';
    } 
  };
  
  function fieldadd() {
    var just_add = Dom.selAll('.icon-record').length;
    if (just_add > 0) {
      if (Dom.selAll('.icon-record')[just_add - 1].parentNode.querySelectorAll('input')[0].value !== "") {
        AddNewZaezd(just_add);
      }
    } else {
      AddNewZaezd(just_add);
    }

    return;
  };
  
  function cleanfield(target) {
    var _field = target.dataset.field;

    if (_field === "from") {
      MyOrder.fromAddress = "";
      MyOrder.fromCity = "";
      MyOrder.fromCoords = "";
      MyOrder.fromFullAddress = "";
    }

    if (_field === "to") {
      MyOrder.toAddress = "";
      MyOrder.toCity = "";
      MyOrder.toCoords = "";
      MyOrder.toFullAddress = "";
    }

    Dom.selAll('.adress_' + _field)[0].value = "";

    return;
  };
  
  function fieldaddtime(target) {
    var _id = target.dataset.id;

    Modal.show('<p><button class="button_rounded--green" data-response="0">Без задержки</button></p>\n\
              <p><button class="button_rounded--green" data-response="5">5 мин</button></p>\n\
              <p><button class="button_rounded--green" data-response="10">10 мин</button></p>\n\
              <p><button class="button_rounded--green" data-response="15">15 мин</button></p>\n\
              <p><button class="button_rounded--green" data-response="20">20 мин</button></p>\n\
              <p><button class="button_rounded--green" data-response="30">30 мин</button></p>\n\
            ', function (response) {
                eval("MyOrder.times[" + _id + "] = " + response);
                reloadPoints();
            });

    return;
  };
  
  function fielddelete(target) {
    var _id = target.dataset.id;

    MyOrder.toAddresses.splice(_id, 1);
    MyOrder.toCoordses.splice(_id, 1);
    MyOrder.times.splice(_id, 1);

    var be_dead = target.parentNode;
      be_dead.parentNode.removeChild(be_dead);

    reloadPoints();

    return;
  };
  
  function sbmtchooselocation() {
    Dom.sel('[data-click="order-taxi"]').disabled = true;

    var _price = Dom.sel('[name="cost"]').value;
    MyOrder.price = _price === "" ? recommended_cost : _price;
    MyOrder.comment = Dom.sel('[name="description"]').value;

    var data = new FormData();

    event.preventDefault();

    data.append('fromCity', User.city);
    data.append('fromAddress', MyOrder.fromAddress);
    data.append('fromLocation', MyOrder.fromCoords);
    data.append('toCity', User.city);
    data.append('toAddress', MyOrder.toAddress);
    data.append('toLocation', MyOrder.toCoords);
    data.append('duration', MyOrder.duration);
    data.append('isIntercity', 0);
    //data.append('bidId', '');
    data.append('price', MyOrder.price);
    data.append('comment', MyOrder.comment);
    data.append('minibus', 0);
    data.append('babyChair', 0);
    data.append('length', MyOrder.length);

    if (MyOrder.toAddresses.length > 0) {
      //var _points = [];

      for (var i = 0; i < MyOrder.toAddresses.length; i++) {
        var time = MyOrder.times[i] ? MyOrder.times[i] : 0;
        //_points.push({'address': MyOrder.toAddresses[i],'location': MyOrder.toCoordses[i],'stopTime': time,'city': User.city,'fullAddress': ''});
        data.append('points[' + i + '][address]', MyOrder.toAddresses[i]);
        data.append('points[' + i + '][location]', MyOrder.toCoordses[i]);
        data.append('points[' + i + '][stopTime]', time);
        data.append('points[' + i + '][city]', User.city);
        data.append('points[' + i + '][fullAddress]', '');
      }
      //data.append('points', _points);
    };

    Ajax.request('POST', 'order', User.token, '', data, function(response) {
      if (response && response.ok) {
        MyOrder.id = response.id;
        window.location.hash = '#client_map';                
      } else {
        alert('Укажите в профиле ваш город');
      }
    }, function() {});

  return;
  };
  
  function AddNewZaezd(just_add) {
    var time = MyOrder.times[just_add];
    var addr = MyOrder.toAddresses[just_add];
      time = time > 0 ? time + " мин" : "";
      addr = addr ? addr : "";
    var el = Dom.sel('.order-city-to');
    var new_field = document.createElement('div');
     new_field.className += 'form-order-city__field order-city-to_z';
     new_field.innerHTML = '<i class="icon-record form-order-city__label"></i>\n\
                            <span class="form-order-city__wrap">\n\
                              <input type="text" name="to_plus' + just_add + '" value="' + addr + '" placeholder="Заезд"/>\n\
                            </span>\n\
                            <span data-click="field_add_time" data-id="' + just_add + '" class="form-order-city__field_add_time">\n\
                              <i class="icon-clock"></i><span class="top-index">' + time + '</span>\n\
                            </span>\n\
                            <span data-click="field_delete" data-id="' + just_add + '" class="form-order-city__field_delete">\n\
                              <i class="icon-trash"></i>\n\
                            </span>\n\
                            <i data-click="choice_location" class="icon-street-view form-order-city__add-button"></i>';

    var parentDiv = el.parentNode;
      parentDiv.insertBefore(new_field, el);
    addEventChooseAddress('to_plus' + just_add);
  };
  
  function reloadpoints() {
    var rem_old_stops = Dom.selAll('.order-city-to_z');

    for (var i = 0; i < rem_old_stops.length; i++) {
      rem_old_stops[i].parentNode.removeChild(rem_old_stops[i]);
    }

    for (var i = 0; i < MyOrder.toAddresses.length; i++) {
      AddNewZaezd(i);
    }
  };

  function addeventchooseaddress(el) {
    Dom.sel('input[name="' + el + '"]').addEventListener('click', function(event) {
      localStorage.setItem('_address_temp', el);
      localStorage.setItem('_address_string_temp', event.target.value);

      window.location.hash = '#client_choose_address';
    });
  };
  
  function addinfoformarker(text, open, marker, map) {
    if(text && text !== "") {
      var infowindow = new google.maps.InfoWindow({
        content: text
      });
      if (open) {
        infowindow.open(map, marker);
      }
      google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
      });
    }
    
    return marker;
  };

  function addmarker(location, title, icon, map) {
    var marker = new google.maps.Marker({
      position: location,
      //animation: google.maps.Animation.DROP,
      icon: icon,
      title: title,
      map: map
    });

    return marker;
  };
  
  function searchArray(index, arr) {
    for (var i = 0; i < arr.length; i++) {
      if (arr[i].id === index) {
        return true;
        break;
      }
    }
    return false;
  }
  
  function getdrivers(markers_driver_pos, map, radiusSearch) {
    Ajax.request('GET', 'agents', User.token, '&radius=' + radiusSearch, '', function(response) {
      if (response && response.ok) {
        var new_markers = [];
        var agnts = response.agents;

        for (var i = 0; i < agnts.length; i++) {
          if (!searchArray(agnts[i].id, markers_driver_pos)) {
            var photo = agnts[i].photo || User.default_avatar;
            var photo_car = agnts[i].vehicle || Car.default_vehicle;
            var name = agnts[i].name || '&nbsp;';
            var brand = agnts[i].brand || '&nbsp;';
            var model = agnts[i].model || '&nbsp;';
            var favorite = !agnts[i].isFavorite ? '<button data-id="' + agnts[i].id  + '" data-click="addtofav">Избранное</button>' : '<button data-id="' + agnts[i].id  + '" data-click="deltofav">Удалить из Избранного</button>';
            var info = '<div style="text-align:center;">\n\
                          <div style="width:50%;display:inline-block;float: left;">\n\
                            <p>id' + agnts[i].id + '<br>' + name + '</p>\n\
                            <p><img class="avatar" src="' + photo + '" alt=""/></p>\n\
                            <p>' + favorite + '</p>\n\
                          </div>\n\
                          <div style="width:50%;display:inline-block">\n\
                            <p>' + brand + '<br>\n\
                            ' + model + '</p>\n\
                            <p><img class="avatar" src="' + photo_car + '" alt=""/></p>\n\
                            <p><button data-id="' + agnts[i].id + '" data-click="addtoblack">Черный список</button></p>\n\
                          </div>\n\
                        </div>\n\
                        ';
            var marker = addInfoForMarker(info, false, addMarker(new google.maps.LatLng(agnts[i].latitude, agnts[i].longitude), agnts[i].name, driver_icon, map));
            new_markers.push({'id': agnts[i].id, 'marker': marker});
          } else {
            if (markers_driver_pos[i]) {
              markers_driver_pos[i].marker.setPosition(new google.maps.LatLng(agnts[i].latitude, agnts[i].longitude));
              new_markers.push({'id': agnts[i].id, 'marker': markers_driver_pos[i].marker});
            }
          }
        }

        var result = [];
        for (var i = 0; i < markers_driver_pos.length; i++) {
          var s = false;
          for (var y = 0; y < new_markers.length; y++) {
            if (markers_driver_pos[i].id === new_markers[y].id) {
              s = true;
            }
          }
          if (!s) {
            result.push(markers_driver_pos[i]);
          }
        }

        for (var i = 0; i < result.length; i++) {
          result[i].marker.setMap(null);
        }

        markers_driver_pos = [];
        markers_driver_pos = new_markers;

      }
    }, function() {});
  }

  

  return {
    addToFav: addtofav,
    delFav: delfav,
    addToBlack: addtoblack,
    delBlack: delblack,
    chooseLoc: chooseloc,
    dropDown: dropdown,
    fieldAdd: fieldadd,
    cleanField: cleanfield,
    fieldAddTime: fieldaddtime,
    fieldDelete: fielddelete,
    sbmtChooseLocation: sbmtchooselocation,
    reloadPoints: reloadpoints,
    addEventChooseAddress: addeventchooseaddress,
    addMarker: addmarker,
    addInfoForMarker: addinfoformarker,
    getDrivers: getdrivers
  };
  
});