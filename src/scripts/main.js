import { getWeatherWithAJAX, getWeatherWithFetch } from "./weather.js";

document.addEventListener('DOMContentLoaded', setEventListeners);

function setEventListeners() {
  const formAjax = document.getElementById('form-ajax');
  const formFetch = document.getElementById('form-fetch');

  formAjax.addEventListener('submit', function (event) {
    event.preventDefault();
    getWeather(event);
  });

  formAjax.addEventListener('click', function (event) {
    if (event.target.classList.contains('submit')) {
      getWeather(event);
    }
  });

  formFetch.addEventListener('submit', function (event) {
    event.preventDefault();
    getWeather(event);
  });

  formFetch.addEventListener('click', function (event) {
    if (event.target.classList.contains('submit')) {
      getWeather(event);
    }
  });
}

function getWeather(event) {
  const formId = event.target.closest('form').id;
  if (formId === "form-ajax") {
    getWeatherWithAJAX();
  } else if (formId === "form-fetch") {
    getWeatherWithFetch();
  }
}