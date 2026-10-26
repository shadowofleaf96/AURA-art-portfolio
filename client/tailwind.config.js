/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        aura: {
          base: "#faf7f2",
          surface: "#ffffff",
          card: "#f5f0e8",
          cardHover: "#efe8dc",
          primary: "#2c2420",
          secondary: "#6b5e54",
          muted: "#9a8d82",
          inverse: "#faf7f2",
          accent: "#c47150",
          accentHover: "#d4856a",
          accentLight: "rgba(196, 113, 80, 0.1)",
          border: "rgba(0, 0, 0, 0.08)",
          borderMedium: "rgba(0, 0, 0, 0.14)",
          success: "#5a9a6e",
        },
      },
      fontFamily: {
        serif: ['"Outfit"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'warm-sm': '0 2px 12px rgba(44, 36, 32, 0.06)',
        'warm-md': '0 8px 28px rgba(44, 36, 32, 0.08)',
        'warm-lg': '0 20px 50px rgba(44, 36, 32, 0.12)',
        'warm-accent': '0 8px 30px rgba(196, 113, 80, 0.18)',
      },
      borderRadius: {
        'card': '16px',
        'card-lg': '24px',
      },
    },
  },
  plugins: [],
};
