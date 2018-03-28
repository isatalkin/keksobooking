'use strict';

(function () {

  var Status = {
    OK: 200,
    NOT_MODIFIED: 304
  };

  var KeyCode = {
    ENTER: 13,
    ESC: 27
  };

  var isEnterEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ENTER) {
      action();
    }
  };

  var isEscEvent = function (evt, action) {
    if (evt.keyCode === KeyCode.ESC) {
      action();
    }
  };

  // Export
  window.utils = {
    isEnterEvent: isEnterEvent,
    isEscEvent: isEscEvent,
    Status: Status
  };
})();
