/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
      './app/**/*.{js,ts,jsx,tsx}',
      './components/**/*.{js,ts,jsx,tsx}',
    ],
    safelist: [
      // Generate color classes for all themes
      ...['indigo', 'emerald', 'rose', 'amber', 'violet', 'cyan'].flatMap(color => [
        // Background colors
        `bg-${color}-50`,
        `bg-${color}-100`,
        `bg-${color}-500`,
        `bg-${color}-600`,
        `bg-${color}-900/30`,
        // Text colors
        `text-${color}-300`,
        `text-${color}-400`,
        `text-${color}-500`,
        `text-${color}-600`,
        `text-${color}-700`,
        // Border colors
        `border-${color}-100`,
        `border-${color}-200`,
        `border-${color}-400`,
        `border-${color}-700`,
        // Hover states
        `hover:bg-${color}-100`,
        `hover:bg-${color}-700`,
        `hover:text-${color}-500`,
        `hover:text-${color}-600`,
        `hover:text-${color}-800`,
        `hover:text-${color}-900`,
        // Dark mode variants
        `dark:bg-${color}-800`,
        `dark:bg-${color}-900`,
        `dark:bg-${color}-900/30`,
        `dark:text-${color}-300`,
        `dark:text-${color}-400`,
        `dark:text-${color}-500`,
        `dark:border-${color}-700`,
        `dark:hover:bg-${color}-700`,
        `dark:hover:text-${color}-300`,
        `dark:hover:text-${color}-400`,
        // Group hover
        `group-hover:text-${color}-400`,
        `group-hover:text-${color}-500`,
        `dark:group-hover:text-${color}-400`,
      ]),
      // Slate colors for secondary
      ...['slate'].flatMap(color => [
        `bg-${color}-50`,
        `bg-${color}-100`,
        `bg-${color}-700`,
        `bg-${color}-800`,
        `bg-${color}-900`,
        `text-${color}-300`,
        `text-${color}-400`,
        `text-${color}-500`,
        `text-${color}-600`,
        `text-${color}-900`,
        `border-${color}-100`,
        `border-${color}-200`,
        `border-${color}-700`,
        `hover:bg-${color}-100`,
        `hover:bg-${color}-700`,
        `hover:text-${color}-500`,
        `hover:text-${color}-600`,
        `hover:text-${color}-800`,
        `hover:text-${color}-900`,
        `dark:bg-${color}-700`,
        `dark:bg-${color}-800`,
        `dark:bg-${color}-900`,
        `dark:text-${color}-300`,
        `dark:text-${color}-400`,
        `dark:text-${color}-500`,
        `dark:border-${color}-700`,
        `dark:hover:bg-${color}-700`,
        `dark:hover:text-${color}-300`,
        `dark:hover:text-${color}-400`,
        `group-hover:text-${color}-400`,
        `group-hover:text-${color}-500`,
        `dark:group-hover:text-${color}-400`,
      ]),
    ],
    theme: {
      extend: {
        animation: {
          'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [],
  }
  