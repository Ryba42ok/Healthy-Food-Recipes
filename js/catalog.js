document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('recipesGrid');
    const countLabel = document.getElementById('recipeCount');
    const searchInputs = document.querySelectorAll('.search-bar__input');
    const currentCategory = document.body.dataset.category;

    let allRecipes = []; // Здесь будем хранить копию данных из XML для быстрого поиска

    // 1. Загрузка данных
    fetch('data/recipes.xml')
        .then(res => {
            if (!res.ok) throw new Error('Ошибка загрузки XML');
            return res.text();
        })
        .then(xmlString => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlString, "text/xml");
            // Превращаем XML в удобный массив объектов
            allRecipes = Array.from(xml.querySelectorAll('recipe')).map(recipe => ({
                id: recipe.getAttribute('id'),
                title: recipe.querySelector('title').textContent,
                category: recipe.querySelector('category').textContent,
                image: recipe.querySelector('image').textContent,
                difficulty: recipe.querySelector('difficulty').textContent,
                time: recipe.querySelector('prepTime').textContent,
                calories: recipe.querySelector('calories').textContent,
                // Добавляем описание для глубокого поиска, если оно есть в XML
                description: recipe.querySelector('description')?.textContent || "" 
            }));

            // Первичный рендеринг (фильтруем только по категории страницы)
            renderFilteredRecipes("");
            
            // Инициализируем поиск
            initSearchLogic();
        })
        .catch(err => console.error('Критическая ошибка:', err));

    // 2. Функция отрисовки (универсальная)
    function renderFilteredRecipes(searchText) {
        if (!grid) return;
        
        grid.innerHTML = '';
        let count = 0;

        allRecipes.forEach(recipe => {
            const matchesCategory = !currentCategory || recipe.category === currentCategory;
            const matchesSearch = recipe.title.toLowerCase().includes(searchText.toLowerCase()) || 
                                recipe.description.toLowerCase().includes(searchText.toLowerCase());

            if (matchesCategory && matchesSearch) {
                count++;
                const card = document.createElement('div');
                card.className = 'recipe-card';
                card.innerHTML = `
                    <a href="recipe/recipe.html?id=${recipe.id}" class="recipe-card__link">
                        <div class="recipe-card__image-wrapper">
                            <img src="data/${recipe.image}" alt="${recipe.title}" class="recipe-card__image">
                            <span class="recipe-card__badge">${recipe.difficulty}</span>
                        </div>
                        <div class="recipe-card__content">
                            <h3 class="recipe-card__title">${recipe.title}</h3>
                            <div class="recipe-card__info">
                                <span class="info-item">🕒 ${recipe.time}</span>
                                <span class="info-item">🔥 ${recipe.calories}</span>
                            </div>
                        </div>
                    </a>
                `;
                grid.appendChild(card);
            }
        });

        if (countLabel) countLabel.textContent = `Найдено рецептов: ${count}`;
        if (count === 0) grid.innerHTML = '<p class="empty-message">Ничего не найдено.</p>';
    }

    // 3. Логика поиска и обработки Enter
    function initSearchLogic() {
        searchInputs.forEach(input => {
            // Живой поиск при вводе
            input.addEventListener('input', (e) => {
                renderFilteredRecipes(e.target.value.trim());
            });

            // Обработка Enter
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Чтобы страница не перезагрузилась
                    
                    // Если мы на странице, где нет сетки (например, Главная)
                    if (!grid) {
                        const query = input.value.trim();
                        if (query) {
                            window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
                        }
                    } else {
                        input.blur(); // Просто закрываем клавиатуру, поиск уже сработал по 'input'
                    }
                }
            });
        });

        // Проверка: если мы пришли с другой страницы с параметром ?search=вок
        const urlParams = new URLSearchParams(window.location.search);
        const externalQuery = urlParams.get('search');
        if (externalQuery) {
            searchInputs.forEach(input => input.value = externalQuery);
            renderFilteredRecipes(externalQuery);
        }
    }
});