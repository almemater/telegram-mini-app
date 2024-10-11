import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#fe8d3f',
        secondary: '#742b5a',
        tertiary: '#0a1236',
        dark: '#160b1b',

        "primary-100": '#f36464',
        "primary-200": '#a11e1e',
        
        "tertiary-100": '#af64f3',
        "tertiary-200": '#521ea1',
        
        'dark-100': '#5e3383',
        'dark-200': '#372241',
      },
      fontFamily: {
        primary: ['SwitzerVariable', 'sans-serif'],
        secondary: ['DharmaGothicE', 'serif'],
      },
      keyframes: {
        'gradient-shift': {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
      },
      animation: {
        'bg-gradient': 'gradient-shift 5s ease infinite',
      },
    },
  },
  plugins: [],
};
export default config;
