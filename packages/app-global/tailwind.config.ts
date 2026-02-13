import baseConfig from '@gbeata/tailwind-config/tailwind.config';

/** @type {import('tailwindcss').Config} */
const config = {
  presets: [baseConfig],
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#00d1d1',
      },
    },
  },
};

export default config;
