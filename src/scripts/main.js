function getWeatherWithAJAX() {
  const location = document.getElementById("location-ajax").value;
  if (validateInput(location)) {
    getCoordinates(location)
      .then(locationData => {
        document.getElementById("location1").innerHTML = locationData.locationName;
        fetchDataWithXHR(locationData);
      })
      .catch(error => {
        console.error(error);
      });
  }
}

function getWeatherWithFetch() {
  const location = document.getElementById("location-fetch").value;
  if (validateInput(location)) {
    getCoordinates(location)
      .then(locationData => {
        document.getElementById("location2").innerHTML = locationData.locationName;
        fetchDataWithFetch(locationData);
      })
      .catch(error => {
        console.error(error);
      });
  }
}

function fetchDataWithXHR(locationData) {
  const locationLat = locationData.locationLat;
  const locationLon = locationData.locationLon;
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

function fetchDataWithFetch(locationData) {
  const locationLat = locationData.locationLat;
  const locationLon = locationData.locationLon;
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

function getCoordinates(location) {
  return new Promise((resolve, reject) => {
    const geocodingApiUrl = 'https://nominatim.openstreetmap.org/search';
    const requestUrl = geocodingApiUrl + '?' + 'q=' + encodeURIComponent(location) + '&format=json';
    const request = new XMLHttpRequest();
    request.open('GET', requestUrl, true);
    request.onload = function() {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        if (Object.keys(data).length === 0) {
          alert('Местоположение не может быть определено.\nПроверьте правильность ввода.');
          reject('Error while geocoding');
          return;
        }
        const locationData = {
          locationLat: data[0].lat,
          locationLon: data[0].lon,
          locationName: data[0].display_name
        };
        resolve(locationData);
      } else if (request.status <= 500) {
        console.log("unable to geocode! Response code: " + request.status);
        const data = JSON.parse(request.responseText);
        console.log('error msg: ' + data.error);
        reject('Error while geocoding');
      } else {
        console.log("server error");
        reject('Server error');
      }
    };
    request.onerror = function() {
      console.log("unable to connect to server");
      reject('Unable to connect to server');
    };
    request.send();
  });
}

function validateInput(inputValue) {
  if (inputValue.trim() === '') {
      alert('Поле не должно быть пустым');
      return false;
  } else if (/[^a-zA-Z0-9а-яА-Я\-_., ]/.test(inputValue)) {
      alert('Введены недопустимые символы');
      return false;
  }
  return true;
}