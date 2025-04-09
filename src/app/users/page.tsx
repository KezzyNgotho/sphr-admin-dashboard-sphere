'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import UserManagement from '@/components/dashboard/UserManagement'
import { motion } from 'framer-motion'

export default function UsersPage() {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">User Management</h1>
            <div className="flex items-center space-x-4">
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Export Users
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Add User
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-6">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">2,543</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
              <p className="text-2xl font-semibold text-green-600 dark:text-green-400">2,123</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Inactive Users</h3>
              <p className="text-2xl font-semibold text-yellow-600 dark:text-yellow-400">320</p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Suspended Users</h3>
              <p className="text-2xl font-semibold text-red-600 dark:text-red-400">100</p>
            </div>
          </div>

          <UserManagement />
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 