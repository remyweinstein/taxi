define(['Ajax', 'Dom', 'Geo', 'Dates', 'Stars'], function (Ajax, Dom, Geo, Dates, Stars) {

  function start() {
    Stars.init('client');
  }
  
  return {
    start: start
  };
  
});