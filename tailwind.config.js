/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Montserrat", "system-ui"],
      },
      colors: {
        "priamry-dark": "#161b21",
        "secondary-dark": "#1f272f",
        "primary-turquoise": "#15e8d8",
        "secondary-turquoise": "#1a8783",
        "light-gray": "#b4b4b4",
        red: "#fd5d5c",
      },
      animation: {
        "spin-slow": "spin 2s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
