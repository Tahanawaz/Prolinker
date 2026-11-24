import forms from '@tailwindcss/forms';
import type { Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1280px' },
    },
    extend: {
      colors: {
        // Brand: deep emerald (trust, growth) + warm amber (action, energy).
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
          700: '#047857',
          800: '#065f46',
          900: '#064e3b',
          950: '#022c22',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        ink: {
          DEFAULT: '#0b1220',
          soft: '#334155',
          muted: '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
        display: ['"Plus Jakarta Sans"', 'Inter', ...defaultTheme.fontFamily.sans],
        urdu: [
          '"Noto Nastaliq Urdu"',
          '"Jameel Noori Nastaleeq"',
          ...defaultTheme.fontFamily.serif,
        ],
      },
      screens: { xs: '420px' },
      boxShadow: {
        soft: '0 1px 2px rgb(15 23 42 / 0.04), 0 8px 24px -6px rgb(15 23 42 / 0.08)',
        lift: '0 2px 4px rgb(15 23 42 / 0.04), 0 24px 48px -12px rgb(15 23 42 / 0.18)',
        glow: '0 0 0 1px rgb(16 185 129 / 0.25), 0 12px 40px -8px rgb(16 185 129 / 0.45)',
        'glow-accent': '0 10px 30px -10px rgb(245 158 11 / 0.65)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'slide-down': {
          from: { opacity: '0', transform: 'translateY(-8px) scale(0.98)' },
          to: { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        marquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.5s ease-out both',
        float: 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'slide-down': 'slide-down 0.2s cubic-bezier(0.22, 1, 0.36, 1) both',
        marquee: 'marquee 40s linear infinite',
      },
    },
  },
  plugins: [forms],
} satisfies Config;
