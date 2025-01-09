/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./**/*.{html,js}",
  ],
  theme: {
    extend: {
      fontFamily: {
        gowun: ["'Gowun Batang'", "serif"],
        nunito: ["'Nunito Sans'", "sans-serif"],
        lora: ["'Lora'", "serif"],
      },
    },
  },
  plugins: [],
};
