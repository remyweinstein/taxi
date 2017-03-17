/* global MyOrder, User, Event, Maps, MapGoogle */

define(['Dom'], function (Dom) {
  var model, Model, dragEvent, center_marker;
  
  function initMap() {
    var x = User.lat, y = User.lng, zoom = 18,
        _route = localStorage.getItem('_address_temp'),
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
      var coords = Maps.point2LatLng((center_marker.offsetLeft + 10), (center_marker.offsetTop + 34));
      localStorage.setItem('_choice_coords', coords);
    }
  }
    
  function addEvents() {
    Event.click = function (event) {
      var target = event.target;

      while (target !== this) {
            // = I choose location =
        if (target.dataset.click === 'i_choice_location') {
          var _route = localStorage.getItem('_address_temp'),
              latl = localStorage.getItem('_choice_coords');
          
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
              Model.fromAddress = _address;
            }

            if (_route === "to") {
              Model.toAddress = _address;
            }

            var substr = _route.substring(0, 7);
            if (substr === "to_plus") {
              var _index = _route.replace("to_plus", "");
              Model.toAddresses[_index] = _address;
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
    model = localStorage.getItem('_active_model');
    
    Maps.removeEvent(dragEvent);
    dragEvent = null;
    
    if (model === "offer") {
      MyOffer = Model;
    } else if (model === "order") {
      MyOrder = Model;
    }
    
    localStorage.removeItem('_active_model');
  }
  
  function start() {
    dragEvent = null;
    model = localStorage.getItem('_active_model');
    
    if (model === "offer") {
      Model = MyOffer;
    } else if (model === "order") {
      Model = MyOrder;
    }
    
    Maps.mapOn();
    addEvents();
    initMap();
  }
  
  return {
    start: start,
    clear: stop
  };
    
});