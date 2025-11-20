/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'mongo': '#be185d',
        'pg': '#1e40af',
        'code-bg': '#1e1e1e',
        'code-text': '#d4d4d4',
      },
      fontFamily: {
        mono: ['"Menlo"', '"Consolas"', 'monospace'],
      },
    },
  },
  plugins: [],
}
