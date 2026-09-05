// =============================================================================
// Maggie Nails — interacciones de la página
// =============================================================================
//
// Un único archivo para todo lo que reacciona al usuario: carrusel de la
// galería, revelado al hacer scroll, contadores animados, lightbox, estados que
// dependen del scroll (botón "subir" y nav flotante), alternar claro y oscuro,
// menú móvil y el aviso del newsletter.
//
// Por qué todo acá y nada inline en el HTML: la Content-Security-Policy del
// sitio declara script-src 'self', que bloquea tanto los <script> inline como
// los atributos onclick. El menú móvil y el botón "subir" vivían inline y se
// movieron acá sin cambiarles el comportamiento.
//
// Qué NO está en este archivo:
//   - La resolución inicial del tema, que corre antes del primer pintado y
//     tiene su propio archivo bloqueante (scripts/tema.js).
//   - Los turnos: los botones "Reservar" son enlaces directos a WhatsApp
//     escritos en index.html y no pasan por JavaScript.
//
// El código está en español, igual que el resto del proyecto. Quedan en inglés
// los nombres que vienen de afuera y no son nuestros: los IDs y las clases del
// HTML, los data-* y el término "lightbox", que es el nombre del patrón de
// interfaz y no una variable.

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // Utilidades compartidas
    // =========================================================================

    /**
     * Ejecuta una acción la primera vez que cada elemento entra en pantalla y
     * después deja de observarlo. Los dos efectos que la usan (revelado y
     * contadores) son de una sola vez: no deben repetirse al volver a subir.
     *
     * @param {ArrayLike<Element>} elementos Elementos a vigilar.
     * @param {IntersectionObserverInit} opciones Umbral y márgenes del observer.
     * @param {(elemento: Element) => void} alEntrar Qué hacer con cada uno.
     * @returns {boolean} false si no hay soporte o no hay nada que observar,
     *   para que quien llama pueda aplicar un plan B.
     */
    const observarUnaVez = (elementos, opciones, alEntrar) => {
        if (!('IntersectionObserver' in window) || !elementos.length) return false;

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach((entrada) => {
                if (!entrada.isIntersecting) return;
                observador.unobserve(entrada.target);
                alEntrar(entrada.target);
            });
        }, opciones);

        elementos.forEach((elemento) => observador.observe(elemento));
        return true;
    };

    // =========================================================================
    // Carrusel de la galería (Swiper)
    // =========================================================================
    // Se inicializa antes de enganchar el lightbox para que ese binding también
    // alcance a los slides clonados que genera el modo loop.

    if (typeof Swiper !== 'undefined' && document.querySelector('.gallery-swiper')) {
        new Swiper('.gallery-swiper', {
            loop: true,
            autoplay: { delay: 3000, disableOnInteraction: false },
            centeredSlides: true,
            // Touch/swipe siempre fluido, incluso si el usuario arranca el gesto
            // sobre un botón o un texto.
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
                // Móvil: exactamente una imagen completa y centrada.
                0: { slidesPerView: 1, spaceBetween: 16, centeredSlides: true },
                640: { slidesPerView: 2, spaceBetween: 20, centeredSlides: false },
                1024: { slidesPerView: 3, spaceBetween: 20, centeredSlides: false },
            },
        });
    }

    // =========================================================================
    // Revelado suave al hacer scroll
    // =========================================================================
    // El desplazamiento y el fundido los define .reveal en el CSS. Acá solo se
    // agrega .is-visible cuando el elemento aparece.

    const elementosRevelables = document.querySelectorAll('.reveal');

    const hayObservadorDeRevelado = observarUnaVez(
        elementosRevelables,
        // rootMargin -50px abajo: el elemento tiene que entrar un poco de
        // verdad, no dispararse apenas asoma el primer píxel.
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' },
        (elemento) => elemento.classList.add('is-visible'),
    );

    // Sin IntersectionObserver se muestra todo de una: vale más ver la página
    // completa sin animación que dejar media página sin aparecer nunca.
    if (!hayObservadorDeRevelado) {
        elementosRevelables.forEach((elemento) => elemento.classList.add('is-visible'));
    }

    // =========================================================================
    // Contadores animados (años, clientas, diseños...)
    // =========================================================================

    /**
     * Anima un número desde 0 hasta el valor de su atributo data-counter.
     *
     * @param {HTMLElement} elemento Nodo con el atributo data-counter.
     * @returns {void}
     */
    const animarContador = (elemento) => {
        const objetivo = parseInt(elemento.dataset.counter, 10) || 0;
        const duracion = 1600;
        const inicio = performance.now();

        const paso = (ahora) => {
            const avance = Math.min((ahora - inicio) / duracion, 1);
            // Ease-out cúbica: arranca rápido y frena al final, que es como se
            // lee natural un número subiendo.
            const suavizado = 1 - Math.pow(1 - avance, 3);
            elemento.textContent = Math.floor(suavizado * objetivo).toLocaleString('es-AR');

            if (avance < 1) {
                requestAnimationFrame(paso);
            } else {
                // Último cuadro exacto: el Math.floor de arriba puede dejar 499
                // cuando el objetivo era 500.
                elemento.textContent = objetivo.toLocaleString('es-AR');
            }
        };

        requestAnimationFrame(paso);
    };

    observarUnaVez(
        document.querySelectorAll('[data-counter]'),
        { threshold: 0.4 },
        animarContador,
    );

    // =========================================================================
    // Lightbox de la galería
    // =========================================================================

    const lightbox = document.getElementById('lightbox');
    const lightboxImagen = document.getElementById('lightboxImg');
    const lightboxCerrar = document.getElementById('lightboxClose');
    const imagenesGaleria = document.querySelectorAll('[data-lightbox]');

    if (lightbox && lightboxImagen && imagenesGaleria.length) {
        /**
         * Abre el visor con la foto que se tocó.
         *
         * @param {HTMLImageElement} imagen Miniatura de la galería.
         * @returns {void}
         */
        const abrirLightbox = (imagen) => {
            lightboxImagen.src = imagen.src;
            lightboxImagen.alt = imagen.alt;
            lightbox.classList.remove('hidden');
            // Bloquea el scroll del fondo: sin esto la página se sigue moviendo
            // detrás del visor.
            document.body.classList.add('overflow-hidden');
        };

        /**
         * Cierra el visor y le devuelve el scroll a la página.
         *
         * @returns {void}
         */
        const cerrarLightbox = () => {
            lightbox.classList.add('hidden');
            document.body.classList.remove('overflow-hidden');
        };

        imagenesGaleria.forEach((imagen) => {
            imagen.addEventListener('click', () => abrirLightbox(imagen));
        });

        if (lightboxCerrar) {
            lightboxCerrar.addEventListener('click', cerrarLightbox);
        }

        // Solo el fondo cierra: si el click nació en la imagen, e.target es la
        // imagen y no el contenedor.
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) cerrarLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') cerrarLightbox();
        });
    }

    // =========================================================================
    // Estados que dependen del scroll
    // =========================================================================
    // Dos cosas miran la posición del scroll: el botón "subir" y el nav. Se
    // resuelven con UN solo listener agrupado con requestAnimationFrame. El
    // evento se dispara decenas de veces por segundo, así que de esta forma los
    // estilos se recalculan una vez por cuadro y no una vez por evento.

    const btnSubir = document.getElementById('btnSubir');
    const navShell = document.querySelector('.nav-shell');

    /**
     * Muestra el botón "subir" solo cuando ya se bajó lo suficiente como para
     * que volver arriba sea un viaje.
     *
     * @param {number} y Posición vertical del scroll, en píxeles.
     * @returns {void}
     */
    const actualizarBotonSubir = (y) => {
        if (!btnSubir) return;
        // Ojo con los nombres acá adentro: el escaner de Tailwind lee este
        // archivo como texto plano, sin entender que es JavaScript, y cualquier
        // palabra que coincida con una utilidad suya termina generando una regla
        // CSS que nadie usa. Por eso la variable no se llama como la utilidad de
        // visibilidad de Tailwind.
        const seVe = y > 300;
        btnSubir.classList.toggle('opacity-0', !seVe);
        btnSubir.classList.toggle('pointer-events-none', !seVe);
        btnSubir.classList.toggle('opacity-100', seVe);
    };

    /**
     * Sobre el hero el nav queda sólido y a todo lo ancho; al bajar se convierte
     * en píldora flotante. Acá solo se prende la clase: el cambio visual y su
     * transición los define .nav-floating en el CSS.
     *
     * @param {number} y Posición vertical del scroll, en píxeles.
     * @returns {void}
     */
    const actualizarNav = (y) => {
        if (navShell) navShell.classList.toggle('nav-floating', y > 60);
    };

    let cuadroPedido = false;

    /**
     * Recalcula de una sola vez todo lo que depende del scroll. La llama el
     * requestAnimationFrame, no el listener directamente.
     *
     * @returns {void}
     */
    const alScrollear = () => {
        const y = window.scrollY;
        actualizarBotonSubir(y);
        actualizarNav(y);
        cuadroPedido = false;
    };

    window.addEventListener('scroll', () => {
        if (cuadroPedido) return;
        cuadroPedido = true;
        requestAnimationFrame(alScrollear);
    }, { passive: true });   // passive: le avisa al navegador que no vamos a
                             // cancelar el evento, y así no frena el scroll.

    // Estado inicial: la página puede cargar ya scrolleada, sea por un ancla en
    // la URL o porque el navegador restauró la posición al volver atrás.
    alScrollear();

    if (btnSubir) {
        // El scroll sigue siendo suave porque lo define la clase scroll-smooth
        // del <html>, no este scrollTo.
        btnSubir.addEventListener('click', () => window.scrollTo(0, 0));
    }

    // =========================================================================
    // Alternar claro / oscuro
    // =========================================================================
    // La resolución inicial ya la hizo scripts/tema.js en el <head>. Acá solo se
    // maneja el click y se mantiene sincronizada la etiqueta del botón.

    const btnTema = document.getElementById('btnTema');
    const CLAVE_TEMA = 'maggie-tema';   // misma clave que usa scripts/tema.js

    /**
     * Lee el tema guardado sin romperse si el navegador no deja.
     *
     * @returns {string|null} 'oscuro', 'claro', o null si nunca se eligió a mano.
     */
    const leerTemaGuardado = () => {
        // localStorage no solo puede devolver null: puede LANZAR excepción en
        // navegación privada o con las cookies de sitio bloqueadas.
        try {
            return localStorage.getItem(CLAVE_TEMA);
        } catch (e) {
            return null;
        }
    };

    /**
     * Guarda la elección del usuario. Si el navegador no deja escribir, el tema
     * igual funciona en esta sesión: solo no se recuerda al recargar.
     *
     * @param {boolean} oscuro true si quedó activo el modo oscuro.
     * @returns {void}
     */
    const guardarTema = (oscuro) => {
        try {
            localStorage.setItem(CLAVE_TEMA, oscuro ? 'oscuro' : 'claro');
        } catch (e) {
            /* sin persistencia, pero el sitio sigue andando igual */
        }
    };

    /**
     * Pone en el botón la etiqueta que lee un lector de pantalla. Describe la
     * ACCIÓN y no el estado, porque un <button> con solo un ícono adentro no
     * dice nada por sí mismo.
     *
     * @returns {void}
     */
    const sincronizarBotonTema = () => {
        const oscuro = document.documentElement.classList.contains('dark');
        btnTema.setAttribute('aria-label', oscuro ? 'Activar modo claro' : 'Activar modo oscuro');
    };

    if (btnTema) {
        sincronizarBotonTema();

        btnTema.addEventListener('click', () => {
            const oscuro = document.documentElement.classList.toggle('dark');
            guardarTema(oscuro);
            sincronizarBotonTema();
        });

        // Si el usuario nunca eligió a mano, seguir los cambios del sistema (por
        // ejemplo el modo oscuro automático al anochecer). Si eligió, su
        // decisión manda y el sistema se ignora.
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (leerTemaGuardado()) return;
            document.documentElement.classList.toggle('dark', e.matches);
            sincronizarBotonTema();
        });
    }

    // =========================================================================
    // Menú desplegable móvil
    // =========================================================================
    // La navegación por anclas la resuelve el navegador solo: los links son <a>
    // con href="#seccion", el scroll suave sale de scroll-smooth y la parada
    // correcta de scroll-pt-[76px] md:scroll-pt-[84px], las tres clases puestas
    // en el <html>. Acá no hay ningún manejador de click que la intercepte.

    const btnMenu = document.getElementById('btnMenu');
    const menuMovil = document.getElementById('menuMovil');
    const opcionesMenu = document.querySelectorAll('.menu-item');

    if (btnMenu && menuMovil) {
        // Abre y cierra el menú al tocar la hamburguesa. La animación es del CSS
        // (.menu-movil / .menu-open); acá solo se prende la clase y se mantiene
        // aria-expanded al día para los lectores de pantalla.
        btnMenu.addEventListener('click', () => {
            const abierto = menuMovil.classList.toggle('menu-open');
            btnMenu.setAttribute('aria-expanded', abierto);
        });

        // Se cierra solo cuando el usuario elige una opción: si no, el menú
        // taparía justo la sección a la que acaba de saltar.
        opcionesMenu.forEach((opcion) => {
            opcion.addEventListener('click', () => {
                menuMovil.classList.remove('menu-open');
                btnMenu.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // =========================================================================
    // Newsletter: no hay backend detrás, así que se dice
    // =========================================================================
    // El formulario quedó en el diseño del footer, pero no manda el correo a
    // ningún lado. En vez de tragarse el envío en silencio, se reemplaza por un
    // aviso que aclara que no se guardó nada.

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
