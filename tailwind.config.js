/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,js,jsx}",
    'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        'brand-red': '#dd1f2c',
        'red-weight': '#6E1E10',
        'red-light': '#D55126',
        'brand-black': '#050708',
        'smoke-black': '#393940',
        'gray-hover': '#56565a',
        'white-smoke': '#f0f2f5',
      },
      screens: {
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }

        '2xl': '1536px',
        // => @media (min-width: 1536px) { ... }
      },
      fontFamily: {
        'roboto': ['Roboto'],
        'poppin': ['Poppins'],
      },
      backgroundImage: {
        // 'hero-front': "url('./assets/img/background.jpg')",
        'hero-front': "url('./assets/img/bg-done.jpg')",
        'hero-star': "url('./assets/img/star.png')",
      }
    },
  },
  plugins: [
    require("daisyui"),
    require('flowbite/plugin')
  ],
}