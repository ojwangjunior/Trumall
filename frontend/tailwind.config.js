/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        orange: {
          DEFAULT: '#f68b1e',
          dark: '#e67e17',
        },
        black: '#000000',
        white: '#ffffff',
      },
    },
  },
  plugins: [],
};
