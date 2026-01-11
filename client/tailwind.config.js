/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Afrionex Brand Colors
        primary: {
          50: '#e6f7f5',
          100: '#b3ebe4',
          200: '#80ded3',
          300: '#4dd2c2',
          400: '#26c8b4',
          500: '#00BFA6', // Neo-Teal - Main brand color
          600: '#00a892',
          700: '#008f7c',
          800: '#007666',
          900: '#005d50',
          950: '#003d35',
        },
        secondary: {
          50: '#e8e9f0',
          100: '#c5c8d9',
          200: '#9fa4c0',
          300: '#7880a7',
          400: '#5b6494',
          500: '#1A1F4B', // Royal Indigo
          600: '#15193d',
          700: '#10132f',
          800: '#0b0d21',
          900: '#060713',
          950: '#030409',
        },
        accent: {
          50: '#fff8e6',
          100: '#ffecb3',
          200: '#ffe080',
          300: '#ffd44d',
          400: '#ffca26',
          500: '#FFB300', // Solar Amber
          600: '#d49500',
          700: '#aa7700',
          800: '#805900',
          900: '#553b00',
          950: '#2a1d00',
        },
        hyper: {
          50: '#e9f1ff',
          100: '#c7dbff',
          200: '#a5c5ff',
          300: '#83afff',
          400: '#619aff',
          500: '#2D7CFF', // Hyper Blue
          600: '#2566d4',
          700: '#1d50aa',
          800: '#153a80',
          900: '#0d2455',
          950: '#061230',
        },
        arctic: '#F5F8FC', // Arctic White
        graphite: '#1A1A1A', // Graphite Black
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
