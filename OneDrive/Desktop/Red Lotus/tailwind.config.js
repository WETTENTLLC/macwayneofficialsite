/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Make sure this covers all your component files
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Bebas Neue', 'Impact', 'sans-serif'],
        'sunshine': ['SUNSHINE', 'system-ui', 'sans-serif'],
      },
      colors: {
        'red-lotus': '#e53e3e', // Example red - adjust to your actual color
        'yellow-lotus': '#f6e05e', // Example yellow - adjust
        'blue-lotus': '#4299e1', // Example blue - adjust
        'green-lotus': '#48bb78', // Example green - adjust
        'brown-lotus': '#a0aec0', // Example brown/gray - adjust
        'pink-lotus': '#ed64a6', // Example pink - adjust
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Add forms plugin if not already present for better default form styling
  ],
}
