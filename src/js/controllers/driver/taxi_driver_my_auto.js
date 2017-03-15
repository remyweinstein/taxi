/* global User, Event, default_city, default_vehicle, Conn */

define(['Dom'], function (Dom) {
  var model;
  
  function cbGetAuto(response) {
    var conditioner = response.result.auto.conditioner ? Dom.sel('input[name="conditioner"][value="1"]') : Dom.sel('input[name="conditioner"][value="0"]');
     conditioner.checked = true;

    if (response.result.auto.type) {
      var type = Dom.sel('select[name="type"] option[value="' + response.result.auto.type + '"]');
       type.selected = true;
    }
    Conn.clearCb('cbGetAuto');
  }
  
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
  
  function cbGetProfileAuto(response) {
    Dom.sel('input[name="color"]').value = response.result.profile.color;
    Dom.sel('input[name="number"]').value = response.result.profile.number;
    Dom.sel('input[name="tonnage"]').value = response.result.profile.tonnage;

    if (response.result.profile.brand) {
      var brand = Dom.sel('select[name="brand"] option[value="' + response.result.profile.brand + '"]');
       brand.selected = true;
    }
    
    model = response.result.profile.model;
    changeModel(response.result.profile.brand);
    var photo_car = response.result.profile.vehicle || default_vehicle;
    Dom.sel('.avatar').src = photo_car;
    Conn.clearCb('cbGetProfileAuto');
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
        name = User.name ? User.name : 'Гость',
        city = User.city ? User.city : default_city,
        data = {},
        data2 = {};

    if (file) {
      data.vehicle = window.btoa(file);
    }
    data.color = Dom.sel('input[name="color"]').value;
    data.number = Dom.sel('input[name="number"]').value;
    data.tonnage = Dom.sel('input[name="tonnage"]').value;
    data.brand = sel_brand.options[sel_brand.selectedIndex].text;
    data.model = sel_model.options[sel_model.selectedIndex].text;
    data.name = name;
    data.city = city;
    Conn.request('updateProfile', data);

    data2.conditioner = Dom.sel('input[name="conditioner"]:checked').value;
    data2.type = sel_type.options[sel_type.selectedIndex].text;

    Conn.request('updateAuto', data2, cbUpdateAuto);

  }
  
  function stop() {

  }
  
  function start() {
    Conn.request('getProfile', '', cbGetProfileAuto);
    Conn.request('getAuto', '', cbGetAuto);

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