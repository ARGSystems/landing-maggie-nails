# Archivos de marca — Maggie Nails

Esta carpeta guarda los **archivos originales de diseño**. El sitio no los sirve:
sirve lo que hay en `assets/`, que se genera a partir de acá.

## Por qué están separados

`assets/` contiene solo los 8 archivos que el navegador descarga. Todo lo demás
—variantes de color, versiones descartadas, patrones alternativos, los PNG en
tamaño completo— vive acá. Así se distingue de un vistazo qué usa el sitio y qué
es material de marca.

## Los que son fuente del build

Estos siete los lee `tools/optimizar-imagenes.mjs` para generar los de `assets/`.
**Si se borran, `npm run optimizar:imagenes` deja de funcionar:**

| Fuente | Genera |
|---|---|
| `logo header2.png` | `assets/logo-header.webp` |
| `Recurso 1 logo2.png` | `assets/logo-maggie.webp` |
| `Pattern1.png` | `assets/pattern1.webp` |
| `Polish1.png` | `assets/polish1.webp` |
| `Polish2.png` | `assets/polish2.webp` |
| `hero-origen.jpg` | `assets/hero.webp` y `assets/hero-movil.webp` |
| `favicon1.png` | `assets/favicon.png` |

## El resto

Variantes que el sitio no usa hoy, pero que son parte del kit de marca:

- **`Recurso 2..6 logo2.png`** — versiones del logotipo principal (todas 1875x2105).
- **`Recurso 1..5.png`** — el mismo logotipo en versión chica.
- **`Recurso Isotipo1..5.png`** — el isotipo suelto, formato vertical.
- **`Mn1..6.png`** — variantes del monograma.
- **`Pattern2..6.png`** — patrones de fondo alternativos al que usa el sitio.
- **`Polish3..8.png`** — otras salpicaduras decorativas.
- **`logo header.png` / `logo header1.png`** — iteraciones previas del logo del nav.

Ninguno es duplicado exacto: se verificó por hash SHA-256.
