import { getWeather } from "./weather.js";

document.addEventListener('DOMContentLoaded', setEventListeners);

function setEventListeners() {
  const forms = document.querySelectorAll('form');

  for (const form of forms) {
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      main(event);
    });
    form.addEventListener('click', function (event) {
      if (event.target.classList.contains('submit')) {
        main(event);
      }
    });
  }
}

function main(event) {
  const formId = event.target.closest('form').id;
  if (formId === "form-ajax") {
    getWeather("ajax");
  } else if (formId === "form-fetch") {
    getWeather("fetch");
  }
}