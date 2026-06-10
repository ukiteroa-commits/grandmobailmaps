/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0f1a',
        neon: {
          purple: '#7c3aed',
          blue: '#3b82f6',
          cyan: '#06b6d4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 20px rgba(124,58,237,0.3)',
        'neon-strong': '0 0 30px rgba(124,58,237,0.5)',
      },
    },
  },
  plugins: [],
};
