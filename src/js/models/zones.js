/* global User, SafeWin, Conn, Zones */

define(['Funcs'], function(Funcs) {
  var current_zone_id,
      base_zone_id,
      new_polygon,
      new_note,
      new_name;
  
  function cbAddZones(response) {
    Zones.list.push({polygon:new_polygon, id:response.id, note:new_note, name:new_name});
    win_reload();
    Conn.clearCb('cbAddZones');
  }
  function cbGetZones(response) {
    Zones.initSafeWin(response);
    Conn.clearCb('cbGetZones');
  }
  
  function cbUpdateZone() {
    Zones.list[current_zone_id].name = new_name;
    Zones.list[current_zone_id].note = new_note;
    Zones.list[current_zone_id].polygon = new_polygon;
    win_reload();
    Conn.clearCb('cbUpdateZone');
  }
 
  function cbDeleteZone() {
    Zones.list.splice(current_zone_id, 1);
    win_reload();
    Conn.clearCb('cbDeleteZone');
  }
  
  function cbActiveZone() {
    Zones.list[current_zone_id].isActive = true;
    Conn.clearCb('cbActiveZone');
  }
  
  function cbInactiveZone() {
    Zones.list[current_zone_id].isActive = false;
    Conn.clearCb('cbInactiveZone');
  }
  
  function win_reload() {
    SafeWin.reload();
  }
  
  function win_init() {
    SafeWin.initial();
  }

  
  var clZones = function () {
    var self = this;
  
    this.list = [];
    
    this.initSafeWin = function (response) {
      var active = [];

      for (var i = 0; i < response.zones.length; i++) {
        var polygon =  response.zones[i].polygon,
            id = response.zones[i].id,
            note = response.zones[i].note,
            name = response.zones[i].name,
            isActive = response.zones[i].isActive;

        if (isActive) {
          active.push(id);
        }
        self.list.push({polygon:polygon, id:id, note:note, name:name, isActive:isActive});
      }
      
      if (active.length > 0) {
        localStorage.setItem('_enable_safe_zone', active.join(','));
      } else {
        localStorage.removeItem('_enable_safe_zone');
      }

      win_init();
    };
    
    this.get = function() {
      Conn.request('requestZones', '', cbGetZones);
    };
    
    this.add = function(polygon, note, name) {
      var data = {};
      
      data.polygon = polygon;
      data.name = name || 'Зона ' + self.list.length;
      data.note = note || '';
      
      new_polygon = JSON.stringify(polygon);
      new_note = data.note;
      new_name = data.name;
      Conn.request('addZones', data, cbAddZones);
    };
    
    this.edit = function(id, polygon, note, name) {
      var data = {};
      
      data.polygon = polygon;
      data.name = name || 'Зона ' + self.list.length;
      data.note = note || '';
      data.id = id;
      
      new_polygon = JSON.stringify(polygon);
      new_note = data.note;
      new_name = data.name;

      Conn.request('addZones', data, cbUpdateZone);      
    };
    
    this.remove = function(id) {
      if (id) {
        current_zone_id = Funcs.findIdArray(self.list, id);
        Conn.request('deleteZones', id, cbDeleteZone);
      }
    };  
    
    this.active = function(id) {
      current_zone_id = Funcs.findIdArray(self.list, id);
      var data = {};
      
      data.isActive = 1;
      data.id = id;
      Conn.request('addZones', data, cbActiveZone);
    };
    
    this.inactive = function(id) {
      var data = {};
      
      data.isActive = 0;
      data.id = id;
      current_zone_id = Funcs.findIdArray(self.list, id);
      Conn.request('addZones', data, cbInactiveZone);

    };
  
  };

	return clZones;
  
});