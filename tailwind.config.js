/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        text: 'var(--color-text)',
        bg: 'var(--color-body-bg)',
        primary: 'var(--color-primary)',
        'primary-bg': 'var(--color-primary-bg)',
        secondary: 'var(--color-secondary)',
        'secondary-bg': 'var(--color-secondary-bg)',
        'primary-bg-transparent': 'var(--color-primary-bg-for-transparent)',
        'secondary-bg-transparent': 'var(--color-secondary-bg-for-transparent)',
      },
      keyframes: {
        move: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-50%)' },
        },
      },
      animation: {
        move: 'move 38s infinite',
      },
    },
  },
  plugins: [],
}
