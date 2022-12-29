/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "system-ui"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
