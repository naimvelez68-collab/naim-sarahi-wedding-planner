import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olive: {
          50:  '#F4F6EE',
          100: '#E8EDDC',
          200: '#D1DBBA',
          300: '#B3C48F',
          400: '#8FA65E',
          500: '#6B7A3A',
          600: '#556130',
          700: '#3F4824',
          800: '#2A3018',
          900: '#15180C',
        },
        gold: {
          50:  '#FDF8EC',
          100: '#FAF0D0',
          200: '#F4DFA1',
          300: '#EDCA6C',
          400: '#D4AF37',
          500: '#C9A020',
          600: '#A07E18',
          700: '#785E12',
          800: '#503F0C',
          900: '#281F06',
        },
        cream: '#F8F4ED',
        blush: '#F0E8E8',
        parchment: '#FAF7F0',
      },
      fontFamily: {
        serif:  ['Cormorant Garamond', 'Georgia', 'serif'],
        sans:   ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'wedding-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236B7A3A' fill-opacity='0.04'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10S0 14.5 0 20s4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5 4.5-10 10-10s10 4.5 10 10-4.5 10-10 10-10-4.5-10-10z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'pulse-soft': 'pulseSoft 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-8px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
