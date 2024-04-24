function getWeatherWithAJAX() {
  getCoordinates();
  fetchDataWithXHR();
}

function getWeatherWithFetch() {
  getCoordinates();
  fetchDataWithFetch();
}

function fetchDataWithXHR() {
  const locationLat = 54.625;
  const locationLon = 43.875;
  const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + locationLat + "&longitude=" +
  locationLon + "&current=temperature_2m&timezone=auto";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", weatherApiUrl, true);
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
  const locationLat = 54.625;
  const locationLon = 43.875;
  const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + locationLat + "&longitude=" +
  locationLon + "&current=temperature_2m&timezone=auto";

  fetch(weatherApiUrl)
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

// setInterval(fetchDataWithXHR, 50000);
// setInterval(fetchDataWithFetch, 50000);

function getCoordinates() {
  const query = 'Ельники';
  const geocodingApiUrl = 'https://nominatim.openstreetmap.org/search';
  const requestUrl = geocodingApiUrl
    + '?'
    + 'q=' + encodeURIComponent(query)
    + '&format=json';

  const request = new XMLHttpRequest();
  request.open('GET', requestUrl, true);
  request.onload = function() {
    if (request.status === 200){
      const data = JSON.parse(request.responseText);
      alert("Latitude: " + data[0].lat + "\nLongitude: " +
        data[0].lon + "\nPlace: " + data[0].display_name);
    } else if (request.status <= 500){
      console.log("unable to geocode! Response code: " + request.status);
      const data = JSON.parse(request.responseText);
      console.log('error msg: ' + data.error);
    } else {
      console.log("server error");
    }
  };
  request.onerror = function() {
    console.log("unable to connect to server");
  };
  request.send();
}