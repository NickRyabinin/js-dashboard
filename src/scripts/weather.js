function getWeatherWithAJAX() {
  const location = document.getElementById("location-ajax").value;
  if (validateInput(location)) {
    getCoordinates(location)
      .then(locationData => {
        document.getElementById("location1").innerHTML = locationData.locationName;
        fetchDataWithXHR(locationData)
          .then(weatherData => {
            showCurrentWeather(1, weatherData);
            showOneHourWeather(1, weatherData);
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
            showOneHourWeather(2, weatherData);
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
      "&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m," +
        "wind_direction_10m,wind_gusts_10m" +
      "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours," +
        "wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant" +
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
    "&hourly=temperature_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m," +
      "wind_direction_10m,wind_gusts_10m" +
    "&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours," +
      "wind_speed_10m_max,wind_gusts_10m_max,wind_direction_10m_dominant" +
    "&wind_speed_unit=ms&timezone=auto&forecast_days=2";

  const response = await fetch(weatherApiUrl);
  if (!response.ok) {
    throw new Error("Произошла ошибка при получении данных");
  }
  const weatherData = await response.json();
  return weatherData;
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

export { getWeatherWithAJAX, getWeatherWithFetch, fetchDataWithXHR, fetchDataWithFetch, getWeatherCondition };