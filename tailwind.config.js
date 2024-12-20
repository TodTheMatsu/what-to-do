/** @type {import('tailwindcss').Config} */
import tailwindcssanimate from 'tailwindcss-animate';
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssanimate],
}
