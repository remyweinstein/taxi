/* global Event, MayLoading, Conn, currentHash, Maps */

define(['Storage', 'Dom', 'react', 'ReactDOM', 'jsx!components/StartPage'], function (Storage, Dom, React, ReactDOM, StartPage) {
  var FactoryStartPage, storeLoadingText;

  function renderLoadingPage() {
    ReactDOM.render(
      FactoryStartPage({text: storeLoadingText}),
      document.querySelector('.dynamic')
    );
  }

  function checkLoading() {
    var next_page;
    
    if (!MayLoading) {
      Dom.startLoading();
      var text;
      
      if (Maps.loading) {
        text = "Загружаем карты...";
      } else if (!Conn.is_connect) {
        text = "Подключаемся к серверу...";
      } else {
        text = "Определяем ваше местоположение...";
      }

        storeLoadingText = text;
        renderLoadingPage();
      
    } else {
      Conn.request('getProfile');
      timerCheckLoading = clearInterval(timerCheckLoading);
      
      if (Storage.getLastPage()) {
        next_page = Storage.getLastPage();
      } else {
        next_page = '#client_city';
      }
      
      goToPage = next_page;
    }
  }
  
  function getPosition(position) {
    console.log(position);
  }
  
  function addEvents() {
    Event.click = function (event) {
          var target = event.target;

          while (target !== this) {
            if (target.dataset.click === 'again-location') {
              navigator.geolocation.getCurrentPosition(getPosition);
              
              return;
            }

            if (target) {
              target = target.parentNode;
            } else {
              break;
            }
          }
        };

    content.addEventListener('click', Event.click);
  }
  
  function stop() {
    
  }
  
  function start() {
    timerCheckLoading = setInterval(checkLoading, 250);
    addEvents();
    FactoryStartPage = React.createFactory(StartPage);
    storeLoadingText = '';
    renderLoadingPage();
  }
  
  return {
    start: start,
    clear: stop
  };
});