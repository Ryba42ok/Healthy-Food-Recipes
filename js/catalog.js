document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('recipesGrid');
    const countLabel = document.getElementById('recipeCount');
    const searchInputs = document.querySelectorAll('.search-bar__input');
    
    // Определяем, на какой мы странице
    const isSearchPage = document.body.dataset.category === 'search';
    
    // Получаем запрос из URL (например, ?query=лосось)
    const urlParams = new URLSearchParams(window.location.search);
    const queryFromUrl = urlParams.get('query');

    // --- ЛОГИКА ОТПРАВКИ (для всех страниц) ---
    searchInputs.forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                const value = input.value.trim();
                if (value) {
                    // Переходим на страницу поиска с параметром query
                    window.location.href = `search.html?query=${encodeURIComponent(value)}`;
                }
            }
        });
    });

    // --- ЛОГИКА ОТОБРАЖЕНИЯ (только для страницы поиска или каталога) ---
    if (grid) {
        fetch('data/recipes.xml')
            .then(res => res.text())
            .then(xmlData => {
                const parser = new DOMParser();
                const xml = parser.parseFromString(xmlData, "text/xml");
                const recipes = xml.querySelectorAll('recipe');
                
                renderResults(recipes, queryFromUrl);
            })
            .catch(err => console.error("Ошибка XML:", err));
    }

    function renderResults(recipes, filterText) {
        grid.innerHTML = '';
        let foundCount = 0;
        const searchLow = filterText ? filterText.toLowerCase() : "";

        // Если это страница поиска, меняем заголовок
        const titleTag = document.getElementById('searchTitle');
        if (isSearchPage && titleTag) {
            titleTag.textContent = `Результаты по запросу: "${filterText}"`;
        }

        recipes.forEach(recipe => {
            const title = recipe.querySelector('title').textContent;
            const category = recipe.querySelector('category').textContent;
            
            // Логика фильтрации:
            // 1. Если мы на странице поиска — ищем по тексту
            // 2. Если мы в категории (завтраки и т.д.) — фильтруем по категории
            let shouldShow = false;
            
            if (isSearchPage) {
                shouldShow = title.toLowerCase().includes(searchLow);
            } else {
                const pageCategory = document.body.dataset.category;
                shouldShow = !pageCategory || category === pageCategory;
            }

            if (shouldShow) {
                foundCount++;
                createCard(recipe, grid);
            }
        });

        // Сообщение, если ничего не найдено
        if (foundCount === 0) {
            grid.innerHTML = `<div class="error-msg">К сожалению, по запросу "${filterText}" ничего не найдено.</div>`;
        }

        if (countLabel) {
            countLabel.textContent = `Найдено рецептов: ${foundCount}`;
        }
    }

    function createCard(recipe, container) {
    const id = recipe.getAttribute('id');
    const title = recipe.querySelector('title').textContent;
    const img = recipe.querySelector('image').textContent;
    
    // Извлекаем данные из XML (проверь, чтобы названия тегов совпадали с XML)
    const stats = recipe.querySelector('stats');
    const difficulty = stats ? stats.querySelector('difficulty').textContent : "Средне";
    const time = stats ? stats.querySelector('prepTime').textContent : "30 мин";
    const calories = stats ? stats.querySelector('calories').textContent : "0 ккал";

    const card = document.createElement('div');
    card.className = 'recipe-card'; 

    card.innerHTML = `
        <a href="recipe/recipe.html?id=${id}" class="recipe-card__link">
            <div class="recipe-card__image-wrapper">
                <img src="data/${img}" alt="${title}" class="recipe-card__image">
                <span class="recipe-card__badge">${difficulty}</span>
            </div>
            <div class="recipe-card__content">
                <h3 class="recipe-card__title">${title}</h3>
                <div class="recipe-card__info">
                    <span class="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        ${time}
                    </span>
                    <span class="info-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M8 2v3M16 2v3M3.5 9h17M21 8.5V17a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8.5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                        ${calories}
                    </span>
                </div>
            </div>
        </a>
    `;
    container.appendChild(card);
}
});