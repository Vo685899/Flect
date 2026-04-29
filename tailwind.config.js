/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}', './lib/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Warm retro palette
        cream:   '#F5F0E8',
        parchment: '#EDE7D9',
        paper:   '#E8E0D0',
        coral:   '#C4794A',
        'coral-light': '#D4896A',
        'coral-dark':  '#A85E35',
        sage:    '#7A9E7E',
        'sage-light':  '#9AB89E',
        'sage-dark':   '#5A7E5E',
        amber:   '#D4A847',
        'amber-light': '#E4C070',
        dusk:    '#8B6F8E',
        slate:   '#6B7B8D',
        ink:     '#1C1917',
        'ink-2': '#44403C',
        'ink-3': '#78716C',
        'ink-4': '#A8A29E',
        // Mood colors (no emojis — use these as border/fill)
        'mood-1': '#E07070', // low
        'mood-2': '#D4A847', // okay-ish
        'mood-3': '#7A9E7E', // neutral/good
        'mood-4': '#6B9EC4', // good
        'mood-5': '#C4794A', // great
      },
      fontFamily: {
        display: ['DM Serif Display', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '20px',
        '3xl': '28px',
      },
    },
  },
  plugins: [],
};
