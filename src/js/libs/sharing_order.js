/* global currentRoute */

define(['Dom'], function (Dom) {
  var sharing_win,
      btParentControl,
      btPassOrder,
      btOpenShare,
      btWatching,
      btTransferCargo;
  
  function swipeRight() {
    sharing_win.classList.remove('sharing-window--closed');
    sharing_win.classList.remove('sharing-window--opened');
    sharing_win.classList.add('sharing-window--closed');

    btOpenShare.addEventListener('click', swipeDown);
  }
  
  function swipeDown() {
    btOpenShare.removeEventListener('click', swipeDown);
    
    if (sharing_win.classList.contains('sharing-window--closed')) {
      sharing_win.classList.remove('sharing-window--closed');
      sharing_win.classList.remove('sharing-window--opened');
      sharing_win.classList.add('sharing-window--opened');
    }
  }
  
  function runParentControl() {
    swipeRight();
  }
  
  function runPassOrder() {
    swipeRight();
  }
  
  function runTransferCargo() {
    swipeRight();
  }
  
  function AddEvents() {
    btParentControl.addEventListener('click', runParentControl);
    btPassOrder.addEventListener('click', runPassOrder);
    btWatching.addEventListener('click', runPassOrder);
    btTransferCargo.addEventListener('click', runTransferCargo);
  }
  
  var SharingOrder = {
    
    init: function() {
      sharing_win = Dom.sel('.sharing-window');
      btOpenShare = Dom.sel('[data-click="openShare"]');
      
      sharing_win.classList.add('sharing-window--closed');
      
      this.render();
      var hammer = new Hammer(sharing_win, {domEvents: true, preventDefault: true});
      
      sharing_win.addEventListener('swiperight', swipeRight);
      btOpenShare.addEventListener('click', swipeDown);

    },
    
    render: function() {
      var wrap = document.createElement('div');

      wrap.classList.add('sharing-window__wrap');
      wrap.innerHTML =  '<button class="button_short--green" data-click="parent-control">Родительский контроль</button>' +
                        '<button class="button_short--green" data-click="transfer-order" disabled>Передать заказ</button>' +
                        '<button class="button_short--green" data-click="transfer-cargo" disabled>Передать груз</button>' +
                        '<button class="button_short--green" data-click="watching-order" disabled>Ссылка на заказ</button>';

                      
      Dom.selAll('.sharing-window')[0].appendChild(wrap);
      
      btParentControl = Dom.sel('[data-click="parent-control"]');
      btPassOrder     = Dom.sel('[data-click="transfer-order"]');
      btWatching      = Dom.sel('[data-click="watching-order"]');
      btTransferCargo = Dom.sel('[data-click="transfer-cargo"]');

      AddEvents();
      
      return;
    },
    
    enableTransferCargo: function() {
      btTransferCargo.disabled = false;
    },

    disableTransferCargo: function() {
      btTransferCargo.disabled = true;
    },

    enableTransfer: function() {
      btPassOrder.disabled = false;
    },

    disableTransfer: function() {
      btPassOrder.disabled = true;
    },

    enableWatching: function() {
      btWatching.disabled = false;
    },

    disableWatching: function() {
      btWatching.disabled = true;
    }

  };
  
  return SharingOrder;

});