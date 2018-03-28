'use strict';
(function () {

  var setDragAndDrop = function () {
    var photoContainer = document.querySelector('.form__photo-container');
    var draggedElement;

    var onDragstart = function (evt) {
      draggedElement = evt.target.parentNode;
      evt.dataTransfer.effectAllowed = 'move';
      evt.dataTransfer.setData('text/plain', draggedElement.textContent);
      setTimeout(function () {
        draggedElement.style.opacity = '0.4';
      }, 0);
    };

    var onDragOver = function (evt) {
      evt.preventDefault();
      evt.dataTransfer.dropEffect = 'move';
      var target = evt.target.parentNode;
      if (target && target !== draggedElement && target.tagName.toLowerCase() === 'div') {
        photoContainer.insertBefore(draggedElement, photoContainer.children[0] !== target && target.nextSibling || target);
      }
    };

    var onDragEnd = function (evt) {
      evt.preventDefault();
      draggedElement.style.opacity = '1';
    };

    if (photoContainer) {
      photoContainer.addEventListener('dragstart', onDragstart);
      photoContainer.addEventListener('dragover', onDragOver, false);
      photoContainer.addEventListener('dragend', onDragEnd, false);
    }
  };

  // Export
  window.dragAndDrop = {
    setDragAndDrop: setDragAndDrop
  };
})();
