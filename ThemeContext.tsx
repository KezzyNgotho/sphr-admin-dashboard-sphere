'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

// Theme definitions
export const themes = {
  indigo: {
    name: 'Indigo',
    primary: 'indigo',
    secondary: 'slate'
  },
  emerald: {
    name: 'Emerald',
    primary: 'emerald',
    secondary: 'slate'
  },
  rose: {
    name: 'Rose',
    primary: 'rose',
    secondary: 'slate'
  },
  amber: {
    name: 'Amber',
    primary: 'amber',
    secondary: 'slate'
  },
  violet: {
    name: 'Violet',
    primary: 'violet',
    secondary: 'slate'
  },
  cyan: {
    name: 'Cyan',
    primary: 'cyan',
    secondary: 'slate'
  }
}

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  currentTheme: string;
  changeTheme: (theme: string) => void;
  theme: {
    name: string;
    primary: string;
    secondary: string;
  };
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState('indigo')
  
  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    
    // Check for theme preference
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    localStorage.setItem('darkMode', String(newDarkMode))
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }
  
  // Change theme
  const changeTheme = (theme: string) => {
    if (themes[theme]) {
      setCurrentTheme(theme)
      localStorage.setItem('theme', theme)
    }
  }
  
  // Get current theme colors
  const theme = themes[currentTheme]
  
  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, currentTheme, changeTheme, theme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
