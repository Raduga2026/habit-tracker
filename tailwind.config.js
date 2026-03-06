/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f8b4d8',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        peach: {
          50: '#fdf7f1',
          100: '#fceee8',
          200: '#f8ded6',
          300: '#f4ccbe',
          400: '#eeb8a6',
          500: '#e8a48e',
          600: '#d88c76',
          700: '#c87460',
          800: '#a85c4a',
          900: '#884434',
        },
        mint: {
          50: '#f0fdf9',
          100: '#dffcf0',
          200: '#c0f9e1',
          300: '#a0f5d2',
          400: '#7ef1c3',
          500: '#5eedb4',
          600: '#3dd5a5',
          700: '#2db996',
          800: '#1f9d87',
          900: '#158178',
        },
        cream: {
          50: '#fffdf8',
          100: '#fff9ed',
          200: '#fff3dd',
          300: '#ffeecc',
          400: '#ffe6b3',
          500: '#ffdd99',
          600: '#f1c27a',
          700: '#d4a25e',
          800: '#b58545',
          900: '#94622e',
        }
      },
      fontFamily: {
        sans: ['Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif']
      },
      borderRadius: {
        none: '0',
        sm: '0.375rem',
        DEFAULT: '0.75rem',
        md: '1rem',
        lg: '1.25rem',
        xl: '1.5rem',
        '2xl': '2rem',
        full: '9999px',
      }
    }
  },
  plugins: []
}
