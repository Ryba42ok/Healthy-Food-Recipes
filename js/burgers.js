   document.addEventListener('DOMContentLoaded', function() {
        const burger = document.getElementById('burgerBtn');
        const mobileMenu = document.getElementById('mobileMenu');
        
        // Бургер меню
        if (burger && mobileMenu) {
            burger.addEventListener('click', function(e) {
                e.stopPropagation();
                this.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                console.log('Burger clicked'); // Для отладки
            });
        }
        
        // Выпадающее меню в мобильной версии
        const mobileDropdownToggle = document.querySelector('.mobile-dropdown__toggle');
        const mobileDropdownMenu = document.querySelector('.mobile-dropdown__menu');
        
        if (mobileDropdownToggle && mobileDropdownMenu) {
            mobileDropdownToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                this.classList.toggle('active');
                mobileDropdownMenu.classList.toggle('active');
                console.log('Dropdown clicked'); // Для отладки
            });
        }
        
        // Закрытие мобильного меню при клике на ссылку
        const mobileLinks = document.querySelectorAll('.mobile-nav-list__link:not(.mobile-dropdown__toggle), .mobile-dropdown__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                burger.classList.remove('active');
                mobileMenu.classList.remove('active');
                
                // Закрываем выпадающее меню
                if (mobileDropdownToggle) {
                    mobileDropdownToggle.classList.remove('active');
                }
                if (mobileDropdownMenu) {
                    mobileDropdownMenu.classList.remove('active');
                }
            });
        });
        
        // Закрытие меню при клике вне области
        document.addEventListener('click', function(e) {
            if (burger && mobileMenu) {
                if (!burger.contains(e.target) && !mobileMenu.contains(e.target)) {
                    burger.classList.remove('active');
                    mobileMenu.classList.remove('active');
                    
                    if (mobileDropdownToggle) {
                        mobileDropdownToggle.classList.remove('active');
                    }
                    if (mobileDropdownMenu) {
                        mobileDropdownMenu.classList.remove('active');
                    }
                }
            }
        });
        
        // Предотвращаем закрытие при клике на выпадающее меню
        if (mobileDropdownMenu) {
            mobileDropdownMenu.addEventListener('click', function(e) {
                e.stopPropagation();
            });
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const mobileSearch = document.getElementById('mobileSearch');
    const burgerBtn = document.getElementById('burgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    // Открыть поиск на мобильных устройствах
    searchToggle.addEventListener('click', () => {
        mobileSearch.classList.add('mobile-search--active');
        // Закрываем меню, если оно открыто
        mobileMenu.classList.remove('mobile-menu--active');
        burgerBtn.classList.remove('header__burger--active');
    });

    // Закрыть поиск
    searchClose.addEventListener('click', () => {
        mobileSearch.classList.remove('mobile-search--active');
    });

    // Закрывать поиск при клике вне его области (опционально)
    window.addEventListener('click', (e) => {
        if (e.target === mobileSearch) {
            mobileSearch.classList.remove('mobile-search--active');
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const searchToggle = document.getElementById('searchToggle');
    const searchClose = document.getElementById('searchClose');
    const mobileSearch = document.getElementById('mobileSearch');

    if (searchToggle) {
        searchToggle.addEventListener('click', () => {
            mobileSearch.classList.add('mobile-search--active');
            // Если открыто меню бургера — закрываем его при поиске
            document.getElementById('mobileMenu').classList.remove('mobile-menu--active');
        });
    }

    if (searchClose) {
        searchClose.addEventListener('click', () => {
            mobileSearch.classList.remove('mobile-search--active');
        });
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const dropdown = document.querySelector('.dropdown');
    const toggle = document.querySelector('.dropdown__toggle');

    if (toggle) {
        toggle.addEventListener('click', function (e) {
            // Если ширина экрана 1024px и меньше (планшеты/телефоны)
            if (window.innerWidth <= 1024) {
                e.preventDefault(); // Запрещаем переход по ссылке catalog.html
                dropdown.classList.toggle('is-active'); // Открываем/закрываем меню
            }
        });
    }

    // Закрываем меню, если пользователь кликнул в другом месте экрана
    document.addEventListener('click', (e) => {
        if (dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.remove('is-active');
        }
    });
});