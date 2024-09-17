import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        primary: '#fe8d3f',
        secondary: '#742b5a',
        tertiary: '#0a1236',
        dark: '#160b1b',
        'dark-100': '#5e3383',
      },
      fontFamily: {
        primary: ['SwitzerVariable', 'sans-serif'],
        secondary: ['DharmaGothicE', 'serif'],
      },
    },
  },
  plugins: [],
};
export default config;
