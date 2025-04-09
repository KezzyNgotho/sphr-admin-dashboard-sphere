'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  UserPlusIcon,
  UserMinusIcon,
  ArrowPathIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'

// Dummy data for development
const dummyExchangeData = {
  sphrReserves: '500,000 SPHR',
  wberaReserves: '425,000 WBERA',
  currentRate: '0.85 WBERA/SPHR',
  minimumRate: '0.75 WBERA/SPHR',
  decayFactor: '0.95',
  claimCooldown: '24 hours',
  isDecaying: true,
  operators: ['0x1234...5678'],
  pendingRewards: '1,234 SPHR'
}

const fetchExchangeData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return dummyExchangeData
}

export default function ExchangePage() {
  const { user } = useAuth()
  const [showOperatorModal, setShowOperatorModal] = useState(false)
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [showUpdateModal, setShowUpdateModal] = useState(false)

  const { data: exchangeData, isLoading } = useQuery({
    queryKey: ['exchangeData'],
    queryFn: fetchExchangeData,
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const handleAddOperator = async (address: string) => {
    // TODO: Implement add operator functionality
    console.log('Adding operator:', address)
  }

  const handleRemoveOperator = async (address: string) => {
    // TODO: Implement remove operator functionality
    console.log('Removing operator:', address)
  }

  const handleWithdraw = async (token: 'SPHR' | 'WBERA', amount: string) => {
    // TODO: Implement withdraw functionality
    console.log('Withdrawing', amount, token)
  }

  const handleUpdateParameters = async (params: {
    decayFactor?: string
    minimumRate?: string
    isDecaying?: boolean
  }) => {
    // TODO: Implement parameter update functionality
    console.log('Updating parameters:', params)
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
            <h1 className="text-xl font-medium text-gray-800">Exchange Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and manage SPHR/WBERA exchange operations
            </p>
          </div>
        </motion.div>

        {/* Exchange Status Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              title: 'SPHR Reserves', 
              value: exchangeData?.sphrReserves, 
              icon: CurrencyDollarIcon, 
              color: 'bg-indigo-100 text-indigo-700' 
            },
            { 
              title: 'WBERA Reserves', 
              value: exchangeData?.wberaReserves, 
              icon: BanknotesIcon, 
              color: 'bg-emerald-100 text-emerald-700' 
            },
            { 
              title: 'Current Rate', 
              value: exchangeData?.currentRate, 
              icon: ArrowTrendingUpIcon, 
              color: 'bg-blue-100 text-blue-700' 
            },
            { 
              title: 'Decay Status', 
              value: exchangeData?.isDecaying ? 'Active' : 'Inactive', 
              icon: ArrowPathIcon, 
              color: exchangeData?.isDecaying ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700' 
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

        {/* Exchange Details */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800">Exchange Parameters</h3>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-700">Minimum Rate</p>
              <p className="mt-1 text-sm text-gray-500">{exchangeData?.minimumRate}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Decay Factor</p>
              <p className="mt-1 text-sm text-gray-500">{exchangeData?.decayFactor}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Claim Cooldown</p>
              <p className="mt-1 text-sm text-gray-500">{exchangeData?.claimCooldown}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">Pending Rewards</p>
              <p className="mt-1 text-sm text-gray-500">{exchangeData?.pendingRewards}</p>
            </div>
          </div>
        </motion.div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <motion.div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          >
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-800">Operator Management</h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Operators</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowOperatorModal(true)}
                      className="text-indigo-600 hover:text-indigo-700"
                    >
                      <UserPlusIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  {exchangeData?.operators.map((addr: string) => (
                    <div key={addr} className="flex items-center justify-between">
                      <span>{addr}</span>
                      <button
                        onClick={() => {
                          // TODO: Implement remove operator
                          console.log('Remove operator:', addr)
                        }}
                        className="text-rose-600 hover:text-rose-700"
                      >
                        <UserMinusIcon className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.2 }}
          >
            <div className="px-5 py-4 border-b border-gray-200">
              <h3 className="text-base font-medium text-gray-800">Exchange Actions</h3>
            </div>
            <div className="p-5 space-y-4">
              <button
                onClick={() => setShowWithdrawModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <BanknotesIcon className="h-5 w-5 mr-2" />
                Withdraw Funds
              </button>
              <button
                onClick={() => setShowUpdateModal(true)}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              >
                <ArrowPathIcon className="h-5 w-5 mr-2" />
                Update Parameters
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modals will be implemented here */}
    </DashboardLayout>
  )
} 