/* global Event, Conn, User, default_city, default_vehicle */

define(['Dom', 'Storage'], function (Dom, Storage) {
  var model,
      id_car;

  function cbGetModels(response) {
    var model_el = Dom.sel('select[name="model"]', model);
    
    model_el.options.length = 0;
    for (var i = 0; i < response.result.models.length; i++) {
        model_el.options[i] = new Option(response.result.models[i], response.result.models[i]);
    }
    if (model) {
      var current = Dom.sel('select[name="model"] option[value="' + model + '"]');
       current.selected = true;
    }
    Conn.clearCb('cbGetModels');
  }
  
  function cbUpdateAuto() {
    Conn.clearCb('cbUpdateAuto');
    Dom.historyBack();
  }
  
  function cbGetAuto(response) {
    var cars = response.result.cars;
    
    for (var i = 0; i < cars.length; i++) {
      if (id_car === cars[i].id) {
        Dom.sel('input[name="color"]').value = cars[i].color;
        Dom.sel('input[name="number"]').value = cars[i].number;
        Dom.sel('input[name="tonnage"]').value = cars[i].tonnage;

        var conditioner = cars[i].conditioner ? Dom.sel('input[name="conditioner"][value="1"]') : Dom.sel('input[name="conditioner"][value="0"]');

        conditioner.checked = true;

        if (cars[i].type) {
          var type = Dom.sel('select[name="type"] option[value="' + cars[i].type + '"]');
           type.selected = true;
        }

        if (cars[i].brand) {
          var brand = Dom.sel('select[name="brand"] option[value="' + cars[i].brand + '"]');
           brand.selected = true;
        }

        model = cars[i].model;
        changeModel(cars[i].brand);
        var photo_car = cars[i].vehicle || default_vehicle;
        Dom.sel('.avatar').src = photo_car;
        
        break;
      }
    }
    
    Conn.clearCb('cbGetAuto');
  }
  
  function changeModel(brand) {
    if (brand) {
      Conn.request('getModels', brand, cbGetModels);
    }
  }
  
  function addEvents() {
    Event.submit = function (event) {
      var target = event.target;
      while (target !== this) {
        if (target.dataset.submit === 'form-edit-auto') {
          // = Form edit auto =
          var file = Dom.sel('input[name=ava_file]').files[0],
              reader = new FileReader();
            
          reader.onabort = function() {
          };

          reader.onerror = function(event) {
            switch(event.target.error.code) {
              case event.target.error.NOT_FOUND_ERR:
                console.log('File not found');
                break;
              case event.target.error.NOT_READABLE_ERR:
                console.log('File is not readable');
                break;
              case event.target.error.ABORT_ERR:
                console.log('File upload aborted');
                break;
              default:
                console.log('An error occurred reading the file.');
            }
          };
          reader.onloadend = function(event) {
            saveAuto(event.target.result);
          };
          
          if (file) {
            reader.readAsBinaryString(file);
          } else {
            saveAuto();
          }
        }

        if (target) {
          target = target.parentNode;
        } else {
          break;
        }
      }
    };

    content.addEventListener('submit', Event.submit);
  }
  
  function saveAuto(file) {
    var sel_brand = Dom.sel('select[name="brand"]'),
        sel_type = Dom.sel('select[name="type"]'),
        sel_model = Dom.sel('select[name="model"]'),
        data = {};

    data.photo       = file ? window.btoa(file) : null;    
    data.id          = id_car || null;
    data.isActive    = false;
    data.color       = Dom.sel('input[name="color"]').value;
    data.number      = Dom.sel('input[name="number"]').value;
    data.tonnage     = Dom.sel('input[name="tonnage"]').value;
    data.brand       = sel_brand.options[sel_brand.selectedIndex].text;
    data.model       = sel_model.options[sel_model.selectedIndex].text;
    data.conditioner = Dom.sel('input[name="conditioner"]:checked').value;
    data.type        = sel_type.options[sel_type.selectedIndex].text;

    Conn.request('updateAuto', data, cbUpdateAuto);

  }
  
  function stop() {
    Storage.removeIdEditCar();
  }
  
  function start() {
    id_car = Storage.getIdEditCar();
    
    if (id_car) {
      Conn.request('getAuto', '', cbGetAuto);
    }

    var brand_el = Dom.sel('select[name="brand"]');
      brand_el.addEventListener('change', function() {
        changeModel(brand_el.options[brand_el.selectedIndex].text);
      });

    addEvents();
  }
  
  return {
    start: start,
    clear: stop
  };
});