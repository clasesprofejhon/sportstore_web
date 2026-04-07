/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Bebas Neue'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fff7ed",
          100: "#ffedd5",
          400: "#fb923c",
          500: "#f97316",
          600: "#ea580c",
          900: "#7c2d12",
        },
        dark: {
          900: "#0a0a0a",
          800: "#141414",
          700: "#1e1e1e",
          600: "#2a2a2a",
        }
      }
    },
  },
  plugins: [],
}
