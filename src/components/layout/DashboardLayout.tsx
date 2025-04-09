'use client'

import { ReactNode, useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  SwatchIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { ThemeProvider } from '../../contexts/ThemeContext'


// Theme definitions
type ThemeKey = 'indigo' | 'emerald' | 'rose' | 'amber' | 'violet' | 'cyan'

const themes: Record<ThemeKey, { name: string; primary: string; secondary: string }> = {
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

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tokens', href: '/token', icon: CurrencyDollarIcon },
  { name: 'Exchange', href: '/exchange', icon: ArrowsRightLeftIcon },
  { name: 'Roles', href: '/roles', icon: UserGroupIcon },
  { name: 'Security', href: '/security', icon: ShieldCheckIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [currentTheme, setCurrentTheme] = useState<ThemeKey>('indigo')
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  
  // Initialize theme from localStorage on component mount
  useEffect(() => {
    // Check for dark mode preference
    const savedDarkMode = localStorage.getItem('darkMode')
    if (savedDarkMode === 'true') {
      setDarkMode(true)
      document.documentElement.classList.add('dark')
    }
    
    // Check for theme preference
    const savedTheme = localStorage.getItem('theme') as ThemeKey
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
  const changeTheme = (theme: ThemeKey) => {
    setCurrentTheme(theme)
    localStorage.setItem('theme', theme)
    setThemeMenuOpen(false)
  }
  
  // Get current theme colors
  const theme = themes[currentTheme]
  
  // Close theme menu when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setThemeMenuOpen(false)
    }
    
    if (themeMenuOpen) {
      document.addEventListener('click', handleClickOutside)
    }
    
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [themeMenuOpen])
  
  return (
    <div className={`flex h-screen bg-${theme.secondary}-50 dark:bg-${theme.secondary}-900 transition-colors duration-200`}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-800 bg-opacity-75 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white dark:bg-${theme.secondary}-800 shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className={`flex h-16 items-center justify-between px-6 border-b border-${theme.secondary}-100 dark:border-${theme.secondary}-700`}>
          <h1 className={`text-lg font-bold text-${theme.primary}-600 dark:text-${theme.primary}-400`}>SPHR</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className={`rounded-full p-1.5 text-${theme.secondary}-400 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-600 dark:hover:text-${theme.secondary}-300 transition-colors`}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-3 py-2.5 my-1 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive
                    ? `bg-${theme.primary}-50 dark:bg-${theme.primary}-900/30 text-${theme.primary}-700 dark:text-${theme.primary}-300`
                    : `text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white`
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 ${
                    isActive ? `text-${theme.primary}-500 dark:text-${theme.primary}-400` : `text-${theme.secondary}-400 dark:text-${theme.secondary}-500 group-hover:text-${theme.secondary}-500 dark:group-hover:text-${theme.secondary}-400`
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className={`border-t border-${theme.secondary}-100 dark:border-${theme.secondary}-700 p-4`}>
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={toggleDarkMode}
              className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white transition-colors`}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5 mr-2" />
              ) : (
                <MoonIcon className="h-5 w-5 mr-2" />
              )}
              {darkMode ? 'Light Mode' : 'Dark Mode'}
            </button>
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white transition-colors`}
              >
                <SwatchIcon className="h-5 w-5" />
              </button>
              
              {themeMenuOpen && (
                <div className={`absolute bottom-full left-0 mb-2 w-48 rounded-lg bg-white dark:bg-${theme.secondary}-800 shadow-lg ring-1 ring-black ring-opacity-5 p-2 z-10`}>
                  {Object.keys(themes).map((themeKey) => {
                    const typedThemeKey = themeKey as ThemeKey
                    return (
                      <button
                        key={themeKey}
                        onClick={() => changeTheme(typedThemeKey)}
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                          currentTheme === typedThemeKey 
                            ? `bg-${themes[typedThemeKey].primary}-50 dark:bg-${themes[typedThemeKey].primary}-900/30 text-${themes[typedThemeKey].primary}-700 dark:text-${themes[typedThemeKey].primary}-300` 
                            : `text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700`
                        }`}
                      >
                        <div className={`w-4 h-4 mr-2 rounded-full bg-${themes[typedThemeKey].primary}-500`}></div>
                        {themes[typedThemeKey].name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
          
          <button
            className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white transition-colors`}
          >
            <ArrowRightOnRectangleIcon
              className={`mr-3 h-5 w-5 text-${theme.secondary}-400 dark:text-${theme.secondary}-500`}
              aria-hidden="true"
            />
            Sign out
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <div className={`flex h-full flex-1 flex-col border-r border-${theme.secondary}-200 dark:border-${theme.secondary}-700 bg-white dark:bg-${theme.secondary}-800 shadow-sm transition-colors duration-200`}>
          <div className={`flex flex-shrink-0 items-center h-16 px-6 border-b border-${theme.secondary}-100 dark:border-${theme.secondary}-700`}>
            <h1 className={`text-lg font-bold text-${theme.primary}-600 dark:text-${theme.primary}-400`}>SPHR</h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-3 py-2.5 my-1 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? `bg-${theme.primary}-50 dark:bg-${theme.primary}-900/30 text-${theme.primary}-700 dark:text-${theme.primary}-300`
                      : `text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white`
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`absolute left-0 top-0 bottom-0 w-1 bg-${theme.primary}-600 dark:bg-${theme.primary}-400 rounded-r-full`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? `text-${theme.primary}-500 dark:text-${theme.primary}-400` : `text-${theme.secondary}-400 dark:text-${theme.secondary}-500 group-hover:text-${theme.secondary}-500 dark:group-hover:text-${theme.secondary}-400`
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          <div className={`flex-shrink-0 border-t border-${theme.secondary}-100 dark:border-${theme.secondary}-700 p-4 mt-auto`}>
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={toggleDarkMode}
                className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white transition-colors`}
              >
                {darkMode ? (
                  <SunIcon className="h-5 w-5 mr-2" />
                ) : (
                  <MoonIcon className="h-5 w-5 mr-2" />
                )}
                {darkMode ? 'Light' : 'Dark'}
              </button>
              
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                  className={`flex items-center rounded-lg px-3 py-2 text-sm font-medium text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white transition-colors`}
                >
                  <SwatchIcon className="h-5 w-5" />
                </button>
                {themeMenuOpen && (
                  <div className={`absolute bottom-full right-0 mb-2 w-48 rounded-lg bg-white dark:bg-${theme.secondary}-800 shadow-lg ring-1 ring-black ring-opacity-5 p-2 z-10`}>
                    {Object.keys(themes).map((themeKey) => {
                      const typedThemeKey = themeKey as ThemeKey
                      return (
                        <button
                          key={themeKey}
                          onClick={(e) => {
                            e.stopPropagation();
                            changeTheme(typedThemeKey);
                          }}
                          className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                            currentTheme === typedThemeKey 
                              ? `bg-${themes[typedThemeKey].primary}-50 dark:bg-${themes[typedThemeKey].primary}-900/30 text-${themes[typedThemeKey].primary}-700 dark:text-${themes[typedThemeKey].primary}-300` 
                              : `text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700`
                          }`}
                        >
                          <div className={`w-4 h-4 mr-2 rounded-full bg-${themes[typedThemeKey].primary}-500`}></div>
                          {themes[typedThemeKey].name}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
            
            <button
              className={`flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-900 dark:hover:text-white transition-colors`}
            >
              <ArrowRightOnRectangleIcon
                className={`mr-3 h-5 w-5 text-${theme.secondary}-400 dark:text-${theme.secondary}-500`}
                aria-hidden="true"
              />
              Sign out
            </button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className={`flex h-16 items-center justify-between border-b border-${theme.secondary}-200 dark:border-${theme.secondary}-700 bg-white dark:bg-${theme.secondary}-800 px-4 md:hidden transition-colors duration-200`}>
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className={`mr-4 rounded-lg p-2 text-${theme.secondary}-400 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-600 dark:hover:text-${theme.secondary}-300 transition-colors`}
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <h1 className={`text-lg font-bold text-${theme.primary}-600 dark:text-${theme.primary}-400`}>SPHR</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={toggleDarkMode}
              className={`rounded-full p-2 text-${theme.secondary}-400 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-600 dark:hover:text-${theme.secondary}-300 transition-colors`}
            >
              {darkMode ? (
                <SunIcon className="h-5 w-5" />
              ) : (
                <MoonIcon className="h-5 w-5" />
              )}
            </button>
            
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className={`rounded-full p-2 text-${theme.secondary}-400 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-600 dark:hover:text-${theme.secondary}-300 transition-colors`}
              >
                <SwatchIcon className="h-5 w-5" />
              </button>
              
              {themeMenuOpen && (
                <div className={`absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-${theme.secondary}-800 shadow-lg ring-1 ring-black ring-opacity-5 p-2 z-10`}>
                  {Object.keys(themes).map((themeKey) => {
                    const typedThemeKey = themeKey as ThemeKey
                    return (
                      <button
                        key={themeKey}
                        onClick={(e) => {
                          e.stopPropagation();
                          changeTheme(typedThemeKey);
                        }}
                        className={`flex items-center w-full px-3 py-2 text-sm rounded-md ${
                          currentTheme === typedThemeKey 
                            ? `bg-${themes[typedThemeKey].primary}-50 dark:bg-${themes[typedThemeKey].primary}-900/30 text-${themes[typedThemeKey].primary}-700 dark:text-${themes[typedThemeKey].primary}-300` 
                            : `text-${theme.secondary}-600 dark:text-${theme.secondary}-300 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700`
                        }`}
                      >
                        <div className={`w-4 h-4 mr-2 rounded-full bg-${themes[typedThemeKey].primary}-500`}></div>
                        {themes[typedThemeKey].name}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        <main className={`flex-1 overflow-y-auto bg-${theme.secondary}-50 dark:bg-${theme.secondary}-900 p-6 transition-colors duration-200`}>
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
