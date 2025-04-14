'use client'

import { ReactNode, useState } from 'react'
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
  BellIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  UserCircleIcon,
  ChevronRightIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'Tokens', href: '/token', icon: CurrencyDollarIcon },
  { name: 'Exchange', href: '/exchange', icon: ArrowsRightLeftIcon },
  { name: 'Roles', href: '/roles', icon: UserGroupIcon },
  { name: 'Contract Lifecycle', href: '/contracts', icon: DocumentTextIcon },
 // { name: 'User Management', href: '/users', icon: UserCircleIcon },
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
  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="flex h-screen bg-[#0F0F0F]">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-800 bg-opacity-75 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1A1A1A] shadow-lg transition-all duration-300 ease-in-out md:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
          <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">SPHR</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-full p-1.5 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
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
                    ? 'bg-gray-800/50 text-white shadow-lg shadow-blue-500/10'
                    : 'text-gray-300 hover:bg-gray-800/30 hover:text-white'
                }`}
              >
                <item.icon
                  className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                    isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-gray-800 p-4">
          <button
            className="flex w-full items-center rounded-lg px-3 py-2.5 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <ArrowRightOnRectangleIcon
              className="mr-3 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Sign out
          </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <motion.div 
        className="hidden md:flex md:flex-col md:w-64 bg-gradient-to-b from-[#0F0F0F] to-[#1A1A1A] border-r border-gray-800 backdrop-blur-xl"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SPHR Admin
            </h1>
          </div>
          <div className="mt-5 flex-grow flex flex-col">
            <nav className="flex-1 px-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                      isActive
                        ? 'bg-gray-800/50 text-white shadow-lg shadow-blue-500/10'
                        : 'text-gray-300 hover:bg-gray-800/30 hover:text-white'
                    }`}
                  >
                    <item.icon
                      className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors duration-200 ${
                        isActive ? 'text-blue-400' : 'text-gray-400 group-hover:text-blue-400'
                      }`}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="flex-shrink-0 flex border-t border-gray-800 p-4">
            <div className="flex-shrink-0 w-full group block">
              <div className="flex items-center">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/20 flex items-center justify-center">
                  <UserIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                    View profile
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-800 bg-[#1A1A1A] px-4 md:hidden">
          <div className="flex items-center">
            <button
              onClick={() => setSidebarOpen(true)}
              className="mr-4 rounded-lg p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              <Bars3Icon className="h-5 w-5" />
            </button>
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">SPHR</h1>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            <div className="relative">
              <button
                className="rounded-full p-2 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
              >
                <BellIcon className="h-5 w-5" />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>

            <div className="relative">
              <button
                className="flex items-center rounded-full p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-300 transition-colors"
              >
                <div className="h-8 w-8 rounded-full bg-gray-700 flex items-center justify-center">
                  <span className="text-sm font-medium text-gray-300">JD</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto bg-[#0F0F0F] p-6">
          <div className="mx-auto max-w-7xl">
            {/* Breadcrumbs */}
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-2">
                <li>
                  <div className="flex items-center">
                    <Link href="/dashboard" className="text-sm font-medium text-gray-400 hover:text-gray-300">
                      Dashboard
                    </Link>
                  </div>
                </li>
                {pathname !== '/dashboard' && (
                  <>
                    <li>
                      <div className="flex items-center">
                        <ChevronRightIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                        <span className="ml-2 text-sm font-medium text-gray-400">
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
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            )}

            {/* Main Content */}
            {!isLoading && children}
          </div>
        </main>
      </div>
    </div>
  )
}
