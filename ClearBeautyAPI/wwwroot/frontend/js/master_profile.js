
document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById("master-profile");

    if (!container) return;

    // Получаем выбранного мастера
    const master = JSON.parse(localStorage.getItem("selectedMaster") || "null");

    // Если мастер не найден
    if (!master) {
        container.innerHTML = `
            <div class="master-profile-empty">
                <h2>Мастер не найден</h2>
                <p>Вернитесь на главную страницу и выберите мастера.</p>
                <a href="index.html">Вернуться на главную</a>
            </div>
        `;
        return;
    }

    // Данные мастера (пока демонстрационные)
    const masterData = {
        experience: "5 лет",
        salon: "Beauty Studio",
        address: "Москва, ул. Примерная, 15",
        description: "Я — специалист в сфере красоты. Для меня важно качество работы, индивидуальный подход и комфорт каждого клиента. Постоянно совершенствую свои навыки и использую современные техники.",
        services: [
            {
                name: "Маникюр без покрытия",
                price: "1 500 ₽",
                duration: "1 ч 30 мин"
            },
            {
                name: "Маникюр с покрытием",
                price: "2 500 ₽",
                duration: "2 ч"
            },
            {
                name: "Снятие покрытия",
                price: "500 ₽",
                duration: "30 мин"
            },
            {
                name: "Дизайн ногтей",
                price: "от 300 ₽",
                duration: "30 мин"
            }
        ],
        reviews: [
            {
                name: "Анастасия",
                date: "12 ноября 2026",
                rating: 5,
                text: "Очень понравилась работа! Всё аккуратно, красиво, мастер внимательная и приятная. Обязательно вернусь."
            },
            {
                name: "Екатерина",
                date: "8 ноября 2026",
                rating: 5,
                text: "Прекрасный мастер, помогла подобрать дизайн. Работа выполнена качественно, атмосфера очень комфортная."
            },
            {
                name: "Мария",
                date: "2 ноября 2026",
                rating: 4,
                text: "Осталась довольна результатом. Всё прошло спокойно, инструменты стерильные, результат красивый."
            }
        ],
        portfolio: [
            "https://images.unsplash.com/photo-1604654498043-5a4c9e4d0f6f?auto=format&fit=crop&w=700&q=80",
            "https://images.unsplash.com/photo-1610992015732-2449b7637c3f?auto=format&fit=crop&w=700&q=80",
            "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=700&q=80"
        ]
    };

    // Данные, которые берем с карточки главной
    const name = master.name || "Мастер";
    const image = master.image || "";
    const specialty = master.specialty || "Бьюти-мастер";
    const rating = master.rating || "5.0";
    const description = master.description || masterData.description;

    // Преобразуем рейтинг в число
    const ratingNumber = parseFloat(String(rating).replace(",", ".")) || 5;

    // Формируем звезды
    const stars = "★".repeat(Math.round(ratingNumber)) + "☆".repeat(5 - Math.round(ratingNumber));

    // Формируем услуги
    const servicesHTML = masterData.services.map(service => `
        <div class="master-service-item">
            <div class="master-service-name">${service.name}</div>

            <div class="master-service-details">
                <span class="master-service-duration">${service.duration}</span>
                <span class="master-service-price">${service.price}</span>
            </div>
        </div>
    `).join("");

    // Формируем портфолио
    const portfolioHTML = masterData.portfolio.map(photo => `
        <div class="master-portfolio-item">
            <img src="${photo}" alt="Работа мастера">
        </div>
    `).join("");

    // Формируем отзывы
    const reviewsHTML = masterData.reviews.map(review => `
        <div class="master-review">

            <div class="master-review-top">
                <span class="master-review-name">${review.name}</span>
                <span class="master-review-date">${review.date}</span>
            </div>

            <div class="master-review-stars">
                ${"★".repeat(review.rating)}${"☆".repeat(5 - review.rating)}
            </div>

            <div class="master-review-text">
                ${review.text}
            </div>

        </div>
    `).join("");

    // Заполняем страницу
    container.innerHTML = `

        <!-- Основная информация -->

        <section class="master-profile-main">

            <div>
                <img 
                    src="${image}" 
                    alt="${name}" 
                    class="master-profile-photo"
                >
            </div>

            <div class="master-profile-info">

                <h1 class="master-profile-name">${name}</h1>

                <div class="master-profile-specialty">
                    ${specialty}
                </div>

                <div class="master-profile-rating">
                    ${stars}
                    <span>${ratingNumber.toFixed(1)} / 5 · ${masterData.reviews.length} отзывов</span>
                </div>

                <div class="master-profile-tags">
                    <span class="master-profile-tag">✓ Проверенный мастер</span>
                    <span class="master-profile-tag">Онлайн-запись</span>
                </div>

                <p class="master-profile-description">
                    ${description}
                </p>

                <div class="master-profile-experience">
                    Опыт работы: <strong>${masterData.experience}</strong>
                </div>

            </div>

        </section>

        <!-- Место работы -->

        <section class="profile-section">

            <h2 class="profile-section-title">Место работы</h2>

            <div class="master-workplace">
                <div class="master-workplace-name">
                    ${masterData.salon}
                </div>

                <div class="master-workplace-address">
                    📍 ${masterData.address}
                </div>
            </div>

        </section>

        <!-- Услуги -->

        <section class="profile-section">

            <h2 class="profile-section-title">Услуги и цены</h2>

            <div class="master-services-list">
                ${servicesHTML}
            </div>

        </section>

        <!-- Портфолио -->

        <section class="profile-section">

            <h2 class="profile-section-title">Работы мастера</h2>

            <div class="master-portfolio">
                ${portfolioHTML}
            </div>

        </section>

        <!-- Отзывы -->

        <section class="profile-section">

            <h2 class="profile-section-title">
                Отзывы клиентов (${masterData.reviews.length})
            </h2>

            <div class="master-reviews">
                ${reviewsHTML}
            </div>

        </section>

        <!-- Запись -->

        <section class="profile-section master-booking" id="booking">

            <h2 class="profile-section-title">Запись к мастеру</h2>

            <p class="master-booking-text">
                Выберите услугу и удобную дату для посещения.
            </p>

            <form class="master-booking-form" id="master-booking-form">

                <label>
                    Услуга

                    <select id="booking-service" required>
                        <option value="">Выберите услугу</option>

                        ${masterData.services.map((service, index) => `
                            <option value="${index}">
                                ${service.name} — ${service.price}
                            </option>
                        `).join("")}

                    </select>
                </label>

                <label>
                    Дата

                    <input 
                        type="date" 
                        id="booking-date" 
                        required
                    >
                </label>

                <label>
                    Время

                    <select id="booking-time" required>
                        <option value="">Выберите время</option>
                        <option>10:00</option>
                        <option>11:00</option>
                        <option>12:00</option>
                        <option>13:00</option>
                        <option>14:00</option>
                        <option>15:00</option>
                        <option>16:00</option>
                        <option>17:00</option>
                        <option>18:00</option>
                    </select>
                </label>

                <label>
                    Ваше имя

                    <input 
                        type="text" 
                        id="booking-name" 
                        placeholder="Введите имя"
                        required
                    >
                </label>

                <label>
                    Телефон

                    <input 
                        type="tel" 
                        id="booking-phone" 
                        placeholder="+7 (___) ___-__-__"
                        required
                    >
                </label>

                <button type="submit" class="master-booking-submit">
                    Подтвердить запись
                </button>

            </form>

        </section>
    `;

    // Запрет выбора прошедших дат
    const dateInput = document.getElementById("booking-date");

    const today = new Date();
    const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

    dateInput.min = localDate;

    // Обработка записи (пока демонстрационная)
    const bookingForm = document.getElementById("master-booking-form");

    bookingForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const selectedService = document.getElementById("booking-service");
        const selectedDate = document.getElementById("booking-date").value;
        const selectedTime = document.getElementById("booking-time").value;
        const clientName = document.getElementById("booking-name").value;
        const clientPhone = document.getElementById("booking-phone").value;

        const service = masterData.services[selectedService.value];

        if (!service) {
            alert("Выберите услугу.");
            return;
        }

        alert(
            "Заявка сформирована!\n\n" +
            "Мастер: " + name + "\n" +
            "Услуга: " + service.name + "\n" +
            "Дата: " + selectedDate + "\n" +
            "Время: " + selectedTime + "\n" +
            "Имя: " + clientName + "\n" +
            "Телефон: " + clientPhone + "\n\n" +
            "Пока это демонстрация. Реальное сохранение записи подключим к БД."
        );
    });

});
