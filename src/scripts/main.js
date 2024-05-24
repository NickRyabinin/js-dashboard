import { getWeatherWithAJAX, getWeatherWithFetch } from "./weather.js";

document.addEventListener('DOMContentLoaded', setEventListeners);

function setEventListeners() {
  const forms = document.querySelectorAll('form');

  for (const form of forms) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      getWeather(event);
    });
    form.addEventListener('click', function (event) {
      if (event.target.classList.contains('submit')) {
        getWeather(event);
      }
    });
  }
}

function getWeather(event) {
  const formId = event.target.closest('form').id;
  if (formId === "form-ajax") {
    getWeatherWithAJAX();
  } else if (formId === "form-fetch") {
    getWeatherWithFetch();
  }
}