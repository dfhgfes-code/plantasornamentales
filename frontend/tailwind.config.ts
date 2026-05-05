import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      colors: {
        pink: {
          50: '#fcfaf9', 100: '#f6efed', 200: '#e8dada',
          300: '#d5bdba', 400: '#c49792', 500: '#ab7e79',
          600: '#8e645e', 700: '#75504b', 800: '#5e403d', 900: '#4a322f',
        },
        sage: {
          50: '#f5f7f5', 100: '#e6ebe6', 200: '#cfd9d0',
          300: '#aebfab', 400: '#8ba38d', 500: '#758c77',
          600: '#5e7360', 700: '#4d5e4e', 800: '#404d40', 900: '#3a4a3c',
        },
        cream: {
          DEFAULT: '#FAFAF8',
          dark: '#F0F0EA',
        },
        blush: '#fcfaf9',
        petal: '#f6efed',
      },
      boxShadow: {
        'soft': '0 4px 40px rgba(171, 126, 121, 0.08)',
        'card': '0 2px 20px rgba(0,0,0,0.03)',
        'modal': '0 25px 80px rgba(0,0,0,0.12)',
        'pink': '0 4px 20px rgba(171, 126, 121, 0.25)',
        'glass': '0 8px 32px 0 rgba(171, 126, 121, 0.05)',
      },
    },
  },
  plugins: [],
};
export default config;
