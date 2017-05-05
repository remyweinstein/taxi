/* global User, Conn */

define(function() {
  
  var clParameters = function () {
    var self = this;

    this.distanceToPoint           = null;
    this.automatClientTime         = null;
    this.automatDriverTime         = null;
    this.blockDays                 = null;
    this.indexInterval             = null;
    this.cancelCount0              = null;
    this.cancelCount1              = null;
    this.orderCostOfKm             = null;
    this.orderLandingPrice         = null;
    this.orderZoneRadius           = null;
    this.t0                        = null;
    this.t1                        = null;
    this.t2                        = null;
    this.t3                        = null;
    this.tSecurityProtocol         = null;
    
    this.label = [];
    this.type = [];
    
    function cbGetParameters(response) {
      Conn.clearCb('cbGetParameters');
      
      if (!response.error) {
        var sets = response.result.settings;
        
        for (var i = 0; i < sets.length; i++) {
          if (sets[i].id === "orderRadius") {
            self.distanceToPoint = sets[i].value;
            self.label.distanceToPoint = sets[i].note;
            self.type.distanceToPoint = 'number';
          }
          
          if (sets[i].id === "automatClientTime") {
            self.automatClientTime = sets[i].value;
            self.label.automatClientTime = sets[i].note;
            self.type.automatClientTime = 'number';
          }
          
          if (sets[i].id === "automatDriverTime") {
            self.automatDriverTime = sets[i].value;
            self.label.automatDriverTime = sets[i].note;
            self.type.automatDriverTime = 'number';
          }
          
          if (sets[i].id === "blockDays") {
            self.blockDays = sets[i].value;
            self.label.blockDays = sets[i].note;
            self.type.blockDays = 'number';
          }

          if (sets[i].id === "cancelCount0") {
            self.cancelCount0 = sets[i].value;
            self.label.cancelCount0 = sets[i].note;
            self.type.cancelCount0 = 'number';
          }

          if (sets[i].id === "cancelCount1") {
            self.cancelCount1 = sets[i].value;
            self.label.cancelCount1 = sets[i].note;
            self.type.cancelCount1 = 'number';
          }
          
          if (sets[i].id === "indexInterval") {
            self.indexInterval = sets[i].value;
            self.label.indexInterval = sets[i].note;
            self.type.indexInterval = 'number';
          }
          
          if (sets[i].id === "orderCostOfKm") {
            self.orderCostOfKm = sets[i].value;
            self.label.orderCostOfKm = sets[i].note;
            self.type.orderCostOfKm = 'number';
          }
          
          if (sets[i].id === "orderLandingPrice") {
            self.orderLandingPrice = sets[i].value;
            self.label.orderLandingPrice = sets[i].note;
            self.type.orderLandingPrice = 'number';
          }
          
          if (sets[i].id === "orderZoneRadius") {
            self.orderZoneRadius = sets[i].value;
            self.label.orderZoneRadius = sets[i].note;
            self.type.orderZoneRadius = 'number';
          }
          
          if (sets[i].id === "t0") {
            self.t0 = sets[i].value;
            self.label.t0 = sets[i].note;
            self.type.t0 = 'number';
          }
          
          if (sets[i].id === "t1") {
            self.t1 = sets[i].value;
            self.label.t1 = sets[i].note;
            self.type.t1 = 'number';
          }
          
          if (sets[i].id === "t2") {
            self.t2 = sets[i].value;
            self.label.t2 = sets[i].note;
            self.type.t2 = 'number';
          }
          
          if (sets[i].id === "t3") {
            self.t3 = sets[i].value;
            self.label.t3 = sets[i].note;
            self.type.t3 = 'number';
          }
          
          if (sets[i].id === "tSecurityProtocol") {
            self.tSecurityProtocol = sets[i].value;
            self.label.tSecurityProtocol = sets[i].note;
            self.type.tSecurityProtocol = 'number';
          }
          
        }
      }
    }
    
    this.getParameters = function () {
      Conn.request('getSettings', '', cbGetParameters);
    };
  };
  
  return clParameters;
  
});