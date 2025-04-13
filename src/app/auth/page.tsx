'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheckIcon } from '@heroicons/react/24/outline'

// Define types for Auth context
interface AuthContextType {
  connectWallet: () => Promise<void>
  isConnecting: boolean
  isAuthenticated: boolean
  error?: string
}

export default function AuthPage() {
  const { connectWallet, isConnecting, error: authError } = useAuth() as unknown as AuthContextType
  const router = useRouter()
  const [localError, setLocalError] = useState<string>('')
  const [isMounted, setIsMounted] = useState(false)

  // Handle hydration mismatch
  useEffect(() => {
    setIsMounted(true)
    return () => setIsMounted(false)
  }, [])

  const handleConnect = async () => {
    try {
      setLocalError('')
      await connectWallet()
    } catch (error) {
      setLocalError(error instanceof Error ? error.message : 'Failed to connect wallet')
    }
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="px-6 py-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 rounded-full bg-blue-100">
                <ShieldCheckIcon className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <h2 className="text-center text-2xl font-bold text-gray-900 mb-2">
              Welcome to SPHR Admin Dashboard
            </h2>
            <p className="text-center text-gray-600 mb-8">
              Connect your wallet to access the dashboard
            </p>
            
            {/* Error Message */}
            {(authError || localError) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg"
              >
                {authError || localError}
              </motion.div>
            )}

            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
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

            <p className="mt-4 text-center text-sm text-gray-600">
              Please make sure you have MetaMask installed
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}