# 💅 Maggie Nails — Landing Page

Landing page oficial de **Maggie Nails**, nail studio en Salta, Argentina. Sitio de una sola página (single-page), 100% estático, pensado para presentar la marca, mostrar el trabajo del estudio y llevar clientas directo a reservar turno por WhatsApp.

**Desarrollado por [ARG Systems](https://github.com/Moksys1)**

🔗 Demo en vivo: _(agregar acá la URL de Vercel una vez desplegado)_

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

Sitio estático, sin build ni dependencias que instalar — todo corre directo en el navegador:

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura de la página (`index.html`) |
| [Tailwind CSS](https://tailwindcss.com/) (vía CDN) | Utilidades de estilo + configuración de tema custom |
| CSS propio | `styles/maggienails.css` — estilos y animaciones que no cubre Tailwind |
| JavaScript vainilla | `scripts/main.js` — interacciones (reveal, contadores, lightbox) |
| [Swiper.js](https://swiperjs.com/) (vía CDN) | Carrusel de la galería |
| Google Fonts | Inter, Playfair Display, Cormorant Garamond |

## 📁 Estructura del proyecto

```
LANDING MAGGIE NAILS/
├── index.html                 # Página principal (única página del sitio)
├── styles/
│   └── maggienails.css        # Estilos propios
├── scripts/
│   └── main.js                # Interacciones: reveal, contadores, carrusel, lightbox
├── assets/                    # Logos, isotipos, patrones decorativos, favicon
├── images/                    # Fotos de la galería de trabajos
└── .gitignore
```

> La carpeta `graphify-out/` (mapa de conocimiento local del proyecto) es una herramienta de desarrollo interna y está excluida del repositorio vía `.gitignore`.

## 🚀 Cómo correrlo en local

Al ser un sitio 100% estático, no requiere `npm install` ni build. Alcanza con abrir `index.html` en el navegador, aunque se recomienda servirlo con un servidor local simple para evitar restricciones del navegador con rutas relativas:

```bash
# Opción 1: extensión "Live Server" de VS Code (recomendado)
# Clic derecho sobre index.html → "Open with Live Server"

# Opción 2: servidor HTTP con Python
python -m http.server 8000
# luego abrir http://localhost:8000

# Opción 3: servidor HTTP con Node
npx serve .
```

## 🌐 Despliegue

El sitio está pensado para desplegarse en **Vercel** conectado directo a este repositorio de GitHub: cada push a `main` genera un nuevo deploy automático. Al no tener build step, no hace falta configurar ningún "Build Command" — Vercel puede servirlo como sitio estático (Framework Preset: **Other**).

## 🎨 Personalización

- **Colores de marca**: definidos en `index.html`, dentro de `tailwind.config` (`maggie` y `gold`), y reutilizados en `styles/maggienails.css`.
- **Textos y servicios**: se editan directamente en `index.html`, dentro de las secciones `#servicios`, `#testimonios` y `#faq`.
- **Fotos de la galería**: agregar/reemplazar imágenes en `images/` y actualizar las referencias correspondientes en la sección `#galeria`.

## 📞 Contacto

Reservas y consultas por WhatsApp desde el propio sitio (botones de cada servicio y sección de contacto).

## 📄 Licencia

Todos los derechos de marca, contenido e imágenes pertenecen a **Maggie Nails**. Código de la landing desarrollado y mantenido por **ARG Systems**.
