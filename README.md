# 💅 Maggie Nails — Landing Page

Landing page oficial de **Maggie Nails**, nail studio en Salta, Argentina. Sitio de una sola página (single-page), 100% estático, pensado para presentar la marca, mostrar el trabajo del estudio y llevar clientas directo a reservar turno por WhatsApp.

**Desarrollado por [ARG Systems](https://github.com/Moksys1)**

🔗 Demo en vivo: _(agregar acá la URL de Netlify)_

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
| Google Fonts | Inter, Playfair Display, Cormorant Garamond |

## 📁 Estructura del proyecto

```
LANDING MAGGIE NAILS/
├── index.html                 # Página principal (única página del sitio)
├── package.json               # Dependencias y scripts de build
├── tailwind.config.js         # Tema de Tailwind: paleta maggie/gold y tipografías
├── styles/
│   ├── tailwind.src.css       # FUENTE de Tailwind (se edita esto)
│   ├── tailwind.css           # CSS COMPILADO (generado — no editar a mano)
│   └── maggienails.css        # Estilos propios: animaciones, lightbox, footer, Swiper
├── scripts/
│   └── main.js                # Interacciones: reveal, contadores, carrusel, lightbox
├── assets/                    # Logos, isotipos, patrones decorativos, favicon
├── images/                    # Fotos de la galería de trabajos
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
