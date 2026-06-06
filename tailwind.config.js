/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
      },
      fontSize: {
        // Hero titles
        "hero-lg": ["72px", { lineHeight: "1.1", fontWeight: "900" }],
        "hero-md": ["56px", { lineHeight: "1.1", fontWeight: "900" }],
        "hero-sm": ["42px", { lineHeight: "1.1", fontWeight: "900" }],
        // Section titles
        "section-lg": ["48px", { lineHeight: "1.15", fontWeight: "900" }],
        "section-md": ["36px", { lineHeight: "1.15", fontWeight: "900" }],
        "section-sm": ["28px", { lineHeight: "1.15", fontWeight: "900" }],
      },
      spacing: {
        section: "clamp(80px, 12vw, 150px)",
        card: "24px",
      },
      boxShadow: {
        soft: "0 24px 80px rgba(15, 23, 42, 0.14)",
        "soft-dark": "0 24px 80px rgba(0, 0, 0, 0.44)",
        glow: "0 18px 45px rgba(20, 184, 166, 0.28)",
        card: "0 4px 24px rgba(15, 23, 42, 0.08)",
        "card-dark": "0 4px 24px rgba(0, 0, 0, 0.2)",
      },
      colors: {
        brand: {
          50: "#f0fdfc",
          100: "#ccfbf1",
          200: "#99f6e4",
          300: "#5eead4",
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
          700: "#0f766e",
          800: "#115e59",
          900: "#134e4a",
        },
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "slide-up": "slide-up 0.6s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "slide-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
