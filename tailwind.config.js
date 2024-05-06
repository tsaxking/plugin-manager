/** @type {import('tailwindcss').Config} */
module.exports = {
darkMode: 'class',
  content: ["./src/**/*.{tsx, sx}", "./src/*.{ts, tsx}", "./static/*.html"],
  theme: {
      screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
      },
      extend: {
          backgroundImage: {
              'gradient-radial': 'radial-gradient(var(--gradient-color-stops))',
          }
      },
  },
  plugins: [],
}