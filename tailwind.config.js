/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        vacation: {
          regular: '#DBEAFE',    // Light blue
          sick: '#FEE2E2',      // Light red
          compensatory: '#DCFCE7', // Light green
          companion: '#FEF9C3'   // Light yellow
        }
      }
    },
  },
  plugins: [],
}

