/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",

        // App backgrounds
        background: "#F9FAFB",        // main app background
        surface: "#F1F5F9",           // cards / incoming messages

        // Brand & actions
        primary: "#2563EB",           // buttons, links, highlights
        outgoing: "#DBEAFE",          // outgoing message bubble

        // Text
        text: "#111827",              // primary text
        muted: "#6B7280",             // secondary text

        // UI elements
        border: "#E5E7EB",             // dividers, outlines

        // States
        danger: "#EF4444",             // errors / destructive actions
      },
    },
  },
};

