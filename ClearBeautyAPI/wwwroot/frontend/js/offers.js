
document.addEventListener("DOMContentLoaded", function () {

    const offersGrid = document.getElementById("offers-grid");
    const sortSelect = document.getElementById("offers-sort");

    if (!offersGrid) return;

    // Демонстрационные предложения
    const offers = [
        {
            id: 1,
            title: "Маникюр с покрытием гель-лак",
            category: "Маникюр",
            image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=800&q=80",
            oldPrice: 2500,
            newPrice: 1750,
            provider: "Мастер Анна Петрова",
            location: "Москва, ул. Тверская, 12",
            discount: 30,
            conditions: "Скидка для новых клиентов. В услугу входит маникюр и покрытие. Предварительная запись обязательна.",
            popular: 10
        },
        {
            id: 2,
            title: "Стрижка и укладка",
            category: "Волосы",
            image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=800&q=80",
            oldPrice: 4000,
            newPrice: 2800,
            provider: "Beauty Studio",
            location: "Москва, ул. Арбат, 25",
            discount: 30,
            conditions: "Предложение действует в будние дни. В стоимость входит стрижка и укладка.",
            popular: 9
        },
        {
            id: 3,
            title: "Комплекс коррекции и окрашивания бровей",
            category: "Брови",
            image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&w=800&q=80",
            oldPrice: 1800,
            newPrice: 1200,
            provider: "Мастер Екатерина",
            location: "Москва, ул. Большая Дмитровка, 8",
            discount: 33,
            conditions: "Скидка при первом посещении. Запись осуществляется заранее.",
            popular: 8
        },
        {
            id: 4,
            title: "Уход за лицом",
            category: "Косметология",
            image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
            oldPrice: 5000,
            newPrice: 3500,
            provider: "Luna Beauty",
            location: "Москва, ул. Садовая, 19",
            discount: 30,
            conditions: "Специальная цена на первую процедуру. Необходимо предварительно проконсультироваться со специалистом.",
            popular: 7
        },
        {
            id: 5,
            title: "Ламинирование ресниц",
            category: "Ресницы",
            image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=800&q=80",
            oldPrice: 3000,
            newPrice: 2100,
            provider: "Мастер Мария",
            location: "Москва, ул. Покровка, 16",
            discount: 30,
            conditions: "Акционная стоимость для новых клиентов. Включает ламинирование и уход.",
            popular: 6
        },
        {
            id: 6,
            title: "Массаж лица",
            category: "Массаж",
            image: "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&w=800&q=80",
            oldPrice: 3500,
            newPrice: 2500,
            provider: "Velvet Skin Studio",
            location: "Москва, ул. Лесная, 7",
            discount: 29,
            conditions: "Предложение действует при предварительной записи. Продолжительность процедуры — 60 минут.",
            popular: 5
        }
    ];

    // Формирование карточек
    function renderOffers(list) {

        offersGrid.innerHTML = list.map(offer => `
            <article class="offer-card">

                <div class="offer-image-wrapper">
                    <img 
                        src="${offer.image}" 
                        alt="${offer.title}" 
                        class="offer-image"
                        loading="lazy"
                    >

                    <span class="offer-discount">
                        −${offer.discount}%
                    </span>
                </div>

                <div class="offer-content">

                    <div class="offer-category">
                        ${offer.category}
                    </div>

                    <h3 class="offer-title">
                        ${offer.title}
                    </h3>

                    <div class="offer-prices">
                        <span class="offer-new-price">
                            ${offer.newPrice.toLocaleString("ru-RU")} ₽
                        </span>

                        <span class="offer-old-price">
                            ${offer.oldPrice.toLocaleString("ru-RU")} ₽
                        </span>
                    </div>

                    <div class="offer-provider">
                        <span class="offer-provider-name">
                            ${offer.provider}
                        </span>

                        <span class="offer-location">
                            📍 ${offer.location}
                        </span>
                    </div>

                    <div class="offer-conditions">
                        <strong>Условия акции:</strong><br>
                        ${offer.conditions}
                    </div>

                    <button 
                        class="offer-button"
                        data-offer-id="${offer.id}"
                    >
                        Записаться
                    </button>

                </div>

            </article>
        `).join("");
    }

    // Сортировка
    function sortOffers() {

        let sortedOffers = [...offers];

        switch (sortSelect.value) {

            case "discount":
                sortedOffers.sort((a, b) => b.discount - a.discount);
                break;

            case "price":
                sortedOffers.sort((a, b) => a.newPrice - b.newPrice);
                break;

            default:
                sortedOffers.sort((a, b) => b.popular - a.popular);
        }

        renderOffers(sortedOffers);
    }

    // Обработка сортировки
    sortSelect.addEventListener("change", sortOffers);

    // Обработка кнопок записи
    offersGrid.addEventListener("click", function (event) {

        const button = event.target.closest(".offer-button");

        if (!button) return;

        const offerId = Number(button.dataset.offerId);
        const offer = offers.find(item => item.id === offerId);

        if (!offer) return;

        alert(
            "Вы выбрали предложение:\n\n" +
        offer.title + "\n" +
        offer.provider + "\n" +
        "Цена: " + offer.newPrice.toLocaleString("ru-RU") + " ₽\n\n" +
        "Функцию записи подключим следующим этапом."
        );
    });

    // Первоначальное отображение
    sortOffers();

});
