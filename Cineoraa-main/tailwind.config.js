/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        vintage: {
          red: 'var(--vintage-red)',
          gold: 'var(--vintage-gold)',
        },
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
      },
      animation: {
        'film-reel': 'film-reel 4s linear infinite',
        'text-glow': 'text-glow 2s ease-in-out infinite',
      },
      keyframes: {
        'film-reel': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'text-glow': {
          '0%, 100%': { textShadow: '0 0 10px var(--vintage-red)' },
          '50%': { textShadow: '0 0 20px var(--vintage-red), 0 0 30px var(--vintage-red)' },
        },
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
  ],
};