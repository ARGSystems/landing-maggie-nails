// =============================================================================
// Maggie Nails — resolución del tema (claro / oscuro)
// =============================================================================
//
// Decide si la página arranca en claro o en oscuro y lo aplica ANTES del primer
// pintado. Si esto corriera con el resto del JavaScript (main.js, al final del
// body) el usuario vería un destello blanco antes de que salte a oscuro.
//
// Por qué es un archivo aparte y no un <script> inline en el <head>: la
// Content-Security-Policy del sitio declara script-src 'self' y bloquea todo
// script inline. Se carga sin defer ni async a propósito: tiene que ser
// bloqueante, ese es justamente el punto.
//
// A partir de acá el toggle lo maneja scripts/main.js, que usa esta misma clave
// de localStorage.

(function () {
    var GUARDADO = 'maggie-tema';

    /**
     * Lee la preferencia guardada.
     *
     * localStorage no solo puede devolver null: puede LANZAR excepción en
     * navegación privada o con las cookies de sitio bloqueadas. Sin este
     * try/catch, ese error cortaría el script y la página quedaría sin tema.
     *
     * @returns {string|null} 'oscuro', 'claro', o null si nunca se eligió a mano.
     */
    function leer() {
        try { return localStorage.getItem(GUARDADO); } catch (e) { return null; }
    }

    var elegido = leer();
    var oscuro = elegido
        ? elegido === 'oscuro'                                  // la elección explícita manda
        : window.matchMedia('(prefers-color-scheme: dark)').matches;   // si no, el sistema

    document.documentElement.classList.toggle('dark', oscuro);
})();
