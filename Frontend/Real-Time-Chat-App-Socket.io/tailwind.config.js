/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#6366F1",
        accent: "#22C55E",
        background: "#1E1E2F",
        surface: "#2A2A3F",
        danger: "#EF4444",
        border: "#3E3E50", 
      },
    },
  },
};
