 document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        window.location.href = '../catalog.html'; 
        return;
    }

    fetch('../data/recipes.xml') 
        .then(res => {
            if (!res.ok) throw new Error('Ошибка загрузки XML');
            return res.text();
        })
        .then(xmlData => {
            const parser = new DOMParser();
            const xml = parser.parseFromString(xmlData, "text/xml");
            // Ищем конкретный рецепт по ID
            const recipe = xml.querySelector(`recipe[id="${recipeId}"]`);

            if (recipe) {
                renderRecipe(recipe);
            } else {
                document.getElementById('recipeTitle').textContent = "Рецепт не найден";
            }
        })
        .catch(err => console.error('Ошибка:', err));

    function renderRecipe(recipe) {
        // 1. Основная информация
        document.getElementById('recipeTitle').textContent = recipe.querySelector('title').textContent;
        document.getElementById('recipeDesc').textContent = recipe.querySelector('description').textContent;
        document.getElementById('categoryBadge').textContent = recipe.querySelector('category').textContent;
        
        // Картинка (поднимаемся выше в корень и идем в папку data)
        const imageFile = recipe.querySelector('image').textContent;
        document.getElementById('mainImage').src = '../data/' + imageFile;

        // 2. Статистика (внутри <stats>)
        const stats = recipe.querySelector('stats');
        document.getElementById('statTime').textContent = stats.querySelector('prepTime').textContent;
        document.getElementById('statServings').textContent = stats.querySelector('servings').textContent;
        document.getElementById('statCalories').textContent = stats.querySelector('calories').textContent;
        document.getElementById('statDifficulty').textContent = stats.querySelector('difficulty').textContent;

        // 3. Пищевая ценность (внутри <nutrition>)
        const nutr = recipe.querySelector('nutrition');
        document.getElementById('nutrProtein').textContent = nutr.querySelector('protein').textContent + 'г';
        document.getElementById('nutrCarbs').textContent = nutr.querySelector('carbs').textContent + 'г';
        document.getElementById('nutrFat').textContent = nutr.querySelector('fat').textContent + 'г';
        document.getElementById('nutrFiber').textContent = nutr.querySelector('fiber').textContent + 'г';

        // 4. Список ингредиентов
        const ingredientsList = document.getElementById('ingredientsList');
        recipe.querySelectorAll('ingredients item').forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.textContent;
            ingredientsList.appendChild(li);
        });

        // 5. Инструкции по приготовлению
        const instructionsList = document.getElementById('instructionsList');
        recipe.querySelectorAll('instructions step').forEach((step, index) => {
            const stepDiv = document.createElement('div');
            stepDiv.className = 'step-item';
            stepDiv.innerHTML = `
                <div class="step-number">${index + 1}</div>
                <div class="step-text">${step.textContent}</div>
            `;
            instructionsList.appendChild(stepDiv);
        });
        
        // Меняем title вкладки браузера
        document.title = recipe.querySelector('title').textContent + " — Здоровое Питание";
    
    
    
    }



    
});