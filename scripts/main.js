// Interacciones visuales de Maggie Nails: revelado al scroll, contadores animados y lightbox de galería.
// No contiene lógica del sistema de reservas (eso vive intacto en index.html).

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
});
