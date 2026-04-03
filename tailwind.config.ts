import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Design system colors from IMPACT GOLF
        'bg-primary': '#0e0e0e',
        'surface': '#0e0e0e',
        'surface-container': '#1a1a1a',
        'surface-container-low': '#131313',
        'surface-container-high': '#20201f',
        'surface-container-highest': '#262626',
        'primary-container': '#cafd00', // Neon accent
        'primary-fixed': '#cafd00',
        'on-primary-fixed': '#3a4a00', // Text on neon
        'primary': '#f3ffca', // Soft lime
        'on-surface': '#ffffff',
        'on-surface-variant': '#adaaaa',
        'error': '#ff7351',
        'outline-variant': '#484847',
      },
      fontFamily: {
        'headline': ['var(--font-manrope)', 'sans-serif'],
        'body': ['var(--font-inter)', 'sans-serif'],
      },
      borderRadius: {
        'full': '9999px',
        'xl': '1rem',
        '2xl': '2rem',
      },
      boxShadow: {
        'neon': '0_0_30px_rgba(202,253,0,0.3)',
        'neon-lg': '0_0_60px_rgba(202,253,0,0.4)',
      },
      textShadow: {
        'neon': '0 0 15px rgba(202, 253, 0, 0.8)',
      },
      backdropBlur: {
        'xl': '12px',
      },
      backgroundImage: {
        'impact-gradient': 'linear-gradient(45deg, #cafd00, #f3ffca)',
      },
    },
  },
  plugins: [
    function ({ addUtilities }: { addUtilities: any }) {
      addUtilities({
        '.text-shadow-neon': {
          'text-shadow': '0 0 15px rgba(202, 253, 0, 0.8)',
        },
        '.glass-bg': {
          'backdrop-filter': 'blur(12px)',
          'background-color': 'rgba(14, 14, 14, 0.6)',
        },
        '.glass-panel': {
          'backdrop-filter': 'blur(48px)',
          'background-color': 'rgba(38, 38, 38, 0.6)',
        },
      });
    },
  ],
}

export default config
