module.exports = {
content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:"#00A0B0"
      },
      keyframes: {
        toast: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" }
        }
      }
    },
  },
  plugins: [],
}
