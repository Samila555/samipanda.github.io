/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff5f0',
          100: '#ffebe0',
          200: '#ffd1b3',
          300: '#ffb380',
          500: '#FF6B35',
          600: '#e55a2b',
          700: '#cc4a22',
          800: '#b33b1a',
          900: '#992c12',
        },
        secondary: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          500: '#2E4057',
          600: '#1e2d3d',
          700: '#0f1a24',
        },
        accent: '#F5F5F5',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
