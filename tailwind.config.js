/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Bricolage Grotesque","system-ui","sans-serif"],
        mono:    ["IBM Plex Mono","monospace"],
        body:    ["IBM Plex Sans","system-ui","sans-serif"],
      },
      colors: {
        bg:     "#0F0F0F",
        card:   "#1A1A1A",
        amber:  "#F59E0B",
        green:  "#34D399",
        red:    "#F87171",
        orange: "#FB923C",
      },
    },
  },
  plugins: [],
}