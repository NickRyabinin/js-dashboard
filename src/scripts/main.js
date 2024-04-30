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
    locationLon + "&current=temperature_2m,apparent_temperature,rain,showers,snowfall,wind_speed_10m," +
    "wind_direction_10m,wind_gusts_10m&wind_speed_unit=ms&timezone=auto";

  const xhr = new XMLHttpRequest();
  xhr.open("GET", weatherApiUrl, true);
  xhr.onload = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);
      const temperature = response.current.temperature_2m;
      const windDegree = response.current.wind_direction_10m;
      document.getElementById("current-temp1").innerHTML = temperature + "&deg;C";
      drawWindDirection(windDegree, 1);
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
    locationLon + "&current=temperature_2m,apparent_temperature,rain,showers,snowfall,wind_speed_10m," +
    "wind_direction_10m,wind_gusts_10m&wind_speed_unit=ms&timezone=auto";

  fetch(weatherApiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error("Произошла ошибка при получении данных");
      }
      return response.json();
    })
    .then(data => {
      const temperature = data.current.temperature_2m;
      const windDegree = data.current.wind_direction_10m;
      document.getElementById("current-temp2").innerHTML = temperature + "&deg;C";
      drawWindDirection(windDegree, 2);
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
          showMessage('Местоположение не может быть определено.<br>Проверьте правильность ввода.');
          reject('Error while geocoding');
          return;
        }
        showMessage('');
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
      showMessage('Поле не должно быть пустым');
      return false;
  } else if (/[^a-zA-Z0-9а-яА-Я\-_., ]/.test(inputValue)) {
      showMessage('Введены недопустимые символы');
      return false;
  }
  return true;
}

function showMessage(message) {
  document.getElementById("error").innerHTML = message;
}

function drawWindDirection(degrees, cardId) {
  const canvas = document.createElement('canvas');
  canvas.id = 'arrowCanvas';
  canvas.width = 70;
  canvas.height = 70;
  const windDirectionDiv = document.getElementById('wind-direction' + cardId);
  windDirectionDiv.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const circleRadius = 18;
  const triangleHeight = 10;
  const triangleBase = 8;
  const triangleTipOffset = 4;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Рисуем окружность
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
  ctx.stroke();
  // Рисуем буквы
  ctx.font = '10px Arial'; // Уменьшаем размер шрифта
  ctx.fillText('N', centerX - 4, centerY - circleRadius + 10);
  ctx.fillText('E', centerX + circleRadius - 9, centerY + 4);
  ctx.fillText('S', centerX - 3, centerY + circleRadius - 3);
  ctx.fillText('W', centerX - circleRadius + 2, centerY + 4);
  // Рассчитываем координаты вершин треугольника
  const tipX = centerX;
  const tipY = centerY - circleRadius - triangleTipOffset; // Внешняя сторона
  const leftX = centerX - triangleBase / 2;
  const leftY = centerY - circleRadius - triangleHeight - triangleTipOffset;
  const rightX = centerX + triangleBase / 2;
  const rightY = centerY - circleRadius - triangleHeight - triangleTipOffset;
  // Поворачиваем контекст на указанный угол
  ctx.translate(centerX, centerY);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.translate(-centerX, -centerY);
  // Рисуем треугольник
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  ctx.fill();
  // Возвращаем контекст в исходное положение
  ctx.translate(centerX, centerY);
  ctx.rotate(-degrees * Math.PI / 180);
  ctx.translate(-centerX, -centerY);
}
