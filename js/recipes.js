// Ждем, когда загрузится страница
document.addEventListener('DOMContentLoaded', function() {
    loadRecipesFromXML();
    
    // Добавляем обработчики для фильтров
    setupFilters();
});

// Главная функция загрузки рецептов
function loadRecipesFromXML() {
    // Создаем запрос для загрузки XML-файла
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'data/recipes.xml', true);
    
    // Что делать, когда файл загрузился
    xhr.onload = function() {
        if (xhr.status === 200) {
            // Парсим XML
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xhr.responseText, 'text/xml');
            
            // Получаем все рецепты из XML
            const recipes = xmlDoc.getElementsByTagName('recipe');
            
            // Отображаем рецепты на странице
            displayRecipes(recipes);
        } else {
            console.error('Ошибка загрузки XML:', xhr.status);
            document.getElementById('recipes-container').innerHTML = 
                '<p class="error">Ошибка загрузки рецептов. Попробуйте позже.</p>';
        }
    };
    
    // Отправляем запрос
    xhr.send();
}

// Функция отображения рецептов
function displayRecipes(recipes) {
    const container = document.getElementById('recipes-container');
    container.innerHTML = ''; // Очищаем контейнер
    
    // Если рецептов нет
    if (recipes.length === 0) {
        container.innerHTML = '<p>Рецепты не найдены</p>';
        return;
    }
    
    // Проходим по каждому рецепту в XML
    for (let i = 0; i < recipes.length; i++) {
        const recipe = recipes[i];
        
        // Извлекаем данные из XML-тегов
        const id = recipe.getAttribute('id');
        const title = getTagContent(recipe, 'title');
        const category = getTagContent(recipe, 'category');
        const time = getTagContent(recipe, 'time');
        const calories = getTagContent(recipe, 'calories');
        const difficulty = getTagContent(recipe, 'difficulty');
        const image = getTagContent(recipe, 'image');
        const description = getTagContent(recipe, 'description');
        
        // Создаем карточку рецепта
        const card = document.createElement('article');
        card.className = 'recipe-card';
        card.dataset.category = category; // Для фильтрации
        
        // Наполняем карточку HTML-содержимым
        card.innerHTML = `
            <div class="card-image">
                <img src="${image}" alt="${title}" onerror="this.src='images/placeholder.jpg'">
                <span class="difficulty-badge">${difficulty}</span>
            </div>
            <div class="card-content">
                <h3>${title}</h3>
                <p class="description">${description}</p>
                <div class="recipe-meta">
                    <span class="meta-item">
                        <!-- SVG иконка времени -->
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" fill="none"/>
                            <polyline points="12 6 12 12 16 14" stroke="currentColor" fill="none"/>
                        </svg>
                        ${time} мин
                    </span>
                    <span class="meta-item">
                        <!-- SVG иконка калорий -->
                        <svg width="16" height="16" viewBox="0 0 24 24">
                            <path d="M12 2C8 6 8 10 8 12c0 4 4 6 4 6s4-2 4-6c0-2 0-6-4-10z" stroke="currentColor" fill="none"/>
                        </svg>
                        ${calories} ккал
                    </span>
                </div>
                <button class="view-recipe-btn" onclick="showRecipeDetails('${id}')">
                    Смотреть рецепт
                </button>
            </div>
        `;
        
        container.appendChild(card);
    }
}

// Вспомогательная функция для получения содержимого тега
function getTagContent(parent, tagName) {
    const element = parent.getElementsByTagName(tagName)[0];
    return element ? element.textContent : '';
}

// Функция для показа детального рецепта (можно открывать в модальном окне)
function showRecipeDetails(recipeId) {
    // Загружаем XML снова или ищем в уже загруженных данных
    // Здесь можно открыть модальное окно с полным рецептом
    alert('Здесь будет полный рецепт с ингредиентами и инструкцией. ID: ' + recipeId);
    // В реальном проекте здесь можно загрузить recipe.html?id=recipeId
}

// Настройка фильтров
function setupFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            const filterValue = this.dataset.filter;
            filterRecipes(filterValue);
        });
    });
}

// Фильтрация рецептов по категории
function filterRecipes(category) {
    const cards = document.querySelectorAll('.recipe-card');
    
    cards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'block'; // Показываем
        } else {
            card.style.display = 'none'; // Скрываем
        }
    });
}