/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
// Google Sans",Roboto,Arial,sans-serif;
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3C4043',
          hover: '#e8f0fe'
        },
        second: '#5F6368',
        third: '#e0e0e0',
        accent: {
          DEFAULT: '#00ff99',
          hover: '#00e187'
        },
        aux: '#1A73e8'
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      },
      fontFamily: {
        primary: 'var(--font-roboto)'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
}

