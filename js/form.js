'use strict';

(function () {

  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';

  var COST_MAP = {
    'flat': 1000,
    'bungalo': 0,
    'house': 5000,
    'palace': 10000
  };
  var CAPACITY_MAP = {
    '1': '1',
    '2': '2',
    '3': '3',
    '100': '0'
  };
  var DISABLED_MAP = {
    '1': [2, 3, 0],
    '2': [3, 0],
    '3': [0],
    '100': [1, 2, 3]
  };

  var form = document.querySelector('.notice__form');
  var address = form.querySelector('#address');
  var type = form.querySelector('#type');
  var rooms = form.querySelector('#room_number');
  var reset = form.querySelector('.form__reset');
  var price = form.querySelector('#price');
  var timeIn = form.querySelector('#timein');
  var timeOut = form.querySelector('#timeout');
  var capacity = form.querySelector('#capacity');

  var toggleForm = function () {
    form.classList.toggle('notice__form--disabled');
    Array.prototype.forEach.call(form.querySelectorAll('fieldset'), function (item) {
      item.disabled = !item.disabled;
    });
  };

  var setAddress = function (x, y) {
    address.setAttribute('value', x + ', ' + y);
  };

  var onTypeChange = function () {
    price.min = COST_MAP[type.value]; // Если изменяется тип жилья
  };

  var onTimeChange = function (evt) {
    if (evt.target === timeIn) { // Если изменяется время въезда
      timeOut.value = timeIn.value;
    } else if (evt.target === timeOut) { // Если изменяется время выезда
      timeIn.value = timeOut.value;
    }
  };

  var onRoomsChange = function () {
    capacity.value = CAPACITY_MAP[rooms.value];
    Array.prototype.forEach.call(form.querySelectorAll('option'), function (item) {
      item.disabled = false;
    });
    DISABLED_MAP[rooms.value].forEach(function (item) {
      capacity.querySelector('option[value="' + item + '"]').disabled = true;
    });
  };

  var onResetButtonClick = function () {
    window.preview.setDefaultAvatar();
    window.preview.removeAllPreviews();
    window.filters.toggleFilters();
    window.map.toggleMap('off');
    window.pins.removeAllMapPins();
    window.card.removeMapCard();
    window.map.mainPinReset();
    setDefault();
    reset.removeEventListener('click', onResetButtonClick);
    type.removeEventListener('change', onTypeChange);
    form.removeEventListener('change', onTimeChange);
    rooms.removeEventListener('change', onRoomsChange);
    window.map.setMainPinEventListener();
  };

  var setFormEventListeners = function () {
    type.addEventListener('change', onTypeChange); // Вешаем обработчик изменения типа жилья
    form.addEventListener('change', onTimeChange); // Вешаем обработчик изменения времени
    rooms.addEventListener('change', onRoomsChange); // Вешаем обработчик изменения кол-ва комнат
    reset.addEventListener('click', onResetButtonClick); // Вешаем обработчик на кнопку сброса формы
  };

  var setDefault = function () {
    form.reset();
    toggleForm();
    setAddress(window.map.mainPinCoords.x, window.map.mainPinCoords.y);
    onRoomsChange();
  };

  // Настройки формы по умолчанию
  form.classList.remove('notice__form--disabled');
  setDefault();

  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(UPLOAD_URL, new FormData(form), function (response) {
      if (response === window.utils.Status.OK) {
        onResetButtonClick();
        window.popup.renderStatusPopup(response);
      }
    }, function (errorStatus) {
      window.popup.renderStatusPopup(errorStatus);
    });
  });

  // Export
  window.form = {
    setAddress: setAddress,
    toggleForm: toggleForm,
    setFormEventListeners: setFormEventListeners,
    onResetButtonClick: onResetButtonClick
  };

})();
