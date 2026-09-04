/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1e3a5f',
          dark: '#15294a',
          light: '#2a4a7f'
        },
        secondary: {
          DEFAULT: '#f59e0b',
          dark: '#d97706',
          light: '#fbbf24'
        },
        sidebar: '#0f172a',
        background: '#f1f5f9'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif']
      }
    },
  },
  plugins: [],
}