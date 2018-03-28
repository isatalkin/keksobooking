'use strict';

(function () {

  var DEBOUNCE_TIMEOUT = 500;

  var filters = document.querySelector('.map__filters');
  var typeSelect = filters.querySelector('#housing-type');
  var priceSelect = filters.querySelector('#housing-price');
  var roomsSelect = filters.querySelector('#housing-rooms');
  var guestsSelect = filters.querySelector('#housing-guests');
  var initialObjects;

  // По умолчанию поля фильтра задизейблены и будут доступны только когда загрузятся внешние данные
  var toggleFilters = function () {
    Array.prototype.forEach.call(filters.children, function (item) {
      item.disabled = !item.disabled;
    });
    filters.reset();
  };
  toggleFilters();

  var filterByValue = function (filteredObjects, objectKey, value) {
    return filteredObjects.filter(function (item) {
      return item.offer[objectKey].toString() === value;
    });
  };

  // Фильтр по цене
  var Price = {
    MIN: 10000,
    MAX: 50000
  };
  var filterByPrice = function (filteredObjects, value) {
    return filteredObjects.filter(function (item) {
      var price = parseInt(item.offer.price, 10);
      var priceType = 'any';
      if (price >= Price.MIN && price <= Price.MAX) {
        priceType = 'middle';
      } else if (price > Price.MAX) {
        priceType = 'high';
      } else {
        priceType = 'low';
      }
      return priceType === value;
    });
  };

  // Фильтр по удобствам
  var filterByFeatures = function (filteredObjects) {
    var checkedFeatures = filters.querySelectorAll('#housing-features [type="checkbox"]:checked');
    Array.prototype.forEach.call(checkedFeatures, function (eachItem) {
      filteredObjects = filteredObjects.filter(function (item) {
        return item.offer.features.indexOf(eachItem.value) >= 0;
      });
    });
    return filteredObjects;
  };

  var onFiltersChange = function () {
    var filteredObjects = initialObjects;
    // Если меняется тип жилья
    if (typeSelect.value !== 'any') {
      filteredObjects = filterByValue(filteredObjects, 'type', typeSelect.value);
    }
    // Если меняется цена
    if (priceSelect.value !== 'any') {
      filteredObjects = filterByPrice(filteredObjects, priceSelect.value);
    }
    // Если меняется кол-во комнат
    if (roomsSelect.value !== 'any') {
      filteredObjects = filterByValue(filteredObjects, 'rooms', roomsSelect.value);
    }
    // Если меняется кол-во гостей
    if (guestsSelect.value !== 'any') {
      filteredObjects = filterByValue(filteredObjects, 'guests', guestsSelect.value);
    }
    // Если меняются удобства
    filteredObjects = filterByFeatures(filteredObjects);

    window.card.removeMapCard();
    window.pins.removeAllMapPins();
    window.pins.renderMapPins(filteredObjects);
  };

  var lastTimeout;
  var debounce = function () {
    if (lastTimeout) {
      clearTimeout(lastTimeout);
    }
    lastTimeout = setTimeout(onFiltersChange, DEBOUNCE_TIMEOUT);
  };

  var setFiltersEventListener = function (objects) {
    initialObjects = objects;
    filters.addEventListener('change', debounce);
  };

  // Export
  window.filters = {
    toggleFilters: toggleFilters,
    setFiltersEventListener: setFiltersEventListener
  };
})();
