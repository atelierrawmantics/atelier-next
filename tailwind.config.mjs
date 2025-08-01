import { theme as colorToken } from './src/generated/theme-token'
import textStylesPlugin from './src/plugins/text-styles'

/** @type {import('tailwindcss').Config} */
const config = {
  darkMode: 'class',
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}', './src/plugins/**/*.{js,ts}'],

  prefix: '',
  theme: {
    screens: {
      sm: '768px',
      md: '1280px',
      lg: '1920px',
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '16px',
        sm: '20px',
        md: '80px',
        lg: '320px',
      },
    },
    extend: {
      colors: {
        ...colorToken,
      },
      fontFamily: {
        sans: ['var(--font-pretendard)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-pretendard)', 'monospace'],
      },
      gridTemplateRows: {
        layout: '60px 1fr auto',
      },
      boxShadow: {
        sm: '0 2px 8px 0 rgb(0, 0, 0, 0.025), 0 0 1px rgba(0,0,0,0.1)',
        DEFAULT: '0 4px 16px 0 rgb(0, 0, 0, 0.05), 0 0 1px rgba(0,0,0,0.1)',
        md: '0 6px 24px 0 rgb(0, 0, 0, 0.075), 0 0 1px rgba(0,0,0,0.1)',
        lg: '0 8px 32px 0 rgb(0, 0, 0, 0.1), 0 0 1px rgba(0,0,0,0.1)',
        xl: '0 12px 48px 0 rgb(0, 0, 0, 0.125), 0 0 1px rgba(0,0,0,0.1)',
        '2xl': '0 16px 64px 0 rgb(0, 0, 0, 0.15), 0 0 1px rgba(0,0,0,0.1)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [textStylesPlugin],
}

export default config
