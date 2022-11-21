module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto"],
        roboto: ["Roboto", "sans-serif"],
      },
      colors: {
        primary: "#00A0B0",
        text: "#1C2A3A",
        light_text: "#596579",
        ctb: "#E6EAF0",
      },
      boxShadow: {
        ctp: "0px 4px 10px rgba(36, 44, 55, 0.1)",
        card: "0px 4px 11px rgba(143, 143, 143, 0.13)",
      },
      keyframes: {
        toast: {
          "0%": { transform: "translateY(100%)" },
          "100%": { transform: "translateY(0%)" },
        },
        popupopen: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
        categoryEditButton: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      animation: {
        popupopen: "popupopen 0.4s ease-out",
        categoryEditButton: "categoryEditButton 0.15s ease-out",
      },
    },
  },
  plugins: [],
};
