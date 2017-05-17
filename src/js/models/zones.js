/* global User, SafeWin, Conn */

define(['Funcs', 'Storage'], function(Funcs, Storage) {  
  var clZones = function () {
    var self = this;
  
    function cbAddZones(response) {
      Conn.clearCb('cbAddZones');
      
      self.list.push({"polygon":self.new_polygon, "id":response.result.id, "note":self.new_note, "name":self.new_name, "isActive":false});
      win_reload();
    }
    function cbGetZones(response) {
      Conn.clearCb('cbGetZones');

      if (!response.error) {
        self.initSafeWin(response.result);
      }
    }

    function cbUpdateZone() {
      Conn.clearCb('cbUpdateZone');
      self.list[self.current_zone_id].name = self.new_name;
      self.list[self.current_zone_id].note = self.new_note;
      self.list[self.current_zone_id].polygon = self.new_polygon;

      win_reload();
    }

    function cbDeleteZone() {
      Conn.clearCb('cbDeleteZone');
      self.list.splice(self.current_zone_id, 1);
      win_reload();
    }

    function cbActiveZone() {
      Conn.clearCb('cbActiveZone');
      self.list[self.current_zone_id].isActive = true;
    }

    function cbInactiveZone() {
      Conn.clearCb('cbInactiveZone');
      self.list[self.current_zone_id].isActive = false;
    }

    function win_reload() {
      SafeWin.reload();
    }

    function win_init() {
      SafeWin.initial();
    }
    
      
    this.list = [];
    this.current_zone_id;
    
    this.new_polygon;
    this.new_note;
    this.new_name;
    
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
        self.list.push({"polygon":polygon, "id":id, "note":note, "name":name, "isActive":isActive});
      }
      
      if (active.length > 0) {
        Storage.setActiveZones(active.join(','));
      } else {
        Storage.removeActiveZones();
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
      
      self.new_polygon = polygon;//JSON.stringify(polygon);
      self.new_note = data.note;
      self.new_name = data.name;
      
      Conn.request('addZones', data, cbAddZones);
    };
    
    this.edit = function(id, polygon, note, name) {
      var data = {};
      
      data.polygon = polygon;
      data.name = name || 'Зона ' + self.list.length;
      data.note = note || '';
      data.id = id;
      
      self.new_polygon = polygon;//JSON.stringify(polygon);
      self.new_note = data.note;
      self.new_name = data.name;

      Conn.request('addZones', data, cbUpdateZone);      
    };
    
    this.remove = function(id) {
      if (id) {
        self.current_zone_id = Funcs.findIdArray(self.list, id);
        Conn.request('deleteZones', id, cbDeleteZone);
      }
    };  
    
    this.active = function(id) {
      self.current_zone_id = Funcs.findIdArray(self.list, id);
      var data = {};
      
      data.isActive = 1;
      data.id = id;
      Conn.request('addZones', data, cbActiveZone);
    };
    
    this.inactive = function(id) {
      var data = {};
      
      data.isActive = 0;
      data.id = id;
      self.current_zone_id = Funcs.findIdArray(self.list, id);
      Conn.request('addZones', data, cbInactiveZone);

    };
  
  };

	return clZones;
  
});