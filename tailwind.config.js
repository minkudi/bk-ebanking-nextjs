/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Couleurs NextAdmin
        primary: '#047857',
        'gray-dark': '#1f2937',
        'gray-2': '#f3f4f6',
        dark: '#111827',
        'dark-2': '#1e293b',
        'dark-3': '#334155',
        'dark-4': '#64748b',
        'dark-6': '#94a3b8',
        stroke: '#e5e7eb',
      },
      fontSize: {
        'body-sm': '0.875rem',
        'heading-3': '1.875rem',
      },
      boxShadow: {
        '1': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'card': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
