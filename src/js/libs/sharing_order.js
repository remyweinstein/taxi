define(['Dom'], function (Dom) {
  var sharing_win,
      btParentControl,
      btLinkOrder,
      btPassOrder,
      btOpenShare;
  
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
  
  function runLinkOrder() {
    swipeRight();
  }
  
  function runPassOrder() {
    swipeRight();
  }
  
  function AddEvents() {
    btParentControl = Dom.sel('[data-click="parent-control"]');
    btLinkOrder = Dom.sel('[data-click="link-order"]');
    btPassOrder = Dom.sel('[data-click="pass-order"]');
    btParentControl.addEventListener('click', runParentControl);
    btLinkOrder.addEventListener('click', runLinkOrder);
    btPassOrder.addEventListener('click', runPassOrder);
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
                        '<button class="button_short--green" data-click="link-order" disabled>Ссылка на заказ</button>' +
                        '<button class="button_short--green" data-click="pass-order" disabled>Передать заказ</button>';
                      
      Dom.selAll('.sharing-window')[0].appendChild(wrap);
      AddEvents();
      
      return;
    }

  };
  
  return SharingOrder;

});