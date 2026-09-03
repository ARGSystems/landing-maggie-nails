/**
 * Descarga las tipografias de Google Fonts y genera styles/fuentes.css con
 * rutas locales. Se corre a mano si alguna vez cambian los pesos:
 *
 *     npm run fuentes
 *
 * Por que self-hostear: cada visita al sitio le enviaba a Google la IP, el
 * user-agent y la pagina de referencia del visitante. Ademas obligaba a abrir
 * conexion con dos dominios mas (fonts.googleapis.com y fonts.gstatic.com)
 * antes de poder pintar texto, y a permitirlos en la CSP.
 */
import { writeFileSync, mkdirSync } from 'node:fs';

const URL_GF = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700'
  + '&family=Playfair+Display:wght@500;600;700;800;900'
  + '&family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&display=swap';

// Google devuelve formatos distintos segun el user-agent. Con uno de Chrome
// moderno devuelve woff2, que es lo que queremos.
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
  + '(KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

// Solo los subsets que el sitio puede llegar a usar. Los acentos y signos del
// castellano (a e i o u con tilde, n con virgulilla, dieresis, ¿ ¡) entran todos
// en 'latin'. Los otros cinco subsets nunca se descargan hoy tampoco: el
// unicode-range impide bajarlos si ningun caracter de la pagina los necesita.
const SUBSETS = ['latin', 'latin-ext'];

mkdirSync('fonts', { recursive: true });

const css = await (await fetch(URL_GF, { headers: { 'User-Agent': UA } })).text();
const bloques = [...css.matchAll(/\/\*\s*([\w-]+)\s*\*\/\s*(@font-face\s*\{[^}]*\})/g)];

const salida = [
  '/* Tipografias self-hosteadas. NO editar a mano: se regenera con `npm run fuentes`.',
  ' * Origen: Google Fonts (Inter, Playfair Display, Cormorant Garamond).',
  ` * Subsets incluidos: ${SUBSETS.join(', ')}. */`,
  '',
];
let bajados = 0, bytes = 0;

for (const [, subset, bloque] of bloques) {
  if (!SUBSETS.includes(subset)) continue;
  const fam = bloque.match(/font-family:\s*'([^']+)'/)[1];
  const peso = bloque.match(/font-weight:\s*(\d+)/)[1];
  const estilo = bloque.match(/font-style:\s*(\w+)/)[1];
  const urlFuente = bloque.match(/url\((https:[^)]+)\)/)[1];

  const nombre = `${fam.toLowerCase().replace(/\s+/g, '-')}-${peso}-${estilo}-${subset}.woff2`;
  const datos = Buffer.from(await (await fetch(urlFuente, { headers: { 'User-Agent': UA } })).arrayBuffer());
  writeFileSync(`fonts/${nombre}`, datos);
  bajados++; bytes += datos.length;

  // Reescribe el src apuntando al archivo local. La ruta es relativa a
  // styles/fuentes.css, que es donde vive la hoja.
  salida.push(`/* ${subset} */`);
  salida.push(bloque.replace(/url\(https:[^)]+\)/, `url(../fonts/${nombre})`));
  salida.push('');
}

writeFileSync('styles/fuentes.css', salida.join('\n'));
console.log(`${bajados} archivos woff2  ${(bytes / 1024).toFixed(0)} KB en total`);
console.log(`styles/fuentes.css escrito (${(salida.join('\n').length / 1024).toFixed(1)} KB)`);
