/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}", 
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", 
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          200: "#0D0F10",
          300: "#131619",
          400: "#1A1D21",
          500: "#363A3D",
          600: "#76828D",
          700: "#ABB8C4",
        }
      }
    },
  },
  plugins: [],
}

