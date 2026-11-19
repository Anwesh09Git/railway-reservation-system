/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
        display: ['Fraunces', 'Georgia', 'Cambria', 'serif'],
      },
      colors: {
        // Higher-contrast neutral scale — text stays readable on light surfaces.
        slate: {
          50: '#F7F6F2',
          100: '#ECEAE3',
          200: '#D8D5CB',
          300: '#B6B2A7',
          400: '#77736A',
          500: '#5B574F',
          600: '#423F39',
          700: '#2F2C28',
          800: '#1F1D1A',
          900: '#141311',
          950: '#0A0908',
        },
        // Railway red replaces the generic blue/indigo accent.
        brand: {
          50: '#FDF2F0',
          100: '#FBE3DE',
          200: '#F5C5BB',
          300: '#ED9F8E',
          400: '#E07059',
          500: '#CB4A32',
          600: '#B32B18',
          700: '#95230F',
          800: '#7A1F0F',
          900: '#651D11',
          950: '#380D07',
        },
        navy: {
          800: '#1C3552',
          900: '#12263E',
          950: '#091727',
        },
        gold: {
          400: '#E3B568',
          500: '#D19A3E',
          600: '#B57F27',
        },
      },
      borderRadius: {
        xl: '0.875rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
      boxShadow: {
        soft: '0 8px 24px -12px rgba(20, 19, 17, 0.22)',
        glow: '0 10px 24px -12px rgba(179, 43, 24, 0.4)',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.45s ease-out both',
      },
    },
  },
  plugins: [],
};
