document.addEventListener("DOMContentLoaded", function () {

    const profileContainer = document.getElementById("master-profile");

    if (!profileContainer) return;

    const master = JSON.parse(localStorage.getItem("selectedMaster") || "null");

    if (!master) {
        profileContainer.innerHTML = `
            <div class="master-profile-empty">
                <h2>Мастер не найден</h2>
                <p>Вернитесь на главную страницу и выберите мастера.</p>
                <a href="index.html">Вернуться на главную</a>
            </div>
        `;
        return;
    }

    profileContainer.innerHTML = `
        <div class="master-profile-card">

            <img 
                src="${master.image}" 
                alt="${master.name}" 
                class="master-profile-photo"
            >

            <div class="master-profile-info">

                <h1 class="master-profile-name">
                    ${master.name}
                </h1>

                <div class="master-profile-specialty">
                    ${master.specialty || "Бьюти-мастер"}
                </div>

                <div class="master-profile-rating">
                    ${master.rating || "★ Рейтинг не указан"}
                </div>

                <p class="master-profile-description">
                    ${master.description || "Информация о мастере пока не добавлена."}
                </p>

                <button class="master-profile-book" id="master-book-button">
                    Записаться
                </button>

            </div>

        </div>
    `;

    document.getElementById("master-book-button").addEventListener("click", function () {
        alert("Функция записи пока находится в разработке.");
    });

});