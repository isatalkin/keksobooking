'use strict';

(function () {

  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var setFilesPreview = function (chooser, preview) {

    chooser.addEventListener('change', function () {

      var files = chooser.files;

      var setPreview = function (file) {

        var fileName = file.name.toLowerCase();
        var matches = FILE_TYPES.some(function (item) {
          return fileName.endsWith(item);
        });

        if (matches) {

          var reader = new FileReader();

          reader.addEventListener('load', function () {
            if (chooser === avatarChooser) {
              preview.src = reader.result;
              preview.setAttribute('width', '100%');
              preview.removeAttribute('height');
            } else {
              var formPhoto = document.createElement('div');
              var newImage = document.createElement('img');
              formPhoto.classList.add('form__photo');
              newImage.src = reader.result;
              newImage.draggable = true;
              formPhoto.appendChild(newImage);
              imagesPreview.appendChild(formPhoto);
            }
          });

          reader.readAsDataURL(file);

        }

      };

      if (files) {
        Array.prototype.forEach.call(files, setPreview);
      }

      window.dragAndDrop.setDragAndDrop();

    });
  };

  // Ставим превью на загрузку аватарки
  var avatarChooser = document.querySelector('#avatar');
  var avatarPreview = document.querySelector('.notice__preview img');
  setFilesPreview(avatarChooser, avatarPreview);

  // Ставим превью на загрузку фотографий
  var imagesChooser = document.querySelector('#images');
  imagesChooser.multiple = true;
  var imagesPreview = document.querySelector('.form__photo-container');
  setFilesPreview(imagesChooser, imagesPreview);

  // Возвращаем аватарку по умолчанию
  var setDefaultAvatar = function () {
    avatarPreview.src = 'img/muffin.png';
    avatarPreview.width = 40;
    avatarPreview.height = 44;
  };

  // Удаляем фотографии из превью
  var removeAllPreviews = function () {
    Array.prototype.forEach.call(imagesPreview.querySelectorAll('.form__photo'), function (item) {
      imagesPreview.removeChild(item);
    });
  };

  // Export
  window.preview = {
    setDefaultAvatar: setDefaultAvatar,
    removeAllPreviews: removeAllPreviews
  };

})();
