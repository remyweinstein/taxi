/* global Maps */

define(function () {
  
  function stop() {

  }
  
  function start() {
    Maps.mapOn();
  }
  
  return {
    start: start,
    clear: stop
  };
  
});