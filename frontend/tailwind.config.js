/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#7EB8F7",
          light: "#A8D0F9",
          dark: "#5A9AE0",
        },
       rosegold: {
         DEFAULT: "#E8C4C4",
         light: "#F0D8D8",
         dark: "#D4A8A8",
       },
        accent2: {
          DEFAULT: "#E8C4C4",
          dark: "#D4A8A8",
        },
       chrome: {
          DEFAULT: "#D4D8E0",
          dark: "#8B92A0",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        display: [
         '"Outfit"',
         "system-ui",
         "sans-serif",
       ],
       mono: [
         '"JetBrains Mono"',
         "monospace",
       ],
        handwriting: ['"Caveat"', "cursive"],
     },
   },
 },
 plugins: [
   function ({ addUtilities }) {
     addUtilities({
       ".bg-glass-texture": {
         "background-image":
           "radial-gradient(circle at 30% 0%, rgba(126, 184, 247, 0.06) 0%, transparent 50%), radial-gradient(circle at 70% 100%, rgba(232, 196, 196, 0.04) 0%, transparent 50%)",
       },
     })
   },
 ],
}
