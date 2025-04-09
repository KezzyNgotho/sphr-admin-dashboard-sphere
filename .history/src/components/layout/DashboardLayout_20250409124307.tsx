'use client'

import { ReactNode, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tokens', href: '/token', icon: CurrencyDollarIcon },
  { name: 'Exchange', href: '/exchange', icon: CurrencyDollarIcon },
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
  
  return (
    <div className="flex h-screen bg-white">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-56 transform bg-white transition-transform duration-200 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-100">
          <h1 className="text-sm font-medium tracking-wider text-gray-700">SPHR</h1>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`group flex items-center px-2 py-1.5 my-1 text-xs font-medium rounded ${
                  isActive
                    ? 'bg-gray-50 text-gray-900'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                }`}
              >
                <item.icon
                  className={`mr-2 h-4 w-4 ${
                    isActive ? 'text-gray-700' : 'text-gray-400'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden md:flex md:w-56 md:flex-col">
        <div className="flex h-full flex-1 flex-col border-r border-gray-100">
          <div className="flex flex-shrink-0 items-center h-16 px-4 border-b border-gray-50">
            <h1 className="text-sm font-medium tracking-wider text-gray-700">SPHR</h1>
          </div>
          
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group relative flex items-center px-2 py-1.5 my-1 text-xs font-medium rounded ${
                    isActive
                      ? 'bg-gray-50 text-gray-900'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-0.5 bg-indigo-500 rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    />
                  )}
                  <item.icon
                    className={`mr-2 h-4 w-4 ${
                      isActive ? 'text-gray-700' : 'text-gray-400'
                    }`}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            })}
          </nav>
          
          <div className="flex-shrink-0 p-3 mt-auto">
            <button
              className="flex w-full items-center rounded px-2 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-800"
            >
              <ArrowRightOnRectangleIcon
                className="mr-2 h-4 w-4 text-gray-400"
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
        <div className="flex h-16 items-center border-b border-gray-100 bg-white px-4 md:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-500"
          >
            <Bars3Icon className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-medium tracking-wider text-gray-700">SPHR</h1>
        </div>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
