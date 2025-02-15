/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          500: '#10b981',
          600: '#059669',
        }
      },
      container: {
        center: true,
        padding: '1rem',
      },
      backgroundImage: {
        'stars': "url('/stars-bg.avif')",
      },
    },
  },
  plugins: [],
} 