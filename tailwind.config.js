/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        math: {
          blue: '#38bdf8',
          emerald: '#34d399',
          amber: '#fbbf24',
          rose: '#fb7185',
          purple: '#a78bfa',
          cyan: '#22d3ee'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        math: ['KaTeX_Math', 'Cambria Math', 'serif']
      }
    },
  },
  plugins: [],
}
