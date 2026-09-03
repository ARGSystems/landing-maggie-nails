// Todas las interacciones de Maggie Nails: carrusel, revelado al scroll, contadores
// animados, lightbox, menú móvil, botón "subir" y el aviso del newsletter.
//
// No contiene lógica del sistema de reservas: los botones de turno son enlaces
// directos a WhatsApp en index.html y no pasan por acá.
//
// El menú móvil y el botón "subir" estaban en dos <script> inline dentro de
// index.html. Se movieron acá porque la Content-Security-Policy declara
// script-src 'self' y bloquea todo lo inline. El comportamiento es el mismo.

document.addEventListener('DOMContentLoaded', () => {

    // --- Carrusel de la galería (Swiper) ---
    // Se inicializa antes del binding del lightbox para que también
    // capture los slides clonados que genera el modo loop.
    if (typeof Swiper !== 'undefined' && document.querySelector('.gallery-swiper')) {
        new Swiper('.gallery-swiper', {
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            centeredSlides: true,
            // Touch/swipe siempre fluido, incluso si el usuario arranca el gesto sobre un botón o texto
            touchRatio: 1,
            followFinger: true,
            grabCursor: true,
            spaceBetween: 16,
            slidesPerView: 1,
            pagination: {
                el: '.gallery-swiper .swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.gallery-swiper .swiper-button-next',
                prevEl: '.gallery-swiper .swiper-button-prev',
            },
            breakpoints: {
                // Móvil: exactamente 1 imagen completa centrada
                0: { slidesPerView: 1, spaceBetween: 16, centeredSlides: true },
                640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
                1024: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
            },
        });
    }

    // --- Revelado suave al hacer scroll ---
    const revealEls = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealEls.length) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        revealEls.forEach((el) => revealObserver.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    // --- Contadores animados (años, clientas, diseños...) ---
    const counters = document.querySelectorAll('[data-counter]');
    if ('IntersectionObserver' in window && counters.length) {
        const countObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const target = parseInt(el.dataset.counter, 10) || 0;
                const duration = 1600;
                const start = performance.now();

                function step(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.floor(eased * target).toLocaleString('es-AR');
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        el.textContent = target.toLocaleString('es-AR');
                    }
                }
                requestAnimationFrame(step);
                countObserver.unobserve(el);
            });
        }, { threshold: 0.4 });

        counters.forEach((el) => countObserver.observe(el));
    }

    // --- Lightbox de la galería ---
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const galleryImgs = document.querySelectorAll('[data-lightbox]');

    if (lightbox && lightboxImg && galleryImgs.length) {
        const openLightbox = (img) => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.remove('hidden');
            document.body.classList.add('overflow-hidden');
        };
        const closeLightbox = () => {
            lightbox.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        galleryImgs.forEach((img) => {
            img.addEventListener('click', () => openLightbox(img));
        });
        if (lightboxClose) {
            lightboxClose.addEventListener('click', closeLightbox);
        }
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeLightbox();
        });
    }

    // --- Botón "subir": aparece al bajar y vuelve arriba al tocarlo ---
    const btnSubir = document.getElementById('btnSubir');
    if (btnSubir) {
        window.addEventListener('scroll', () => {
            // Si el usuario bajó más de 300 píxeles, mostramos el botón
            if (window.scrollY > 300) {
                btnSubir.classList.remove('opacity-0', 'pointer-events-none');
                btnSubir.classList.add('opacity-100');
            } else {
                // Si está arriba, lo ocultamos
                btnSubir.classList.add('opacity-0', 'pointer-events-none');
                btnSubir.classList.remove('opacity-100');
            }
        });
        // El scroll sigue siendo suave porque lo define html { scroll-behavior: smooth }.
        btnSubir.addEventListener('click', () => window.scrollTo(0, 0));
    }

    // --- Menú desplegable móvil ---
    const btnMenu = document.getElementById('btnMenu');
    const menuMovil = document.getElementById('menuMovil');
    const opcionesMenu = document.querySelectorAll('.menu-item');

    if (btnMenu && menuMovil) {
        // Abre y cierra el menú al tocar la hamburguesa (con animación suave vía CSS)
        btnMenu.addEventListener('click', () => {
            const abierto = menuMovil.classList.toggle('menu-open');
            btnMenu.setAttribute('aria-expanded', abierto);
        });

        // Cierra el menú automáticamente cuando el usuario elige una opción
        opcionesMenu.forEach(opcion => {
            opcion.addEventListener('click', () => {
                menuMovil.classList.remove('menu-open');
                btnMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- Newsletter: no hay backend detrás, así que se dice ---
    // El formulario quedó en el diseño del footer, pero no manda el correo a
    // ningún lado. En vez de tragarse el envío en silencio, muestra un aviso
    // que aclara que no se guardó nada.
    const formNewsletter = document.getElementById('formNewsletter');
    const avisoNewsletter = document.getElementById('avisoNewsletter');
    if (formNewsletter && avisoNewsletter) {
        formNewsletter.addEventListener('submit', (e) => {
            e.preventDefault();
            formNewsletter.classList.add('hidden');
            avisoNewsletter.classList.remove('hidden');
        });
    }
});
