define(['Ajax', 'Dom', 'Geo', 'Dates', 'Stars'], function (Ajax, Dom, Geo, Dates, Stars) {

  function start() {
    Stars.init('driver');
  }
  
  return {
    start: start
  };
  
});