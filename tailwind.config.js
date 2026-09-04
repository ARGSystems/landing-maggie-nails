/** @type {import('tailwindcss').Config} */
module.exports = {
  // Habilita el selector manual: cada dark:* se compila como `.dark .dark:*`,
  // asi que la clase `dark` en <html> activa todas las variantes de una.
  // Con 'media' quedaria atado a prefers-color-scheme y el boton no serviria.
  darkMode: 'class',

  // Archivos que Tailwind escanea para decidir que utilidades generar (purga lo demas).
  // scripts/ se incluye porque main.js agrega clases por JS (overflow-hidden, hidden)
  // que no siempre estan escritas en el HTML.
  content: [
    './index.html',
    './scripts/**/*.js',
  ],
  theme: {
    extend: {
      // Paleta identica a la que estaba inline en el <head> con el Play CDN.
      colors: {
        maggie: {
          900: '#4b1c71',
          700: '#7f4ca5',
          // 600 existe solo para el boton principal del hero: blanco sobre el 500
          // da 3.01:1 y WCAG AA pide 4.5:1 para texto de 16-18px. Este da 4.65:1
          // y es lo mas cerca del 500 que se puede quedar pasando la norma.
          600: '#925eb8',
          500: '#b57edc',
          300: '#dbb6ee',
          100: '#faf5ff',
        },
        gold: {
          900: '#6b4e24',
          700: '#a67c3d',
          500: '#c9a15a',
          300: '#e8d5a8',
          100: '#fbf4e7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        accent: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [],
}
