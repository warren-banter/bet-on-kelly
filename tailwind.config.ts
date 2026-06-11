import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './content/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Single accent colour for the whole site: electric green.
        accent: {
          DEFAULT: '#2bff88',
          bright: '#5dffa6',
          dim: '#13c46e',
        },
        ink: {
          DEFAULT: '#eef2ef',
          soft: '#96a39b',
        },
        page: '#070809', // near-black background
        surface: '#111513', // card surface
        raised: '#181d1a', // raised / hover surface
        line: '#252c27', // borders
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
