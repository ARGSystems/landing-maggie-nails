// Resuelve el tema ANTES del primer pintado, para que no se vea el destello
// blanco antes de saltar a oscuro.
//
// Va en su propio archivo y no inline en el <head> porque la CSP del sitio
// declara script-src 'self' y bloquea todo script inline. Se carga sin defer
// ni async: tiene que ser bloqueante, ese es justamente el punto.
(function () {
    var GUARDADO = 'maggie-tema';

    // localStorage no solo puede devolver null: puede LANZAR excepcion en
    // navegacion privada o con las cookies de sitio bloqueadas.
    function leer() {
        try { return localStorage.getItem(GUARDADO); } catch (e) { return null; }
    }

    var elegido = leer();
    var oscuro = elegido
        ? elegido === 'oscuro'                    // la eleccion explicita manda
        : window.matchMedia('(prefers-color-scheme: dark)').matches;

    document.documentElement.classList.toggle('dark', oscuro);
})();
