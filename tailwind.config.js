const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      cyan: colors.cyan,
      green: colors.green,
      violet: colors.violet,
      amber: colors.amber,
      black: colors.black,
      white: colors.white,
      alert: colors.red[600],
    },
    fontFamily: {
      sans: ['Montserrat','Roboto']
    },
    minWidth: {
      '0': '0',
      '1': '5em',
      '2': '10em',
      '3': '15em',
      '4': '20em',
    }
    ,
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
