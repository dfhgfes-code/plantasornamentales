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
          50: '#fff5f7', 100: '#ffe4eb', 200: '#ffc2d1',
          300: '#ff9ab5', 400: '#f9688e', 500: '#f0436e',
          600: '#d92b5a', 700: '#b81e4a', 800: '#96163c', 900: '#7a1032',
        },
        blush: '#fdf0f3',
        petal: '#fce7f0',
        sage: '#e8f0e9',
      },
      boxShadow: {
        'soft': '0 4px 30px rgba(240, 67, 110, 0.08)',
        'card': '0 2px 20px rgba(0,0,0,0.05)',
        'modal': '0 25px 80px rgba(0,0,0,0.18)',
        'pink': '0 4px 20px rgba(240, 67, 110, 0.25)',
      },
    },
  },
  plugins: [],
};
export default config;
