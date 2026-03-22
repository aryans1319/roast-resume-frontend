/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html","./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit","system-ui","sans-serif"],
        mono: ["JetBrains Mono","monospace"],
      },
      colors: {
        bg:    "#0F1115",
        s1:    "#14171D",
        amber: "#F5A623",
        ok:    "#4ADE80",
        warn:  "#FB923C",
        err:   "#F87171",
      },
    },
  },
  plugins: [],
}
