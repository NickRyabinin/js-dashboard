import { getWeatherWithAJAX, getWeatherWithFetch, fetchDataWithXHR, fetchDataWithFetch, getWeatherCondition } from "./weather.js";
import { validateInput } from "./validator.js";
import { getCoordinates } from "./location.js";
import { showMessage, drawWindDirection, showCurrentWeather, showOneHourWeather, showTomorrowWeather } from "./view.js";

export function getWeather(event) {
  const formId = event.target.closest('form').id;
  if (event.type ===  "click" || event.key === "Enter") {
    if (formId === "form-ajax") {
      getWeatherWithAJAX();
    } else if (formId === "form-fetch") {
      getWeatherWithFetch();
    }
  }
}