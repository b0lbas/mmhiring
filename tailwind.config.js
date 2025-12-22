/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'display': ['Clash Display', 'sans-serif'],
        'mono': ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: {
          pink: '#d24a98',
          dark: '#0A0F1F',
          blue: '#1A1F2E',
          light: '#2A2F3E',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-complex': 'radial-gradient(circle at center, #1A1F2E 0%, #0A0F1F 100%)',
        'gradient-pink': 'linear-gradient(135deg, #d24a98 0%, #FF6B6B 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0A0F1F 0%, #1A1F2E 50%, #2A2F3E 100%)',
        'gradient-path': 'linear-gradient(90deg, #d24a98 0%, #FF6B6B 50%, #d24a98 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'glass-inner': 'inset 0 0 0 1px rgba(255, 255, 255, 0.1)',
        'glow': '0 0 20px rgba(210, 74, 152, 0.3)',
      },
      backdropBlur: {
        'glass': '4px',
      },
      animation: {
        'path-glow': 'path-glow 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'path-glow': {
          '0%, 100%': { 'background-position': '0% 50%' },
          '50%': { 'background-position': '100% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
    },
  },
  plugins: [],
} 