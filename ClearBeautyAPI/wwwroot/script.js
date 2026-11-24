/* ============================================================
   Clear Beauty — script_beauty.js
   Общий скрипт для index.html, favorites_beauty.html, profile_beauty.html

   - загрузка мастеров через fetch с fallback на демо-данные
   - фильтры, поиск, сортировка на главной
   - избранное в localStorage + страница избранного
   - демо-авторизация и личный кабинет
   - модальное окно записи + отправка формы через fetch
   ============================================================ */
(function () {
  'use strict';

  /* ----------------------------- Конфигурация ----------------------------- */

  const API_BASE = '/api';
  const ENDPOINTS = {
    masters: API_BASE + '/masters',
    bookings: API_BASE + '/bookings'
  };

  const STORAGE = {
    favorites: 'cb_favorites',
    bookings: 'cb_bookings',
    user: 'cb_user'
  };

  const PLACEHOLDER = 'https://placehold.co/400x400/eee6f8/8066a8?text=Clear+Beauty';

  const MONTHS_SHORT = ['ЯНВ', 'ФЕВ', 'МАР', 'АПР', 'МАЙ', 'ИЮН', 'ИЮЛ', 'АВГ', 'СЕН', 'ОКТ', 'НОЯ', 'ДЕК'];

  const CATEGORY_META = {
    manicure:    { name: 'Маникюр',      radio: 'catManicure' },
    hair:        { name: 'Стрижки',      radio: 'catHair' },
    color:       { name: 'Окрашивание',  radio: 'catColor' },
    brows:       { name: 'Брови',        radio: 'catBrows' },
    lashes:      { name: 'Ресницы',      radio: 'catLashes' },
    cosmetology: { name: 'Косметология', radio: 'catCosmetology' },
    makeup:      { name: 'Макияж',       radio: 'catMakeup' },
    massage:     { name: 'Массаж',       radio: 'catMassage' }
  };

  const RATING_RADIOS = { ratingAny: 0, rating4: 4, rating45: 4.5, rating5: 5 };
  const SORT_OPTIONS = ['popular', 'rating', 'price', 'distance'];

  /* ----------------------------- Демо-данные ----------------------------- */

  const MOCK_MASTERS = [
    {
      id: 1,
      name: 'Анна Петрова',
      specialty: 'Парикмахер · Стрижки, окрашивание',
      categories: ['hair', 'color'],
      rating: 4.9,
      reviews: 124,
      distance: 3.2,
      salon: 'Салон «Beauty Space»',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
      description: 'Стрижки, окрашивание и уход за волосами.',
      online: true,
      home: false,
      worksNow: true,
      services: [
        { id: 101, name: 'Женская стрижка', price: 2000, duration: 60, comment: 'Стрижка с укладкой и консультацией по уходу' },
        { id: 102, name: 'Окрашивание', price: 5000, duration: 180, comment: 'Однотонное окрашивание. Сложное — от 7000 ₽' },
        { id: 103, name: 'Укладка', price: 1500, duration: 45, comment: 'Повседневная или вечерняя укладка' }
      ]
    },
    {
      id: 2,
      name: 'Мария Иванова',
      specialty: 'Мастер маникюра · Маникюр, педикюр',
      categories: ['manicure'],
      rating: 4.8,
      reviews: 98,
      distance: 1.8,
      salon: 'Студия «Nail Lab»',
      photo: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80',
      description: 'Маникюр, педикюр, покрытие гель-лаком.',
      online: true,
      home: true,
      worksNow: true,
      services: [
        { id: 201, name: 'Маникюр с покрытием', price: 1800, duration: 90, comment: 'Покрытие гель-лаком с дизайном 2 ногтей в подарок' },
        { id: 202, name: 'Педикюр', price: 2200, duration: 90, comment: 'Аппаратный педикюр с покрытием' },
        { id: 203, name: 'Наращивание ногтей', price: 3000, duration: 120, comment: 'Размер S — 2500 ₽, M — 3000 ₽, L — 3500 ₽' }
      ]
    },
    {
      id: 3,
      name: 'Екатерина Соколова',
      specialty: 'Колорист · Окрашивание',
      categories: ['color'],
      rating: 4.7,
      reviews: 76,
      distance: 4.5,
      salon: 'Салон «Color Studio»',
      photo: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80',
      description: 'Сложное окрашивание, балаяж, тонирование.',
      online: true,
      home: false,
      worksNow: false,
      services: [
        { id: 301, name: 'Окрашивание в один тон', price: 4500, duration: 120, comment: 'Стойкая краска премиум-класса' },
        { id: 302, name: 'Балаяж', price: 7000, duration: 180, comment: 'Стоимость зависит от длины волос' },
        { id: 303, name: 'Тонирование', price: 2500, duration: 60, comment: 'Освежение цвета между окрашиваниями' }
      ]
    },
    {
      id: 4,
      name: 'Алина Кузнецова',
      specialty: 'Бровист · Брови, ресницы',
      categories: ['brows', 'lashes'],
      rating: 4.9,
      reviews: 132,
      distance: 2.7,
      salon: 'Студия «Brow&Lash»',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=500&q=80',
      description: 'Ламинирование бровей и наращивание ресниц.',
      online: true,
      home: false,
      worksNow: true,
      services: [
        { id: 401, name: 'Ламинирование бровей', price: 1800, duration: 60, comment: 'С окрашиванием и коррекцией формы' },
        { id: 402, name: 'Наращивание ресниц', price: 2500, duration: 120, comment: 'Классика — 2500 ₽, 2D — 3000 ₽, 3D — 3500 ₽' },
        { id: 403, name: 'Коррекция бровей', price: 800, duration: 30, comment: 'Коррекция пинцетом + воск' }
      ]
    },
    {
      id: 5,
      name: 'Ольга Смирнова',
      specialty: 'Косметолог · Уходовые процедуры',
      categories: ['cosmetology'],
      rating: 4.8,
      reviews: 64,
      distance: 5.1,
      salon: 'Клиника «Skin Care»',
      photo: 'https://images.unsplash.com/photo-1552699611-e2c4e0b2c3f0?auto=format&fit=crop&w=500&q=80',
      description: 'Чистки, пилинги, уходовые процедуры.',
      online: true,
      home: false,
      worksNow: false,
      services: [
        { id: 501, name: 'Чистка лица', price: 3500, duration: 90, comment: 'Комбинированная чистка с маской по типу кожи' },
        { id: 502, name: 'Пилинг', price: 2500, duration: 60, comment: 'Химический пилинг подбирается индивидуально' }
      ]
    },
    {
      id: 6,
      name: 'Виктория Федорова',
      specialty: 'Визажист · Макияж',
      categories: ['makeup'],
      rating: 4.6,
      reviews: 53,
      distance: 3.9,
      salon: 'Студия «Makeup Room»',
      photo: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=500&q=80',
      description: 'Дневной, вечерний и свадебный макияж.',
      online: true,
      home: true,
      worksNow: true,
      services: [
        { id: 601, name: 'Дневной макияж', price: 2500, duration: 60, comment: 'Лёгкий макияж на каждый день' },
        { id: 602, name: 'Вечерний макияж', price: 4000, duration: 90, comment: 'С использованием профессиональной косметики' }
      ]
    },
    {
      id: 7,
      name: 'Иван Беляев',
      specialty: 'Массажист · Массаж',
      categories: ['massage'],
      rating: 4.9,
      reviews: 87,
      distance: 2.3,
      salon: 'Салон «Relax»',
      photo: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80',
      description: 'Классический, расслабляющий и спортивный массаж.',
      online: true,
      home: true,
      worksNow: true,
      services: [
        { id: 701, name: 'Массаж спины', price: 2500, duration: 60, comment: 'Классический расслабляющий массаж' },
        { id: 702, name: 'Общий массаж тела', price: 3500, duration: 90, comment: 'С элементами лимфодренажа' }
      ]
    },
    {
      id: 8,
      name: 'Студия красоты «Lumière»',
      specialty: 'Салон · Комплексные услуги',
      categories: ['hair', 'manicure', 'color', 'brows', 'lashes', 'cosmetology', 'makeup', 'massage'],
      rating: 4.7,
      reviews: 215,
      distance: 1.6,
      salon: 'Москва, ул. Лесная, 7',
      photo: 'https://images.unsplash.com/photo-1600948836103-54d8a7d9b6f1?auto=format&fit=crop&w=500&q=80',
      description: 'Салон с полным спектром услуг красоты.',
      online: true,
      home: false,
      worksNow: true,
      services: [
        { id: 801, name: 'Комплексный уход', price: 5000, duration: 120, comment: 'Программа подбирается индивидуально' },
        { id: 802, name: 'Стрижка', price: 2500, duration: 60, comment: 'Включая укладку' },
        { id: 803, name: 'Маникюр', price: 1800, duration: 60, comment: 'С покрытием гель-лаком' }
      ]
    }
  ];

  /* ----------------------------- Состояние ----------------------------- */

  const state = {
    masters: [],
    search: '',
    category: 'all',
    rating: 0,
    onlineOnly: true,
    homeOnly: false,
    worksNow: false,
    maxDistance: 20,
    maxPrice: 10000,
    sort: 'popular'
  };

  let mastersPromise = null;
  let selectedMasterId = null;
  let profileEditing = false;

  /* ----------------------------- Запуск ----------------------------- */

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    seedFavoritesOnce();
    injectBookingModal();
    bindBookingModal();
    bindHeader();

    await loadMasters();

    initMainPage();
    initFavoritesPage();
    initProfilePage();
    bindGlobalLinks();
  }

  /* ----------------------------- Данные и API ----------------------------- */

  function loadMasters() {
    if (mastersPromise) return mastersPromise;

    mastersPromise = (async function () {
      try {
        const response = await fetch(ENDPOINTS.masters, { headers: { Accept: 'application/json' } });
        if (!response.ok) throw new Error('HTTP ' + response.status);

        const data = await response.json();
        const list = Array.isArray(data) ? data : (data && Array.isArray(data.masters) ? data.masters : null);
        if (!list || !list.length) throw new Error('Пустой ответ API');

        state.masters = list.map(normalizeMaster);
        console.info('[Clear Beauty] Мастера загружены с API:', state.masters.length);
      } catch (error) {
        console.warn('[Clear Beauty] API мастеров недоступен, используем демо-данные:', error.message || error);
        await delay(300);
        state.masters = MOCK_MASTERS.map(normalizeMaster);
      }
      return state.masters;
    })();

    return mastersPromise;
  }

  async function sendBooking(payload) {
    try {
      const response = await fetch(ENDPOINTS.bookings, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return await response.json().catch(function () { return { ok: true }; });
    } catch (error) {
      console.warn('[Clear Beauty] API записей недоступен, сохраняем локально:', error.message || error);
      await delay(500);
      return { ok: true, mock: true };
    }
  }

  function normalizeMaster(raw, order) {
    const services = Array.isArray(raw.services)
      ? raw.services.map(function (s) {
          return {
            id: s.id != null ? s.id : 's' + Math.random().toString(36).slice(2),
            name: s.name || 'Услуга',
            price: Number(s.price) || 0,
            duration: Number(s.duration) || 60,
            comment: s.comment || ''
          };
        })
      : [];

    let categories = raw.categories;
    if (typeof categories === 'string') categories = categories.split(/[,\s]+/).filter(Boolean);
    if (!Array.isArray(categories)) categories = raw.categoryId != null ? [String(raw.categoryId)] : [];

    return {
      id: raw.id != null ? raw.id : 'm' + Math.random().toString(36).slice(2),
      order: Number(order) || 0,
      name: raw.name || 'Мастер',
      specialty: raw.specialty || 'Мастер красоты',
      description: raw.description || '',
      photo: raw.photo || PLACEHOLDER,
      rating: Number(raw.rating) || 0,
      reviews: Number(raw.reviews) || 0,
      distance: raw.distance != null ? Number(raw.distance) : 3,
      salon: raw.salon || raw.address || '',
      online: raw.online !== false,
      home: raw.home === true,
      worksNow: raw.worksNow !== false,
      priceFrom: raw.priceFrom != null ? Number(raw.priceFrom) : minPrice(services),
      categories: categories.map(String),
      services: services
    };
  }

  /* ----------------------------- Главная: рендер ----------------------------- */

  function masterCardTemplate(m) {
    const favorite = isFavorite(m.id);

    return '' +
      '<article class="master-card" data-id="' + m.id + '" ' +
        'data-category="' + escapeAttr(m.categories.join(' ')) + '" ' +
        'data-rating="' + m.rating.toFixed(1) + '">' +
        '<div class="master-photo">' +
          '<img alt="' + escapeAttr(m.name) + '" src="' + escapeAttr(m.photo) + '" loading="lazy">' +
          (m.online ? '<span class="online-badge">Онлайн-запись</span>' : '') +
        '</div>' +
        '<div class="master-info">' +
          '<button class="favorite' + (favorite ? ' is-favorite' : '') + '" type="button" ' +
            'data-favorite="' + m.id + '" title="' + (favorite ? 'Убрать из избранного' : 'В избранное') + '">' +
            (favorite ? '♥' : '♡') +
          '</button>' +
          '<h3>' + escapeHtml(m.name) + '</h3>' +
          '<p class="master-specialty">' + escapeHtml(m.specialty) + '</p>' +
          '<p class="master-rating">★ ' + formatRating(m.rating) + ' <span>(' + m.reviews + ')</span></p>' +
          '<p class="master-location">⌖ ' + formatDistance(m.distance) + ' · ' + escapeHtml(m.salon) + '</p>' +
          '<button class="details-button" type="button" data-details="' + m.id + '">Подробнее</button>' +
        '</div>' +
      '</article>';
  }

  function renderMasterCards(list) {
    const grid = document.querySelector('.masters-grid');
    if (!grid) return;

    if (!list.length) {
      grid.innerHTML =
        '<div class="masters-empty">' +
          'По выбранным фильтрам мастеров не найдено.' +
          '<button type="button" class="link-button" data-reset-filters>Сбросить фильтры</button>' +
        '</div>';
    } else {
      grid.innerHTML = list.map(masterCardTemplate).join('');
    }

    const heading = document.querySelector('.masters-heading h2');
    if (heading) {
      heading.textContent = 'Найдено ' + list.length + ' ' +
        plural(list.length, ['мастер', 'мастера', 'мастеров']) + ' и салонов';
    }
  }

  function applyFilters() {
    renderMasterCards(sortMasters(filterMasters()));
  }

  function filterMasters() {
    const query = state.search.trim().toLowerCase();

    return state.masters.filter(function (m) {
      if (query) {
        const haystack = (m.name + ' ' + m.specialty + ' ' + m.description + ' ' + m.salon).toLowerCase();
        if (haystack.indexOf(query) === -1) return false;
      }
      if (state.category !== 'all' && m.categories.indexOf(state.category) === -1) return false;
      if (state.rating && m.rating < state.rating) return false;
      if (state.onlineOnly && !m.online) return false;
      if (state.homeOnly && !m.home) return false;
      if (state.worksNow && !m.worksNow) return false;
      if (m.distance > state.maxDistance) return false;
      if (m.priceFrom > state.maxPrice) return false;
      return true;
    });
  }

  function sortMasters(list) {
    const arr = list.slice();

    switch (state.sort) {
      case 'rating':
        arr.sort(function (a, b) { return b.rating - a.rating || b.reviews - a.reviews; });
        break;
      case 'price':
        arr.sort(function (a, b) { return a.priceFrom - b.priceFrom; });
        break;
      case 'distance':
        arr.sort(function (a, b) { return a.distance - b.distance; });
        break;
      default:
        arr.sort(function (a, b) { return a.order - b.order; });
    }
    return arr;
  }

  /* ----------------------------- Главная: фильтры ----------------------------- */

  function initMainPage() {
    const grid = document.querySelector('.masters-grid');
    if (!grid) return;

    /* Поиск в шапке */
    const searchInput = document.querySelector('.header-search input');
    if (searchInput) {
      const params = new URLSearchParams(window.location.search);
      const initialQuery = params.get('q') || params.get('search') || '';
      if (initialQuery) {
        searchInput.value = initialQuery;
        state.search = initialQuery;
      }
      searchInput.addEventListener('input', function () {
        state.search = searchInput.value;
        applyFilters();
      });
    }

    /* Радио категорий */
    document.querySelectorAll('input[name="category-filter"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (!radio.checked) return;
        state.category = categoryFromRadio(radio.id);
        syncCategoryUI();
        applyFilters();
      });
    });

    /* Радио рейтинга */
    document.querySelectorAll('input[name="rating-filter"]').forEach(function (radio) {
      radio.addEventListener('change', function () {
        if (!radio.checked) return;
        state.rating = RATING_RADIOS[radio.id] || 0;
        applyFilters();
      });
    });

    /* Переключатели */
    document.querySelectorAll('.toggle-row').forEach(function (row) {
      const input = row.querySelector('input[type="checkbox"]');
      if (!input) return;
      const text = row.textContent.toLowerCase();

      if (text.indexOf('онлайн') !== -1) {
        input.checked = true;
        state.onlineOnly = true;
        input.addEventListener('change', function () {
          state.onlineOnly = input.checked;
          applyFilters();
        });
      } else if (text.indexOf('дом') !== -1) {
        state.homeOnly = input.checked;
        input.addEventListener('change', function () {
          state.homeOnly = input.checked;
          applyFilters();
        });
      } else if (text.indexOf('сейчас') !== -1) {
        state.worksNow = input.checked;
        input.addEventListener('change', function () {
          state.worksNow = input.checked;
          applyFilters();
        });
      }
    });

    /* Диапазоны */
    const ranges = document.querySelectorAll('.filters input[type="range"]');
    const distanceRange = ranges[0];
    const priceRange = document.querySelector('.filters .price-range') || ranges[1];

    if (distanceRange) {
      distanceRange.value = distanceRange.max || 20;
      state.maxDistance = Number(distanceRange.value);
      distanceRange.addEventListener('input', function () {
        state.maxDistance = Number(distanceRange.value);
        applyFilters();
      });
    }

    if (priceRange) {
      state.maxPrice = Number(priceRange.value) || 10000;
      priceRange.addEventListener('input', function () {
        state.maxPrice = Number(priceRange.value);
        applyFilters();
      });
    }

    /* Сортировка */
    const sortSelect = document.querySelector('.sorting select');
    if (sortSelect) {
      sortSelect.addEventListener('change', function () {
        state.sort = SORT_OPTIONS[sortSelect.selectedIndex] || 'popular';
        applyFilters();
      });
    }

    /* Сброс */
    document.querySelectorAll('.reset-filters').forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        resetFilters();
      });
    });

    /* Клик по категории-карточке */
    document.querySelectorAll('.category-card').forEach(function (card) {
      card.addEventListener('click', function () {
        const label = card.querySelector('p');
        const categoryId = label ? categoryIdByName(label.textContent.trim()) : null;
        if (!categoryId) return;

        state.category = categoryId;
        syncCategoryUI();
        applyFilters();

        const section = document.querySelector('.masters-section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    /* «Все категории →» */
    const allCategoriesLink = document.querySelector('.popular-categories .section-heading a');
    if (allCategoriesLink) {
      allCategoriesLink.addEventListener('click', function (e) {
        e.preventDefault();
        state.category = 'all';
        syncCategoryUI();
        applyFilters();
      });
    }

    /* Баннер */
    const bannerButton = document.querySelector('.banner-button');
    if (bannerButton) {
      bannerButton.addEventListener('click', function () {
        toast('Скидка 15% на первое посещение. Выберите мастера и запишитесь!');
        const section = document.querySelector('.masters-section');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }

    /* Делегирование кликов по карточкам */
    grid.addEventListener('click', function (e) {
      const favoriteBtn = e.target.closest('[data-favorite]');
      if (favoriteBtn) {
        const isNowFavorite = toggleFavorite(favoriteBtn.getAttribute('data-favorite'));
        favoriteBtn.textContent = isNowFavorite ? '♥' : '♡';
        favoriteBtn.classList.toggle('is-favorite', isNowFavorite);
        favoriteBtn.title = isNowFavorite ? 'Убрать из избранного' : 'В избранное';
        return;
      }

      const detailsBtn = e.target.closest('[data-details]');
      if (detailsBtn) {
        openBookingModal(Number(detailsBtn.getAttribute('data-details')));
        return;
      }

      const resetBtn = e.target.closest('[data-reset-filters]');
      if (resetBtn) resetFilters();
    });

    applyFilters();
  }

  function syncCategoryUI() {
    let radioId = 'catAny';
    if (state.category !== 'all' && CATEGORY_META[state.category]) {
      radioId = CATEGORY_META[state.category].radio;
    }
    const radio = document.getElementById(radioId);
    if (radio) radio.checked = true;

    document.querySelectorAll('.category-card').forEach(function (card) {
      const label = card.querySelector('p');
      const categoryId = label ? categoryIdByName(label.textContent.trim()) : null;
      card.classList.toggle('is-active', state.category !== 'all' && categoryId === state.category);
    });
  }

  function resetFilters() {
    state.search = '';
    state.category = 'all';
    state.rating = 0;
    state.onlineOnly = true;
    state.homeOnly = false;
    state.worksNow = false;
    state.sort = 'popular';

    const searchInput = document.querySelector('.header-search input');
    if (searchInput) searchInput.value = '';

    const anyCategory = document.getElementById('catAny');
    if (anyCategory) anyCategory.checked = true;

    const anyRating = document.getElementById('ratingAny');
    if (anyRating) anyRating.checked = true;

    const toggles = document.querySelectorAll('.toggle-row input[type="checkbox"]');
    if (toggles[0]) toggles[0].checked = true;
    if (toggles[1]) toggles[1].checked = false;
    if (toggles[2]) toggles[2].checked = false;

    const ranges = document.querySelectorAll('.filters input[type="range"]');
    if (ranges[0]) {
      ranges[0].value = ranges[0].max || 20;
      state.maxDistance = Number(ranges[0].value);
    }
    const priceRange = document.querySelector('.filters .price-range') || ranges[1];
    if (priceRange) {
      priceRange.value = priceRange.max || 10000;
      state.maxPrice = Number(priceRange.value);
    }

    const sortSelect = document.querySelector('.sorting select');
    if (sortSelect) sortSelect.selectedIndex = 0;

    syncCategoryUI();
    applyFilters();
  }

  function categoryFromRadio(radioId) {
    const found = Object.keys(CATEGORY_META).find(function (key) {
      return CATEGORY_META[key].radio === radioId;
    });
    return found || 'all';
  }

  function categoryIdByName(name) {
    const normalized = String(name || '').trim().toLowerCase();
    const found = Object.keys(CATEGORY_META).find(function (key) {
      return CATEGORY_META[key].name.toLowerCase() === normalized;
    });
    return found || null;
  }

  /* ----------------------------- Модальное окно записи ----------------------------- */

  function injectBookingModal() {
    if (document.getElementById('booking-modal')) return;

    const modal = document.createElement('div');
    modal.className = 'cb-modal';
    modal.id = 'booking-modal';
    modal.setAttribute('aria-hidden', 'true');
    modal.innerHTML = '' +
      '<div class="cb-modal__overlay" data-close></div>' +
      '<div class="cb-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="booking-title">' +
        '<button class="cb-modal__close" type="button" data-close aria-label="Закрыть">×</button>' +
        '<h3 id="booking-title">Запись к мастеру</h3>' +
        '<p class="cb-modal__master" id="booking-master-name"></p>' +
        '<p class="cb-modal__specialty" id="booking-master-specialty"></p>' +
        '<form class="cb-form" id="booking-form" novalidate>' +
          '<label>Услуга' +
            '<select name="serviceId" id="booking-service" required></select>' +
          '</label>' +
          '<p class="service-comment" id="service-comment" hidden></p>' +
          '<div class="cb-form__row">' +
            '<label>Дата<input type="date" name="date" id="booking-date" required></label>' +
            '<label>Время<input type="time" name="time" required></label>' +
          '</div>' +
          '<label>Ваше имя<input type="text" name="clientName" placeholder="Анна" required></label>' +
          '<label>Телефон<input type="tel" name="clientPhone" placeholder="+7 (999) 000-00-00" required></label>' +
          '<label>Комментарий<textarea name="comment" rows="2" placeholder="Пожелания к записи"></textarea></label>' +
          '<div class="form-status" id="booking-status" hidden></div>' +
          '<button type="submit" class="cb-form__submit">Записаться</button>' +
        '</form>' +
      '</div>';

    document.body.appendChild(modal);
  }

  function bindBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    modal.addEventListener('click', function (e) {
      if (e.target.closest('[data-close]')) closeBookingModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeBookingModal();
    });

    const form = modal.querySelector('#booking-form');
    form.addEventListener('submit', handleBookingSubmit);

    const select = modal.querySelector('#booking-service');
    select.addEventListener('change', function () {
      const master = getMasterById(selectedMasterId);
      const service = master ? master.services.find(function (s) {
        return String(s.id) === select.value;
      }) : null;
      const comment = modal.querySelector('#service-comment');

      if (service && service.comment) {
        comment.hidden = false;
        comment.innerHTML = 'ⓘ ' + escapeHtml(service.comment);
      } else {
        comment.hidden = true;
        comment.textContent = '';
      }
    });
  }

  function openBookingModal(masterId) {
    const master = getMasterById(masterId);
    if (!master) return;

    selectedMasterId = Number(masterId);

    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    modal.querySelector('#booking-master-name').textContent = master.name;
    modal.querySelector('#booking-master-specialty').textContent = master.specialty;

    const select = modal.querySelector('#booking-service');
    const services = master.services.length
      ? master.services
      : [{ id: 'consult', name: 'Консультация', price: 0, duration: 30, comment: '' }];

    select.innerHTML = '<option value="">Выберите услугу</option>' + services.map(function (s) {
      return '<option value="' + escapeAttr(s.id) + '">' +
        escapeHtml(s.name) + ' — ' + formatPrice(s.price) + ' ₽ (' + s.duration + ' мин)' +
        '</option>';
    }).join('');

    const form = modal.querySelector('#booking-form');
    form.reset();
    select.value = '';

    const comment = modal.querySelector('#service-comment');
    comment.hidden = true;
    comment.textContent = '';

    const status = modal.querySelector('#booking-status');
    status.hidden = true;
    status.textContent = '';
    status.className = 'form-status';

    const dateInput = modal.querySelector('#booking-date');
    const today = new Date();
    today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dateInput.min = today.toISOString().slice(0, 10);
    dateInput.value = '';

    const user = getUser();
    if (user) {
      form.querySelector('[name="clientName"]').value = user.name || '';
      form.querySelector('[name="clientPhone"]').value = user.phone || '';
    }

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('cb-modal-open');

    setTimeout(function () { select.focus(); }, 60);
  }

  function closeBookingModal() {
    const modal = document.getElementById('booking-modal');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('cb-modal-open');
    selectedMasterId = null;
  }

  async function handleBookingSubmit(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const master = getMasterById(selectedMasterId);
    if (!master) return;

    const formData = new FormData(form);
    const status = document.getElementById('booking-status');

    const serviceId = String(formData.get('serviceId') || '');
    const service = master.services.find(function (s) { return String(s.id) === serviceId; });
    const date = String(formData.get('date') || '');
    const time = String(formData.get('time') || '');
    const clientName = String(formData.get('clientName') || '').trim();
    const clientPhone = String(formData.get('clientPhone') || '').trim();
    const comment = String(formData.get('comment') || '').trim();

    if (!serviceId || !date || !time || !clientName || !clientPhone) {
      setStatus(status, 'Пожалуйста, заполните все обязательные поля', 'error');
      return;
    }

    if (clientPhone.replace(/\D/g, '').length < 10) {
      setStatus(status, 'Проверьте номер телефона', 'error');
      return;
    }

    const booking = {
      id: 'b' + Date.now(),
      masterId: master.id,
      masterName: master.name,
      salon: master.salon,
      serviceId: serviceId,
      serviceName: service ? service.name : 'Услуга',
      price: service ? service.price : null,
      date: date,
      time: time,
      clientName: clientName,
      clientPhone: clientPhone,
      comment: comment,
      status: 'Запись подтверждена',
      createdAt: new Date().toISOString()
    };

    const submitBtn = form.querySelector('.cb-form__submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    setStatus(status, 'Отправляем заявку...', 'info');

    await sendBooking(booking);
    saveBooking(booking);

    setStatus(status, '✅ Заявка успешно отправлена! Мы свяжемся с вами для подтверждения.', 'success');
    form.reset();

    const commentBlock = document.getElementById('service-comment');
    if (commentBlock) {
      commentBlock.hidden = true;
      commentBlock.textContent = '';
    }

    if (document.querySelector('.profile-page')) {
      const user = getUser();
      if (user) renderAppointments(user);
    }

    setTimeout(function () {
      closeBookingModal();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Записаться';
    }, 2200);
  }

  /* ----------------------------- Избранное ----------------------------- */

  function initFavoritesPage() {
    const grid = document.querySelector('.favorites-grid');
    if (!grid) return;

    renderFavoritesPage();

    grid.addEventListener('click', function (e) {
      const favoriteBtn = e.target.closest('[data-favorite]');
      if (favoriteBtn) {
        e.preventDefault();
        toggleFavorite(favoriteBtn.getAttribute('data-favorite'));
        renderFavoritesPage();
        return;
      }

      const detailsLink = e.target.closest('[data-details]');
      if (detailsLink) {
        e.preventDefault();
        openBookingModal(Number(detailsLink.getAttribute('data-details')));
      }
    });
  }

  function renderFavoritesPage() {
    const grid = document.querySelector('.favorites-grid');
    if (!grid) return;

    const ids = getFavorites();
    const list = state.masters.filter(function (m) {
      return ids.indexOf(Number(m.id)) !== -1;
    });

    const description = document.querySelector('.favorites-description');
    if (description) {
      description.textContent = list.length
        ? 'Здесь собраны мастера, которые вам понравились. Всего: ' + list.length + '.'
        : 'Здесь собраны мастера, которые вам понравились.';
    }

    if (!list.length) {
      grid.innerHTML =
        '<div class="favorites-empty">' +
          'Пока никого нет. Нажмите ♡ на карточке мастера, чтобы добавить его сюда.' +
          '<br><a href="index.html" class="back-to-catalog">← Перейти к поиску</a>' +
        '</div>';
      return;
    }

    grid.innerHTML = list.map(favoriteCardTemplate).join('');
  }

  function favoriteCardTemplate(m) {
    return '' +
      '<article class="favorite-card" data-id="' + m.id + '">' +
        '<div class="favorite-image">' +
          '<img src="' + escapeAttr(m.photo) + '" alt="' + escapeAttr(m.name) + '">' +
          '<button class="favorite-heart" type="button" data-favorite="' + m.id + '" title="Удалить из избранного">♥</button>' +
        '</div>' +
        '<div class="favorite-card-info">' +
          '<div class="favorite-name-row">' +
            '<h2>' + escapeHtml(m.name) + '</h2>' +
            '<span class="favorite-rating">★ ' + formatRating(m.rating) + '</span>' +
          '</div>' +
          '<p class="favorite-specialization">' + escapeHtml(m.specialty) + '</p>' +
          '<p class="favorite-price">от ' + formatPrice(m.priceFrom) + ' ₽</p>' +
          '<a href="#" class="favorite-details" data-details="' + m.id + '">Подробнее</a>' +
        '</div>' +
      '</article>';
  }

  function toggleFavorite(id) {
    const ids = getFavorites();
    const numericId = Number(id);
    const index = ids.indexOf(numericId);

    if (index === -1) ids.push(numericId);
    else ids.splice(index, 1);

    writeJSON(STORAGE.favorites, ids);
    return ids.indexOf(numericId) !== -1;
  }

  function isFavorite(id) {
    return getFavorites().indexOf(Number(id)) !== -1;
  }

  /* ----------------------------- Личный кабинет / авторизация ----------------------------- */

  function initProfilePage() {
    const page = document.querySelector('.profile-page');
    if (!page) return;

    const layout = document.querySelector('.profile-layout');
    const user = getUser();

    if (!user) {
      if (layout) layout.style.display = 'none';
      renderLoginView();
    } else {
      if (layout) layout.style.display = '';
      ensureLogoutButton();
      renderProfile(user);
    }
  }

  function renderLoginView() {
    if (document.getElementById('login-view')) return;

    const heading = document.querySelector('.profile-page-heading');
    if (!heading) return;

    const section = document.createElement('section');
    section.className = 'profile-card login-card';
    section.id = 'login-view';
    section.innerHTML = '' +
      '<div class="profile-card-heading"><h3>Вход в личный кабинет</h3></div>' +
      '<p class="login-note">Введите имя и телефон — профиль создастся автоматически. Это демо-авторизация.</p>' +
      '<form id="login-form" class="login-form" novalidate>' +
        '<label>Имя<input name="name" type="text" placeholder="Анна" required></label>' +
        '<label>Телефон<input name="phone" type="tel" placeholder="+7 (999) 000-00-00" required></label>' +
        '<label>Email <span class="optional">(необязательно)</span><input name="email" type="email" placeholder="anna@example.com"></label>' +
        '<div class="form-status" id="login-status" hidden></div>' +
        '<button type="submit" class="login-submit">Войти</button>' +
      '</form>';

    heading.insertAdjacentElement('afterend', section);
    section.querySelector('#login-form').addEventListener('submit', handleLogin);
  }

  function handleLogin(e) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get('name') || '').trim();
    const phone = String(formData.get('phone') || '').trim();
    const email = String(formData.get('email') || '').trim();
    const status = document.getElementById('login-status');

    if (name.length < 2) {
      setStatus(status, 'Укажите имя (минимум 2 символа)', 'error');
      return;
    }
    if (phone.replace(/\D/g, '').length < 10) {
      setStatus(status, 'Укажите корректный телефон', 'error');
      return;
    }

    const user = createUser(name, phone, email);
    setUser(user);

    const loginView = document.getElementById('login-view');
    if (loginView) loginView.remove();

    const layout = document.querySelector('.profile-layout');
    if (layout) layout.style.display = '';

    ensureLogoutButton();
    renderProfile(user);
    toast('Добро пожаловать, ' + user.firstName + '!');
  }

  function renderProfile(user) {
    const firstName = user.firstName || user.name || 'Гость';
    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.name || 'Гость';

    setText('.profile-user-mini h3', firstName);
    setText('.profile-user-mini .avatar', firstName.charAt(0).toUpperCase());
    setText('.large-avatar', firstName.charAt(0).toUpperCase());
    setText('.personal-info-text h2', fullName);
    setText('.personal-info-text p', 'Добро пожаловать в Clear Beauty!');

    renderPersonalFields(user, profileEditing);
    renderAppointments(user);
    renderProfileFavorites();

    const editBtn = document.querySelector('.edit-profile-button');
    if (editBtn) {
      editBtn.textContent = profileEditing ? 'Сохранить' : 'Изменить';
      editBtn.onclick = toggleProfileEdit;
    }
  }

  function renderPersonalFields(user, editing) {
    const container = document.querySelector('.profile-fields');
    if (!container) return;

    const fields = [
      { key: 'firstName', label: 'Имя', value: user.firstName || '', type: 'text' },
      { key: 'lastName', label: 'Фамилия', value: user.lastName || '', type: 'text' },
      { key: 'phone', label: 'Телефон', value: user.phone || '', type: 'tel' },
      { key: 'email', label: 'Электронная почта', value: user.email || '', type: 'email' }
    ];

    container.innerHTML = fields.map(function (field) {
      const valueHtml = editing
        ? '<input data-field="' + field.key + '" type="' + field.type + '" value="' + escapeAttr(field.value) + '">'
        : '<strong>' + escapeHtml(field.value || '—') + '</strong>';

      return '<div class="profile-field"><span>' + field.label + '</span>' + valueHtml + '</div>';
    }).join('');
  }

  function readPersonalFields() {
    const inputs = document.querySelectorAll('.profile-fields [data-field]');
    if (!inputs.length) return null;

    const data = {};
    inputs.forEach(function (input) {
      data[input.getAttribute('data-field')] = input.value.trim();
    });

    if (!data.firstName) {
      toast('Имя не может быть пустым');
      return null;
    }
    if (data.phone.replace(/\D/g, '').length < 10) {
      toast('Проверьте номер телефона');
      return null;
    }
    return data;
  }

  function toggleProfileEdit() {
    const user = getUser();
    if (!user) return;

    if (!profileEditing) {
      profileEditing = true;
      renderPersonalFields(user, true);
      const btn = document.querySelector('.edit-profile-button');
      if (btn) btn.textContent = 'Сохранить';
      return;
    }

    const fields = readPersonalFields();
    if (!fields) return;

    profileEditing = false;
    const updated = Object.assign({}, user, fields);
    updated.name = [updated.firstName, updated.lastName].filter(Boolean).join(' ');

    setUser(updated);
    renderProfile(updated);
    toast('Данные профиля обновлены');
  }

  function renderAppointments(user) {
    const section = document.getElementById('appointments');
    if (!section) return;

    section.querySelectorAll('.appointment-card, .appointments-list, .profile-empty').forEach(function (el) {
      el.remove();
    });

    const bookings = getBookings()
      .filter(function (b) { return samePhone(b.clientPhone, user.phone); })
      .sort(function (a, b) {
        return String(a.date + a.time).localeCompare(String(b.date + b.time));
      });

    if (!bookings.length) {
      const empty = document.createElement('div');
      empty.className = 'profile-empty';
      empty.innerHTML = 'У вас пока нет записей. <a href="index.html">Найти мастера →</a>';
      section.appendChild(empty);
      return;
    }

    const list = document.createElement('div');
    list.className = 'appointments-list';
    list.innerHTML = bookings.map(appointmentTemplate).join('');
    section.appendChild(list);

    list.addEventListener('click', function (e) {
      const detailsBtn = e.target.closest('[data-details]');
      if (detailsBtn) openBookingModal(Number(detailsBtn.getAttribute('data-details')));
    });
  }

  function appointmentTemplate(booking) {
    const date = parseBookingDate(booking.date);

    return '' +
      '<div class="appointment-card">' +
        '<div class="appointment-date"><span>' + date.monthShort + '</span><strong>' + date.day + '</strong></div>' +
        '<div class="appointment-info">' +
          '<h4>' + escapeHtml(booking.serviceName || 'Услуга') + '</h4>' +
          '<p>' + escapeHtml(booking.masterName || 'Мастер') +
            (booking.salon ? ' · ' + escapeHtml(booking.salon) : '') + '</p>' +
          '<p>' + escapeHtml(date.full) + ' · ' + escapeHtml(booking.time || '') + '</p>' +
          '<span class="appointment-status">' + escapeHtml(booking.status || 'Запись подтверждена') + '</span>' +
        '</div>' +
        (booking.masterId
          ? '<button class="appointment-more" type="button" data-details="' + booking.masterId + '">Подробнее</button>'
          : '') +
      '</div>';
  }

  function renderProfileFavorites() {
    const preview = document.querySelector('.favorites-preview');
    if (!preview) return;

    const ids = getFavorites();
    const list = state.masters.filter(function (m) {
      return ids.indexOf(Number(m.id)) !== -1;
    });

    if (!list.length) {
      preview.innerHTML = '<div class="profile-empty">В избранном пока никого нет. <a href="index.html">Найти мастера →</a></div>';
      return;
    }

    preview.innerHTML = list.slice(0, 4).map(favoriteMasterTemplate).join('');

    preview.onclick = function (e) {
      const favoriteBtn = e.target.closest('[data-favorite]');
      if (favoriteBtn) {
        toggleFavorite(favoriteBtn.getAttribute('data-favorite'));
        renderProfileFavorites();
        return;
      }

      const detailsBtn = e.target.closest('[data-details]');
      if (detailsBtn) openBookingModal(Number(detailsBtn.getAttribute('data-details')));
    };
  }

  function favoriteMasterTemplate(master) {
    return '' +
      '<div class="favorite-master" data-id="' + master.id + '">' +
        '<img src="' + escapeAttr(master.photo) + '" alt="' + escapeAttr(master.name) + '">' +
        '<div>' +
          '<h4>' + escapeHtml(master.name) + '</h4>' +
          '<p>' + escapeHtml(shortSpecialty(master.specialty)) + '</p>' +
          '<span>★ ' + formatRating(master.rating) + '</span>' +
        '</div>' +
        '<button class="favorite-heart" type="button" data-favorite="' + master.id + '" title="Убрать из избранного">♥</button>' +
      '</div>';
  }

  function ensureLogoutButton() {
    if (document.getElementById('logout-btn')) return;

    const nav = document.querySelector('.profile-navigation');
    if (!nav) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.id = 'logout-btn';
    btn.className = 'profile-nav-item profile-logout';
    btn.innerHTML = '<span>⎋</span> Выйти';
    btn.addEventListener('click', function () {
      localStorage.removeItem(STORAGE.user);
      window.location.reload();
    });

    nav.appendChild(btn);
  }

  /* ----------------------------- Общие привязки ----------------------------- */

  function bindHeader() {
    const heartButton = document.querySelector('.header-actions button[aria-label="Избранное"]');
    if (heartButton) {
      heartButton.addEventListener('click', function () {
        window.location.href = 'favorites_beauty.html';
      });
    }

    const searchInput = document.querySelector('.header-search input');
    if (searchInput && !document.querySelector('.layout')) {
      searchInput.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter') return;
        e.preventDefault();
        const query = searchInput.value.trim();
        window.location.href = 'index.html' + (query ? '?q=' + encodeURIComponent(query) : '');
      });
    }
  }

  function bindGlobalLinks() {
    document.querySelectorAll('.settings-list a').forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const label = link.querySelector('span');
        toast('Раздел «' + (label ? label.textContent.trim() : 'Настройки') + '» скоро появится');
      });
    });

    const allAppointmentsLink = document.querySelector('#appointments .text-link');
    if (allAppointmentsLink) {
      allAppointmentsLink.addEventListener('click', function (e) {
        e.preventDefault();
        const section = document.getElementById('appointments');
        if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }

  /* ----------------------------- Утилиты ----------------------------- */

  function getUser() {
    return readJSON(STORAGE.user, null);
  }

  function setUser(user) {
    writeJSON(STORAGE.user, user);
  }

  function createUser(name, phone, email) {
    const parts = name.split(/\s+/).filter(Boolean);
    const firstName = parts.shift() || 'Гость';

    return {
      name: name,
      firstName: firstName,
      lastName: parts.join(' '),
      phone: phone,
      email: email || ''
    };
  }

  function getFavorites() {
    return readJSON(STORAGE.favorites, [])
      .map(Number)
      .filter(function (id) { return !Number.isNaN(id); });
  }

  function getBookings() {
    const list = readJSON(STORAGE.bookings, []);
    return Array.isArray(list) ? list : [];
  }

  function saveBooking(booking) {
    const list = getBookings();
    list.push(booking);
    writeJSON(STORAGE.bookings, list);
  }

  function seedFavoritesOnce() {
    if (localStorage.getItem(STORAGE.favorites) === null) {
      writeJSON(STORAGE.favorites, [1, 2, 4]);
    }
  }

  function readJSON(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function writeJSON(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('[Clear Beauty] Не удалось сохранить в localStorage:', error);
    }
  }

  function getMasterById(id) {
    return state.masters.find(function (m) {
      return Number(m.id) === Number(id);
    });
  }

  function setStatus(element, message, type) {
    if (!element) return;
    element.hidden = false;
    element.className = 'form-status is-' + type;
    element.textContent = message;
  }

  function toast(message) {
    let container = document.getElementById('cb-toast');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cb-toast';
      document.body.appendChild(container);
    }

    const item = document.createElement('div');
    item.className = 'cb-toast__item';
    item.textContent = message;
    container.appendChild(item);

    setTimeout(function () {
      item.classList.add('is-hide');
      setTimeout(function () { item.remove(); }, 320);
    }, 2600);
  }

  function setText(selector, text) {
    const element = document.querySelector(selector);
    if (element) element.textContent = text;
  }

  function minPrice(services) {
    if (!services.length) return 0;
    return Math.min.apply(null, services.map(function (s) { return Number(s.price) || 0; }));
  }

  function shortSpecialty(specialty) {
    return String(specialty || '').split('·')[0].trim();
  }

  function formatPrice(value) {
    return (Number(value) || 0).toLocaleString('ru-RU');
  }

  function formatRating(value) {
    return (Number(value) || 0).toFixed(1);
  }

  function formatDistance(value) {
    return String(Number(value) || 0).replace('.', ',') + ' км';
  }

  function parseBookingDate(value) {
    const date = new Date(String(value) + 'T00:00:00');
    if (isNaN(date.getTime())) {
      return { day: '--', monthShort: '---', full: value || 'Дата уточняется' };
    }
    return {
      day: String(date.getDate()).padStart(2, '0'),
      monthShort: MONTHS_SHORT[date.getMonth()],
      full: date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
    };
  }

  function samePhone(a, b) {
    const digitsA = String(a || '').replace(/\D/g, '').slice(-10);
    const digitsB = String(b || '').replace(/\D/g, '').slice(-10);
    return digitsA && digitsA === digitsB;
  }

  function plural(number, forms) {
    const n10 = number % 10;
    const n100 = number % 100;
    if (n10 === 1 && n100 !== 11) return forms[0];
    if (n10 >= 2 && n10 <= 4 && (n100 < 10 || n100 >= 20)) return forms[1];
    return forms[2];
  }

  function delay(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
  }

  function escapeHtml(text) {
    if (text == null) return '';
    const div = document.createElement('div');
    div.textContent = String(text);
    return div.innerHTML;
  }

  function escapeAttr(text) {
    return escapeHtml(text).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }
})();
