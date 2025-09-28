/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        success: '#22C55E',
        'primary-50': '#EFF6FF',
        'primary-100': '#DBEAFE',
        'primary-500': '#3B82F6',
        'primary-600': '#2563EB',
        'primary-700': '#1D4ED8',
        'success-50': '#F0FDF4',
        'success-100': '#DCFCE7',
        'success-500': '#22C55E',
        'success-600': '#16A34A',
        'success-700': '#15803D',
      },
    },
  },
  plugins: [],
};