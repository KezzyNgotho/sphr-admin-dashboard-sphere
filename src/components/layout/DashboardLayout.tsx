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
  SwatchIcon,
  BellIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useTheme, themes } from '../../contexts/ThemeContext'
import type { ThemeKey } from '../../contexts/ThemeContext'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  
  { name: 'Tokens', href: '/token', icon: CurrencyDollarIcon },
  { name: 'Exchange', href: '/exchange', icon: ArrowsRightLeftIcon },
  { name: 'Roles', href: '/roles', icon: UserGroupIcon },
  { name: 'Contract Lifecycle', href: '/contracts', icon: DocumentTextIcon },
  { name: 'User Management', href: '/users', icon: UserCircleIcon },
  { name: 'Security', href: '/security', icon: ShieldCheckIcon },
  { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
]

interface DashboardLayoutProps {
  children: ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { darkMode, toggleDarkMode, currentTheme, changeTheme, theme } = useTheme()
  const [themeMenuOpen, setThemeMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: true
  })
  const [language, setLanguage] = useState('en')
  const [currency, setCurrency] = useState('USD')
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: false,
    autoLock: true
  })
  
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
  
  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSecurityChange = (type: keyof typeof security) => {
    setSecurity(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

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
            {/* Search Button */}
            <button
              className={`rounded-full p-2 text-${theme.secondary}-400 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-600 dark:hover:text-${theme.secondary}-300 transition-colors`}
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                className={`rounded-full p-2 text-${theme.secondary}-400 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-600 dark:hover:text-${theme.secondary}-300 transition-colors`}
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>

            {/* User Profile */}
            <div className="relative">
              <button
                className={`flex items-center rounded-full p-1 text-${theme.secondary}-400 hover:bg-${theme.secondary}-100 dark:hover:bg-${theme.secondary}-700 hover:text-${theme.secondary}-600 dark:hover:text-${theme.secondary}-300 transition-colors`}
              >
                <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-300">JD</span>
                </div>
              </button>
            </div>

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
          </div>
        </div>

        <main className={`flex-1 overflow-y-auto bg-${theme.secondary}-50 dark:bg-${theme.secondary}-900 p-6 transition-colors duration-200`}>
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <Link href="/dashboard" className={`text-sm font-medium text-${theme.secondary}-500 hover:text-${theme.secondary}-700 dark:text-${theme.secondary}-400 dark:hover:text-${theme.secondary}-300`}>
                      Dashboard
                    </Link>
                  </div>
                </li>
                {pathname !== '/dashboard' && (
                  <>
                    <li>
                      <div className="flex items-center">
                        <ChevronRightIcon className={`h-5 w-5 flex-shrink-0 text-${theme.secondary}-400`} aria-hidden="true" />
                        <span className={`ml-2 text-sm font-medium text-${theme.secondary}-500 dark:text-${theme.secondary}-400`}>
                          {(() => {
                            const pathParts = pathname.split('/').filter(Boolean)
                            const lastPart = pathParts[pathParts.length - 1] || ''
                            return lastPart.charAt(0).toUpperCase() + lastPart.slice(1)
                          })()}
                        </span>
                      </div>
                    </li>
                  </>
                )}
              </ol>
            </nav>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
              </div>
            )}

            {/* Main Content */}
            {!isLoading && children}
          </div>
        </main>
      </div>

      {/* Settings Panel */}
      {settingsOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSettingsOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
            <div className="w-screen max-w-md">
              <div className="h-full flex flex-col bg-white dark:bg-gray-800 shadow-xl">
                <div className="flex-1 overflow-y-auto py-6 px-4 sm:px-6">
                  <div className="flex items-start justify-between">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Settings</h2>
                    <button
                      onClick={() => setSettingsOpen(false)}
                      className="rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>

                  <div className="mt-6 space-y-6">
                    {/* Profile Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Profile Settings</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={user?.user_metadata?.email || ''}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Wallet Address
                          </label>
                          <input
                            type="text"
                            value={user?.address || ''}
                            disabled
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Notification Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notification Settings</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive updates via email</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange('email')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              notifications.email ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                notifications.email ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Push Notifications</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Receive push notifications</p>
                          </div>
                          <button
                            onClick={() => handleNotificationChange('push')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              notifications.push ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                notifications.push ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Security Settings */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h3>
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security</p>
                          </div>
                          <button
                            onClick={() => handleSecurityChange('twoFactor')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              security.twoFactor ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">Biometric Authentication</h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Use fingerprint or face ID</p>
                          </div>
                          <button
                            onClick={() => handleSecurityChange('biometric')}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                              security.biometric ? 'bg-indigo-600' : 'bg-gray-200 dark:bg-gray-700'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                                security.biometric ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Preferences</h3>
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Language
                          </label>
                          <select
                            value={language}
                            onChange={(e) => setLanguage(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="en">English</option>
                            <option value="es">Spanish</option>
                            <option value="fr">French</option>
                            <option value="de">German</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Currency
                          </label>
                          <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          >
                            <option value="USD">USD ($)</option>
                            <option value="EUR">EUR (€)</option>
                            <option value="GBP">GBP (£)</option>
                            <option value="JPY">JPY (¥)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
