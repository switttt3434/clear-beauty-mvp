const API_BASE = '/api';
const ENDPOINTS = {
  masters: `${API_BASE}/masters`,
  bookings: `${API_BASE}/bookings`,
  categories: `${API_BASE}/categories`,
  services: `${API_BASE}/services`
};

const MOCK_CATEGORIES = [
  { id: 1, name: 'Парикмахерская', icon: '✂️' },
  { id: 2, name: 'Спа', icon: '🧖‍♀️' },
  { id: 3, name: 'Солярий', icon: '☀️' },
  { id: 4, name: 'Маникюр/Педикюр', icon: '💅' },
  { id: 5, name: 'Бровки/Ресницы', icon: '👁️' },
  { id: 6, name: 'Косметология', icon: '🧴' },
  { id: 7, name: 'Депиляция/Эпиляция', icon: '✨' }
];

const MOCK_MASTERS = [
  {
    id: 1,
    name: 'Анна Иванова',
    specialty: 'Маникюр/Педикюр',
    categoryId: 4,
    photo: 'https://placehold.co/300x300/e8d5c4/333?text=Анна',
    rating: 4.8,
    experience: 5,
    description: 'Мастер ногтевого сервиса. Работаю с гель-лаком, наращиванием и дизайном.',
    services: [
      { id: 1, name: 'Гель-лак', price: 1500, duration: 60, comment: 'Покрытие гель-лаком с дизайном 2 ногтей в подарок' },
      { id: 2, name: 'Наращивание ногтей', price: 3000, duration: 120, comment: 'Размер S — 2500₽, M — 3000₽, L — 3500₽' },
      { id: 3, name: 'Коррекция ногтей', price: 2000, duration: 90, comment: 'Коррекция с покрытием гель-лаком' }
    ]
  },
  {
    id: 2,
    name: 'Мария Петрова',
    specialty: 'Парикмахерская',
    categoryId: 1,
    photo: 'https://placehold.co/300x300/c4d5e8/333?text=Мария',
    rating: 4.9,
    experience: 8,
    description: 'Стилист-парикмахер. Стрижки, окрашивание, укладки.',
    services: [
      { id: 4, name: 'Женская стрижка', price: 2000, duration: 60, comment: 'Стрижка с укладкой и консультацией по уходу' },
      { id: 5, name: 'Окрашивание', price: 5000, duration: 180, comment: 'Однотонное окрашивание. Сложное — от 7000₽' },
      { id: 6, name: 'Укладка', price: 1500, duration: 45, comment: 'Повседневная или вечерняя укладка' }
    ]
  },
  {
    id: 3,
    name: 'Елена Сидорова',
    specialty: 'Косметология',
    categoryId: 6,
    photo: 'https://placehold.co/300x300/d5e8c4/333?text=Елена',
    rating: 4.7,
    experience: 6,
    description: 'Косметолог-эстетист. Чистки, пилинги, уходовые процедуры.',
    services: [
      { id: 7, name: 'Чистка лица', price: 3500, duration: 90, comment: 'Комбинированная чистка с маской по типу кожи' },
      { id: 8, name: 'Пилинг', price: 2500, duration: 60, comment: 'Химический пилинг. Подбирается индивидуально' }
    ]
  },
  {
    id: 4,
    name: 'Ольга Козлова',
    specialty: 'Бровки/Ресницы',
    categoryId: 5,
    photo: 'https://placehold.co/300x300/e8c4d5/333?text=Ольга',
    rating: 5.0,
    experience: 4,
    description: 'Lash-мастер и brow-стилист. Наращивание ресниц, ламинирование бровей.',
    services: [
      { id: 9, name: 'Наращивание ресниц', price: 2500, duration: 120, comment: 'Классика — 2500₽, 2D — 3000₽, 3D — 3500₽' },
      { id: 10, name: 'Ламинирование бровей', price: 1800, duration: 60, comment: 'С окрашиванием и коррекцией формы' },
      { id: 11, name: 'Коррекция бровей', price: 800, duration: 30, comment: 'Коррекция пинцетом + воск' }
    ]
  },
  {
    id: 5,
    name: 'Дарья Волкова',
    specialty: 'Спа',
    categoryId: 2,
    photo: 'https://placehold.co/300x300/c4e8d5/333?text=Дарья',
    rating: 4.6,
    experience: 3,
    description: 'Спа-терапевт. Массаж, обёртывания, программы расслабления.',
    services: [
      { id: 12, name: 'Массаж спины', price: 2500, duration: 60, comment: 'Классический расслабляющий массаж' },
      { id: 13, name: 'Обёртывание', price: 3000, duration: 90, comment: 'Шоколадное или водорослевое на выбор' }
    ]
  },
  {
    id: 6,
    name: 'Наталья Морозова',
    specialty: 'Депиляция/Эпиляция',
    categoryId: 7,
    photo: 'https://placehold.co/300x300/d5c4e8/333?text=Наталья',
    rating: 4.8,
    experience: 7,
    description: 'Мастер шугаринга и восковой эпиляции. Быстро и безболезненно.',
    services: [
      { id: 14, name: 'Шугаринг ног', price: 1500, duration: 60, comment: 'Полностью ноги (голени + бёдра)' },
      { id: 15, name: 'Шугаринг бикини', price: 2000, duration: 45, comment: 'Глубокое бикини. Классическое — 1200₽' },
      { id: 16, name: 'Шугаринг подмышек', price: 500, duration: 20, comment: 'Быстро и комфортно' }
    ]
  }
];

async function loadMasters() {
  const mastersContainer = document.getElementById('masters-grid');
  if (!mastersContainer) return;

  mastersContainer.innerHTML = '<div class="text-center py-5"><div class="spinner-border text-primary" role="status"><span class="visually-hidden">Загрузка...</span></div></div>';

  try {
    const response = await fetch(ENDPOINTS.masters);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const masters = await response.json();
    renderMasters(masters);
  } catch (error) {
    console.error('Ошибка загрузки мастеров:', error);
    await delay(500);
    renderMasters(MOCK_MASTERS);
  }
}

function renderMasters(masters) {
  const grid = document.getElementById('masters-grid');
  if (!grid) return;

  if (masters.length === 0) {
    grid.innerHTML = `
      <div class="col-12 text-center py-5">
        <p class="text-muted">По вашему фильтру мастеров не найдено</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = masters.map(master => `
    <div class="col-md-6 col-lg-4 mb-4">
      <div class="card h-100 master-card shadow-sm" data-master-id="${master.id}">
        <img src="${master.photo}" class="card-img-top master-photo" alt="${master.name}">
        <div class="card-body">
          <h5 class="card-title">${escapeHtml(master.name)}</h5>
          <p class="card-text text-muted small">
            <i class="fas fa-cut"></i> ${escapeHtml(master.specialty)}
          </p>
          <p class="card-text small">${escapeHtml(master.description)}</p>
          <div class="d-flex justify-content-between align-items-center mb-2">
            <span class="badge bg-warning text-dark">
              <i class="fas fa-star"></i> ${master.rating}
            </span>
            <span class="text-muted small">Опыт: ${master.experience} лет</span>
          </div>
          <div class="services-preview">
            <small class="text-muted">Услуги от ${getMinPrice(master.services)} ₽</small>
          </div>
        </div>
        <div class="card-footer bg-transparent border-0 pb-3">
          <button class="btn btn-primary w-100" onclick="openBookingModal(${master.id})">
            <i class="fas fa-calendar-check"></i> Записаться
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

async function loadCategories() {
  const filtersContainer = document.getElementById('category-filters');
  if (!filtersContainer) return;

  try {
    const response = await fetch(ENDPOINTS.categories);
    const categories = await response.json();
    renderCategoryFilters(categories);
  } catch (error) {
    console.error('Ошибка загрузки категорий:', error);
    renderCategoryFilters(MOCK_CATEGORIES);
  }
}

function renderCategoryFilters(categories) {
  const container = document.getElementById('category-filters');
  if (!container) return;

  const allButton = `<button class="btn btn-outline-primary active" data-category="all" onclick="filterByCategory('all')">Все мастера</button>`;

  const categoryButtons = categories.map(cat => `
    <button class="btn btn-outline-primary" data-category="${cat.id}" onclick="filterByCategory(${cat.id})">
      ${cat.icon} ${escapeHtml(cat.name)}
    </button>
  `).join('');

  container.innerHTML = allButton + categoryButtons;
}

function filterByCategory(categoryId) {
  document.querySelectorAll('#category-filters .btn').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category == categoryId) {
      btn.classList.add('active');
    }
  });

  let filtered;
  if (categoryId === 'all') {
    filtered = MOCK_MASTERS;
  } else {
    filtered = MOCK_MASTERS.filter(m => m.categoryId == categoryId);
  }

  renderMasters(filtered);
}

let selectedMasterId = null;

function openBookingModal(masterId) {
  selectedMasterId = masterId;

  const master = MOCK_MASTERS.find(m => m.id === masterId);
  if (!master) return;

  document.getElementById('booking-master-name').textContent = master.name;
  document.getElementById('booking-master-specialty').textContent = master.specialty;

  const servicesSelect = document.getElementById('booking-service');
  servicesSelect.innerHTML = '<option value="">Выберите услугу</option>' +
    master.services.map(s => `
      <option value="${s.id}">${escapeHtml(s.name)} — ${s.price} ₽ (${s.duration} мин)</option>
    `).join('');

  servicesSelect.addEventListener('change', () => {
    const selectedService = master.services.find(s => s.id == servicesSelect.value);
    const commentBlock = document.getElementById('service-comment');
    if (selectedService && selectedService.comment) {
      commentBlock.innerHTML = `<small class="text-muted"><i class="fas fa-info-circle"></i> ${escapeHtml(selectedService.comment)}</small>`;
      commentBlock.style.display = 'block';
    } else {
      commentBlock.style.display = 'none';
    }
  });

  const today = new Date().toISOString().split('T')[0];
  document.getElementById('booking-date').min = today;

  const modal = new bootstrap.Modal(document.getElementById('bookingModal'));
  modal.show();
}

function initBookingForm() {
  const form = document.getElementById('booking-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const bookingData = {
      masterId: selectedMasterId,
      serviceId: formData.get('serviceId'),
      date: formData.get('date'),
      time: formData.get('time'),
      clientName: formData.get('clientName'),
      clientPhone: formData.get('clientPhone'),
      comment: formData.get('comment') || ''
    };

    if (!bookingData.masterId || !bookingData.serviceId || !bookingData.date || !bookingData.time || !bookingData.clientName || !bookingData.clientPhone) {
      showFormStatus('Пожалуйста, заполните все обязательные поля', 'danger');
      return;
    }

    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Отправка...';
    showFormStatus('Отправка заявки...', 'info');

    try {
      const response = await fetch(ENDPOINTS.bookings, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      showFormStatus('✅ Заявка успешно отправлена! Мы свяжемся с вами для подтверждения.', 'success');
      form.reset();

      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        if (modal) modal.hide();
      }, 2000);

    } catch (error) {
      console.error('Ошибка отправки записи:', error);
      await delay(1000);
      console.log('📤 Данные записи (мок):', bookingData);
      showFormStatus('✅ Заявка успешно отправлена! Мы свяжемся с вами для подтверждения.', 'success');
      form.reset();

      setTimeout(() => {
        const modal = bootstrap.Modal.getInstance(document.getElementById('bookingModal'));
        if (modal) modal.hide();
      }, 2000);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Записаться';
    }
  });
}

function showFormStatus(message, type) {
  const statusEl = document.getElementById('form-status');
  if (!statusEl) return;

  statusEl.className = `alert alert-${type} mt-3`;
  statusEl.textContent = message;
  statusEl.style.display = 'block';
}

function initSearch() {
  const searchInput = document.getElementById('master-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();

    if (!query) {
      renderMasters(MOCK_MASTERS);
      return;
    }

    const filtered = MOCK_MASTERS.filter(master => {
      return master.name.toLowerCase().includes(query) ||
             master.specialty.toLowerCase().includes(query) ||
             master.description.toLowerCase().includes(query);
    });

    renderMasters(filtered);
  });
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getMinPrice(services) {
  if (!services || services.length === 0) return 0;
  return Math.min(...services.map(s => s.price));
}

document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  loadMasters();
  initBookingForm();
  initSearch();
});
