'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  CurrencyDollarIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  ArrowPathIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'

// Dummy data for development
const dummyTokenData = {
  totalSupply: '1,000,000 SPHR',
  isTransferable: true,
  isPaused: false,
  decimals: 18,
  symbol: 'SPHR',
  roles: {
    DEFAULT_ADMIN: ['0x1234...5678'],
    MINTER: ['0x1234...5678'],
    BURNER: ['0x1234...5678'],
    PAUSER: ['0x1234...5678']
  }
}

const fetchTokenData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return dummyTokenData
}

export default function TokenPage() {
  const { user } = useAuth()
  const [showMintModal, setShowMintModal] = useState(false)
  const [showBurnModal, setShowBurnModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')

  const { data: tokenData, isLoading } = useQuery({
    queryKey: ['tokenData'],
    queryFn: fetchTokenData,
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const handleMint = async (address: string, amount: string) => {
    // TODO: Implement mint functionality
    console.log('Minting', amount, 'to', address)
  }

  const handleBurn = async (address: string, amount: string) => {
    // TODO: Implement burn functionality
    console.log('Burning', amount, 'from', address)
  }

  const handleRoleChange = async (role: string, address: string, action: 'grant' | 'revoke') => {
    // TODO: Implement role change functionality
    console.log(action, role, 'for', address)
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h1 className="text-xl font-medium text-gray-800">Token Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage SPHR token operations and roles
            </p>
          </div>
        </motion.div>

        {/* Token Status Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              title: 'Total Supply', 
              value: tokenData?.totalSupply, 
              icon: CurrencyDollarIcon, 
              color: 'bg-indigo-100 text-indigo-700' 
            },
            { 
              title: 'Transferable', 
              value: tokenData?.isTransferable ? 'Yes' : 'No', 
              icon: ArrowPathIcon, 
              color: tokenData?.isTransferable ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            },
            { 
              title: 'Paused', 
              value: tokenData?.isPaused ? 'Yes' : 'No', 
              icon: tokenData?.isPaused ? PauseCircleIcon : PlayCircleIcon, 
              color: tokenData?.isPaused ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            },
            { 
              title: 'Decimals', 
              value: tokenData?.decimals, 
              icon: CurrencyDollarIcon, 
              color: 'bg-blue-100 text-blue-700' 
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <div className="p-5">
                <div className="flex items-center mb-3">
                  <div className={`p-2 rounded-md ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <p className="ml-3 text-sm font-medium text-gray-700">
                    {stat.title}
                  </p>
                </div>
                <p className="text-xl font-semibold text-gray-900">
                  {isLoading ? '...' : stat.value}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <motion.div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.2 }}
          >
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-800">Token Operations</h3>
            </div>
            <div className="p-5 space-y-4">
              <button
                onClick={() => setShowMintModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <ArrowUpIcon className="h-5 w-5 mr-2" />
                Mint Tokens
              </button>
              <button
                onClick={() => setShowBurnModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                <ArrowDownIcon className="h-5 w-5 mr-2" />
                Burn Tokens
              </button>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          >
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-800">Role Management</h3>
            </div>
            <div className="p-5 space-y-4">
              {Object.entries(tokenData?.roles || {}).map(([role, addresses]) => (
                <div key={role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{role}</span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRole(role)
                          setShowRoleModal(true)
                        }}
                        className="text-indigo-600 hover:text-indigo-700"
                      >
                        <UserPlusIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedRole(role)
                          setShowRoleModal(true)
                        }}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <UserMinusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {addresses.map((addr: string) => (
                      <div key={addr}>{addr}</div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals will be implemented here */}
    </DashboardLayout>
  )
} 