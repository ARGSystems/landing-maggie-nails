# 💅 Maggie Nails — Landing Page

Landing page oficial de **Maggie Nails**, nail studio en Salta, Argentina. Sitio de una sola página (single-page), 100% estático, pensado para presentar la marca, mostrar el trabajo del estudio y llevar clientas directo a reservar turno por WhatsApp.

**Desarrollado por [ARG Systems](https://github.com/Moksys1)**

🔗 Demo en vivo: **https://maggienails.netlify.app**

---

## ✨ Características

- **Diseño responsive**, optimizado mobile-first (menú hamburguesa en celular, navegación sticky en desktop).
- **Navegación por anclas** a cada sección: Inicio, Nosotras, Beneficios, Servicios, Trabajos, Reseñas y FAQ.
- **Reserva por WhatsApp**: cada servicio deep-linkea directo a un chat de WhatsApp pre-armado.
- **Galería / Portfolio** con carrusel (Swiper.js) y **lightbox** para ver las fotos en grande.
- **Contadores animados** (años de experiencia, clientas, diseños) que se activan al hacer scroll.
- **Animaciones de revelado** (reveal on scroll) mediante `IntersectionObserver`.
- **Sección de testimonios** de clientas.
- **Identidad visual propia**: paleta de colores personalizada (lila/violeta `maggie` y dorado `gold`) y tipografías de Google Fonts (Inter, Playfair Display, Cormorant Garamond).

## 🧱 Stack técnico

Sitio estático servido tal cual, con un único paso de build local para compilar Tailwind:

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la página (`index.html`) |
| [Tailwind CSS](https://tailwindcss.com/) 3.4.19 (compilado con la CLI) | Utilidades de estilo + tema custom definido en `tailwind.config.js` |
| CSS propio | `styles/maggienails.css` — estilos y animaciones que no cubre Tailwind |
| JavaScript vainilla | `scripts/main.js` — interacciones (reveal, contadores, lightbox) |
| [Swiper.js](https://swiperjs.com/) (vía CDN) | Carrusel de la galería |
| [sharp](https://sharp.pixelplumbing.com/) | Optimización de imágenes a WebP (solo en desarrollo) |
| Google Fonts | Inter, Playfair Display, Cormorant Garamond |

## 📁 Estructura del proyecto

```
LANDING MAGGIE NAILS/
├── index.html                 # Página principal (única página del sitio)
├── robots.txt                 # Reglas de rastreo + ubicación del sitemap
├── sitemap.xml                # Una sola URL: el sitio es de una página
├── package.json               # Dependencias y scripts de build
├── tailwind.config.js         # Tema de Tailwind: paleta maggie/gold y tipografías
├── netlify.toml               # Configuración de deploy y headers de seguridad
├── fonts/                     # Tipografías self-hosteadas (.woff2)
├── tools/
│   ├── optimizar-imagenes.mjs # Genera los WebP a partir de los PNG originales
│   └── descargar-fuentes.mjs  # Baja las tipografías y arma styles/fuentes.css
├── styles/
│   ├── tailwind.src.css       # FUENTE de Tailwind (se edita esto)
│   ├── tailwind.css           # CSS COMPILADO (generado — no editar a mano)
│   ├── fuentes.css            # @font-face de las tipografías (generado)
│   └── maggienails.css        # Estilos propios: animaciones, lightbox, footer, Swiper
├── scripts/
│   └── main.js                # Todas las interacciones: carrusel, reveal, contadores,
│                              # lightbox, menú móvil, botón subir y newsletter
├── assets/                    # SOLO lo que el sitio sirve (8 archivos WebP/PNG)
├── marca/                     # Archivos originales de diseño (ver marca/README.md)
├── images/                    # Fotos de la galería: PNG originales + WebP generados
└── .gitignore
```

> La carpeta `graphify-out/` (mapa de conocimiento local del proyecto) es una herramienta de desarrollo interna y está excluida del repositorio vía `.gitignore`.

## 🚀 Cómo levantarlo en local

**Requisito:** Node.js 18 o superior.

### Desde un clone limpio — un solo comando

```bash
npm install
```

Instala las dependencias y **compila el CSS automáticamente** (el script `prepare` de
`package.json` corre `build:css` al terminar la instalación). Con eso el sitio ya queda listo.

### Scripts disponibles

| Comando | Qué hace |
|---|---|
| `npm install` | Instala dependencias **y** compila el CSS (vía `prepare`) |
| `npm run build:css` | Compila `styles/tailwind.src.css` → `styles/tailwind.css` minificado |
| `npm run dev:css` | Igual, pero en modo *watch*: recompila solo al guardar cambios |
| `npm run optimizar:imagenes` | Regenera los WebP desde los PNG originales (solo al agregar fotos) |
| `npm run fuentes` | Vuelve a bajar las tipografías de Google y regenera `styles/fuentes.css` |

### Flujo de trabajo diario

```bash
npm run dev:css      # dejar corriendo en una terminal
```

Y en paralelo, servir la página con cualquier servidor estático:

```bash
# Opción 1: extensión "Live Server" de VS Code (recomendado)
# Clic derecho sobre index.html → "Open with Live Server"

# Opción 2: servidor HTTP con Node
npx serve .
```

> ⚠️ **Importante:** si agregás o cambiás clases de Tailwind en `index.html`, hay que
> recompilar (`npm run build:css`) **antes de commitear**. Si no, el CSS versionado queda
> desactualizado y la clase nueva no va a existir en producción. Tener `npm run dev:css`
> corriendo mientras editás evita el olvido.

### Por qué el CSS se compila y ya no viene de un CDN

Antes el sitio cargaba `cdn.tailwindcss.com`: **397 KB de JavaScript** que el navegador de
cada visitante descargaba, parseaba y ejecutaba para generar **20 KB de CSS**, en cada visita.
Además bloqueaba el renderizado y, si el CDN fallaba, la página se veía sin estilos.
Ahora ese CSS se genera una sola vez en desarrollo y se sirve como archivo estático cacheable.

### Orden de los `<link>` en el `<head>` (no cambiar)

`styles/tailwind.css` va **último**, después de `maggienails.css` y de Swiper. El Play CDN
inyectaba su `<style>` al final del `<head>`, así que las utilidades de Tailwind tenían
prioridad sobre el CSS propio. Subir ese `<link>` invertiría la cascada y rompería el diseño.

## 🖼️ Cómo se manejan las imágenes

El proyecto separa **fuente** de **lo que se sirve**:

- `marca/` y los PNG de `images/` son los **originales**. El sitio no los descarga nunca.
- `assets/` y los `.webp` de `images/` son lo que el navegador sí baja, y se **generan**
  con `npm run optimizar:imagenes`.

Al agregar una foto nueva hay que correr ese comando y commitear los WebP resultantes.

Los tamaños no son arbitrarios: salen de medir el ancho real de render de cada imagen en
390 / 768 / 1440 px y multiplicar por 3, para cubrir pantallas con densidad DPR 3.

### La galería y el `srcset`

Cada foto se genera en tres anchos — 400, 800 y 1080 px — y el navegador elige con:

```html
srcset="images/img1-400.webp 400w, images/img1-800.webp 800w, images/img1.webp 1080w"
sizes="(min-width: 640px) 360px, 92vw"
```

Los cortes salen de los anchos medidos: la foto se muestra a ~354 px en móvil (1 slide),
~338 px en tablet (2 slides) y ~345 px en escritorio (3 slides). Como el ancho es
prácticamente el mismo en tablet y escritorio, un solo corte en 640 px alcanza. **400w**
cubre pantallas DPR 1, **800w** las DPR 2 (la mayoría de los celulares) y **1080w** las DPR 3.

> ⚠️ El atributo `src` apunta a propósito a la versión de **1080 px**: `main.js` hace
> `lightboxImg.src = img.src`, así que el lightbox siempre abre la foto grande aunque la
> grilla haya cargado la de 400 px. Si se cambia el `src` a una variante chica, el lightbox
> se ve borroso.

### Los logos y la relación de aspecto

`logo-header.webp` mide 652×130 y `logo-maggie.webp` 750×842. **No son números redondos a
propósito.** Los dos logos se dimensionan con un solo lado fijo (`h-9 w-auto`, `w-44`) y el
navegador calcula el otro a partir de la relación de aspecto del archivo. Si el redimensionado
la redondea, el elemento cambia de tamaño y corre el layout de toda la página. 750×842 conserva
1875:2105 exacto (= 375:421); 652×130 aproxima 2287:456 con un error de 0.0012 px, por debajo
del cuanto de layout de Chrome (1/64 px).

### El fondo del hero

Antes se traía por hotlink desde `images.unsplash.com`. Ahora está self-hosteado en
`assets/hero.webp` (1920 px) con una variante liviana `assets/hero-movil.webp` (1000 px), y
se sirve desde `.hero-bg` en `maggienails.css` con una media query. El original descargado
queda en `assets/hero-origen.jpg` como fuente para volver a generarlos.

Como es el elemento **LCP** y los fondos de CSS se descubren tarde (recién después de bajar y
parsear el CSS), el `<head>` lleva dos `<link rel="preload">` con `media` para adelantar la
descarga de la variante que corresponda.

## 🔎 SEO técnico y compartido en redes

### Preview al compartir el link

`assets/og.jpg` (1200x630) se genera con `npm run optimizar:imagenes` a partir de
`images/img1.png` y el logotipo: **es una foto propia del estudio, no de banco de imágenes.**
Pesa 59 KB, bien por debajo del límite que maneja WhatsApp para mostrar preview grande.

Las URLs de `og:image`, `og:url` y `canonical` son **absolutas a propósito**: los scrapers de
WhatsApp, Facebook y LinkedIn no resuelven rutas relativas, y con una ruta relativa el preview
sale sin imagen.

> ⚠️ Están escritas a mano apuntando a `https://maggienails.netlify.app/`. **Si el sitio pasa
> a un dominio propio hay que actualizarlas** en `index.html` (canonical, `og:url`, `og:image`,
> `twitter:image`), en `robots.txt` y en `sitemap.xml`. Al ser un sitio estático sin
> plantillas, no hay forma de derivarlas automáticamente.

### Por qué no hay JSON-LD ni analytics

Se dejaron afuera **a propósito**. El schema `LocalBusiness`/`NailSalon` declara dirección,
horarios y teléfono de un local físico: publicar datos de un negocio que no está operando sería
información falsa para Google. Tampoco hay Analytics ni píxeles de tracking, así que el sitio no
necesita banner de cookies.

### El sitemap

Una sola `<url>`. Las secciones (`#servicios`, `#galeria`, `#faq`...) son anclas dentro del
mismo documento, no URLs independientes: listarlas sería declarar contenido duplicado.

### robots.txt

Permite todo salvo `/marca/`, que son los archivos originales de diseño. No aportan nada en
buscadores y no tiene sentido gastar presupuesto de rastreo en ellos.

## 🔒 Seguridad

### Headers

Se configuran en `netlify.toml`. En criollo, qué previene cada uno:

| Header | Qué ataque frena |
|---|---|
| `Content-Security-Policy` | **Inyección de código (XSS).** Declara de qué dominios se puede cargar cada tipo de recurso. Si alguien lograra meter un `<script>` en la página, el navegador se niega a ejecutarlo porque su origen no está en la lista. |
| `X-Content-Type-Options: nosniff` | **Confusión de tipo de archivo.** Sin esto, el navegador "adivina" qué es un archivo mirando su contenido. Un .txt con código JS adentro podía terminar ejecutándose. Esto lo obliga a respetar el `Content-Type` declarado. |
| `Referrer-Policy` | **Fuga de información al salir del sitio.** Al hacer clic en un link externo el navegador le cuenta al destino de dónde venís. Con esto, hacia afuera solo se manda el dominio, nunca la ruta ni los parámetros. |
| `Permissions-Policy` | **Abuso de APIs del navegador.** Apaga cámara, micrófono, ubicación, pagos y demás. Si algo lograra ejecutar código en la página, igual no podría pedirlos. |
| `X-Frame-Options: DENY` + `frame-ancestors 'none'` | **Clickjacking.** Impide que otro sitio meta esta página dentro de un `<iframe>` invisible y te haga tocar botones que no ves. Van los dos: `frame-ancestors` es el moderno, `X-Frame-Options` cubre navegadores viejos. |

`Strict-Transport-Security` no está en el archivo porque **Netlify ya lo manda solo** en los dominios `.netlify.app`.

### Detalles de la CSP

No usa `'unsafe-inline'` ni en scripts ni en estilos. Para lograrlo hubo que sacar del HTML:

- los dos `<script>` inline → `scripts/main.js`
- `onclick="window.scrollTo(0,0)"` del botón subir → `addEventListener` en `main.js`
- `onsubmit="event.preventDefault();"` del newsletter → `addEventListener` en `main.js`
- el único `style="opacity:.08"` → la clase `opacity-[0.08]`

> Se descartó la alternativa de permitir esos scripts con hashes (`'sha256-...'`). Un hash se
> rompe con cualquier edición del script, y como los headers **solo se aplican en producción**,
> el menú seguiría funcionando en local y quedaría roto en el sitio publicado sin aviso.

`font-src` incluye `data:` porque Swiper embebe su fuente de íconos (las flechas del carrusel)
como data URI dentro de su propio CSS. Es la única concesión de la política.

### Swiper fijado con SRI

```
swiper@11.2.10  +  integrity="sha384-..."  +  crossorigin="anonymous"
```

Antes decía `swiper@11`, que resuelve a la última 11.x: el CDN podía servir una versión distinta
de un día para el otro. Ahora la versión es exacta y el atributo `integrity` hace que el navegador
calcule el hash del archivo descargado y lo **rechace** si no coincide — protege si el CDN llegara
a ser comprometido.

### Tipografías self-hosteadas

Antes venían de `fonts.googleapis.com`. Cada visita le mandaba a Google la IP, el user-agent y la
página de referencia del visitante, y obligaba a abrir conexión con dos dominios más antes de poder
pintar texto. Ahora viven en `fonts/` y la CSP puede decir `font-src 'self'`.

Se descargan solo los subsets `latin` y `latin-ext`: los acentos y signos del castellano entran
todos en `latin`. Verificado que el render es **idéntico píxel a píxel** al de Google Fonts.

## 📬 El formulario de newsletter

El footer tiene un formulario de suscripción que **no manda el correo a ningún lado**: no hay
servicio de mailing detrás ni se guarda nada.

Antes se tragaba el envío en silencio (`onsubmit="event.preventDefault();"`), lo que es peor que
no tenerlo: el usuario escribe su correo, toca el botón, no pasa nada visible y queda creyendo que
se suscribió. Ahora, al enviarlo, el formulario se reemplaza por un aviso que dice explícitamente
que **no se guardó el correo**.

Se evaluó directamente sacar el formulario. Se decidió mantenerlo con feedback honesto porque
quitarlo obligaba a rediseñar la grilla de 12 columnas del footer, y porque los botones de
"Reservar" hacen la misma promesa implícita y se mantienen: sacar solo el newsletter habría sido
incoherente. La honestidad se resuelve con el texto, no eliminando la sección.

El aviso lleva `role="status"` y `aria-live="polite"` para que un lector de pantalla lo anuncie
al aparecer.

## 🧭 Hero y navegación

### El hero se centra, no se rellena

Antes el `<header id="inicio">` no tenía altura propia: la simulaba con relleno fijo
(`pt-16 pb-12 md:py-32 lg:py-40`). El resultado era que el alto dependía del padding y no de la
pantalla: en un portátil de 1512x780 el header medía 956px, el `<h1>` recién aparecía a los
458px y la franja de confianza quedaba cortada abajo.

Ahora `.hero-bg` ocupa **la pantalla menos el alto del nav** y centra el contenido con flex:

```css
--nav-alto: 4.75rem;                      /* cambia por breakpoint */
min-height: calc(100vh - var(--nav-alto));
min-height: calc(100svh - var(--nav-alto));
display: flex;
align-items: center;
```

Tres detalles del porqué:

- **Las dos declaraciones de `min-height` no son un error.** `svh` es la unidad que descuenta
  las barras del navegador móvil, pero los navegadores viejos no la entienden: el que no la
  soporte ignora la segunda línea y se queda con `vh`.
- **Se descuenta el alto del nav** para que el hero no sobresalga justo esa cantidad y obligue a
  scrollear. Los tres valores (76 / 84 / 68 px) salen de **medir el nav en el navegador**, no de
  estimarlos: el alto lo manda el botón hamburguesa, que es más alto que el logo.
- **El padding bajó a `py-12 md:py-16`.** Ya no empuja el contenido al medio; queda solo como
  margen de respiro para pantallas muy bajas donde el contenido no entra.

Resultado medido: el H1, los botones y la franja de confianza entran sin scroll en 375, 768,
1440, 1512 y 1920 px, y el header no salta más de **16px** entre breakpoints.

### El nav pasa a íconos desde 1024px

Los 7 links llevan un ícono SVG de 16px (20px en el menú móvil) con el mismo estilo de trazo que
el hamburguesa. Se definen **una sola vez** en un sprite `<symbol>` al inicio del `<body>` y
cada link lo referencia con `<use href="#ico-...">`: son 7 íconos en 14 lugares, repetirlos
inline habría inflado el HTML sin necesidad. Van con `aria-hidden` porque son decorativos —
el texto del link ya dice a dónde va.

`¿Por qué elegirnos?` pasó a **`Beneficios`** en el nav: era una pregunta completa entre
etiquetas de una palabra. El `href="#beneficios"` y el `<h2>` de la sección quedaron intactos.

> **El menú de escritorio ahora aparece desde `lg:` (1024px), no desde `md:` (768px).** Con los
> íconos, los 7 links dejaron de entrar junto al logo hasta ~950px. Entre 768 y 1023px se usa el
> menú hamburguesa, que ya funcionaba. Esto además arregla de paso el nav apretado que el sitio
> arrastraba desde el commit inicial en ese mismo rango.

## ♿ Accesibilidad

Lighthouse da **100**. Los tres problemas que había se resolvieron así:

**1. El botón "subir" no tenía nombre accesible.** Era un `<button>` con solo un SVG adentro:
un lector de pantalla lo anunciaba como "botón" a secas, sin decir qué hace. Se agregó
`aria-label="Volver arriba"`. Sin cambio visual.

**2. El footer saltaba de `<h2>` a `<h4>`.** Los tres encabezados del footer bajaron a `<h3>`.
No cambia cómo se ven: el Preflight de Tailwind resetea el tamaño de los encabezados y estos ya
lo definen por clase (`text-lg`). Verificado: **0 píxeles de diferencia**.

**3. Contraste insuficiente en "Ver Servicios".** Blanco sobre `maggie-500` (`#b57edc`) daba
**3,01:1** y WCAG AA pide 4,5:1 para texto de 16-18px. Este sí es un cambio visual.

Se agregó `maggie-600: #925eb8` a la paleta, usado **solo en ese botón**. No es un color
elegido a ojo: se interpoló entre `maggie-500` y `maggie-700` buscando el punto más cercano
al 500 que pase la norma. Queda a 65% del camino, con **4,65:1** — apenas por encima del
mínimo, para alterar la marca lo menos posible.

Alternativas descartadas y por qué:

| Opción | Ratio | Problema |
|---|---|---|
| Texto `maggie-900` sobre el 500 | 4,10:1 | No alcanza |
| Fondo `maggie-700` | 6,04:1 | Pasa, pero oscurece tanto que se confunde con los botones "Reservar" |
| Agrandar el texto a `text-xl` | 3,01:1 | Calificaría como "texto grande" (pide 3:1), pero pasaría por 0,01 y cambia el tamaño del botón |

## 📊 Resultados medidos

Lighthouse (móvil, CPU x4, 1638 Kbps, RTT 150 ms), comparando el estado inicial contra el actual:

| Categoría | Antes | Después | |
|---|---|---|---|
| Performance | 60 | **72** | +12 |
| Accesibilidad | 89 | **100** | +11 |
| Best Practices | 100 | 100 | ya estaba |
| SEO | 100 | 100 | ya estaba |

| Métrica | Antes | Después |
|---|---|---|
| Largest Contentful Paint | 24,4 s | **4,2 s** |
| Time to Interactive | 25,0 s | **4,2 s** |
| Speed Index | 5,2 s | 4,9 s |
| Total Blocking Time | 220 ms | 200 ms |
| Cumulative Layout Shift | 0 | 0 |
| **Peso total transferido** | **5.491 KiB** | **642 KiB** |

> Lighthouse simula una red lenta y un procesador 4x más lento. Sobre red real el LCP medido
> fue de ~810 ms. Son metodologías distintas: sirven para comparar antes/después, no como
> tiempo absoluto.

**SEO y Best Practices ya daban 100 antes.** Vale aclararlo: la categoría SEO de Lighthouse solo
revisa lo básico (título, meta description, links rastreables) y **no audita Open Graph ni
Twitter Card**. Que diera 100 no significaba que el link se viera bien al compartirlo — de hecho
no se veía. Un score perfecto no equivale a estar completo.

## ✅ Cómo se verificó cada cambio

Ninguna fase se dio por buena sin comprobarlo. El método:

1. Se sirve la versión anterior y la nueva **en paralelo**, en dos puertos.
2. Se capturan ambas a página completa en 390 / 768 / 1440 px, congelando animaciones,
   scroll suave y el autoplay del carrusel para que las capturas sean deterministas
   (verificado: dos corridas de la misma versión dan PNG byte a byte idénticos).
3. Se comparan **píxel a píxel** y se compara el DOM completo: posición, tamaño y tipografía
   de cada elemento que ocupa espacio.
4. Se hace `grep` de los enlaces de WhatsApp e Instagram en el diff para confirmar que no
   cambió ninguno.

Salvo la conversión de imágenes —que por definición altera píxeles al recomprimir— todas las
fases cerraron con **0 píxeles de diferencia**.

## ⚠️ Pendientes conocidos

Cosas detectadas y **no** corregidas, porque implican decisiones de diseño o de contenido:

### Otros

- **`fonts/` pesa 1,2 MB en 26 archivos y el navegador solo descarga 7** (289 KB). Los otros
  son pesos que el diseño no usa hoy. Se pueden podar, con el riesgo de que si mañana se usa
  uno el navegador falsifique la variante y se vea peor.
- **`marca/` se publica igual.** `robots.txt` pide no rastrearla, pero eso es un pedido a los
  buscadores, no un bloqueo: sigue accesible por URL. Se bloquea con una regla en `netlify.toml`.
- **La `<meta name="description">` dice "nail studio en Salta, Argentina"** y ese texto ahora
  también viaja en el preview de WhatsApp. Si el estudio no está operando, conviene revisarla.
- **Las URLs absolutas están escritas a mano.** Si el sitio pasa a un dominio propio hay que
  actualizar `canonical`, `og:url`, `og:image`, `twitter:image`, `robots.txt` y `sitemap.xml`.

## 🌐 Despliegue

El sitio se despliega en **Netlify** conectado directo a este repositorio de GitHub: cada push
a `main` genera un deploy automático.

Configuración en Netlify:

| Campo | Valor |
|---|---|
| Build command | *(vacío)* |
| Publish directory | `.` (la raíz del repo) |

**El CSS compilado (`styles/tailwind.css`) se versiona en el repo a propósito.** Netlify no
necesita correr ningún build: publica los archivos tal cual. Las razones:

- **El deploy no puede fallar por el build.** Sin `npm install` en el servidor, una caída de
  npm o una dependencia rota no pueden tumbar producción.
- **Deploys instantáneos**, sin los ~30 s de instalar dependencias en cada push.
- **El repo funciona sin Node.** Al ser una pieza de portfolio, alguien puede clonarlo y abrir
  `index.html` directamente y verlo bien, sin instalar nada.
- **Portabilidad**: anda igual en GitHub Pages, Vercel, Cloudflare Pages o cualquier hosting estático.

El costo de esta decisión es que un archivo generado vive en git y puede quedar
desincronizado si se edita el HTML sin recompilar. Por eso los scripts `build:css` y
`dev:css`, y la advertencia de la sección anterior.

> Nota: los scripts se llaman `build:css` y `dev:css`, no `build`. Es a propósito: evita
> que la plataforma de hosting detecte un build step y trate de construir el sitio en el
> deploy, buscando un directorio de salida que este proyecto no tiene. Netlify solo corre un
> build si se lo configurás explícitamente, pero el nombre lo deja a prueba de sorpresas
> (y de una eventual migración a otra plataforma).

> Si más adelante hace falta configurar headers, redirects o caché, en Netlify eso va en un
> archivo `netlify.toml` en la raíz del repo.

## 🎨 Personalización

- **Colores de marca**: definidos en `tailwind.config.js` (paletas `maggie` y `gold`), y reutilizados como variables CSS en `styles/maggienails.css`. Después de tocarlos, correr `npm run build:css`.
- **Textos y servicios**: se editan directamente en `index.html`, dentro de las secciones `#servicios`, `#testimonios` y `#faq`.
- **Fotos de la galería**: agregar/reemplazar imágenes en `images/` y actualizar las referencias correspondientes en la sección `#galeria`.

## 📞 Contacto

Reservas y consultas por WhatsApp desde el propio sitio (botones de cada servicio y sección de contacto).

## 📄 Licencia

Todos los derechos de marca, contenido e imágenes pertenecen a **Maggie Nails**. Código de la landing desarrollado y mantenido por **ARG Systems**.
