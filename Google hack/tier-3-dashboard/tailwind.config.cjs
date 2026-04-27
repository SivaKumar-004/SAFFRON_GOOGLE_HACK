/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: {
          green: '#39ff14',
          yellow: '#ffbf00',
          red: '#ff073a'
        }
      }
    },
  },
  plugins: [],
}
