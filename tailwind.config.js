/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['src/**/*.{ts,tsx,jsx,js,html}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        /* your brand palette */
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',      // ←  referenced in globals.css
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      boxShadow: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      },
      keyframes: {
        'fade-in-up': {
          '0%':   { opacity: 0, transform: 'translateY(8px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        'fade-out-down': {
          '0%':   { opacity: 1, transform: 'translateY(0)' },
          '100%': { opacity: 0, transform: 'translateY(8px)' },
        },
        'fade-in': {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
      },
      animation: {
        'fade-in-up':   'fade-in-up .2s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-out-down':'fade-out-down .2s cubic-bezier(0.16,1,0.3,1) forwards',
        'fade-in':      'fade-in .15s ease-out forwards',
      },
    },
  },
  plugins: [],
};
