define(['push', 'Storage'], function(Push, Storage) {

  var Notify = {
    
    listnerNotify: function(response) {
      if (response && response.notifications) {
        var notify = response.notifications;
        
        for(var i = 0; i < notify.length; i++) {
          var type = notify[i].type,
              args = notify[i].args;
          
          if (type === "start") {
            if (args.offerId) {
              Storage.setTripDriver(args.offerId);
            }
            
            if (args.orderId) {
              Storage.setTripClient(args.orderId);
            }
          }
          
          Storage.setOpenNotify(notify[i].id);
          Push.create(notify[i].text, {
              body: "",
              icon: 'icon.png',
              timeout: 4000,
              onClick: function () {
                goToPage = '#open_message';
                window.focus();
                this.close();
              }
          });
        }
      }
    }
    
  };

	return Notify;
});