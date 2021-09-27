const colors = require('tailwindcss/colors')

module.exports = {
  purge: false,
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
    fontFamily: {
      'sans': ['Helvetica', 'Arial', 'sans-serif']
    },
    extend: {},
  },
  variants: {
    extend: {
      textColor: ['visited']
    }
  },
  plugins: [],
}
