define(['push', 'Storage', 'ModalWindows'], function(Push, Storage, Modal) {

  function openMessage() {
    goToPage = '#open_message';
    window.focus();
  }

  var Notify = {
    
    listnerNotify: function(response) {
      if (response && response.notifications) {
        var notify = response.notifications;
        
        for(var i = 0; i < notify.length; i++) {
          var type = notify[i].type,
              args = notify[i].args,
              text = notify[i].text;
          
          if (type === "start") {
            if (args.offerId) {
              Storage.setTripDriver(args.offerId);
            }
            
            if (args.orderId) {
              Storage.setTripClient(args.orderId);
            }
          }
          
          if (type === "sos") {
            var isDr = args.isDriver ? 'Водитель ' : 'Клиент ';
            
            Modal.show('<p>Внимание</p>' + 
                        '<p>' + isDr + args.name + ' в опасности!</p>' +
                        '<p>Текущие координаты: ' + args.location + '</p>' +
                           '<p><button data-click="close" class="button_short--green">Перейти</button></p>', openMessage);
          }
          
          Storage.setOpenNotify(notify[i].id);
          
          if (type === "invite") {
            Modal.show('<p>Вас приглашают в список контактов</p>' + 
                           '<p><button data-click="close" class="button_short--green">Перейти</button></p>', openMessage);
          }
                         
          if (type === "push") {
            Modal.show('<p>' + text + '</p>');
          }
          
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