import type { Config } from 'tailwindcss'

const config: Config = {
  safelist: [
    'bg-lime',
    'text-swiss-black',
    'text-swiss-text',
    'text-swiss-muted',
    'border-swiss-border',
    'bg-swiss-surface',
    'bg-swiss-black',
  ],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        lime: '#D4FF00',
        'swiss-black': '#000000',
        'swiss-white': '#FFFFFF',
        'swiss-surface': '#F7F7F7',
        'swiss-border': '#E0E0E0',
        'swiss-text': '#212121',
        'swiss-muted': '#616161',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
