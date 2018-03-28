'use strict';

(function () {

  var RESPONSE_TIMEOUT = 5000; // 5seconds

  var download = function (url, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', url);

    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.utils.Status.OK || xhr.status === window.utils.Status.NOT_MODIFIED) {
        onLoad(xhr.response);
      } else {
        onError(xhr.status);
      }
    });
    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });
    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = RESPONSE_TIMEOUT;

    xhr.send();
  };

  var upload = function (url, data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === window.utils.Status.OK) {
        onLoad(xhr.status);
      } else {
        onError(xhr.status);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = RESPONSE_TIMEOUT;

    xhr.open('POST', url);
    xhr.send(data);
  };

  // Export
  window.backend = {
    download: download,
    upload: upload
  };

})();
