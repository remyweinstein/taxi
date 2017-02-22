/* global User, SafeWin, Conn */

define(['Ajax', 'Funcs'], function(Ajax, Funcs) {
  
  var clZones = function () {
    var self = this;
  
    this.list = [];
    
    this.initSafeWin = function (response) {
      var active = [];

      for (var i = 0; i < response.zones.length; i++) {
        var polygon =  response.zones[i].polygon;
        var id =       response.zones[i].id;
        var note =     response.zones[i].note;
        var name =     response.zones[i].name;
        var isActive = response.zones[i].isActive;

        if (isActive) {
          active.push(id);
        }
        self.list.push({polygon:polygon,id:id,note:note,name:name,isActive:isActive});
      }
      if (active.length > 0) {
        localStorage.setItem('_enable_safe_zone', active.join(','));
      } else {
        localStorage.removeItem('_enable_safe_zone');
      }

      //win_reload();
      win_init();
    };
    
    this.get = function() {
      Conn.requestZones();
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
    
    this.edit = function(id, polygon, note, name) {
      var list = JSON.stringify(polygon);
      var data = new FormData();
      var arr_id = Funcs.findIdArray(self.list, id);
      
      if (!name) {
        name = 'Зона ' + self.list.length;
      }
      
      if (!note) {
        note = '';
      }
      
      data.append('polygon', list);
      data.append('name', name);
      data.append('note', note);
      
      Ajax.request('POST', 'zone', User.token, '&id=' + id, data, function(response) {
        if (response && response.ok) {
          self.list[arr_id].name = name;
          self.list[arr_id].note = note;
          self.list[arr_id].polygon = polygon;
          win_reload();
        }
      }, function() {});
      
    };
    
    this.remove = function(id) {
      if (id) {
        var arr_id = Funcs.findIdArray(self.list, id);

        Ajax.request('POST', 'delete-zone', User.token, '&id=' + id, '', function(response) {
          if (response && response.ok) {
            self.list.splice(arr_id, 1);
            win_reload();
          }
        }, function() {});
      }
    };  
    
    this.active = function(id) {
      var arr_id = Funcs.findIdArray(self.list, id);
      var data = new FormData();
          data.append('isActive', '1');

      Ajax.request('POST', 'zone', User.token, '&id=' + id, data, function(response) {
        if (response && response.ok) {
          self.list[arr_id].isActive = true;
        }
      }, function() {});
    };
    
    this.inactive = function(id) {
      var arr_id = Funcs.findIdArray(self.list, id);
      var data = new FormData();
          data.append('isActive', '0');

      Ajax.request('POST', 'zone', User.token, '&id=' + id, data, function(response) {
        if (response && response.ok) {
          self.list[arr_id].isActive = false;
        }
      }, function() {});
    };
    
    function win_reload() {
      SafeWin.reload();
    };
    
    function win_init() {
      SafeWin.initial();
    };
  
  };

	return clZones;
  
});