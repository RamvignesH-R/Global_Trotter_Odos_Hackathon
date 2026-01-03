/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1e3a8a", // Booking.com Blue
        secondary: "#f97316", // Goibibo Orange
        bgLight: "#f3f4f6",
      }
    },
  },
  plugins: [],
}
