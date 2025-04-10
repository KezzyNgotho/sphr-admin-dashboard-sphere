'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  CurrencyDollarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ArrowTrendingUpIcon,
  ClockIcon,
  ArrowPathIcon,
  BanknotesIcon,
  UserIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'


// Dummy data
const dummyStats = {
  totalSupply: '1,000,000 SPHR',
  activeUsers: '2,543',
  securityStatus: 'Active',
  priceChange: '+2.5%',
  lastUpdate: '2 minutes ago',
  marketCap: '$25.4M',
  volume24h: '$1.2M',
  holders: '1,892',
  transactions: '4,231'
}

const recentActivity = [
  {
    id: 1,
    type: 'Token Transfer',
    time: '2 hours ago',
    amount: '+1,000 SPHR',
    status: 'Completed',
    icon: BanknotesIcon,
    from: '0x1234...5678',
    to: '0x8765...4321'
  },
  {
    id: 2,
    type: 'Exchange Rate Update',
    time: '4 hours ago',
    amount: '0.85 → 0.87',
    status: 'Completed',
    icon: ArrowPathIcon,
    from: 'System',
    to: 'Market'
  },
  {
    id: 3,
    type: 'New User Registration',
    time: '6 hours ago',
    amount: 'ID #28491',
    status: 'Verified',
    icon: UserIcon,
    from: 'Registration',
    to: 'System'
  },
  {
    id: 4,
    type: 'Contract Update',
    time: '8 hours ago',
    amount: 'v2.1.0',
    status: 'Deployed',
    icon: ShieldCheckIcon,
    from: 'Development',
    to: 'Mainnet'
  }
]

const fetchDummyData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return dummyStats
}

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()
  
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDummyData
  })

  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push('/')
    }
  }, [user, router])

  if (!user?.isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111827] to-[#0A0A0A] relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-[0.03]"></div>
      
      {/* Animated lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-r from-transparent via-blue-600/20 to-transparent animate-[spin_20s_linear_infinite]"></div>
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-r from-transparent via-indigo-600/20 to-transparent animate-[spin_15s_linear_infinite]"></div>
      </div>

      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tight">Dashboard</h1>
              <p className="mt-2 text-sm text-blue-200">
                {user.address.slice(0, 6)}...{user.address.slice(-4)} • Last updated: {stats?.lastUpdate || 'loading...'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-blue-200 flex items-center">
                <ClockIcon className="h-4 w-4 mr-1.5 text-blue-400" />
                Auto-refreshes every 30s
              </div>
              <div className="h-8 w-px bg-blue-800/50"></div>
              <div className="text-sm text-blue-200">
                Network: <span className="font-medium text-blue-400">Mainnet</span>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            {isLoading ? (
              // Loading skeleton
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-32 bg-blue-900/20 rounded-xl border border-blue-800/30 shadow-lg animate-pulse"></div>
              ))
            ) : (
              <>
                <div className="bg-blue-900/20 rounded-xl border border-blue-800/30 shadow-lg hover:shadow-xl transition-all duration-200 p-6 group hover:border-blue-500/50 backdrop-blur-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500/30 to-blue-600/30 rounded-xl group-hover:from-blue-500/40 group-hover:to-blue-600/40 transition-colors duration-200">
                      <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-200">Total Supply</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats?.totalSupply}</p>
                      <p className="text-xs text-blue-300 mt-1">Market Cap: {stats?.marketCap}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-indigo-900/20 rounded-xl border border-indigo-800/30 shadow-lg hover:shadow-xl transition-all duration-200 p-6 group hover:border-indigo-500/50 backdrop-blur-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-indigo-500/30 to-indigo-600/30 rounded-xl group-hover:from-indigo-500/40 group-hover:to-indigo-600/40 transition-colors duration-200">
                      <UserGroupIcon className="h-6 w-6 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-indigo-200">Active Users</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats?.activeUsers}</p>
                      <p className="text-xs text-indigo-300 mt-1">Total Holders: {stats?.holders}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-emerald-900/20 rounded-xl border border-emerald-800/30 shadow-lg hover:shadow-xl transition-all duration-200 p-6 group hover:border-emerald-500/50 backdrop-blur-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-500/30 to-emerald-600/30 rounded-xl group-hover:from-emerald-500/40 group-hover:to-emerald-600/40 transition-colors duration-200">
                      <ShieldCheckIcon className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-200">Security Status</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats?.securityStatus}</p>
                      <p className="text-xs text-emerald-300 mt-1">24h Transactions: {stats?.transactions}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-900/20 rounded-xl border border-purple-800/30 shadow-lg hover:shadow-xl transition-all duration-200 p-6 group hover:border-purple-500/50 backdrop-blur-xl">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-gradient-to-br from-purple-500/30 to-purple-600/30 rounded-xl group-hover:from-purple-500/40 group-hover:to-purple-600/40 transition-colors duration-200">
                      <ArrowTrendingUpIcon className="h-6 w-6 text-purple-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-purple-200">Price Change</p>
                      <p className="text-2xl font-bold text-white mt-1">{stats?.priceChange}</p>
                      <p className="text-xs text-purple-300 mt-1">24h Volume: {stats?.volume24h}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </motion.div>

          {/* Recent Activity */}
          <motion.div 
            className="bg-blue-900/20 rounded-xl border border-blue-800/30 shadow-lg backdrop-blur-xl"
            variants={fadeIn}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.2 }}
          >
            <div className="px-6 py-4 border-b border-blue-800/30">
              <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            </div>
            <div className="divide-y divide-blue-800/30">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="px-6 py-4 hover:bg-blue-800/20 transition-colors duration-150">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-blue-800/30 rounded-lg">
                        <activity.icon className="h-5 w-5 text-blue-300" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{activity.type}</p>
                        <p className="text-xs text-blue-200 mt-0.5">{activity.time}</p>
                        <p className="text-xs text-blue-300 mt-1">
                          From: {activity.from} → To: {activity.to}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-white">{activity.amount}</p>
                      <p className="text-xs text-blue-200 mt-0.5">{activity.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </DashboardLayout>
    </div>
  )
}
