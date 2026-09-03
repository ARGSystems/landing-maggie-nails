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
  ['assets/logo header2.png',    'assets/logo-header.webp', 652, { lossless: true }],
  ['assets/Recurso 1 logo2.png', 'assets/logo-maggie.webp', 750, { lossless: true }],

  // --- Decoraciones de fondo (van en maggienails.css) ---
  // Pattern1 es 4509x4621 y se dibuja como mosaico de 300px: 20 megapixeles
  // decodificados para pintar un patron chiquito.
  ['assets/Pattern1.png', 'assets/pattern1.webp', 600, { quality: 80 }],
  ['assets/Polish1.png',  'assets/polish1.webp',  500, { quality: 85 }],
  ['assets/Polish2.png',  'assets/polish2.webp',  500, { quality: 85 }],

  // --- Fondo del hero (descargado de Unsplash y self-hosteado) ---
  ['assets/hero-origen.jpg', 'assets/hero.webp',        1920, { quality: 72 }],
  ['assets/hero-origen.jpg', 'assets/hero-movil.webp',  1000, { quality: 72 }],
];

// El favicon queda en PNG (formato universal para iconos), solo se achica.
const FAVICON = ['assets/favicon1.png', 'assets/favicon.png', 192];

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
