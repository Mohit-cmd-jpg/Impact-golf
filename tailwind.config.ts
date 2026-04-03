import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
  "tertiary-fixed": "#ffffff",
  "on-surface": "#ffffff",
  "surface-container": "#1a1a1a",
  "surface-dim": "#0e0e0e",
  "outline": "#767575",
  "secondary-fixed-dim": "#d6d4d3",
  "error-dim": "#d53d18",
  "tertiary-container": "#ebebeb",
  "error": "#ff7351",
  "on-secondary": "#525151",
  "secondary": "#e4e2e1",
  "on-tertiary-fixed": "#4f5051",
  "on-error": "#450900",
  "surface-container-highest": "#262626",
  "surface-variant": "#262626",
  "on-primary-container": "#4a5e00",
  "inverse-on-surface": "#565555",
  "inverse-surface": "#fcf9f8",
  "on-tertiary-fixed-variant": "#6c6d6e",
  "tertiary-dim": "#ebebeb",
  "tertiary": "#f9f9f9",
  "primary": "#f3ffca",
  "on-background": "#ffffff",
  "on-primary": "#516700",
  "surface": "#0e0e0e",
  "error-container": "#b92902",
  "on-error-container": "#ffd2c8",
  "on-surface-variant": "#adaaaa",
  "outline-variant": "#484847",
  "primary-dim": "#beee00",
  "on-primary-fixed": "#3a4a00",
  "on-secondary-fixed-variant": "#5c5b5b",
  "secondary-fixed": "#e4e2e1",
  "surface-tint": "#f3ffca",
  "surface-container-low": "#131313",
  "surface-container-lowest": "#000000",
  "surface-bright": "#2c2c2c",
  "on-primary-fixed-variant": "#526900",
  "tertiary-fixed-dim": "#f1f1f1",
  "primary-fixed": "#cafd00",
  "primary-fixed-dim": "#beee00",
  "secondary-container": "#474747",
  "on-secondary-fixed": "#3f3f3f",
  "on-tertiary-container": "#555757",
  "surface-container-high": "#20201f",
  "background": "#0e0e0e",
  "inverse-primary": "#516700",
  "on-secondary-container": "#d2d0cf",
  "secondary-dim": "#d6d4d3",
  "primary-container": "#cafd00",
  "on-tertiary": "#5e5f5f"
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
      animation: {
        'marquee': 'marquee 25s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
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
