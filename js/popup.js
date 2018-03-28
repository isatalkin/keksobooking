'use strict';

(function () {

  var DELETE_TIMEOUT = 2500; // 2.5seconds

  var statusMap = {
    '200': 'Данные успешно отправлены!',
    '404': 'Произошла ошибка 404 NOT FOUND'
  };

  var renderStatusPopup = function (serverStatus) {
    var popup = document.createElement('div');
    popup.classList.add('modal-popup');
    if (serverStatus === window.utils.Status.OK) {
      popup.classList.add('modal-popup--success');
    } else {
      popup.classList.add('modal-popup--error');
    }
    popup.textContent = statusMap[serverStatus];

    document.body.appendChild(popup);
    setTimeout(deletePopup, DELETE_TIMEOUT);
  };

  var deletePopup = function () {
    document.body.removeChild(document.querySelector('.modal-popup'));
  };

  // Export
  window.popup = {
    renderStatusPopup: renderStatusPopup
  };

})();
