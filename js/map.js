'use strict';

(function () {

  var DOWNLOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var MAX_OBJECTS_TO_SHOW = 5;

  var MainPin = {
    DEFAULT_X: 600,
    DEFAULT_Y: 375,
    X_MIN: 35,
    X_MAX: 1165,
    Y_MIN: 150,
    Y_MAX: 500,
    Y_SHIFT: 40
  };

  var map = document.querySelector('.map');

  // Вкл/выкл карты
  var mapActivated = false;
  var toggleMap = function (state) {
    map.classList.toggle('map--faded');
    if (state === 'on') {
      mapActivated = true;
    } else if (state === 'off') {
      mapActivated = false;
    }
  };

  var mainPin = map.querySelector('.map__pin--main');

  var mainPinCoords = {
    x: MainPin.DEFAULT_X,
    y: MainPin.DEFAULT_Y
  };

  var mainPinSet = false;

  var mainPinReset = function () {
    mainPinSet = false;
    mainPinCoords.x = MainPin.DEFAULT_X;
    mainPinCoords.y = MainPin.DEFAULT_Y;
    mainPin.style.left = mainPinCoords.x + 'px';
    mainPin.style.top = mainPinCoords.y + 'px';
  };

  var onMouseDown = function (mouseDownEvent) {
    mouseDownEvent.preventDefault();

    var onMouseMove = function (mouseMoveEvent) {
      mouseMoveEvent.preventDefault();

      // Если карта не активирована, то активируем
      if (!mapActivated) {
        toggleMap('on');
      }

      var x = mouseMoveEvent.pageX - map.offsetLeft;
      var y = mouseMoveEvent.pageY - map.offsetTop;

      if (x >= MainPin.X_MIN && x <= MainPin.X_MAX) {
        mainPinCoords.x = x;
      }

      if (y + MainPin.Y_SHIFT >= MainPin.Y_MIN && y + MainPin.Y_SHIFT <= MainPin.Y_MAX) {
        mainPinCoords.y = y;
      }

      mainPin.style.left = mainPinCoords.x + 'px';
      mainPin.style.top = mainPinCoords.y + 'px';

      window.form.setAddress(mainPinCoords.x, mainPinCoords.y + MainPin.Y_SHIFT);
    };

    var onMouseUp = function (mouseUpEvent) {
      mouseUpEvent.preventDefault();

      if (!mapActivated) {
        toggleMap('on');
      }

      if (!mainPinSet) {
        mainPinSet = true;

        // Получаем данные с сервера
        window.backend.download(DOWNLOAD_URL, function (response) {
          var objects = response.slice(0, MAX_OBJECTS_TO_SHOW);
          window.pins.renderMapPins(objects);
          window.filters.toggleFilters();
          window.filters.setFiltersEventListener(objects);
        }, function (serverStatus) {
          window.popup.renderStatusPopup(serverStatus);
        });

        window.form.toggleForm();
        window.form.setAddress(mainPinCoords.x, mainPinCoords.y + MainPin.Y_SHIFT);
        window.form.setFormEventListeners();
      }

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  var setMainPinEventListener = function () {
    mainPin.addEventListener('mousedown', onMouseDown);
  };
  setMainPinEventListener();

  // Export
  window.map = {
    toggleMap: toggleMap,
    mainPinCoords: mainPinCoords,
    mainPinReset: mainPinReset,
    setMainPinEventListener: setMainPinEventListener
  };

})();
