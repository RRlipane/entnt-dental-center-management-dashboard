/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      /* ---------- ENTNT palette ---------- */
      colors: {
        primary        : '#2563eb',
        primaryHover   : '#1d4ed8',
        success        : '#10b981',
        danger         : '#ef4444',
        surface        : '#ffffff',
        'surface-muted': '#f9fafb',
      },

      /* ---------- radius / shadow ---------- */
      borderRadius: { card: '0.75rem' },
      boxShadow:   { card: '0 1px 2px 0 rgb(0 0 0 / 0.05)' },

      /* ---------- dynamic font‑sizes ---------- */
      fontSize: {
        'dynamic-sm': ['clamp(0.875rem,2vw,1rem)',   { lineHeight: '1.25' }],
        'dynamic-md': ['clamp(1rem,3vw,1.25rem)',    { lineHeight: '1.3'  }],
        'dynamic-lg': ['clamp(1.25rem,4vw,1.5rem)',  { lineHeight: '1.35' }],
      },
    },
  },

  plugins: [
    /* 🧩 1. animated utilities */
    function ({ addUtilities, theme }) {
      addUtilities({
        '.animate-fade-in-up'  : { animation: 'fade-in-up   .2s cubic-bezier(0.16,1,0.3,1)   forwards' },
        '.animate-fade-out-down':{ animation: 'fade-out-down .2s cubic-bezier(0.16,1,0.3,1)   forwards' },
        '.animate-fade-in'     : { animation: 'fade-in       .15s ease-out forwards' },
      });
    },

    /* 🧩 2. transition‑speed helpers  */
    function ({ addUtilities }) {
      addUtilities({
        '.transition-slow'  : { transition: 'all 300ms cubic-bezier(0.4,0,0.2,1)' },
        '.transition-medium': { transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)' },
        '.transition-fast'  : { transition: 'all 100ms cubic-bezier(0.4,0,0.2,1)' },
      });
    },

    /* 🧩 3. scroll‑bar styling */
    function ({ addUtilities, theme }) {
      addUtilities({
        '.scrollbar-thin'                     : { scrollbarWidth: 'thin', scrollbarColor: `${theme('colors.gray.300')} ${theme('colors.gray.100')}` },
        '.scrollbar-thin::-webkit-scrollbar'  : { width: '8px', height: '8px' },
        '.scrollbar-thin::-webkit-scrollbar-track': { backgroundColor: theme('colors.gray.100') },
        '.scrollbar-thin::-webkit-scrollbar-thumb': { backgroundColor: theme('colors.gray.300'), borderRadius: '4px' },
      });
    },

    /* 🧩 4. button / card component classes  */
    function ({ addComponents, theme }) {
      addComponents({
        '.btn-animated': {
          position   : 'relative',
          overflow   : 'hidden',
          transition : 'all .2s cubic-bezier(0.4,0,0.2,1)',
          '&:hover'  : { transform: 'scale(1.05)' },
          '&:active' : { transform: 'scale(0.95)' },
        },
        '.card' : {
          backgroundColor: theme('colors.surface'),
          borderRadius   : theme('borderRadius.card'),
          boxShadow      : theme('boxShadow.card'),
          transition     : 'all .2s cubic-bezier(0.4,0,0.2,1)',
          '&:hover'      : { boxShadow: theme('boxShadow.md') },
          '.dark &':     { backgroundColor: theme('colors.gray.800') },
        },
      });
    },
  ],
};
