/* global User, Event, Maps, MapGoogle */

define(['Dom', 'Storage', 'DriverOffer', 'ClientOrder'], function (Dom, Storage, clDriverOffer, clClientOrder) {
  var Model, dragEvent, center_marker;
  
  function initMap() {
    var x = User.lat, y = User.lng, zoom = 18,
        _route = Storage.getTemporaryRoute(),
        _temp_coords = "",
        event = 'dragend';
    
    if (_route === "from") {
      _temp_coords = Model.fromCoords;
    }

    if (_route === "to") {
      _temp_coords = Model.toCoords;
    }
    
    if (_temp_coords) {
      x = _temp_coords.split(',');
      y = x[1];
      x = x[0];
    }
    
    Maps.setCenter(x, y);
    Maps.setZoom(zoom);
    Maps.insertHtml('beforeend', '<div class="centerMarker"></div>');
    center_marker = Dom.sel('.centerMarker');
    
    if (Maps.currentMapProvider === "yandex") {
      event = 'actionend';
    }
    
    dragEvent = Maps.addEvent(Maps.map, event, function() {
      setNewCoord();
    });
    
    function setNewCoord() {
      Storage.setTemporaryCoords(Maps.point2LatLng((center_marker.offsetLeft + 10), (center_marker.offsetTop + 34)));
    }
  }
    
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
            // = I choose location =
        if (target.dataset.click === 'i_choice_location') {
          var _route = Storage.getTemporaryRoute(),
              latl = Storage.getTemporaryCoords();
          
          latl = latl.replace("(", "");
          latl = latl.replace(")", "");
          latl = latl.replace(" ", "");
          latl = latl.split(",");
          
          var latlng = latl[0] + ',' + latl[1];

          if (_route === "from") {
            Model.fromCoords = latlng;
          }

          if (_route === "to") {
            Model.toCoords = latlng;
          }

          var substr = _route.substring(0, 7);
          if (substr === "to_plus") {
            var _index = _route.replace("to_plus", "");

            Model.toCoordses[_index] = latlng;
          }
          
          MapGoogle.geocoder(latl[0], latl[1], function (results) {
            var _address = MapGoogle.getStreetFromCoords(results);

            if (_route === "from") {
              Model.fromAddress = _address.address;
              if (Storage.getActiveTypeTaxi() === 'intercity') {
                Model.fromCity = _address.city;
              }
            }

            if (_route === "to") {
              Model.toAddress = _address.address;
              if (Storage.getActiveTypeTaxi() === 'intercity') {
                Model.toCity = _address.city;
              }
            }

            var substr = _route.substring(0, 7);
            if (substr === "to_plus") {
              var _index = _route.replace("to_plus", "");
              Model.toAddresses[_index] = _address.address;
            }

            Dom.historyBack();
          });
          
          return;
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
    var center_marker = Dom.sel('.centerMarker');
    
    center_marker.parentNode.removeChild(center_marker);
    Maps.removeEvent(dragEvent);
    dragEvent = null;
    Storage.lullModel(Model);
    Storage.removeTemporaryRoute();
    Storage.removeTemporaryCoords();
    //Storage.removeActiveTypeModelTaxi();
  }
  
  function start() {
    var model = Storage.getActiveTypeModelTaxi();
    
    dragEvent = null;
    
    if (model === "offer") {
      Model = new clDriverOffer();
    } else if (model === "order") {
      Model = new clClientOrder();
    }
    
    Model.activateCurrent();
    Maps.mapOn();
    addEvents();
    initMap();
  }
  
  return {
    start: start,
    clear: stop
  };
    
});