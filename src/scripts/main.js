/**
 * main.js формирует необходимое количество погодных карточек через builder.js.
 * Устанавливает слушатели событий в сгенерированные формы.
 * Маршрутизирует обращения к AJAX- или Fetch-версиям запроса погоды.
 * (Смешение AJAX, Fetch, статического HTML и генерации HTML через JS манипуляции
 * с DOM реализовано исключительно в учебных целях)
 */
import { createWeatherCard } from "./builder.js";
import { getWeather } from "./weather.js";

const container = document.querySelector('.container');
container.appendChild(createWeatherCard(1, 'ajax'));
container.appendChild(createWeatherCard(2, 'fetch'));

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