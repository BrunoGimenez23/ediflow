/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ediblue: '#113769',         // Primario
        ediblueLight: '#3B5C99',    // Primario claro
        edigray: '#F4F6F8',         // Secundario (gris claro)
        editext: '#1F2937',         // Texto principal (gray-800)
        edicyan: '#00AEEF',         // Énfasis
        edigreen: '#4CAF50',        // Éxito
        edired: '#EF4444',          // Error
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          paddingLeft: '1rem',    // px-4 (4 * 0.25rem)
          paddingRight: '1rem',
          paddingTop: '0.5rem',   // py-2 (2 * 0.25rem)
          paddingBottom: '0.5rem',
          borderRadius: '0.375rem',  // rounded-md
          fontWeight: '500',          // font-medium
          transitionProperty: 'all',
          transitionDuration: '200ms',
        },
        '.btn-primary': {
          backgroundColor: theme('colors.ediblue'),
          color: 'white',
          '&:hover': {
            backgroundColor: theme('colors.ediblueLight'),
          },
        },
        '.btn-outline': {
          backgroundColor: 'transparent',
          border: `1px solid ${theme('colors.ediblue')}`,
          color: theme('colors.ediblue'),
          '&:hover': {
            backgroundColor: theme('colors.ediblue'),
            color: 'white',
          },
        },
        '.btn-accent': {
          backgroundColor: theme('colors.edicyan'),
          color: 'white',
          '&:hover': {
            backgroundColor: theme('colors.ediblueLight'),
          },
        },
        '.btn-success': {
          backgroundColor: theme('colors.edigreen'),
          color: 'white',
          '&:hover': {
            opacity: '0.9',
          },
        },
        '.btn-error': {
          backgroundColor: theme('colors.edired'),
          color: 'white',
          '&:hover': {
            opacity: '0.9',
          },
        },
      })
    }),
  ],
}