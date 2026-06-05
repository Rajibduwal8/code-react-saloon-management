export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          cream: '#F5F0EB',
          sand: '#E8DDD4',
          warm: '#C9A882',
          brown: '#8B5E3C',
          dark: '#3D2B1F',
          accent: '#A0522D',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
      }
    }
  },
  plugins: []
}
