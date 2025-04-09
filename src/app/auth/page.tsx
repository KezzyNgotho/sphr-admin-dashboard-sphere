'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function AuthPage() {
  const { connectWallet, isConnecting } = useAuth()
  const { theme } = useTheme()

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-center mb-6">
              <div className={`p-3 rounded-full bg-${theme.primary}-100 dark:bg-${theme.primary}-900/30`}>
                <ShieldCheckIcon className={`h-12 w-12 text-${theme.primary}-600 dark:text-${theme.primary}-400`} />
              </div>
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to SPHR Admin Dashboard
            </h2>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
              Connect your wallet to access the dashboard
            </p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-${theme.primary}-600 hover:bg-${theme.primary}-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${theme.primary}-500 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isConnecting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                'Connect Wallet'
              )}
            </button>
            <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
              Please make sure you have MetaMask installed
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 