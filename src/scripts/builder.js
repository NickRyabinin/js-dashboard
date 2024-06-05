function createWeatherCard(cardId, method) {
  const card = buildElement('div', '', ['card', 'bg-blue']);

  // form
  buildForm(card, method);

  // location
  const location = buildElement('div', `location${cardId}`, ['location'], "Местоположение не определено");
  card.appendChild(location);

  // current block
  buildBlock(card, cardId, 'current');

  // one-hour block
  buildBlock(card, cardId, 'one-hour');

  // tomorrow block
  buildBlock(card, cardId, 'tomorrow');

  return card;
}

function buildElement(tag, id = '', classList = [], innerHTML = '') {
  const element = document.createElement(tag);

  if (id) {
    element.id = id;
  }

  if (classList) {
    for (const item of classList) {
      element.classList.add(item);
    }
  }

  if (innerHTML) {
    element.innerHTML = innerHTML;
  }

  return element;
}

function buildForm(card, method) {
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

  return card;
}

function buildBlock(card, cardId, blockId) {
  // hr
  const hr = document.createElement('hr');
  card.appendChild(hr);

  // time
  const time = buildElement('div', `${blockId}-time${cardId}`, ['time']);
  card.appendChild(time);

  // temp & precipitation
  buildTempSubBlock(card, cardId, blockId);

  // wind
  buildWindSubBlock(card, cardId, blockId);

  return card;
}

function buildTempSubBlock(card, cardId, blockId) {
  const weatherParametersContainer = buildElement('div', '', ['weather-parameters-container']);

  const superstructure1 = buildElement('div', '', ['superstructure']);

  let label1 = buildElement('div', '', ['label'], "Температура");
  let temp = buildElement('div', `${blockId}-temp${cardId}`, ['temperature']);

  let label3 = buildElement('div', '', ['label'], "Ощущается как");
  let apparentTemp = buildElement('div', `${blockId}-apparent-temp${cardId}`, ['temperature']);

  if (blockId === 'tomorrow') {
    label1 = buildElement('div', '', ['label'], "Температура, min");
    temp = buildElement('div', `${blockId}-min-temp${cardId}`, ['temperature']);

    label3 = buildElement('div', '', ['label'], "Температура, max");
    apparentTemp = buildElement('div', `${blockId}-max-temp${cardId}`, ['temperature']);
  }

  superstructure1.appendChild(label1);
  superstructure1.appendChild(temp);

  weatherParametersContainer.appendChild(superstructure1);

  const superstructure2 = buildElement('div', '', ['superstructure']);

  const label2 = buildElement('div', '', ['label'], "Осадки");
  superstructure2.appendChild(label2);

  const precipitation = buildElement('div', `${blockId}-precipitation${cardId}`, ['precipitation']);
  superstructure2.appendChild(precipitation);

  weatherParametersContainer.appendChild(superstructure2);

  const superstructure3 = buildElement('div', '', ['superstructure']);

  superstructure3.appendChild(label3);
  superstructure3.appendChild(apparentTemp);

  weatherParametersContainer.appendChild(superstructure3);

  card.appendChild(weatherParametersContainer);

  return card;
}

function buildWindSubBlock(card, cardId, blockId) {
  const weatherParametersContainer = buildElement('div', '', ['weather-parameters-container']);

  const superstructure1 = buildElement('div', '', ['superstructure']);

  const label1 = buildElement('div', '', ['label'], "Ветер");
  superstructure1.appendChild(label1);

  const windSpeed = buildElement('div', `${blockId}-wind-speed${cardId}`, ['wind']);
  superstructure1.appendChild(windSpeed);

  weatherParametersContainer.appendChild(superstructure1);

  const windDirection = buildElement('div', `${blockId}-wind-direction${cardId}`, ['wind']);

  weatherParametersContainer.appendChild(windDirection);

  const superstructure3 = buildElement('div', '', ['superstructure']);

  const label3 = buildElement('div', '', ['label'], "Порывы");
  superstructure3.appendChild(label3);

  const windGusts = buildElement('div', `${blockId}-wind-gusts${cardId}`, ['wind']);
  superstructure3.appendChild(windGusts);

  weatherParametersContainer.appendChild(superstructure3);

  card.appendChild(weatherParametersContainer);

  return card;
}

export { createWeatherCard };