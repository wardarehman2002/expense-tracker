/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F8FA",
        surface: "#FFFFFF",
        "canvas-dark": "#12151A",
        "surface-dark": "#1B1F27",
        border: "#E4E7EC",
        "border-dark": "#2A2F3A",
        ink: "#101828",
        "ink-dim": "#667085",
        primary: {
          DEFAULT: "#0F766E",
          light: "#14958A",
          dark: "#0B5750",
          soft: "#ECFDF9",
        },
        accent: "#B45309",
      },
      fontFamily: {
        display: ["Manrope", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 2px rgba(16,24,40,0.06), 0 1px 3px rgba(16,24,40,0.08)",
        "card-lg": "0 4px 8px -2px rgba(16,24,40,0.08), 0 2px 4px -2px rgba(16,24,40,0.06)",
      },
    },
  },
  plugins: [],
}
