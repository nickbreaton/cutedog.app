const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    fontWeight: {
      title: 700,
    },
    fonts: {
      sans: '"Nunito", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
      serif: '"Libre Baskerville", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
    },
    extend: {
      colors: {
        text: "#222",
      },
    },
  },

  plugins: [
    plugin(({ addVariant }) => {
      addVariant("modal", ["&:modal"]);
    }),
  ],
};
