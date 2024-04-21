const locationLat = 54.625;
const locationLon = 43.875;
const locationTimezone = "Europe/Moscow";

const url = "https://api.open-meteo.com/v1/forecast?latitude=" + locationLat + "&longitude=" +
  locationLon + "&current=temperature_2m&timezone=" + locationTimezone;

function fetchDataWithXHR() {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
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

function fetchDataWithFetch() {
  fetch(url)
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

setInterval(fetchDataWithXHR, 120000);
setInterval(fetchDataWithFetch, 120000);