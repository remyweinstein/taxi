define(['Ajax', 'Dom'], function (Ajax, Dom) {
  
  function changeModel(brand, model) {
    var model_el = Dom.sel('select[name="model"]', model);

    Ajax.request('GET', 'models', User.token, '&brand='+brand, '', function(response) {
      model_el.options.length = 0;

      for (var i=0; i<response.length; i++) {
          model_el.options[i] = new Option(response[i], response[i]);
      }

      if (model) {
        var current = Dom.sel('select[name="model"] option[value="'+model+'"]');
         current.selected = true;
      }

    }, function() {});
  }
  
  function addEvents() {
    Event.submit = function (event) {
      var target = event.target;
      while (target !== this) {
        if (target.dataset.submit === 'form-edit-auto') {
          // = Form edit auto =
          var file = Dom.sel('input[name=ava_file]').files[0];
          var sel_brand = Dom.sel('select[name="brand"]');
          var sel_type = Dom.sel('select[name="type"]');
          var sel_model = Dom.sel('select[name="model"]');
          var name = User.name ? User.name : 'Гость';
          var city = User.city ? User.city : default_city;
          var data = new FormData();
            data.append('vehicle', file);
            data.append('color', Dom.sel('input[name="color"]').value);
            data.append('number', Dom.sel('input[name="number"]').value);
            //data.append('model', Dom.sel('input[name="model"]').value);
            data.append('tonnage', Dom.sel('input[name="tonnage"]').value);
            data.append('brand', sel_brand.options[sel_brand.selectedIndex].text);
            data.append('model', sel_model.options[sel_model.selectedIndex].text);
            data.append('name', name);
            data.append('city', city);

          Ajax.request('POST', 'profile', User.token, '', data, function() {}, function() {});

          var data2 = new FormData();
            data2.append('conditioner', Dom.sel('input[name="conditioner"]:checked').value);
            data2.append('type', sel_type.options[sel_type.selectedIndex].text);

          Ajax.request('POST', 'auto', User.token, '', data2, function(response) {

            if (response && response.ok) {
              //window.location.hash = '/';
              window.history.back();
            }
          }, function() {});
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
  
  function start() {
    Ajax.request('GET', 'profile', User.token, '', '', function(response) {
      if (response && response.ok) {
        Dom.sel('input[name="color"]').value = response.profile.color;
        Dom.sel('input[name="number"]').value = response.profile.number;
        Dom.sel('input[name="tonnage"]').value = response.profile.tonnage;

        if (response.profile.brand) {
          var brand = Dom.sel('select[name="brand"] option[value="' + response.profile.brand + '"]');
           brand.selected = true;
        }

        changeModel(response.profile.brand, response.profile.model);
        var photo_car = response.profile.vehicle ? response.profile.vehicle : default_vehicle;
        Dom.sel('.avatar').src = photo_car;

      }

    }, function() {});

    Ajax.request('GET', 'auto', User.token, '', '', function(response) {
      if (response && response.ok) {
        var conditioner = response.auto.conditioner ? Dom.sel('input[name="conditioner"][value="1"]') : Dom.sel('input[name="conditioner"][value="0"]');
         conditioner.checked = true;

        if (response.auto.type) {
          var type = Dom.sel('select[name="type"] option[value="' + response.auto.type + '"]');
           type.selected = true;
        }
      }
    }, function() {});

    var brand_el = Dom.sel('select[name="brand"]');
      brand_el.addEventListener('change', function() {
        changeModel(brand_el.options[brand_el.selectedIndex].text);
      });
      
    addEvents();
  }
  
  return {
    start: start
  };

});