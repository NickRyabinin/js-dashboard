function createWeatherCard(cardId, method) {
  const card = document.createElement('div');
  card.classList.add('card', 'bg-blue');

  const form = document.createElement('form');
  form.id = `form-${method}`;
  const input = document.createElement('input');
  input.id = `location-${method}`;
  input.classList.add('input');
  input.type = 'search';
  input.placeholder = 'Введите нужное местоположение';
  const submitBtn = document.createElement('input');
  submitBtn.classList.add('submit');
  submitBtn.type = 'button';
  submitBtn.value = 'Получить погоду';

  form.appendChild(input);
  form.appendChild(submitBtn);
  card.appendChild(form);

  const location = document.createElement('div');
  location.id = `location${cardId}`;
  location.classList.add('location');
  location.innerHTML = "Местоположение не определено";

  card.appendChild(location);

  const hr = document.createElement('hr');

  card.appendChild(hr);

  const currentTime = document.createElement('div');
  currentTime.id = `current-time${cardId}`;
  currentTime.classList.add('time');

  card.appendChild(currentTime);

  const weatherParametersContainer = document.createElement('div');
  weatherParametersContainer.classList.add('weather-parameters-container');

  const superstructure1 = document.createElement('div');
  superstructure1.classList.add('superstructure');

  const label1 = document.createElement('div');
  label1.classList.add('label');
  label1.innerHTML = "Температура";

  superstructure1.appendChild(label1);

  const currentTemp = document.createElement('div');
  currentTemp.id = `current-temp${cardId}`;
  currentTemp.classList.add('temperature');

  superstructure1.appendChild(currentTemp);

  weatherParametersContainer.appendChild(superstructure1);

  const superstructure2 = document.createElement('div');
  superstructure2.classList.add('superstructure');

  const label2 = document.createElement('div');
  label2.classList.add('label');
  label2.innerHTML = "Осадки";

  superstructure2.appendChild(label2);

  const currentPrecipitation = document.createElement('div');
  currentPrecipitation.id = `current-precipitation${cardId}`;
  currentPrecipitation.classList.add('precipitation');

  superstructure2.appendChild(currentPrecipitation);

  weatherParametersContainer.appendChild(superstructure2);

  const superstructure3 = document.createElement('div');
  superstructure3.classList.add('superstructure');

  const label3 = document.createElement('div');
  label3.classList.add('label');
  label3.innerHTML = "Ощущается как";

  superstructure3.appendChild(label3);

  const currentApparentTemp = document.createElement('div');
  currentApparentTemp.id = `current-apparent-temp${cardId}`;
  currentApparentTemp.classList.add('temperature');

  superstructure3.appendChild(currentApparentTemp);

  weatherParametersContainer.appendChild(superstructure3);

  card.appendChild(weatherParametersContainer);

  return card;
}

export { createWeatherCard };