export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'ui-sans-serif', 'system-ui'],
        display: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui'],
      },
      colors: {
        ink: '#07111F',
        brand: {
          50: '#E8F7F4',
          100: '#C5EBE4',
          400: '#2DD4BF',
          500: '#0F9B8E',
          600: '#0B7A70',
          700: '#0A5C68',
          800: '#0B3B4A',
          900: '#07111F',
        },
        flame: {
          400: '#FF8A3D',
          500: '#F97316',
          600: '#EA580C',
        },
      },
      boxShadow: {
        glass: '0 10px 40px -12px rgba(11, 59, 74, 0.25)',
      },
    },
  },
  plugins: [],
};
