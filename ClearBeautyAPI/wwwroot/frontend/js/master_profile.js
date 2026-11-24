document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("master-profile");
    if (!container) return;

    const masterId = localStorage.getItem("selectedMasterId");
    if (!masterId) {
        container.innerHTML = `<div class="master-profile-empty"><h2>Мастер не найден</h2><a href="index.html">Вернуться</a></div>`;
        return;
    }

    container.innerHTML = '<p>Загрузка профиля...</p>';

    try {
        const response = await fetch(`/api/masters/${masterId}`);
        if (!response.ok) throw new Error("Мастер не найден");
        const master = await response.json();

        const servicesHTML = (master.services || []).map(s => `
            <div class="master-service-item">
                <div class="master-service-name">${s.name}</div>
                <div class="master-service-details">
                    <span class="master-service-duration">${s.durationMinutes} мин</span>
                    <span class="master-service-price">${s.price} ₽</span>
                </div>
            </div>`).join("");

        const portfolioHTML = (master.portfolio || []).map(p => `
            <div class="master-portfolio-item"><img src="${p.imageUrl}" alt="Работа"></div>`).join("");

        const reviewsHTML = (master.reviews || []).map(r => `
            <div class="master-review">
                <div class="master-review-top">
                    <span class="master-review-name">${r.clientName}</span>
                    <span class="master-review-date">${new Date(r.createdAt).toLocaleDateString('ru-RU')}</span>
                </div>
                <div class="master-review-stars">${"★".repeat(r.rating)}${"☆".repeat(5 - r.rating)}</div>
                <div class="master-review-text">${r.text}</div>
            </div>`).join("");

        const rating = parseFloat(master.rating) || 5;
        const stars = "★".repeat(Math.round(rating)) + "☆".repeat(5 - Math.round(rating));

        container.innerHTML = `
            <section class="master-profile-main">
                <div><img src="${master.imageUrl}" alt="${master.name}" class="master-profile-photo"></div>
                <div class="master-profile-info">
                    <h1 class="master-profile-name">${master.name}</h1>
                    <div class="master-profile-specialty">${master.specialization}</div>
                    <div class="master-profile-rating">${stars} <span>${rating.toFixed(1)} / 5 · ${(master.reviews || []).length} отзывов</span></div>
                    <p class="master-profile-description">${master.description}</p>
                    <div class="master-profile-experience">Опыт работы: <strong>${master.experience}</strong></div>
                </div>
            </section>
            <section class="profile-section">
                <h2 class="profile-section-title">Место работы</h2>
                <div class="master-workplace">
                    <div class="master-workplace-name">${master.salon}</div>
                    <div class="master-workplace-address">📍 ${master.address}</div>
                </div>
            </section>
            <section class="profile-section">
                <h2 class="profile-section-title">Услуги и цены</h2>
                <div class="master-services-list">${servicesHTML}</div>
            </section>
            <section class="profile-section">
                <h2 class="profile-section-title">Работы мастера</h2>
                <div class="master-portfolio">${portfolioHTML}</div>
            </section>
            <section class="profile-section">
                <h2 class="profile-section-title">Отзывы (${(master.reviews || []).length})</h2>
                <div class="master-reviews">${reviewsHTML}</div>
            </section>
            <section class="profile-section master-booking" id="booking">
                <h2 class="profile-section-title">Запись к мастеру</h2>
                <form class="master-booking-form" id="master-booking-form">
                    <label>Услуга
                        <select id="booking-service" required>
                            <option value="">Выберите услугу</option>
                            ${(master.services || []).map(s => `<option value="${s.id}">${s.name} — ${s.price} ₽</option>`).join("")}
                        </select>
                    </label>
                    <label>Дата <input type="date" id="booking-date" required></label>
                    <label>Время
                        <select id="booking-time" required>
                            <option>10:00</option><option>11:00</option><option>12:00</option>
                            <option>13:00</option><option>14:00</option><option>15:00</option>
                            <option>16:00</option><option>17:00</option><option>18:00</option>
                        </select>
                    </label>
                    <label>Ваше имя <input type="text" id="booking-name" required></label>
                    <label>Телефон <input type="tel" id="booking-phone" required></label>
                    <button type="submit" class="master-booking-submit">Подтвердить запись</button>
                </form>
            </section>
        `;

        const dateInput = document.getElementById("booking-date");
        const today = new Date();
        dateInput.min = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split("T")[0];

        document.getElementById("master-booking-form").addEventListener("submit", async function (e) {
            e.preventDefault();
            const booking = {
                serviceId: parseInt(document.getElementById("booking-service").value),
                clientName: document.getElementById("booking-name").value,
                clientPhone: document.getElementById("booking-phone").value,
                bookingDate: document.getElementById("booking-date").value + "T" + document.getElementById("booking-time").value + ":00"
            };
            try {
                const res = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(booking)
                });
                if (!res.ok) throw new Error("Ошибка");
                const saved = await res.json();
                alert(`Запись №${saved.id} создана!`);
                this.reset();
            } catch (err) {
                alert("Ошибка: " + err.message);
            }
        });
    } catch (error) {
        container.innerHTML = `<div class="master-profile-empty"><h2>Ошибка</h2><p>${error.message}</p></div>`;
    }
});