import { defineConfig } from "@pandacss/dev";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  jsxFramework: "solid",

  // Where to look for your css declarations
  include: ["./src/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      tokens: {
        fontWeights: {
          title: { value: 700 },
        },
        fonts: {
          sans: {
            value:
              '"Nunito", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          },
          serif: {
            value: '"Libre Baskerville", ui-serif, Georgia, Cambria, "Times New Roman", Times, serif',
          },
        },
        colors: {
          text: { value: "#222" },
        },
      },
    },
  },

  // The output directory for your css system
  outdir: "styled-system",

  strictTokens: true,
});
