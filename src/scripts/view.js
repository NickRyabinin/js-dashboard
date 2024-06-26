/**
 * view.js отображает пользователю ранее обработанные результаты запроса
 */
import { getWeatherCondition } from "./weather.js";

function showMessage(message) {
  document.getElementById("error").innerHTML = message;
}

function drawWindDirection(elementId, degrees) {
  const canvas = createCanvas(elementId);

  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const circleRadius = 16;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // Рисуем окружность
  drawCircle(ctx, centerX, centerY, circleRadius);
  // Рисуем буквы
  drawTextInsideCircle(ctx, centerX, centerY, circleRadius);
  // Поворачиваем контекст на указанный угол
  ctx.translate(centerX, centerY);
  ctx.rotate(degrees * Math.PI / 180);
  ctx.translate(-centerX, -centerY);
  // Рисуем указатель направления ветра
  drawDirectionPointer(ctx, centerX, centerY, circleRadius);
  // Возвращаем контекст в исходное положение
  ctx.translate(centerX, centerY);
  ctx.rotate(-degrees * Math.PI / 180);
  ctx.translate(-centerX, -centerY);
}

function createCanvas(elementId) {
  const windDirectionDiv = document.getElementById(elementId);
  let canvas = windDirectionDiv.querySelector('canvas');

  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    windDirectionDiv.appendChild(canvas);
  }

  return canvas;
}

function drawCircle(ctx, centerX, centerY, circleRadius) {
  ctx.beginPath();
  ctx.arc(centerX, centerY, circleRadius, 0, 2 * Math.PI);
  ctx.stroke();
}

function drawTextInsideCircle(ctx, centerX, centerY, circleRadius) {
  ctx.font = '10px Arial';
  ctx.fillText('N', centerX - 4, centerY - circleRadius + 10);
  ctx.fillText('E', centerX + circleRadius - 9, centerY + 4);
  ctx.fillText('S', centerX - 3, centerY + circleRadius - 3);
  ctx.fillText('W', centerX - circleRadius + 2, centerY + 4);
}

function drawDirectionPointer(ctx, centerX, centerY, circleRadius) {
  const triangleHeight = 10;
  const triangleBase = 8;
  const triangleTipOffset = 4;

  // Рассчитываем координаты вершин треугольника
  const tipX = centerX;
  const tipY = centerY - circleRadius - triangleTipOffset; // Внешняя сторона
  const leftX = centerX - triangleBase / 2;
  const leftY = centerY - circleRadius - triangleHeight - triangleTipOffset;
  const rightX = centerX + triangleBase / 2;
  const rightY = centerY - circleRadius - triangleHeight - triangleTipOffset;
  // Рисуем треугольник
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(leftX, leftY);
  ctx.lineTo(rightX, rightY);
  ctx.closePath();
  ctx.fill();
}

function displayWeather(cardId, weatherData) {
  showCurrentWeather(cardId, weatherData);
  showOneHourWeather(cardId, weatherData);
  showTomorrowWeather(cardId, weatherData);
}

function displayLocation(cardId, locationName) {
  document.getElementById("location" + cardId).innerHTML = locationName;
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

  const utcZoneString = getUtcZoneString(data);

  document.getElementById("current-time" + cardId).innerHTML = "По состоянию на " + time + "(" + utcZoneString + ")" + ":";
  document.getElementById("current-temp" + cardId).innerHTML = temperature + "&deg;C";
  document.getElementById("current-precipitation" + cardId).innerHTML = precipitation;
  document.getElementById("current-apparent-temp" + cardId).innerHTML = feelsLikeTemperature + "&deg;C";
  document.getElementById("current-wind-speed" + cardId).innerHTML = windSpeed + "м/с";
  drawWindDirection("current-wind-direction" + cardId, windDegree);
  document.getElementById("current-wind-gusts" + cardId).innerHTML = windGusts + "м/с";
}

function showOneHourWeather(cardId, data) {
  const utcZoneString = getUtcZoneString(data);
  const neededHour = getNeededHour(data);

  const time = data.hourly.time[neededHour];
  const temperature = data.hourly.temperature_2m[neededHour];
  const feelsLikeTemperature = data.hourly.apparent_temperature[neededHour];
  const windSpeed = data.hourly.wind_speed_10m[neededHour];
  const windDegree = data.hourly.wind_direction_10m[neededHour];
  const windGusts = data.hourly.wind_gusts_10m[neededHour];
  const weatherCode = data.hourly.weather_code[neededHour];

  let precipitation = getWeatherCondition(weatherCode);
  const precipitationSum = data.hourly.precipitation[neededHour];

  if (precipitation !== "--") {
    precipitation = precipitation + "<br>" + precipitationSum + "мм WE";
  }

  document.getElementById("one-hour-time" + cardId).innerHTML = "Через час, в " + time + "(" + utcZoneString + ")" + ":";
  document.getElementById("one-hour-temp" + cardId).innerHTML = temperature + "&deg;C";
  document.getElementById("one-hour-precipitation" + cardId).innerHTML = precipitation;
  document.getElementById("one-hour-apparent-temp" + cardId).innerHTML = feelsLikeTemperature + "&deg;C";
  document.getElementById("one-hour-wind-speed" + cardId).innerHTML = windSpeed + "м/с";
  drawWindDirection("one-hour-wind-direction" + cardId, windDegree);
  document.getElementById("one-hour-wind-gusts" + cardId).innerHTML = windGusts + "м/с";
}

function showTomorrowWeather(cardId, data) {
  const time = data.daily.time[1];
  const minTemperature = data.daily.temperature_2m_min[1];
  const maxTemperature = data.daily.temperature_2m_max[1];
  const windSpeed = data.daily.wind_speed_10m_max[1];
  const windDegree = data.daily.wind_direction_10m_dominant[1];
  const windGusts = data.daily.wind_gusts_10m_max[1];
  const weatherCode = data.daily.weather_code[1];

  let precipitation = getWeatherCondition(weatherCode);
  const precipitationSum = data.daily.precipitation_sum[1];
  const precipitationHours = data.daily.precipitation_hours[1];

  if (precipitation !== "--") {
    precipitation = precipitation + "<br>" + precipitationSum + "мм WE" + " / " + precipitationHours + "ч";
  }

  const utcZoneString = getUtcZoneString(data);

  document.getElementById("tomorrow-time" + cardId).innerHTML = "Завтра, " + time + "(" + utcZoneString + ")" + ":";
  document.getElementById("tomorrow-min-temp" + cardId).innerHTML = minTemperature + "&deg;C";
  document.getElementById("tomorrow-max-temp" + cardId).innerHTML = maxTemperature + "&deg;C";
  document.getElementById("tomorrow-precipitation" + cardId).innerHTML = precipitation;
  document.getElementById("tomorrow-wind-speed" + cardId).innerHTML = windSpeed + "м/с";
  drawWindDirection("tomorrow-wind-direction" + cardId, windDegree);
  document.getElementById("tomorrow-wind-gusts" + cardId).innerHTML = windGusts + "м/с";
}

function getUtcZoneString(data) {
  const timeOffsetHours = data.utc_offset_seconds / 3600;

  let utcZoneString = "UTC+" + timeOffsetHours;
  if (timeOffsetHours < 0) {
    utcZoneString = "UTC" + timeOffsetHours;
  }

  return utcZoneString;
}

function getNeededHour(data) {
  const timeZone = data.timezone;
  const currentDate = new Date();
  const timeOptions = { timeZone: timeZone, hour12: false, hour: 'numeric' };
  const hoursInTimeZone = parseInt(currentDate.toLocaleTimeString('ru-RU', timeOptions));
  const currentMinute = currentDate.getMinutes();

  let neededHour = hoursInTimeZone + 1;
  if (currentMinute >= 30) {
    neededHour = hoursInTimeZone + 2;
  }

  return neededHour;
}

export { showMessage, drawWindDirection, displayWeather, displayLocation };