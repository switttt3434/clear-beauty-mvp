document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 1. ПОЛУЧАЕМ ЭЛЕМЕНТЫ СТРАНИЦЫ
    // ==========================================

    const searchInput = document.querySelector(".header-search input");
    const masterCards = document.querySelectorAll(".master-card");
    const mastersGrid = document.querySelector(".masters-grid");

    const distanceSlider = document.querySelector(".filters input[type='range']");
    const distanceSelect = document.querySelector(".filters select");

    const ratingButtons = document.querySelectorAll(".rating-option");
    const categoryButtons = document.querySelectorAll(".category-filter-item");

    const toggleCheckboxes = document.querySelectorAll(".toggle-block input[type='checkbox']");

    const priceSliders = document.querySelectorAll(".double-range input[type='range']");

    const sortingSelect = document.querySelector(".sorting select");
    const resetButton = document.querySelector(".reset-filters");
    const mastersHeading = document.querySelector(".masters-heading h2");


    // ==========================================
    // 2. СОСТОЯНИЕ ФИЛЬТРОВ
    // ==========================================

    let searchText = "";
    let selectedCategory = "";
    let selectedRating = 0;

    let maxDistance = 20;

    let minPrice = 500;
    let maxPrice = 10000;

    let onlineOnly = true;
    let homeVisitOnly = false;
    let openNowOnly = false;

    let sortingType = "По популярности";


    // ==========================================
    // 3. ИЗБРАННОЕ
    // ==========================================

    const STORAGE_KEY = "clearBeautyFavorites";

    function getFavorites() {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

            // Поддержка только корректных новых записей
            return saved.filter(item =>
                item &&
                typeof item === "object" &&
                item.id &&
                item.html
            );
        } catch {
            return [];
        }
    }

    let favorites = getFavorites();

    function saveFavorites() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    }

    // Добавляем уникальный ID каждой карточке
    masterCards.forEach((card, index) => {
        if (!card.dataset.masterId) {
            card.dataset.masterId = "master-" + (index + 1);
        }

        const button = card.querySelector(".favorite");

        if (button) {
            button.dataset.favorite = card.dataset.masterId;
            button.type = "button";
        }
    });

    function getMasterName(card) {
        return card.querySelector(".master-info h3")?.textContent.trim() || "";
    }

    function updateFavoriteButtons() {
        document.querySelectorAll(".master-card").forEach(card => {
            const button = card.querySelector(".favorite");
            if (!button) return;

            const id = card.dataset.masterId;

            const isFavorite = favorites.some(master => master.id === id);

            button.textContent = isFavorite ? "♥" : "♡";
            button.classList.toggle("active", isFavorite);
            button.setAttribute("aria-pressed", String(isFavorite));
        });
    }

    // Добавление и удаление из избранного
    function toggleFavorite(button) {
        const card = button.closest(".master-card");
        if (!card) return;

        const id = card.dataset.masterId;
        if (!id) return;

        const existing = favorites.find(master => master.id === id);

        if (existing) {
            favorites = favorites.filter(master => master.id !== id);
        } else {
            favorites.push({
                id: id,
                name: getMasterName(card),
                html: card.outerHTML
            });
        }

        saveFavorites();
        updateFavoriteButtons();
        renderFavorites();
    }

    // Отображение карточек на странице избранного
    function renderFavorites() {
        const container = document.querySelector(".favorites-grid");
        const emptyMessage = document.querySelector(".favorites-empty");

        if (!container) return;

        container.innerHTML = "";

        if (favorites.length === 0) {
            container.hidden = true;

            if (emptyMessage) {
                emptyMessage.hidden = false;
            }

            return;
        }

        container.hidden = false;

        if (emptyMessage) {
            emptyMessage.hidden = true;
        }

        favorites.forEach(master => {
            const wrapper = document.createElement("div");
            wrapper.innerHTML = master.html;

            const card = wrapper.firstElementChild;
            if (!card) return;

            // Восстанавливаем ID и сердечко
            card.dataset.masterId = master.id;

            const button = card.querySelector(".favorite");

            if (button) {
                button.dataset.favorite = master.id;
                button.type = "button";
            }

            container.appendChild(card);
        });

        updateFavoriteButtons();
    }

    // Обработка нажатий на сердечки
    document.addEventListener("click", function (event) {
        const button = event.target.closest(".favorite");

        if (!button) return;

        event.preventDefault();
        event.stopPropagation();

        toggleFavorite(button);
    });

    renderFavorites();
    updateFavoriteButtons();


    // ==========================================
    // 4. ПОИСК
    // ==========================================

    if (searchInput) {
        searchInput.addEventListener("input", function () {
            searchText = searchInput.value.trim().toLowerCase();
            updateMasters();
        });
    }


    // ==========================================
    // 5. ФИЛЬТР РЕЙТИНГА
    // ==========================================

    ratingButtons.forEach(button => {
        button.addEventListener("click", function () {

            ratingButtons.forEach(item => {
                item.classList.remove("selected");
            });

            button.classList.add("selected");

            const ratingText = button.innerText.replace(/\s/g, "");

            if (ratingText.includes("4.5")) {
                selectedRating = 4.5;
            } else if (ratingText.includes("4+")) {
                selectedRating = 4;
            } else if (ratingText.includes("5")) {
                selectedRating = 5;
            } else {
                selectedRating = 0;
            }

            updateMasters();
        });
    });


    // ==========================================
    // 6. ФИЛЬТР КАТЕГОРИЙ
    // ==========================================

    categoryButtons.forEach(button => {
        button.addEventListener("click", function () {

            const category = button.textContent
                .replace(/[^\p{L}\s]/gu, "")
                .trim()
                .toLowerCase();

            if (selectedCategory === category) {
                selectedCategory = "";
                button.classList.remove("active");
            } else {
                categoryButtons.forEach(item => {
                    item.classList.remove("active");
                });

                selectedCategory = category;
                button.classList.add("active");
            }

            updateMasters();
        });
    });


    // ==========================================
    // 7. ФИЛЬТР РАССТОЯНИЯ
    // ==========================================

    if (distanceSlider) {
        distanceSlider.addEventListener("input", function () {
            maxDistance = Number(distanceSlider.value);
            updateMasters();
        });
    }

    if (distanceSelect) {
        distanceSelect.addEventListener("change", function () {
            const value = parseInt(distanceSelect.value);

            if (!isNaN(value)) {
                maxDistance = value;

                if (distanceSlider) {
                    distanceSlider.value = value;
                }

                updateMasters();
            }
        });
    }


    // ==========================================
    // 8. ФИЛЬТРЫ-ПЕРЕКЛЮЧАТЕЛИ
    // ==========================================

    if (toggleCheckboxes.length >= 3) {

        toggleCheckboxes[0].addEventListener("change", function () {
            onlineOnly = toggleCheckboxes[0].checked;
            updateMasters();
        });

        toggleCheckboxes[1].addEventListener("change", function () {
            homeVisitOnly = toggleCheckboxes[1].checked;
            updateMasters();
        });

        toggleCheckboxes[2].addEventListener("change", function () {
            openNowOnly = toggleCheckboxes[2].checked;
            updateMasters();
        });
    }


    // ==========================================
    // 9. ФИЛЬТР ЦЕНЫ
    // ==========================================

    if (priceSliders.length === 2) {

        priceSliders[0].addEventListener("input", function () {
            minPrice = Number(priceSliders[0].value);

            if (minPrice > maxPrice) {
                minPrice = maxPrice;
                priceSliders[0].value = minPrice;
            }

            updateMasters();
        });

        priceSliders[1].addEventListener("input", function () {
            maxPrice = Number(priceSliders[1].value);

            if (maxPrice < minPrice) {
                maxPrice = minPrice;
                priceSliders[1].value = maxPrice;
            }

            updateMasters();
        });
    }


    // ==========================================
    // 10. СОРТИРОВКА
    // ==========================================

    if (sortingSelect) {
        sortingSelect.addEventListener("change", function () {
            sortingType = sortingSelect.value;
            updateMasters();
        });
    }


    // ==========================================
    // 11. ПОЛУЧЕНИЕ РЕЙТИНГА
    // ==========================================

    function getRating(card) {
        const ratingElement = card.querySelector(".master-rating");

        if (!ratingElement) return 0;

        const match = ratingElement.textContent.match(/(\d+[.,]\d+)/);

        return match ? Number(match[1].replace(",", ".")) : 0;
    }


    // ==========================================
    // 12. ПОЛУЧЕНИЕ РАССТОЯНИЯ
    // ==========================================

    function getDistance(card) {
        const locationElement = card.querySelector(".master-location");

        if (!locationElement) return 999;

        const match = locationElement.textContent.match(/(\d+[.,]?\d*)\s*км/i);

        return match ? Number(match[1].replace(",", ".")) : 999;
    }


    // ==========================================
    // 13. ПОИСК ПО КАРТОЧКЕ
    // ==========================================

    function matchesSearch(card) {
        const text = card.textContent.toLowerCase();
        return text.includes(searchText);
    }


    // ==========================================
    // 14. ПРОВЕРКА КАТЕГОРИИ
    // ==========================================

    function matchesCategory(card) {
        if (!selectedCategory) return true;

        const specialty = card.querySelector(".master-specialty");

        if (!specialty) return false;

        const text = specialty.textContent.toLowerCase();

        const categories = {
            "маникюр": ["маникюр", "педикюр"],
            "стрижки": ["стриж", "парикмахер"],
            "окрашивание": ["окраш", "колорист"],
            "брови": ["бров", "бровист"],
            "ресницы": ["ресниц", "lash"],
            "косметология": ["косметолог", "косметологи"],
            "макияж": ["визаж", "макияж"],
            "массаж": ["массаж"]
        };

        const keywords = categories[selectedCategory] || [selectedCategory];

        return keywords.some(keyword => text.includes(keyword));
    }


    // ==========================================
    // 15. ПРОВЕРКА ОНЛАЙН-ЗАПИСИ
    // ==========================================

    function matchesOnline(card) {
        if (!onlineOnly) return true;
        return card.querySelector(".online-badge") !== null;
    }


    // ==========================================
    // 16. ПРОВЕРКА РЕЙТИНГА
    // ==========================================

    function matchesRating(card) {
        return getRating(card) >= selectedRating;
    }


    // ==========================================
    // 17. ПРОВЕРКА РАССТОЯНИЯ
    // ==========================================

    function matchesDistance(card) {
        return getDistance(card) <= maxDistance;
    }


    // ==========================================
    // 18. ПРОВЕРКА ЦЕНЫ
    // ==========================================

    function matchesPrice(card) {
        const priceElement = card.querySelector(".master-price");

        // Пока цены в карточках нет — не исключаем мастеров
        if (!priceElement) return true;

        const price = Number(priceElement.textContent.replace(/[^\d]/g, ""));

        if (!price) return true;

        return price >= minPrice && price <= maxPrice;
    }


    // ==========================================
    // 19. ПРОВЕРКА ВЫЕЗДА НА ДОМ
    // ==========================================

    function matchesHomeVisit(card) {
        if (!homeVisitOnly) return true;
        return card.dataset.homeVisit === "true";
    }


    // ==========================================
    // 20. ПРОВЕРКА РАБОЧЕГО ВРЕМЕНИ
    // ==========================================

    function matchesOpenNow(card) {
        if (!openNowOnly) return true;
        return card.dataset.openNow === "true";
    }


    // ==========================================
    // 21. ФИЛЬТРАЦИЯ МАСТЕРОВ
    // ==========================================

    function updateMasters() {
        let visibleCards = [];

        masterCards.forEach(card => {

            const visible =
                matchesSearch(card) &&
                matchesCategory(card) &&
                matchesRating(card) &&
                matchesDistance(card) &&
                matchesOnline(card) &&
                matchesPrice(card) &&
                matchesHomeVisit(card) &&
                matchesOpenNow(card);

            card.style.display = visible ? "" : "none";

            if (visible) {
                visibleCards.push(card);
            }
        });

        sortMasters(visibleCards);
        updateCounter(visibleCards.length);
    }


    // ==========================================
    // 22. СОРТИРОВКА КАРТОЧЕК
    // ==========================================

    function sortMasters(cards) {
        if (!mastersGrid) return;

        cards.sort(function (a, b) {

            if (sortingType.includes("рейтинг")) {
                return getRating(b) - getRating(a);
            }

            if (sortingType.includes("цен")) {
                return getPrice(a) - getPrice(b);
            }

            if (sortingType.includes("расстояни")) {
                return getDistance(a) - getDistance(b);
            }

            return 0;
        });

        cards.forEach(card => {
            mastersGrid.appendChild(card);
        });
    }


    // ==========================================
    // 23. ПОЛУЧЕНИЕ ЦЕНЫ
    // ==========================================

    function getPrice(card) {
        const priceElement = card.querySelector(".master-price");

        if (!priceElement) return 999999;

        const price = Number(priceElement.textContent.replace(/[^\d]/g, ""));

        return price || 999999;
    }


    // ==========================================
    // 24. СЧЁТЧИК РЕЗУЛЬТАТОВ
    // ==========================================

    function updateCounter(count) {
        if (!mastersHeading) return;

        mastersHeading.textContent = "Найдено " + count + " " + getWord(count);

        let emptyMessage = document.querySelector(".empty-results");

        if (count === 0) {

            if (!emptyMessage) {
                emptyMessage = document.createElement("p");
                emptyMessage.className = "empty-results";
                emptyMessage.textContent = "Ничего не найдено. Попробуйте изменить параметры поиска.";

                mastersGrid.appendChild(emptyMessage);
            }

        } else if (emptyMessage) {
            emptyMessage.remove();
        }
    }


    // ==========================================
    // 25. ПРАВИЛЬНОЕ ОКОНЧАНИЕ СЛОВА
    // ==========================================

    function getWord(number) {
        const lastTwo = number % 100;

        if (lastTwo >= 11 && lastTwo <= 14) {
            return "мастеров и салонов";
        }

        const last = number % 10;

        if (last === 1) {
            return "мастер и салон";
        }

        if (last >= 2 && last <= 4) {
            return "мастера и салона";
        }

        return "мастеров и салонов";
    }


    // ==========================================
    // 26. СБРОС ФИЛЬТРОВ
    // ==========================================

    if (resetButton) {
        resetButton.addEventListener("click", function () {

            searchText = "";
            selectedCategory = "";
            selectedRating = 0;

            maxDistance = 20;

            minPrice = 500;
            maxPrice = 10000;

            onlineOnly = false;
            homeVisitOnly = false;
            openNowOnly = false;

            sortingType = "По популярности";

            if (searchInput) {
                searchInput.value = "";
            }

            if (distanceSlider) {
                distanceSlider.value = 20;
            }

            if (distanceSelect) {
                distanceSelect.value = "20 км";
            }

            if (priceSliders.length === 2) {
                priceSliders[0].value = 500;
                priceSliders[1].value = 10000;
            }

            ratingButtons.forEach(button => {
                button.classList.remove("selected");
            });

            if (ratingButtons.length > 0) {
                ratingButtons[0].classList.add("selected");
            }

            categoryButtons.forEach(button => {
                button.classList.remove("active");
            });

            toggleCheckboxes.forEach(checkbox => {
                checkbox.checked = false;
            });

            if (sortingSelect) {
                sortingSelect.selectedIndex = 0;
            }

            updateMasters();
        });
    }


    // ==========================================
    // 27. ПЕРВОНАЧАЛЬНОЕ ОБНОВЛЕНИЕ
    // ==========================================

    updateMasters();

});


/* ==================================
   ПЕРЕХОД НА ПРОФИЛЬ МАСТЕРА
================================== */

document.addEventListener("click", function (event) {

    // Если нажали на сердечко — не открываем профиль
    if (event.target.closest(".favorite")) return;

    const card = event.target.closest(".master-card");

    if (!card) return;

    const name = card.querySelector(".master-info h3")?.textContent.trim() || "Мастер";

    const image = card.querySelector("img")?.src || "";

    const rating = card.querySelector(".rating")?.textContent.trim() || "";

    const description = card.querySelector(".master-info p")?.textContent.trim() || "";

    const specialty = card.dataset.category || "";

    const master = {
        name: name,
        image: image,
        rating: rating,
        description: description,
        specialty: specialty,
        cardHTML: card.innerHTML
    };

    localStorage.setItem("selectedMaster", JSON.stringify(master));

    window.location.href = "master_profile.html";
});


/* ==================================
   ЗАГРУЗКА ПРОФИЛЯ МАСТЕРА
================================== */

const profileContainer = document.getElementById("master-profile");

if (profileContainer) {

    const master = JSON.parse(localStorage.getItem("selectedMaster") || "null");

    if (!master) {

        profileContainer.innerHTML = `
            <div class="master-profile-empty">
                <h2>Профиль мастера не найден</h2>
                <p>Вернитесь на главную и выберите мастера.</p>
                <a href="index.html">Перейти к мастерам</a>
            </div>
        `;

    } else {

        profileContainer.innerHTML = `
            <div class="master-profile-card">

                <div class="master-profile-left">
                    <img 
                        src="${master.image}" 
                        alt="${master.name}" 
                        class="master-profile-photo"
                    >
                </div>

                <div class="master-profile-info">

                    <h1 class="master-profile-name">
                        ${master.name}
                    </h1>

                    <div class="master-profile-specialty">
                        ${master.specialty || "Бьюти-мастер"}
                    </div>

                    <div class="master-profile-rating">
                        ${master.rating || "★ Рейтинг мастера"}
                    </div>

                    <p class="master-profile-description">
                        ${master.description || "Информация о мастере скоро появится."}
                    </p>

                    <div class="master-profile-section">
                        <h2>О мастере</h2>
                        <p class="master-profile-description">
                            Специалист индустрии красоты. 
                            Выберите мастера, чтобы ознакомиться с его работами 
                            и услугами, а также записаться на процедуру.
                        </p>
                    </div>

                    <button class="master-profile-book" id="master-book-button">
                        Записаться
                    </button>

                </div>

            </div>
        `;

        // Кнопка записи
        const bookButton = document.getElementById("master-book-button");

        bookButton.addEventListener("click", function () {
            alert("Функция записи будет добавлена следующим этапом.");
        });
    }
}

