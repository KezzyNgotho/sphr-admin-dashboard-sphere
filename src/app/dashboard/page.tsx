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
  exchangeRate: '0.85 WBERA/SPHR',
  securityStatus: 'Active',
  priceChange: '+2.5%',
  dailyVolume: '$1.2M',
  pendingClaims: '124',
  lastUpdate: '2 minutes ago'
}

const recentActivity = [
  { id: 1, type: 'Token Transfer', time: '2 hours ago', amount: '+1,000 SPHR', status: 'Completed', icon: BanknotesIcon },
  { id: 2, type: 'Exchange Rate Update', time: '4 hours ago', amount: '0.85 → 0.87', status: 'Completed', icon: ArrowPathIcon },
  { id: 3, type: 'New User Registration', time: '6 hours ago', amount: 'ID #28491', status: 'Verified', icon: UserIcon }
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
      <div className="space-y-6">
        <motion.div 
          className="flex items-center justify-between"
          {...fadeIn}
          transition={{ duration: 0.2 }}
        >
          <div>
            <h1 className="text-xl font-medium text-gray-800">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              {user.address.slice(0, 6)}...{user.address.slice(-4)} • Last updated: {stats?.lastUpdate || 'loading...'}
            </p>
          </div>
          <div className="text-sm text-gray-500 flex items-center">
            <ClockIcon className="h-4 w-4 mr-1" />
            Auto-refreshes every 30s
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { 
              title: 'Total Supply', 
              value: stats?.totalSupply, 
              icon: CurrencyDollarIcon, 
              color: 'bg-indigo-100 text-indigo-700' 
            },
            { 
              title: 'Active Users', 
              value: stats?.activeUsers, 
              icon: UserGroupIcon, 
              color: 'bg-emerald-100 text-emerald-700' 
            },
            { 
              title: 'Exchange Rate', 
              value: stats?.exchangeRate, 
              icon: ArrowTrendingUpIcon, 
              color: 'bg-blue-100 text-blue-700',
              change: stats?.priceChange
            },
            { 
              title: 'Security Status', 
              value: stats?.securityStatus, 
              icon: ShieldCheckIcon, 
              color: 'bg-rose-100 text-rose-700' 
            }
          ].map((stat, index) => (
            <motion.div
              key={stat.title}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                    {stat.change && (
                      <p className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.change}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

       

        <motion.div
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={activity.id}
                className="px-5 py-4 flex items-center justify-between hover:bg-gray-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.05 }}
              >
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <activity.icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-800">{activity.type}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-800">{activity.amount}</p>
                  <p className="text-sm text-gray-500">{activity.status}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}
