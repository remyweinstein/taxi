var lat = "", lng = "", token = "";

function doSomething() {
  console.log('token = ' + token + ', lat = ' + lat + ', lng = ' + lng);
  if (token !== "" && lat !== "" && lng !== "") {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'https://192.168.20.90/location?token=' + token + '&latitude=' + lat + '&longitude=' + lng, true);
    xhr.send();
  }
}

onmessage = function(event) {
  token = event.data.token;
  lat = event.data.lat;
  lng = event.data.lng;
};

var setIntervaldoSomething = setInterval(doSomething, 500);
var setIntervalGetPosition = setInterval(geoFindMe, 500);