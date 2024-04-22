const locationLat = 54.625;
const locationLon = 43.875;
const locationTimezone = "Europe/Moscow";

const url = "https://api.open-meteo.com/v1/forecast?latitude=" + locationLat + "&longitude=" +
  locationLon + "&current=temperature_2m&timezone=" + locationTimezone;

function fetchDataWithXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const temperature = response.current.temperature_2m;
      document.getElementById("current-temp1").innerHTML = temperature + "&deg;C";
    } else {
      console.log("Произошла ошибка при получении данных");
    }
  };
  xhr.send();
}

function fetchDataWithFetch() {
  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error("Произошла ошибка при получении данных");
      }
      return response.json();
    })
    .then(data => {
      const temperature = data.current.temperature_2m;
      document.getElementById("current-temp2").innerHTML = temperature + "&deg;C";
    })
    .catch(error => {
      console.error(error);
    });
}

setInterval(fetchDataWithXHR, 50000);
setInterval(fetchDataWithFetch, 50000);

const apiKey = 'secret';

// forward geocoding example (address to coordinate)
// note: query needs to be URI encoded (see below)
const query = 'Ельники';
const apiUrl = 'https://api.opencagedata.com/geocode/v1/json';

const requestUrl = apiUrl
  + '?'
  + 'key=' + apiKey
  + '&q=' + encodeURIComponent(query)
  + '&pretty=1';

const request = new XMLHttpRequest();
request.open('GET', requestUrl, true);

request.onload = function() {

  if (request.status === 200){
    const data = JSON.parse(request.responseText);
    alert("Latitude: " + data.results[0].geometry.lat + "\nLongitude: " +
      data.results[0].geometry.lng + "\nTimezone: " +
      data.results[0].annotations.timezone.name);

  } else if (request.status <= 500){
    console.log("unable to geocode! Response code: " + request.status);
    const data = JSON.parse(request.responseText);
    console.log('error msg: ' + data.status.message);
  } else {
    console.log("server error");
  }
};

request.onerror = function() {
  console.log("unable to connect to server");
};

request.send();