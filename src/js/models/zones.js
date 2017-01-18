define(['Ajax'], function(Ajax) {
  
  var clZones = function () {
    var self = this;
  
    this.list = [];
        
    this.get = function(callback) {
      Ajax.request('GET', 'zones', User.token, '', '', function(response) {
        if (response && response.ok) {
          var active = [];
          
          for (var i = 0; i < response.zones.length; i++) {
            var polygon =  response.zones[i].polygon;
            var id =       response.zones[i].id;
            var note =     response.zones[i].note;
            var name =     response.zones[i].name;
            var isActive = response.zones[i].isActive;
            
            if (isActive) {
              active.push(i);
            }
            self.list.push({polygon:polygon,id:id,note:note,name:name,isActive:isActive});
          }
          if (active.length > 0) {
            localStorage.setItem('_enable_safe_zone', active.join(','));
          } else {
            localStorage.removeItem('_enable_safe_zone');
          }
          callback();
          win_reload();
        }
      }, function() {});
    };
    
    this.add = function(polygon, note, name) {
      var list = JSON.stringify(polygon);
      var data = new FormData();
      
      if (!note) {
        note = '';
      }
      
      if (!name) {
        name = 'Зона ' + self.list.length;
      }
      
      data.append('polygon', list);
      data.append('name', name);
      data.append('note', note);

      Ajax.request('POST', 'zone', User.token, '', data, function(response) {
        if (response && response.ok) {
          self.list.push({polygon:polygon,id:response.id,note:note,name:name});
          win_reload();
        }
      }, function() {});
    };
    
    this.edit = function(my_id, polygon, note, name) {
      var list = JSON.stringify(polygon);
      var data = new FormData();
      var id = self.list[my_id].id;
      
      if (!note) {
        note = '';
      }
      
      if (!name) {
        name = 'Зона ' + self.list.length;
      }
            
      data.append('polygon', list);
      data.append('name', name);
      data.append('note', note);
      
      Ajax.request('POST', 'zone', User.token, '&id=' + id, data, function(response) {
        if (response && response.ok) {
          self.list[my_id].name = name;
          self.list[my_id].note = note;
          self.list[my_id].polygon = polygon;
          win_reload();
        }
      }, function() {});
      
    };
    
    this.remove = function(id) {
      if (id) {
        var t_id = self.list[id].id;
        Ajax.request('POST', 'delete-zone', User.token, '&id=' + t_id, '', function(response) {
          if (response && response.ok) {
            self.list.splice(id, 1);
            win_reload();
          }
        }, function() {});
      }
    };  
    
    this.active = function(id) {
      var data = new FormData();
          data.append('isActive', '1');
      var t_id = self.list[id].id;

      Ajax.request('POST', 'zone', User.token, '&id=' + t_id, data, function(response) {
        if (response && response.ok) {
          self.list[id].isActive = true;
        }
      }, function() {});
    };
    
    this.inactive = function(id) {
      var data = new FormData();
          data.append('isActive', '0');

      if (self.list[id]) {
        var t_id = self.list[id].id;

        Ajax.request('POST', 'zone', User.token, '&id=' + t_id, data, function(response) {
          if (response && response.ok) {
            self.list[id].isActive = false;
          }
        }, function() {});
      }
    };
    
    function win_reload() {
      SafeWin.reload();
    };
  
  };

	return clZones;
  
});