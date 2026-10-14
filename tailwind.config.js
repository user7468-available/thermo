/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Kanit', 'Prompt', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Primary: deep medical blue
        brand: {
          50: '#eef4fc',
          100: '#d6e4f7',
          200: '#aec9ef',
          300: '#7ba7e3',
          400: '#4a80d2',
          500: '#0b4f9e',
          600: '#093f80',
          700: '#072d5e',
          800: '#051f42',
          900: '#03132a',
        },
        // Status palette — reserved for sensor state only
        status: {
          good: '#0ca30c',
          'good-ink': '#116b11',
          'good-bg': '#e8f7e8',
          warn: '#fab219',
          'warn-ink': '#8a5a06',
          'warn-bg': '#fdf3dd',
          crit: '#d03b3b',
          'crit-ink': '#a81f1f',
          'crit-bg': '#fbe9e9',
        },
        ink: {
          DEFAULT: '#14181f',
          soft: '#4a5464',
          muted: '#7c8798',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(7,45,94,0.06), 0 6px 20px -8px rgba(7,45,94,0.18)',
        lift: '0 10px 30px -10px rgba(7,45,94,0.35)',
      },
      transitionTimingFunction: {
        medical: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
      },
    },
  },
  plugins: [],
}
