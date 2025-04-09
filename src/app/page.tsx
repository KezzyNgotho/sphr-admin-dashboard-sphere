'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function Home() {
  const { user, connectWallet, isConnecting } = useAuth()
  const router = useRouter()
  const [showSecurityInfo, setShowSecurityInfo] = useState(false)

  useEffect(() => {
    if (user?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleConnect = async () => {
    try {
      await connectWallet()
      router.push('/dashboard')
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0F0F0F] to-[#1A1A1A]"></div>
      
      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-[#3B82F6]/5 to-transparent animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-transparent via-[#8B5CF6]/5 to-transparent animate-[spin_15s_linear_infinite]"></div>
      </div>
      
      <motion.div 
        className="relative sm:mx-auto sm:w-full sm:max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-[#1A1A1A]/80 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/5 p-8 relative overflow-hidden">
          {/* Card border gradient */}
          <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-br from-[#3B82F6]/20 via-[#8B5CF6]/20 to-[#EC4899]/20">
            <div className="absolute inset-0 rounded-3xl bg-[#1A1A1A]/80 backdrop-blur-xl"></div>
          </div>
          
          <div className="flex flex-col items-center relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="w-24 h-24 mb-6 relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#3B82F6]/20 to-[#8B5CF6]/20 blur-xl"></div>
        <Image
                src="/logo.svg"
                alt="SPHR Logo"
                width={96}
                height={96}
                className="w-full h-full relative z-10"
          priority
        />
              <motion.div
                className="absolute inset-0 rounded-2xl border border-[#3B82F6]/30"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            </motion.div>
            
            <motion.h2 
              className="mt-2 text-center text-4xl font-bold tracking-tight text-white"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              SPHR Admin
            </motion.h2>
            
            <motion.p 
              className="mt-2 text-center text-sm text-[#A1A1AA] font-medium"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Secure Dashboard Access
            </motion.p>
          </div>

          <motion.div 
            className="mt-8 space-y-6 relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleConnect}
              disabled={isConnecting}
              className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-sm font-medium text-white bg-gradient-to-r from-[#3B82F6] to-[#8B5CF6] hover:from-[#2563EB] hover:to-[#7C3AED] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3B82F6] transition-all duration-200 relative overflow-hidden group ${
                isConnecting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                animate={{
                  x: ['-100%', '100%'],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
              />
              {isConnecting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Connect MetaMask</span>
                </>
              )}
            </motion.button>

            <div className="flex items-center justify-center gap-2 text-sm text-[#A1A1AA]">
              <button
                onClick={() => setShowSecurityInfo(!showSecurityInfo)}
                className="flex items-center gap-1.5 hover:text-[#E4E4E7] transition-colors group"
              >
                <svg className="h-4 w-4 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Security Info</span>
              </button>
        </div>

            <AnimatePresence>
              {showSecurityInfo && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-[#A1A1AA] space-y-2 bg-[#1A1A1A]/40 rounded-xl p-4 backdrop-blur-sm"
                >
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 mt-0.5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>Your wallet connection is secure and encrypted</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 mt-0.5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>We never store your private keys</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <svg className="h-4 w-4 mt-0.5 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p>All transactions require your explicit approval</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {typeof window !== 'undefined' && typeof window.ethereum === 'undefined' && (
              <motion.div 
                className="mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <p className="text-sm text-[#EF4444]">
                  MetaMask is not installed. Please install it to continue.
                </p>
                <a
                  href="https://metamask.io/download/"
          target="_blank"
          rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center text-sm text-[#3B82F6] hover:text-[#60A5FA] transition-colors duration-200 group"
                >
                  <span>Download MetaMask</span>
                  <svg className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
