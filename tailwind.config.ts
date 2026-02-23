import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#ecfdf3',
          100: '#d1fae3',
          200: '#a7f3c8',
          300: '#6ee7a4',
          400: '#34d37f',
          500: '#17b265',
          600: '#0f8c4f',
          700: '#116f43',
          800: '#135936',
          900: '#13492e'
        }
      },
      boxShadow: {
        soft: '0 10px 30px -12px rgba(16, 24, 40, 0.22)'
      }
    }
  },
  plugins: []
};

export default config;
