/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {},
    minWidth: {
      "1/2": "50%",
    },
    maxWidth: {
      "1/2": "50%",
      "3/4": "75%",
    },
  },
  plugins: [],
  darkMode: "class",
};
