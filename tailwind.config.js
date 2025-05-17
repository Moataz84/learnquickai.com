module.exports = {
  darkMode: "class", 
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        fira: ['var(--font-fira-code)', 'monospace'],
      },
    },
  },
  plugins: [],
};