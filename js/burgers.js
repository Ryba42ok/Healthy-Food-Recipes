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
