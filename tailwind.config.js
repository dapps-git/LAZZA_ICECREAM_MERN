/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    borderRadius: {
      none: '0px',
      sm: '0px',
      DEFAULT: '0px',
      md: '0px',
      lg: '0px',
      xl: '0px',
      '2xl': '0px',
      '3xl': '0px',
      full: '0px',
    },
    extend: {
      colors: {
        violet: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7e22ce',
          800: '#581c87',
          900: '#3b185f', // Deep Lazza Violet
          950: '#230a3a', // Darkest Sidebar Violet
        },
        yellow: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b', // Lazza Golden Yellow
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        lazza: {
          violet: '#3b185f',
          deepViolet: '#230a3a',
          purple: '#4c1d95',
          gold: '#f59e0b',
          brightYellow: '#fbbf24',
          softYellow: '#fef3c7',
          bg: '#fcfbfe',
        }
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 2px 6px -1px rgba(59, 24, 95, 0.06), 0 1px 3px -1px rgba(59, 24, 95, 0.04)',
        'card-hover': '0 12px 28px -6px rgba(59, 24, 95, 0.12), 0 8px 12px -6px rgba(245, 158, 11, 0.1)',
        'yellow-glow': '0 4px 20px -2px rgba(245, 158, 11, 0.35)',
        'violet-glow': '0 4px 20px -2px rgba(59, 24, 95, 0.35)',
      }
    },
  },
  plugins: [],
};
