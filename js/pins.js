'use strict';

(function () {
  var PIN_X_SHIFT = 25;
  var PIN_Y_SHIFT = 70;

  var template = document.querySelector('template').content;
  var map = document.querySelector('.map');
  var pinsContainer = map.querySelector('.map__pins');

  var onMapPinClick = function (object) {
    window.card.removeMapCard();
    window.card.insertMapCard(object);
  };

  var pins = [];
  var mapPinEventListeners = [];

  var renderMapPin = function (object) {
    var mapPin = template.querySelector('.map__pin').cloneNode(true);
    mapPin.setAttribute('style', 'left: ' + (object.location.x - PIN_X_SHIFT) + 'px; top: ' + (object.location.y - PIN_Y_SHIFT) + 'px;');
    mapPin.querySelector('img').setAttribute('src', object.author.avatar);

    var bind = onMapPinClick.bind(null, object);
    mapPinEventListeners.push(bind);

    mapPin.addEventListener('click', bind);
    pins.push(mapPin);
    return mapPin;
  };

  var renderMapPins = function (objects) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < objects.length; i++) {
      fragment.appendChild(renderMapPin(objects[i]));
    }
    pinsContainer.appendChild(fragment);
  };

  var removeAllMapPins = function () {
    pins.forEach(function (item, index) {
      item.removeEventListener('click', mapPinEventListeners[index]);
    });
    while (pinsContainer.lastElementChild.classList.contains('map__pin--main') === false) {
      pinsContainer.removeChild(pinsContainer.lastChild);
    }
  };

  // Export
  window.pins = {
    renderMapPins: renderMapPins,
    removeAllMapPins: removeAllMapPins
  };
})();
