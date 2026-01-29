    document.addEventListener('DOMContentLoaded', () => {
//  Хедер при скролле 
    (function headerScroll() {
        const header = document.querySelector('header');
        if (!header) return;
        let prevY = window.scrollY;
        header.style.transform = 'translateY(0)';
        window.addEventListener('scroll', () => {
        const y = window.scrollY;
        if (y === 0) {
        header.style.transform = 'translateY(0)';
        } else if (y > prevY) {
        header.style.transform = 'translateY(-100%)';
        } else {
        header.style.transform = 'translateY(0)';
        }
        prevY = y;
        });
    })();

//  Бургер + мобильное меню по клику
    (function mobileMenu() {
        const burger = document.getElementById('hamburger');
        const menu   = document.getElementById('menu');
        if (!burger || !menu) return;
        burger.addEventListener('click', () => {
        if (window.innerWidth <= 767) {
        menu.classList.toggle('open');
        burger.classList.toggle('active');
        }
    });

// Закрыть при ресайзе на десктоп
    window.addEventListener('resize', () => {
        if (window.innerWidth > 767) {
        menu.classList.remove('open');
        burger.classList.remove('active');
        document.querySelectorAll('#menu li.has-submenu.submenu-open')
            .forEach(li => li.classList.remove('submenu-open'));
        }
    });

// Клик вне меню — закрыть (мобилка)
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 767) {
        const inside = e.target.closest('nav') || e.target.closest('#hamburger');
        if (!inside) {
        menu.classList.remove('open');
        burger.classList.remove('active');
        document.querySelectorAll('#menu li.has-submenu.submenu-open')
            .forEach(li => li.classList.remove('submenu-open'));
        }
        }
    });
    })();

//  Подменю (мобилка) — аккордеон внутри #menu
    (function mobileSubmenus() {
        const links = document.querySelectorAll('#menu li.has-submenu > a');
        if (!links.length) return;
        links.forEach(link => {
        link.addEventListener('click', (e) => {
        if (window.innerWidth <= 767) {
        e.preventDefault();
        const li = link.closest('li.has-submenu');
        if (!li) return;
        const isOpen = li.classList.contains('submenu-open');
        // Закрываем все прочие
        document.querySelectorAll('#menu li.has-submenu.submenu-open')
            .forEach(openLi => { if (openLi !== li) openLi.classList.remove('submenu-open'); });
        li.classList.toggle('submenu-open', !isOpen);
        }
        });
        });
    })();

//  Скрытие меню после выбора > Для пунктов без подменю
    const normalLinks = document.querySelectorAll('#menu li:not(.has-submenu) > a');
    normalLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 767) {
        document.getElementById('menu').classList.remove('open');
        document.getElementById('hamburger').classList.remove('active');
        document.querySelectorAll('#menu li.has-submenu.submenu-open')
            .forEach(li => li.classList.remove('submenu-open'));
        }
    });
    });

//  Скрытие меню после выбора > Для пунктов внутри подменю
    const submenuLinks = document.querySelectorAll('#menu li.has-submenu .submenu li a');
        submenuLinks.forEach(a => {
            a.addEventListener('click', () => {
            if (window.innerWidth <= 767) {
                document.getElementById('menu').classList.remove('open');
                document.getElementById('hamburger').classList.remove('active');
                document.querySelectorAll('#menu li.has-submenu.submenu-open')
                    .forEach(li => li.classList.remove('submenu-open'));
            }
        });
    });

//  Табы "Активные / Завершённые" в блоке .hangers
    (function hangersTabs() {
        const hangers = document.querySelector('#hangers');
        if (!hangers) return;

    const tabsControl = hangers.querySelector('.tabs-control');
    const buttons = tabsControl?.querySelectorAll('.tab-button');
    const panels = hangers.querySelectorAll('.tab-panel');
    if (!tabsControl || !buttons?.length || !panels.length) return; 
    
    buttons.forEach(button => {
        button.addEventListener('click', () => {
            const target = button.dataset.tab; //active или completed
            if (!target) return;

            // переключаем состояние кнопок
            buttons.forEach(btn => {
                const isCurrent = btn === button;
                btn.classList.toggle('is-active', isCurrent);
                btn.setAttribute('aria-selected', String(isCurrent));
            });
        
            // показываем нужную панель
            panels.forEach(panel => {
                const shouldShow =
                    (target === 'active' && panel.id === 'tab-active') ||
                    (target === 'completed' && panel.id === 'tab-completed');

                panel.hidden = !shouldShow;
                panel.classList.toggle('is-active', shouldShow);
            });
        });
    });
    })();

//  Аккордеон внутри .hangers-card
    (function hangersCardAccordion() {
        const cards = document.querySelectorAll('.hangers-card');
        if (!cards.length) return;

        cards.forEach(card => {
            const textInfo = card.querySelector('.text-info');
            const btnLink = card.querySelector('.btn-link');
                if (!textInfo || !btnLink) return;

            const toggle = () => {
                const isExpanded = textInfo.classList.contains('is-expanded');
                    
                if (isExpanded) {
                    textInfo.classList.remove('is-expanded');
                    textInfo.style.maxHeight = '0px';
            } else {
                cards.forEach(otherCard => {
                    const otherTextInfo = otherCard.querySelector('.text-info');
                    if (otherTextInfo && otherTextInfo !== textInfo) {
                        otherTextInfo.classList.remove('is-expanded');
                        otherTextInfo.style.maxHeight = '0px';
                    }
                });

                textInfo.classList.add('is-expanded');
                requestAnimationFrame(() => {
                    textInfo.style.maxHeight = textInfo.scrollHeight + 'px';
                });
            }
        };

        //клик для раскрытия
        btnLink.addEventListener('click', (e) => {
            e.preventDefault(); //чтобы a href не скроллил наверх
            toggle();
            });
        });
    })(); 

//  Акордеон для wd-key-info —— только один открыт
    (function wdkeyinfoAccordeon() {
        const items = document.querySelectorAll('.work-direction-item-first, .work-direction-item');
        if (!items.length) return;

        items.forEach(item => {
            item.addEventListener('click', (e) => {
            const header = e.target.closest('.content-wrapper');
            if (!header || !item.contains(header)) return;

            const alreadyOpen = item.classList.contains('pressed');

            // закрыть все открытые
            document.querySelectorAll('.work-direction-item-first.pressed, .work-direction-item.pressed')
            .forEach(opened => opened.classList.remove('pressed'));

            // открыть текущий, если он был закрыт
            if (!alreadyOpen) item.classList.add('pressed');

            // предотвращаем дальнейшую обработку (если у вас ещё какие-то слушатели)
            e.stopPropagation();
            });
        });
    })();

//  Попап cookie
    (function cookiePopup() {
        const popup = document.getElementById('cookie-popup');
        const btn = document.getElementById('cookie-accept-btn');
        if (!popup || !btn) return;
        const ok = localStorage.getItem('cookieAccepted') === 'true';
        popup.style.display = ok ? 'none' : 'flex';
        btn.addEventListener('click', () => {
        localStorage.setItem('cookieAccepted', 'true');
        popup.style.display = 'none';
        });
    })();

//  Переключение фото по клику
    (function teamImageToggle() {
        const secondary = document.querySelector('.team .inner .secondary-info');
        if (!secondary) return;

        const mainImg = secondary.querySelector('.main-img');
        const ident = secondary.querySelector('.ident');
        if (!mainImg || !ident) return;

        // путь к двум изображениям 
        const defaultSrc = '/img/team/all-team-photo-default.jpg';
        const activeSrc = '/img/team/all-team-photo-active-mono.jpg';

        secondary.addEventListener('click', () => {
            const isActive = secondary.classList.toggle('active');

            // меняем src изображения
            mainImg.src = isActive ? activeSrc : defaultSrc;
            
            // птичка с анимацией
            if (isActive) {
                ident.style.display = 'block';
                requestAnimationFrame(() => {
                    ident.style.opacity = '1';
                    ident.style.transform = 'translateY(0)';
                });
            } else {
                ident.style.opacity = '0';
                ident.style.transform = 'translateY(8px)'; 
                setTimeout(() => {
                    ident.style.display = 'none';
                }, 500); //столько же, сколько в transition
            }
        });
    })();
});