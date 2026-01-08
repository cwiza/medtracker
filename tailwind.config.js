/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontSize: {
        'med-name': '1.125rem', // 18px
        'med-dose': '1.5rem',   // 24px
      },
    },
  },
  plugins: [],
};
