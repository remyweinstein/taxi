/* global MyOrder, User, google, map, Event, Maps, ymaps */

define(['Dom'], function (Dom) {
  var model, Model, dragEvent, center_marker;
  
  function initMap() {
    var x = User.lat, y = User.lng, zoom = 18;
    var _route = localStorage.getItem('_address_temp');
    var _temp_coords = "";
    
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
    
    if (Maps.currentMapProvider === "google") {
      dragEvent = Maps.addEvent('dragend', function() {
        setNewCoord();
      });
    } else if (Maps.currentMapProvider === "yandex") {
      dragEvent = Maps.map.events.group().add('actionend', function () {
        setNewCoord();
      });
    }
    
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
          
          geocoder = new google.maps.Geocoder();
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

          latlng = new google.maps.LatLng(latl[0], latl[1]);

          geocoder.geocode ({
            'latLng': latlng
          }, function (results, status) {
              if (status === google.maps.GeocoderStatus.OK) {
                var _address = Maps.getStreetFromGoogle(results);

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
              }
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
    
    if (Maps.currentProvider === "google") {
      google.maps.event.removeListener(dragEvent);
    } else if (Maps.currentMapProvider === "yandex") {
      dragEvent.removeAll();
    }
    
    dragEvent = null;
    
    if (model === "offer") {
      MyOffer = Model;
    }
    
    if (model === "order") {
      MyOrder = Model;
    }
    
    localStorage.removeItem('_active_model');
  }
  
  function start() {
    dragEvent = null;
    model = localStorage.getItem('_active_model');
    
    if (model === "offer") {
      Model = MyOffer;
    }
    
    if (model === "order") {
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