/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Darkish grey background (#17181c / #111215) with 0D1C42 card surfaces, 22396F borders, and FCF1D0 cream accent
        ink: {
          950: '#111215', // Deep darkish grey
          900: '#17181c', // Primary darkish grey background
          850: '#1e2026',
          800: '#0D1C42', // Card and panel surfaces (Navy surface)
          750: '#162754',
          700: '#22396F', // Borders and interactive elements (Sapphire)
          600: '#2B4685',
          500: '#3A5DAE',
        },
        navy: {
          deep: '#17181c',
          surface: '#0D1C42',
          border: '#22396F',
        },
        bone: '#FCF1D0', // Champagne cream text
        slate: {
          DEFAULT: '#C3CEE6', // Soft slate with high contrast
          muted: '#8A9DBF',
          dark: '#586E9E',
        },
        accent: {
          DEFAULT: '#FCF1D0', // Champagne / pale gold accent
          hover: '#FFFFFF',
          muted: '#D8D1BE',
          glow: 'rgba(252, 241, 208, 0.25)',
        },
        mint: '#FCF1D0',
        danger: '#FF6B6B',
        warn: '#FFD166',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      keyframes: {
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
      animation: { marquee: 'marquee 40s linear infinite' },
    },
  },
  plugins: [],
};
