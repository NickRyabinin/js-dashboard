function getWeather(event) {
  const formId = event.target.closest('form').id;
  if (event.type ===  "click" || event.key === "Enter") {
    if (formId === "form-ajax") {
      getWeatherWithAJAX();
    } else if (formId === "form-fetch") {
      getWeatherWithFetch();
    }
  }
}

function getWeatherWithAJAX() {
  const location = document.getElementById("location-ajax").value;
  if (validateInput(location)) {
    getCoordinates(location)
      .then(locationData => {
        document.getElementById("location1").innerHTML = locationData.locationName;
        fetchDataWithXHR(locationData)
          .then(weatherData => {
            showCurrentWeather(1, weatherData);
            showTomorrowWeather(1, weatherData);
          })
          .catch(error => {
            showMessage(error);
          });
      })
      .catch(error => {
        showMessage(error);
      });
  }
}

function getWeatherWithFetch() {
  const location = document.getElementById("location-fetch").value;
  if (validateInput(location)) {
    getCoordinates(location)
      .then(locationData => {
        document.getElementById("location2").innerHTML = locationData.locationName;
        fetchDataWithFetch(locationData)
          .then(weatherData => {
            showCurrentWeather(2, weatherData);
            showTomorrowWeather(2, weatherData);
          })
          .catch(error => {
            showMessage(error);
          });
      })
      .catch(error => {
        showMessage(error);
      });
  }
}

function fetchDataWithXHR(locationData) {
  return new Promise((resolve, reject) => {
    const locationLat = locationData.locationLat;
    const locationLon = locationData.locationLon;
    const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + locationLat + "&longitude=" + locationLon +
      "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m" +
      "&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m," +
        "wind_direction_10m,wind_gusts_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours," +
        "precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant" +
      "&wind_speed_unit=ms&timezone=auto&forecast_days=2";

    const xhr = new XMLHttpRequest();
    xhr.open("GET", weatherApiUrl, true);
    xhr.onload = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const weatherData = JSON.parse(xhr.responseText);
        resolve(weatherData);
      } else {
        reject("Произошла ошибка при получении данных");
      }
    };
    xhr.send();
  });
}

async function fetchDataWithFetch(locationData) {
  const locationLat = locationData.locationLat;
  const locationLon = locationData.locationLon;
  const weatherApiUrl = "https://api.open-meteo.com/v1/forecast?latitude=" + locationLat + "&longitude=" + locationLon +
    "&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m,wind_gusts_10m" +
    "&hourly=temperature_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,wind_speed_10m," +
      "wind_direction_10m,wind_gusts_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours," +
      "precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant" +
    "&wind_speed_unit=ms&timezone=auto&forecast_days=2";

  const response = await fetch(weatherApiUrl);
  if (!response.ok) {
    throw new Error("Произошла ошибка при получении данных");
  }
  const weatherData = await response.json();
  return weatherData;
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
          reject('Местоположение не может быть определено');
        }
        showMessage('');
        const locationData = {
          locationLat: data[0].lat,
          locationLon: data[0].lon,
          locationName: data[0].display_name
        };
        resolve(locationData);
      } else if (request.status <= 500) {
        reject('Error while geocoding');
      } else {
        reject('Server error');
      }
    };
    request.onerror = function() {
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

function drawWindDirection(cardId, degrees) {
  const windDirectionDiv = document.getElementById('wind-direction' + cardId);
  let canvas = windDirectionDiv.querySelector('canvas');

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 70;
    canvas.height = 70;
    windDirectionDiv.appendChild(canvas);
  }

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

function getWeatherCondition(weatherCode) {
  let condition = '--';
  const rain = [61, 63, 65, 66, 67];
  const showers = [80, 81, 82];
  const snow = [71, 73, 75, 77, 85, 86];

  if (rain.includes(weatherCode)) {
    condition = "Дождь";
  }
  if (showers.includes(weatherCode)) {
    condition = "Ливень";
  }
  if (snow.includes(weatherCode)) {
    condition = "Снег"
  }

  return condition;
}

function showCurrentWeather(cardId, data) {
  const time = data.current.time;
  const temperature = data.current.temperature_2m;
  const feelsLikeTemperature = data.current.apparent_temperature;
  const windSpeed = data.current.wind_speed_10m;
  const windDegree = data.current.wind_direction_10m;
  const windGusts = data.current.wind_gusts_10m;
  const weatherCode = data.current.weather_code;
  const precipitation = getWeatherCondition(weatherCode);

  document.getElementById("time" + cardId).innerHTML = "По состоянию на " + time + ":";
  document.getElementById("current-temp" + cardId).innerHTML = temperature + "&deg;C";
  document.getElementById("precipitation" + cardId).innerHTML = precipitation;
  document.getElementById("apparent-temp" + cardId).innerHTML = feelsLikeTemperature + "&deg;C";
  document.getElementById("wind-speed" + cardId).innerHTML = windSpeed + "m/s";
  drawWindDirection(cardId, windDegree);
  document.getElementById("wind-gusts" + cardId).innerHTML = windGusts + "m/s";
}

function showTomorrowWeather(cardId, data) {
  const time = data.daily.time[1];
  const minTemperature = data.daily.temperature_2m_min[1];
  const maxTemperature = data.daily.temperature_2m_max[1];
  const windSpeed = data.daily.wind_speed_10m_max[1];
  const windDegree = data.daily.wind_direction_10m_dominant[1];
  const windGusts = data.daily.wind_gusts_10m_max[1];
  const weatherCode = data.daily.weather_code[1];
  const precipitation = getWeatherCondition(weatherCode);

  document.getElementById("tomorrow-time" + cardId).innerHTML = "Завтра, " + time + ":";
  document.getElementById("tomorrow-min-temp" + cardId).innerHTML = minTemperature + "&deg;C";
  document.getElementById("tomorrow-max-temp" + cardId).innerHTML = maxTemperature + "&deg;C";
  document.getElementById("tomorrow-precipitation" + cardId).innerHTML = precipitation;
  document.getElementById("tomorrow-wind-speed" + cardId).innerHTML = windSpeed + "m/s";
  // drawWindDirection(cardId, windDegree);
  document.getElementById("tomorrow-wind-gusts" + cardId).innerHTML = windGusts + "m/s";
}