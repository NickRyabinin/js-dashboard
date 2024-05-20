function getCoordinates(location) {
  return new Promise((resolve, reject) => {
    const geocodingApiUrl = 'https://nominatim.openstreetmap.org/search';
    const requestUrl = geocodingApiUrl + '?' + 'q=' + encodeURIComponent(location) + '&format=json';
    const request = new XMLHttpRequest();
    request.open('GET', requestUrl, true);
    request.onload = function() {
      if (request.status === 200) {
        const data = JSON.parse(request.responseText);
        if (Object.keys(data).length === 0) {
          reject('Местоположение не может быть определено');
        }
        showMessage('');
        const locationData = {
          locationLat: data[0].lat,
          locationLon: data[0].lon,
          locationName: data[0].display_name
        };
        resolve(locationData);
      } else if (request.status <= 500) {
        reject('Error while geocoding');
      } else {
        reject('Server error');
      }
    };
    request.onerror = function() {
      reject('Unable to connect to server');
    };
    request.send();
  });
}