module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  content: ['./src/**/*.{html,ts,css,scss}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('tailwindcss-primeui')],
};
