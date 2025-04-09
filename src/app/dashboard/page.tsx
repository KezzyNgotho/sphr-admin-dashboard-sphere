'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { 
  CurrencyDollarIcon, 
  UserGroupIcon, 
  ShieldCheckIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline'

import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'

// Dummy data
const dummyStats = {
  totalSupply: '1,000,000 SPHR',
  activeUsers: '2,543',
  exchangeRate: '0.85 WBERA/SPHR',
  securityStatus: 'Active',
  priceChange: '+2.5%',
  dailyVolume: '$1.2M',
  pendingClaims: '124',
  lastUpdate: '2 minutes ago'
}

const fetchDummyData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return dummyStats
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
}

export default function Dashboard() {
  const { user } = useAuth()
  const router = useRouter()

  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDummyData,
    refetchInterval: 30000 // Refetch every 30 seconds
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
    <DashboardLayout>
      <motion.div 
        className="space-y-6"
        initial="hidden"
        animate="show"
        variants={container}
      >
        <motion.div variants={item}>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back, {user.address.slice(0, 6)}...{user.address.slice(-4)}
          </p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"
          variants={item}
        >
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <dt>
              <div className="absolute rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 p-3">
                <CurrencyDollarIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Total Supply
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '...' : stats?.totalSupply}
              </p>
            </dd>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <dt>
              <div className="absolute rounded-md bg-gradient-to-r from-green-500 to-emerald-600 p-3">
                <UserGroupIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Active Users
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '...' : stats?.activeUsers}
              </p>
            </dd>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <dt>
              <div className="absolute rounded-md bg-gradient-to-r from-blue-500 to-cyan-600 p-3">
                <ArrowTrendingUpIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Exchange Rate
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '...' : stats?.exchangeRate}
              </p>
              <span className="ml-2 flex items-baseline text-sm font-semibold text-green-600">
                {stats?.priceChange}
              </span>
            </dd>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <dt>
              <div className="absolute rounded-md bg-gradient-to-r from-red-500 to-pink-600 p-3">
                <ShieldCheckIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
                Security Status
              </p>
            </dt>
            <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
              <p className="text-2xl font-semibold text-gray-900">
                {isLoading ? '...' : stats?.securityStatus}
              </p>
            </dd>
          </motion.div>
        </motion.div>

        <motion.div 
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          variants={item}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Quick Actions
            </h3>
            <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Mint Tokens
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-green-600 to-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Update Exchange Rate
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-blue-600 to-cyan-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:from-blue-700 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Manage Roles
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="bg-white shadow-lg rounded-lg overflow-hidden"
          variants={item}
        >
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Recent Activity
            </h3>
            <div className="mt-5 space-y-4">
              {[1, 2, 3].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: item * 0.1 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-900">Token Transfer</p>
                      <p className="text-sm text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">+1,000 SPHR</p>
                    <p className="text-xs text-gray-500">Completed</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </DashboardLayout>
  )
} 