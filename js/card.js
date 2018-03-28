'use strict';

(function () {
  var template = document.querySelector('template').content;
  var map = document.querySelector('.map');

  // Создаем функцию рендера features
  var renderFeature = function (object, index) {
    var feature = template.querySelector('.feature').cloneNode(true);
    feature.classList.remove('feature--wifi');
    feature.classList.add('feature--' + object.offer.features[index]);
    return feature;
  };

  // Создаем функцию рендера картинки
  var renderPopupPicture = function (object, index) {
    var popupPicture = template.querySelector('.popup__pictures li').cloneNode(true);
    var popupImg = popupPicture.querySelector('img');
    popupImg.setAttribute('src', object.offer.photos[index]);
    popupImg.setAttribute('width', '70');
    popupImg.setAttribute('height', '50');
    return popupPicture;
  };

  var renderMapCard = function (object) {
    var fragment = document.createDocumentFragment();
    var mapCard = template.querySelector('.map__card').cloneNode(true);
    mapCard.querySelector('h3').textContent = object.offer.title;
    mapCard.querySelector('p small').textContent = object.offer.address;
    mapCard.querySelector('.popup__price').innerHTML = object.offer.price + ' &#x20bd;/ночь';
    if (object.offer.type === 'flat') {
      mapCard.querySelector('h4').textContent = 'Квартира';
    } else if (object.offer.type === 'house') {
      mapCard.querySelector('h4').textContent = 'Дом';
    } else {
      mapCard.querySelector('h4').textContent = 'Бунгало';
    }
    mapCard.querySelector('p:nth-of-type(3)').textContent = object.offer.rooms + ' комнаты для ' + object.offer.guests + ' гостей';
    mapCard.querySelector('p:nth-of-type(4)').textContent = 'Заезд после ' + object.offer.checkin + ', выезд до ' + object.offer.checkout;
    mapCard.querySelector('p:nth-of-type(5)').textContent = object.offer.description;
    mapCard.querySelector('.popup__avatar').setAttribute('src', object.author.avatar);

    // Удаляем все features по умолчанию и скрываем сам блок
    var popupFeatures = mapCard.querySelector('.popup__features');
    while (popupFeatures.firstChild) {
      popupFeatures.removeChild(popupFeatures.firstChild);
    }
    mapCard.removeChild(popupFeatures);

    // Если в объекте есть features, то рендерим их из массива и вставляем через document.fragment
    if (object.offer.features.length > 0) {
      for (var x = 0; x < object.offer.features.length; x++) {
        fragment.appendChild(renderFeature(object, x));
      }
      popupFeatures.appendChild(fragment);
      mapCard.insertBefore(popupFeatures, mapCard.querySelector('p:nth-of-type(4)'));
    }

    // Удаляем все картинки по умолчанию
    var popupPictures = mapCard.querySelector('.popup__pictures');
    while (popupPictures.firstChild) {
      popupPictures.removeChild(popupPictures.firstChild);
    }
    mapCard.removeChild(popupPictures);

    // Рендерим картинки из массива
    if (object.offer.photos.length > 0) {
      for (var y = 0; y < object.offer.photos.length; y++) {
        fragment.appendChild(renderPopupPicture(object, y));
      }
      popupPictures.appendChild(fragment);
      mapCard.appendChild(popupPictures);
    }

    mapCard.querySelector('.popup__close').addEventListener('click', onMapCardCloseButtonClick);

    return mapCard;
  };

  var removeMapCard = function () {
    if (map.contains(map.querySelector('.map__card'))) {
      map.querySelector('.popup__close').removeEventListener('click', onMapCardCloseButtonClick);
      document.removeEventListener('keydown', onDocumentKeydown);
      map.removeChild(map.querySelector('.map__card'));
    }
  };

  var onMapCardCloseButtonClick = function () {
    removeMapCard();
  };

  var onDocumentKeydown = function (evt) {
    window.utils.isEscEvent(evt, removeMapCard);
  };

  var insertMapCard = function (object) {
    map.insertBefore(renderMapCard(object), map.querySelector('.map__filters-container'));
    document.addEventListener('keydown', onDocumentKeydown);
  };

  // Export
  window.card = {
    insertMapCard: insertMapCard,
    removeMapCard: removeMapCard
  };
})();
