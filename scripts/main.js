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

    // --- Estados que dependen del scroll ---
    // Un solo listener para las dos cosas que reaccionan al scroll: el botón
    // "subir" y el nav flotante. El evento se dispara decenas de veces por
    // segundo, así que se agrupa con requestAnimationFrame: por más eventos que
    // lleguen, los estilos se recalculan una vez por cuadro.
    const btnSubir = document.getElementById('btnSubir');
    const navShell = document.querySelector('.nav-shell');
    let cuadroPedido = false;

    const alScrollear = () => {
        const y = window.scrollY;

        if (btnSubir) {
            // Si el usuario bajó más de 300 píxeles, mostramos el botón
            if (y > 300) {
                btnSubir.classList.remove('opacity-0', 'pointer-events-none');
                btnSubir.classList.add('opacity-100');
            } else {
                // Si está arriba, lo ocultamos
                btnSubir.classList.add('opacity-0', 'pointer-events-none');
                btnSubir.classList.remove('opacity-100');
            }
        }

        // Sobre el hero el nav queda sólido y a todo lo ancho; al bajar se
        // convierte en píldora flotante. El cambio visual lo hace el CSS.
        if (navShell) navShell.classList.toggle('nav-floating', y > 60);

        cuadroPedido = false;
    };

    window.addEventListener('scroll', () => {
        if (!cuadroPedido) {
            cuadroPedido = true;
            requestAnimationFrame(alScrollear);
        }
    }, { passive: true });   // passive: le avisa al navegador que no vamos a
                             // cancelar el evento, y no frena el scroll

    // Estado inicial: la página puede cargar ya scrolleada, sea por un ancla en
    // la URL o porque el navegador restauró la posición al volver atrás.
    alScrollear();

    if (btnSubir) {
        // El scroll sigue siendo suave porque lo define html { scroll-behavior: smooth }.
        btnSubir.addEventListener('click', () => window.scrollTo(0, 0));
    }

    // --- Navegación por anclas del nav, manejada a mano ---
    //
    // Antes esto dependía del comportamiento nativo: scroll-behavior: smooth más
    // scroll-padding-top en <html>. El problema es que durante esa animación el
    // navegador puede reajustar la posición por su cuenta (scroll anchoring), y la
    // página termina asentándose unos píxeles más allá del destino, con el nav
    // quedando en estado flotante estando arriba de todo.
    //
    // Acá el destino se calcula UNA vez, se hace un solo scroll y se corrige al
    // final. Así el resultado no depende de lo que pase durante el viaje.
    //
    // Las clases scroll-pt-[100px] md:scroll-pt-[120px] del <html> se dejan como
    // red de resguardo: cubren el caso de entrar al sitio con un ancla en la URL,
    // donde no hay click que interceptar.

    const OFFSET_MOVIL = 100;       // = scroll-pt-[100px]
    const OFFSET_ESCRITORIO = 120;  // = md:scroll-pt-[120px]

    const destinoDe = (id) => {
        // "Inicio" es siempre el tope absoluto. La sección arranca pegada al nav,
        // así que restarle el offset daría un número negativo y quedaría en 0 igual,
        // pero dejarlo explícito evita depender de ese redondeo.
        if (id === '#inicio') return 0;
        const el = document.querySelector(id);
        if (!el) return null;
        const offset = window.innerWidth >= 768 ? OFFSET_ESCRITORIO : OFFSET_MOVIL;
        return Math.max(0, Math.round(el.getBoundingClientRect().top + window.scrollY - offset));
    };

    // Un solo selector cubre los tres casos: los links de escritorio, los del menú
    // móvil y el del logo, que también apunta a #inicio.
    document.querySelectorAll('.nav-shell a[href^="#"]').forEach((enlace) => {
        enlace.addEventListener('click', (e) => {
            const id = enlace.getAttribute('href');
            const destinoEl = document.querySelector(id);
            if (!destinoEl) return;        // ancla rota: que el navegador haga lo suyo
            e.preventDefault();

            const target = destinoDe(id);
            window.scrollTo({ top: target, behavior: 'smooth' });

            // pushState y no location.hash: asignar el hash dispararía un segundo
            // scroll nativo compitiendo con el que acabamos de lanzar.
            history.pushState(null, '', id);

            // El foco tiene que seguir al scroll para quien navega con teclado o
            // lector de pantalla. preventScroll evita que enfocar mueva la página.
            if (!destinoEl.hasAttribute('tabindex')) destinoEl.setAttribute('tabindex', '-1');
            destinoEl.focus({ preventScroll: true });

            // --- Corrección final, una vez que el scroll se asentó ---
            //
            // OJO con el temporizador de respaldo: tiene que ser MÁS largo que la
            // animación de scroll. Con 700ms saltaba en pleno viaje, veía que
            // faltaban 260px para el destino, lo interpretaba como "el usuario tomó
            // el control" y se saltaba la corrección. La sección terminaba
            // aterrizando con hasta 20px de desvío.
            let resuelto = false;
            let temporizador = null;
            const EVENTOS_USUARIO = ['wheel', 'touchstart', 'keydown'];

            const limpiar = () => {
                clearTimeout(temporizador);
                window.removeEventListener('scrollend', asentar);
                EVENTOS_USUARIO.forEach((ev) => window.removeEventListener(ev, cancelar));
            };
            const cancelar = () => { resuelto = true; limpiar(); };

            function asentar() {
                if (resuelto) return;
                resuelto = true;
                limpiar();
                // El destino se recalcula en vez de reusar el de hace medio segundo:
                // mientras duró la animación pueden haber terminado de cargar
                // imágenes y la sección ya no está donde estaba.
                const objetivo = destinoDe(id) ?? target;
                // Solo corrige desvíos chicos. Si la distancia es grande, el usuario
                // tomó el control y devolverlo al destino sería pelearle.
                if (Math.abs(window.scrollY - objetivo) <= 150) {
                    window.scrollTo({ top: objetivo, behavior: 'instant' });
                }
                // Recién ahora se recalcula el estado del nav, con el scroll quieto.
                alScrollear();
            }

            // Vigila hasta que el scroll deje de moverse. Es el camino para los
            // navegadores sin scrollend, y evita el problema del temporizador fijo:
            // no adivina cuánto dura la animación, mira si todavía se está moviendo.
            const vigilarQuietud = () => {
                if (resuelto) return;
                const y = window.scrollY;
                quietos = Math.abs(y - ultimaY) < 1 ? quietos + 1 : 0;
                ultimaY = y;
                if (quietos >= 3) return asentar();
                requestAnimationFrame(vigilarQuietud);
            };
            let ultimaY = window.scrollY, quietos = 0;

            if (Math.abs(window.scrollY - target) < 2) {
                // Ya estábamos en el destino: no va a haber scroll ni scrollend.
                asentar();
            } else {
                if ('onscrollend' in window) {
                    window.addEventListener('scrollend', asentar, { once: true });
                } else {
                    requestAnimationFrame(vigilarQuietud);
                }
                // Tope duro por si scrollend nunca llega. Holgado a propósito.
                temporizador = setTimeout(asentar, 2500);
                EVENTOS_USUARIO.forEach((ev) =>
                    window.addEventListener(ev, cancelar, { once: true, passive: true }));
            }
        });
    });

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
