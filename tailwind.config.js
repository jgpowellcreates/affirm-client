const colors = require('tailwindcss/colors')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      cyan: colors.cyan,
      //amber: colors.amber,
      black: colors.black,
      white: colors.white,
      alert: colors.red[600],
      //overlay: colors.trueGray,
      custom: {
        pink: {
          light: '#EFC3BD',
          DEFAULT: "#E3958A",
          dark: '#D7695B'  
        },
        lightblue: {
          light: '#C1D4EC',
          DEFAULT: "#8AAFDB",
          dark: '#6394CF'
        },
        darkblue: {
          light:'#6F96C3',
          DEFAULT: "#4877AD",
          dark: '#365981'
        },
        yellow: {
          light: '#FEE971',
          DEFAULT: "#FEDC23",
          dark: '#F4CF01',
        },
        orange: {
          light: '#FCC25F',
          DEFAULT: "#FAA918",
          dark: '#DC8D04'
        },
        amber: {
          light: '#F8A363',
          DEFAULT: "#F47D1F",
          dark: '#D6630A'
        },
        deeppurple: {
          shade: '#793E72',
          light: '#512A4C',
          DEFAULT: "#361C33",
          dark: '#0D070D'
        }
      }
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
    extend: {
      backgroundImage: theme => ({
        "practice-start": "url('./assets/mountain-gradient.jpg')",
        "sunrise-bg": "url('./assets/sunrise-bg.jpeg')"
      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
