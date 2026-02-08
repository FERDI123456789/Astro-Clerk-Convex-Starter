module.exports = {
  theme: {
    extend: {
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        draw: "draw 0.4s linear forwards",
        "animate-slideDown": "slideDown 0.25s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },

        draw: {
          to: { "stroke-dashoffset": "0" },
        },
      },
    },
  },
};
