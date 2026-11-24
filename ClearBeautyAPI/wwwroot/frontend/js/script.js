document.addEventListener("DOMContentLoaded", async function () {
    // ==========================================
    // 1. ЭЛЕМЕНТЫ СТРАНИЦЫ
    // ==========================================
    const searchInput = document.querySelector(".header-search input");
    const mastersGrid = document.getElementById("masters-grid") || document.querySelector(".masters-grid");
    const distanceSlider = document.querySelector(".filters input[type='range']");
    const distanceSelect = document.querySelector(".filters select");
    const ratingButtons = document.querySelectorAll(".rating-option");
    const toggleCheckboxes = document.querySelectorAll(".toggle-block input[type='checkbox']");
    const sortingSelect = document.querySelector(".sorting select");
    const resetButton = document.querySelector(".reset-filters");
    const mastersHeading = document.querySelector(".masters-heading h2");

    // ==========================================
    // 2. ГЛАВНЫЙ МАССИВ ДАННЫХ ИЗ БД
    // ==========================================
    let mastersData = [];

    // ==========================================
    // 3. ЗАГРУЗКА ДАННЫХ С БЭКЕНДА
    // ==========================================
    async function loadMasters() {
        try {
            if (mastersGrid) mastersGrid.innerHTML = '<div class="loading-state" style="padding:20px; text-align:center; color:#888;">Загрузка мастеров...</div>';
            
            const response = await fetch('/api/masters');
            if (!response.ok) throw new Error('Ошибка сервера: ' + response.status);
            
            mastersData = await response.json();
            applyFilters(); // Сразу применяем фильтры и рендерим
        } catch (error) {
            console.error("Ошибка загрузки мастеров:", error);
            if (mastersGrid) mastersGrid.innerHTML = '<p style="padding:20px; color:red;">Не удалось загрузить мастеров. Проверьте подключение к API.</p>';
        }
    }

    // ==========================================
    // 4. РЕНДЕРИНГ КАРТОЧЕК (точная структура под ваш CSS)
    // ==========================================
    function renderMasters(data) {
        if (!mastersGrid) return;
        mastersGrid.innerHTML = "";

        if (data.length === 0) {
            mastersGrid.innerHTML = '<p class="empty-results" style="grid-column: 1/-1; text-align:center; padding: 30px; color:#888;">Ничего не найдено. Попробуйте изменить параметры поиска.</p>';
            return;
        }

        data.forEach(master => {
            const card = document.createElement("div");
            card.className = "master-card";
            card.dataset.masterId = master.id;
            card.dataset.homeVisit = master.homeVisit ? "true" : "false";
            card.dataset.openNow = master.openNow ? "true" : "false";

            // Безопасные значения (защита от undefined)
            const name = master.name || "Без имени";
            const spec = master.specialization || "Бьюти-мастер";
            const rating = (master.rating == null || isNaN(master.rating)) ? "—" : Number(master.rating).toFixed(1);
            const reviews = (master.reviewsCount == null) ? 0 : master.reviewsCount;
            const distance = (master.distance == null || isNaN(master.distance)) ? "—" : Number(master.distance).toFixed(1);
            const salon = master.salon || "";
            const imageUrl = master.imageUrl || "";
            const online = master.onlineBooking ? '<span class="online-badge">Онлайн-запись</span>' : "";

            // SVG-заглушка, если фото нет или не загрузилось
            const initials = name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
            const fallbackSvg = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect fill="%23eee8f5" width="100" height="100"/><text x="50" y="55" font-size="40" text-anchor="middle" fill="%23876bb0" font-family="Arial">${initials}</text></svg>`;

            card.innerHTML = `
                <div class="master-photo">
                    <img src="${imageUrl || fallbackSvg}" alt="${name}" onerror="this.src='${fallbackSvg}'">
                    ${online}
                </div>
                <div class="master-info">
                    <button class="favorite" type="button" data-favorite="${master.id}" aria-pressed="false">♡</button>
                    <h3>${name}</h3>
                    <p class="master-specialty">${spec}</p>
                    <div class="master-rating">★ ${rating} <span>(${reviews})</span></div>
                    <div class="master-location">⌖ ${distance} км${salon ? " · " + salon : ""}</div>
                    <button class="details-button">Подробнее</button>
                </div>
            `;
            mastersGrid.appendChild(card);
        });

        updateFavoriteButtons();
    }

    // ==========================================
    // 5. ИЗБРАННОЕ (сохраняем ТОЛЬКО ID)
    // ==========================================
    const STORAGE_KEY = "clearBeautyFavorites";
    let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]").filter(id => typeof id === "string" || typeof id === "number");

    function saveFavorites() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }

    function updateFavoriteButtons() {
        document.querySelectorAll(".master-card").forEach(card => {
            const button = card.querySelector(".favorite");
            if (!button) return;
            const id = String(card.dataset.masterId);
            const isFav = favorites.includes(id);
            button.textContent = isFav ? "♥" : "♡";
            button.classList.toggle("active", isFav);
            button.setAttribute("aria-pressed", String(isFav));
        });
    }

    document.addEventListener("click", function (event) {
        const button = event.target.closest(".favorite");
        if (!button) return;
        event.preventDefault();
        event.stopPropagation();
        
        const card = button.closest(".master-card");
        const id = String(card.dataset.masterId);
        
        if (favorites.includes(id)) {
            favorites = favorites.filter(f => f !== id);
        } else {
            favorites.push(id);
        }
        saveFavorites();
        updateFavoriteButtons();
    });

    // ==========================================
    // 6. ФИЛЬТРЫ (Ваша упрощённая логика + исправленные категории)
    // ==========================================
    let searchText = "";
    let selectedCategory = "";
    let selectedRating = 0;
    let maxDistance = 20;
    let onlineOnly = false;
    let homeVisitOnly = false;
    let openNowOnly = false;
    let sortingType = "По популярности";

    function applyFilters() {
        let filtered = mastersData.filter(m => {
            // Поиск
            if (searchText && !(m.name + " " + m.specialization).toLowerCase().includes(searchText)) return false;
            
            // Категории (умный поиск по ключевым словам)
            if (selectedCategory) {
                const spec = (m.specialization || "").toLowerCase();
                const categories = {
                    "маникюр": ["маникюр", "педикюр"],
                    "стрижки": ["стриж", "парикмахер"],
                    "окрашивание": ["окраш", "колорист"],
                    "брови": ["бров", "бровист"],
                    "ресницы": ["ресниц", "lash"],
                    "косметология": ["косметолог"],
                    "макияж": ["визаж", "макияж"],
                    "массаж": ["массаж"]
                };
                const keywords = categories[selectedCategory] || [selectedCategory];
                if (!keywords.some(k => spec.includes(k))) return false;
            }
            
            // Остальные фильтры
            if (selectedRating > 0 && m.rating < selectedRating) return false;
            if (m.distance > maxDistance) return false;
            if (onlineOnly && !m.onlineBooking) return false;
            if (homeVisitOnly && !m.homeVisit) return false;
            if (openNowOnly && !m.openNow) return false;
            
            return true;
        });

        // Сортировка
        if (sortingType.includes("рейтинг")) {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortingType.includes("расстояни")) {
            filtered.sort((a, b) => a.distance - b.distance);
        }

        renderMasters(filtered);
        updateCounter(filtered.length);
    }

    // --- Обработчики событий фильтров ---
    if (searchInput) {
        searchInput.addEventListener("input", e => { 
            searchText = e.target.value.trim().toLowerCase(); 
            applyFilters(); 
        });
    }

    ratingButtons.forEach(b => b.addEventListener("click", function () {
        ratingButtons.forEach(x => x.classList.remove("selected"));
        this.classList.add("selected");
        const t = this.innerText.replace(/\s/g, "");
        selectedRating = t.includes("4.5") ? 4.5 : t.includes("4+") ? 4 : t.includes("5") ? 5 : 0;
        applyFilters();
    }));

    if (distanceSlider) {
        distanceSlider.addEventListener("input", e => { 
            maxDistance = Number(e.target.value); 
            applyFilters(); 
        });
    }
    
    if (distanceSelect) {
        distanceSelect.addEventListener("change", e => { 
            maxDistance = parseInt(e.target.value) || 20; 
            applyFilters(); 
        });
    }

    if (toggleCheckboxes.length >= 3) {
        toggleCheckboxes[0].addEventListener("change", e => { onlineOnly = e.target.checked; applyFilters(); });
        toggleCheckboxes[1].addEventListener("change", e => { homeVisitOnly = e.target.checked; applyFilters(); });
        toggleCheckboxes[2].addEventListener("change", e => { openNowOnly = e.target.checked; applyFilters(); });
    }

    if (sortingSelect) {
        sortingSelect.addEventListener("change", e => { 
            sortingType = e.target.value; 
            applyFilters(); 
        });
    }

    if (resetButton) {
        resetButton.addEventListener("click", () => location.reload());
    }

    // === ИСПРАВЛЕННЫЙ ФИЛЬТР КАТЕГОРИЙ (работает и для верхних плиток, и для бокового меню) ===
    const CATEGORY_WORDS = ["маникюр", "стрижки", "окрашивание", "брови", "ресницы", "косметология", "макияж", "массаж"];
    
    function cleanCategoryText(el) {
        return el.textContent.replace(/[^\p{L}\s]/gu, "").trim().toLowerCase();
    }

    document.addEventListener("click", function (event) {
        const el = event.target.closest("button, a, [class*='category'], [class*='tile']");
        if (!el) return;
        
        const cat = cleanCategoryText(el);
        if (!CATEGORY_WORDS.includes(cat)) return; // Клик не по категории

        // Переключаем категорию
        selectedCategory = (selectedCategory === cat) ? "" : cat;

        // Синхронно подсвечиваем активный элемент везде (и в сайдбаре, и вверху)
        document.querySelectorAll("button, a, [class*='category'], [class*='tile']").forEach(item => {
            if (cleanCategoryText(item) === selectedCategory) {
                item.classList.add("active");
            } else if (CATEGORY_WORDS.includes(cleanCategoryText(item))) {
                item.classList.remove("active");
            }
        });

        applyFilters();
    });

    // ==========================================
    // 7. СЧЁТЧИК РЕЗУЛЬТАТОВ
    // ==========================================
    function updateCounter(count) {
        if (!mastersHeading) return;
        const last = count % 10, last2 = count % 100;
        let word = "мастеров и салонов";
        if (last2 < 11 || last2 > 14) {
            if (last === 1) word = "мастер и салон";
            else if (last >= 2 && last <= 4) word = "мастера и салона";
        }
        mastersHeading.textContent = `Найдено ${count} ${word}`;
    }

    // ==========================================
    // 8. ПЕРЕХОД НА ПРОФИЛЬ (сохраняем ТОЛЬКО ID)
    // ==========================================
    document.addEventListener("click", function (event) {
        if (event.target.closest(".favorite")) return; // Не открываем профиль при клике на сердечко
        const card = event.target.closest(".master-card");
        if (!card) return;
        
        localStorage.setItem("selectedMasterId", card.dataset.masterId);
        window.location.href = "master_profile.html";
    });

    // ==========================================
    // 9. СТАРТ
    // ==========================================
    await loadMasters();
});