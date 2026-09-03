/**
 * Optimiza las imagenes del sitio: redimensiona al tamano en que realmente se
 * muestran y convierte a WebP. Se corre a mano cuando se agregan fotos nuevas:
 *
 *     npm run optimizar:imagenes
 *
 * Los tamanos NO son arbitrarios: salen de medir el ancho real de render de cada
 * imagen en 390 / 768 / 1440 px y multiplicar por 3 (pantallas con DPR 3).
 */
import sharp from 'sharp';
import { readFileSync, existsSync, statSync } from 'node:fs';

const kb = (p) => (statSync(p).size / 1024).toFixed(1);

// [origen, salida, ancho, opciones]
const TAREAS = [
  // --- Fotos de la galeria (tambien alimentan el lightbox) ---
  // El src apunta a la de 1080: es la que abre el lightbox a pantalla completa.
  ...[1, 2, 3, 4].flatMap((n) => [
    [`images/img${n}.png`, `images/img${n}-400.webp`,  400,  { quality: 82 }],
    [`images/img${n}.png`, `images/img${n}-800.webp`,  800,  { quality: 82 }],
    [`images/img${n}.png`, `images/img${n}.webp`,      1080, { quality: 82 }],
  ]),

  // --- Logos: arte plana con transparencia -> lossless comprime mejor que q82 ---
  // OJO con estos anchos: los logos usan h-9/w-44 con la otra dimension en auto,
  // asi que el navegador calcula el lado que falta a partir de la relacion de aspecto
  // del archivo. Si el resize la redondea, el elemento cambia de tamano y corre el
  // layout de toda la pagina. 750x842 conserva 1875:2105 exacto (= 375:421);
  // 652x130 aproxima 2287:456 con un error de 0.0012 px, bajo el cuanto de Blink (1/64).
  ['marca/logo header2.png',    'assets/logo-header.webp', 652, { lossless: true }],
  ['marca/Recurso 1 logo2.png', 'assets/logo-maggie.webp', 750, { lossless: true }],

  // --- Decoraciones de fondo (van en maggienails.css) ---
  // Pattern1 es 4509x4621 y se dibuja como mosaico de 300px: 20 megapixeles
  // decodificados para pintar un patron chiquito.
  ['marca/Pattern1.png', 'assets/pattern1.webp', 600, { quality: 80 }],
  ['marca/Polish1.png',  'assets/polish1.webp',  500, { quality: 85 }],
  ['marca/Polish2.png',  'assets/polish2.webp',  500, { quality: 85 }],

  // --- Fondo del hero (descargado de Unsplash y self-hosteado) ---
  ['marca/hero-origen.jpg', 'assets/hero.webp',        1920, { quality: 72 }],
  ['marca/hero-origen.jpg', 'assets/hero-movil.webp',  1000, { quality: 72 }],
];

// El favicon queda en PNG (formato universal para iconos), solo se achica.
const FAVICON = ['marca/favicon1.png', 'assets/favicon.png', 192];

let antes = 0, despues = 0;
console.log('origen                          ->  salida                        antes    despues   ahorro');
console.log('-'.repeat(96));

for (const [src, out, ancho, opts] of TAREAS) {
  if (!existsSync(src)) { console.log(`  SALTEADA (falta ${src})`); continue; }
  await sharp(src).resize({ width: ancho, withoutEnlargement: true }).webp(opts).toFile(out);
  const a = +kb(src), d = +kb(out);
  antes += a; despues += d;
  console.log(`${src.padEnd(31)} ->  ${out.padEnd(28)} ${(a+' KB').padStart(8)} ${(d+' KB').padStart(9)}  ${(-(100-d/a*100)).toFixed(0)}%`);
}

const [fs_, fo, fa] = FAVICON;
await sharp(fs_).resize({ width: fa }).png({ compressionLevel: 9 }).toFile(fo);
console.log(`${fs_.padEnd(31)} ->  ${fo.padEnd(28)} ${(kb(fs_)+' KB').padStart(8)} ${(kb(fo)+' KB').padStart(9)}`);

console.log('-'.repeat(96));
console.log(`TOTAL (sin contar variantes srcset duplicadas): ${antes.toFixed(0)} KB -> ${despues.toFixed(0)} KB`);

// ---------------------------------------------------------------------------
// Imagen de preview para redes (Open Graph / Twitter) e iconos de la marca.
// La foto es propia del estudio, no de banco de imagenes.
// ---------------------------------------------------------------------------
const W = 1200, H = 630, FOTO = 760, PANEL = W - FOTO;

// Panel de marca a la izquierda. El degradado llega a #1a0b2e justo en la union
// con la foto (37% de 1200 = 444px) para que no se note la costura.
const fondo = Buffer.from(`<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="b" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="#3a1259"/>
    <stop offset="37%" stop-color="#1a0b2e"/>
    <stop offset="100%" stop-color="#1a0b2e"/>
  </linearGradient></defs><rect width="${W}" height="${H}" fill="url(#b)"/></svg>`);

// Mismo velo que el hero del sitio: oscuro donde apoya el logo, se abre a la derecha.
const fundido = Buffer.from(`<svg width="${FOTO}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="#1a0b2e" stop-opacity="1"/>
    <stop offset="32%"  stop-color="#1a0b2e" stop-opacity="0.45"/>
    <stop offset="70%"  stop-color="#1a0b2e" stop-opacity="0.12"/>
    <stop offset="100%" stop-color="#1a0b2e" stop-opacity="0.05"/>
  </linearGradient></defs><rect width="${FOTO}" height="${H}" fill="url(#g)"/></svg>`);

const foto = await sharp('images/img1.png').resize(FOTO, H, { fit: 'cover', position: 'centre' })
  .composite([{ input: fundido, top: 0, left: 0 }]).toBuffer();
const logoOg = await sharp('marca/Recurso 1 logo2.png').resize({ height: 330 }).toBuffer();
const anchoLogo = (await sharp(logoOg).metadata()).width;

await sharp(fondo).composite([
  { input: foto,    top: 0, left: PANEL },
  { input: logoOg,  top: Math.round((H - 330) / 2), left: Math.round((PANEL - anchoLogo) / 2) },
]).jpeg({ quality: 88, mozjpeg: true }).toFile('assets/og.jpg');
console.log(`${'(compuesta)'.padEnd(31)} ->  ${'assets/og.jpg'.padEnd(28)} ${''.padStart(8)} ${(kb('assets/og.jpg')+' KB').padStart(9)}`);

// apple-touch-icon: iOS no respeta transparencia, asi que va sobre fondo solido.
// El recuadro redondeado lo aplica el sistema.
await sharp({ create: { width: 180, height: 180, channels: 3, background: '#4b1c71' } })
  .composite([{ input: await sharp('marca/favicon1.png').resize({ width: 140 }).toBuffer(),
                gravity: 'centre' }])
  .png({ compressionLevel: 9 }).toFile('assets/apple-touch-icon.png');
console.log(`${'marca/favicon1.png'.padEnd(31)} ->  ${'assets/apple-touch-icon.png'.padEnd(28)} ${''.padStart(8)} ${(kb('assets/apple-touch-icon.png')+' KB').padStart(9)}`);

// 32x32 para que la pestaña se vea nitida (el navegador reduciendo desde 192 la ensucia).
await sharp('marca/favicon1.png').resize({ width: 32 }).png({ compressionLevel: 9 })
  .toFile('assets/favicon-32.png');
console.log(`${'marca/favicon1.png'.padEnd(31)} ->  ${'assets/favicon-32.png'.padEnd(28)} ${''.padStart(8)} ${(kb('assets/favicon-32.png')+' KB').padStart(9)}`);
