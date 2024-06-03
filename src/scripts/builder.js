function createWeatherCard(cardId, method) {
  const card = buildElement('div', '', ['card', 'bg-blue']);

  // form
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

  // location
  const location = buildElement('div', `location${cardId}`, ['location'], "Местоположение не определено");
  card.appendChild(location);

  // hr
  const hr = document.createElement('hr');
  card.appendChild(hr);

  // current block
  buildBlock(card, cardId, 'current');

  // hr
  card.appendChild(hr);
  
  // one-hour block
  buildBlock(card, cardId, 'one-hour');
  
  // hr
  card.appendChild(hr);

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

function buildBlock(card, cardId, blockId) {
  // time
  const time = buildElement('div', `${blockId}-time${cardId}`, ['time']);
  card.appendChild(time);

  // temp & precipitation
  const weatherParametersContainer1 = buildElement(tag='div', classList=['weather-parameters-container']);

  const superstructure1 = buildElement(tag='div', classList=['superstructure']);

  let label1 = buildElement('div', '', ['label'], "Температура");
  let temp = buildElement('div', `${blockId}-temp${cardId}`, ['temperature']);
  if (blockId === 'tomorrow') {
    label1 = buildElement('div', '', ['label'], "Температура, min");
    temp = buildElement('div', `${blockId}-min-temp${cardId}`, ['temperature']);
  }

  superstructure1.appendChild(label1);
  superstructure1.appendChild(temp);

  weatherParametersContainer1.appendChild(superstructure1);

  const superstructure2 = buildElement(tag='div', classList=['superstructure']);

  const label2 = buildElement('div', '', ['label'], "Осадки");
  superstructure2.appendChild(label2);

  const precipitation = buildElement('div', `${blockId}-precipitation${cardId}`, ['precipitation']);
  superstructure2.appendChild(precipitation);

  weatherParametersContainer1.appendChild(superstructure2);

  const superstructure3 = buildElement(tag='div', classList=['superstructure']);

  let label3 = buildElement('div', '', ['label'], "Ощущается как");
  let apparentTemp = buildElement('div', `${blockId}-apparent-temp${cardId}`, ['temperature']);
  if (blockId === 'tomorrow') {
    label3 = buildElement('div', '', ['label'], "Температура, max");
    apparentTemp = buildElement('div', `${blockId}-max-temp${cardId}`, ['temperature']);
  }

  superstructure3.appendChild(label3);
  superstructure3.appendChild(apparentTemp);

  weatherParametersContainer1.appendChild(superstructure3);

  card.appendChild(weatherParametersContainer1);

  // wind
  const weatherParametersContainer2 = buildElement(tag='div', classList=['weather-parameters-container']);

  const superstructure4 = buildElement(tag='div', classList=['superstructure']);

  const label4 = buildElement('div', '', ['label'], "Ветер");
  superstructure4.appendChild(label4);

  const windSpeed = buildElement('div', `${blockId}-wind-speed${cardId}`, ['wind']);
  superstructure4.appendChild(windSpeed);

  weatherParametersContainer2.appendChild(superstructure4);

  const windDirection = buildElement('div', `${blockId}-wind-direction${cardId}`, ['wind']);

  weatherParametersContainer2.appendChild(windDirection);

  const superstructure6 = buildElement(tag='div', classList=['superstructure']);

  const label6 = buildElement('div', '', ['label'], "Порывы");
  superstructure6.appendChild(label6);

  const windGusts = buildElement('div', `${blockId}-wind-gusts${cardId}`, ['wind']);
  superstructure6.appendChild(windGusts);

  weatherParametersContainer2.appendChild(superstructure6);

  card.appendChild(weatherParametersContainer2);

  return card;
}

export { createWeatherCard };