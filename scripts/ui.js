// Interacciones de UI que antes vivian en dos <script> inline dentro de index.html.
// Se movieron a un archivo para que la Content-Security-Policy pueda declarar
// script-src 'self' sin recurrir a hashes: un hash se rompe con cualquier edicion
// y el script deja de correr solo en produccion, donde si se aplican los headers.
// El comportamiento es identico: mismo codigo, misma posicion en el documento.

// --- Boton "subir": controla cuando aparece y desaparece ---
const btnSubir = document.getElementById('btnSubir');

// Antes era onclick="window.scrollTo(0,0)" en el HTML. Los manejadores inline
// tambien los bloquea la CSP, asi que se engancha desde aca. El scroll sigue
// siendo suave porque lo define html { scroll-behavior: smooth } en el CSS.
btnSubir.addEventListener('click', () => window.scrollTo(0, 0));

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

// --- Menu desplegable movil ---
const btnMenu = document.getElementById('btnMenu');
const menuMovil = document.getElementById('menuMovil');
const opcionesMenu = document.querySelectorAll('.menu-item');

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

// --- Newsletter (solo visual) ---
// Antes era onsubmit="event.preventDefault();" en el HTML. No hay backend
// detras: el formulario esta para completar el diseno del footer.
const formNewsletter = document.getElementById('formNewsletter');
if (formNewsletter) {
    formNewsletter.addEventListener('submit', (e) => e.preventDefault());
}
