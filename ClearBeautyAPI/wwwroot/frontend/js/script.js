document.addEventListener("DOMContentLoaded", async function () {
    const searchInput = document.querySelector(".header-search input");
    const mastersGrid = document.getElementById("masters-grid");
    const distanceSlider = document.querySelector(".filters input[type='range']");
    const distanceSelect = document.querySelector(".filters select");
    const ratingButtons = document.querySelectorAll(".rating-option");
    const categoryButtons = document.querySelectorAll(".category-filter-item");
    const toggleCheckboxes = document.querySelectorAll(".toggle-block input[type='checkbox']");
    const sortingSelect = document.querySelector(".sorting select");
    const resetButton = document.querySelector(".reset-filters");
    const mastersHeading = document.querySelector(".masters-heading h2");

    let mastersData = [];

    // === ЗАГРУЗКА ИЗ БД ===
    async function loadMasters() {
        try {
            mastersGrid.innerHTML = '<div class="loading-state">Загрузка...</div>';
            const response = await fetch('/api/masters');
            if (!response.ok) throw new Error('Ошибка сервера');
            mastersData = await response.json();
            renderMasters(mastersData);
            updateCounter(mastersData.length);
        } catch (error) {
            console.error(error);
            mastersGrid.innerHTML = '<p>Не удалось загрузить мастеров</p>';
        }
    }

    // === РЕНДЕР КАРТОЧЕК ===
   function renderMasters(data) {
    mastersGrid.innerHTML = "";
    
    if (data.length === 0) {
        mastersGrid.innerHTML = '<p class="empty-results">Ничего не найдено.</p>';
        return;
    }

    data.forEach(master => {
        const card = document.createElement("div");
        card.className = "master-card";
        card.dataset.masterId = master.id;
        card.dataset.homeVisit = master.homeVisit ? "true" : "false";
        card.dataset.openNow = master.openNow ? "true" : "false";
        card.dataset.category = (master.specialization || "").toLowerCase();

     
        card.innerHTML = `
            <img src="${master.imageUrl || ''}" alt="${master.name}">
            <div class="master-card-badges">
                ${master.onlineBooking ? '<span class="online-badge">Онлайн-запись</span>' : ''}
                <button class="favorite" type="button" data-favorite="${master.id}">♡</button>
            </div>
            <div class="master-info">
                <h3>${master.name}</h3>
                <p class="master-specialty">${master.specialization || ''}</p>
                <div class="master-rating">★ ${master.rating} (${master.reviewsCount})</div>
                <div class="master-location">⌖ ${master.distance} км · ${master.salon || ''}</div>
            </div>
            <button class="master-details-btn">Подробнее</button>
        `;
        
        mastersGrid.appendChild(card);
    });

    updateFavoriteButtons();
}

    // === ИЗБРАННОЕ (только ID) ===
    const STORAGE_KEY = "clearBeautyFavorites";
    let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

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

    // === ФИЛЬТРЫ (упрощённые) ===
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
            if (searchText && !(m.name + " " + m.specialization).toLowerCase().includes(searchText)) return false;
            if (selectedRating > 0 && m.rating < selectedRating) return false;
            if (m.distance > maxDistance) return false;
            if (onlineOnly && !m.onlineBooking) return false;
            if (homeVisitOnly && !m.homeVisit) return false;
            if (openNowOnly && !m.openNow) return false;
            return true;
        });

        if (sortingType.includes("рейтинг")) filtered.sort((a, b) => b.rating - a.rating);
        else if (sortingType.includes("расстояни")) filtered.sort((a, b) => a.distance - b.distance);

        renderMasters(filtered);
        updateCounter(filtered.length);
    }

    if (searchInput) searchInput.addEventListener("input", e => { searchText = e.target.value.trim().toLowerCase(); applyFilters(); });
    ratingButtons.forEach(b => b.addEventListener("click", function () {
        ratingButtons.forEach(x => x.classList.remove("selected"));
        this.classList.add("selected");
        const t = this.innerText.replace(/\s/g, "");
        selectedRating = t.includes("4.5") ? 4.5 : t.includes("4+") ? 4 : t.includes("5") ? 5 : 0;
        applyFilters();
    }));
    if (distanceSlider) distanceSlider.addEventListener("input", e => { maxDistance = Number(e.target.value); applyFilters(); });
    if (distanceSelect) distanceSelect.addEventListener("change", e => { maxDistance = parseInt(e.target.value) || 20; applyFilters(); });
    if (toggleCheckboxes.length >= 3) {
        toggleCheckboxes[0].addEventListener("change", e => { onlineOnly = e.target.checked; applyFilters(); });
        toggleCheckboxes[1].addEventListener("change", e => { homeVisitOnly = e.target.checked; applyFilters(); });
        toggleCheckboxes[2].addEventListener("change", e => { openNowOnly = e.target.checked; applyFilters(); });
    }
    if (sortingSelect) sortingSelect.addEventListener("change", e => { sortingType = e.target.value; applyFilters(); });
    if (resetButton) resetButton.addEventListener("click", () => location.reload());

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

    // === ПЕРЕХОД НА ПРОФИЛЬ ===
    document.addEventListener("click", function (event) {
        if (event.target.closest(".favorite")) return;
        const card = event.target.closest(".master-card");
        if (!card) return;
        localStorage.setItem("selectedMasterId", card.dataset.masterId);
        window.location.href = "master_profile.html";
    });

    await loadMasters();
});