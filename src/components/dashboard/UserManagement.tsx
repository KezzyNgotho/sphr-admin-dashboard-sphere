'use client'

import { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  UserIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ArrowPathIcon,
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import { useTheme } from '@/contexts/ThemeContext'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user' | 'moderator'
  status: 'active' | 'inactive' | 'pending'
  lastLogin: string
  claims: Claim[]
}

interface Claim {
  id: string
  userId: string
  amount: number
  status: 'pending' | 'approved' | 'rejected'
  date: string
  type: string
}

// Memoize the dummy data
const dummyUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'admin' as const,
    status: 'active' as const,
    lastLogin: '2024-03-15',
    claims: [
      {
        id: '1',
        userId: '1',
        amount: 1000,
        status: 'approved' as const,
        date: '2024-03-14',
        type: 'Token Claim'
      }
    ]
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'user' as const,
    status: 'pending' as const,
    lastLogin: '2024-03-14',
    claims: [
      {
        id: '2',
        userId: '2',
        amount: 500,
        status: 'pending' as const,
        date: '2024-03-15',
        type: 'Reward Claim'
      }
    ]
  },
  {
    id: '3',
    name: 'Bob Johnson',
    email: 'bob@example.com',
    role: 'moderator' as const,
    status: 'inactive' as const,
    lastLogin: '2024-03-13',
    claims: [
      {
        id: '3',
        userId: '3',
        amount: 2000,
        status: 'rejected' as const,
        date: '2024-03-13',
        type: 'Token Claim'
      }
    ]
  }
]

// Memoize status colors
const statusColors = {
  active: 'text-green-600 bg-green-50 dark:text-green-400 dark:bg-green-900/30',
  inactive: 'text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-900/30',
  pending: 'text-yellow-600 bg-yellow-50 dark:text-yellow-400 dark:bg-yellow-900/30',
  default: 'text-gray-600 bg-gray-50 dark:text-gray-400 dark:bg-gray-900/30'
}

export default function UserManagement() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [users, setUsers] = useState<User[]>(dummyUsers)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'users' | 'claims'>('users')

  // Memoize all claims
  const allClaims = useMemo(() => 
    users.flatMap(user => user.claims.map(claim => ({
      ...claim,
      user: {
        name: user.name,
        email: user.email
      }
    }))), 
    [users]
  )

  const handleRefresh = useCallback(async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500)) // Reduced delay
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleEditUser = useCallback((user: User) => {
    console.log('Editing user:', user)
  }, [])

  const handleDeleteUser = useCallback(async (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }, [])

  const getStatusColor = useCallback((status: User['status']) => 
    statusColors[status] || statusColors.default, 
    []
  )

  const getRoleIcon = useCallback((role: User['role']) => {
    switch (role) {
      case 'admin':
        return <ShieldCheckIcon className="h-5 w-5 text-indigo-500" />
      case 'moderator':
        return <UserGroupIcon className="h-5 w-5 text-blue-500" />
      default:
        return <UserIcon className="h-5 w-5 text-gray-500" />
    }
  }, [])

  const getClaimStatusIcon = useCallback((status: Claim['status']) => {
    switch (status) {
      case 'approved':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'rejected':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }, [])

  // Memoize the tab content
  const tabContent = useMemo(() => {
    if (activeTab === 'users') {
      return (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Last Login
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          {getRoleIcon(user.role)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-white capitalize">
                      {user.role}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(user.lastLogin).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {allClaims.map((claim) => (
              <tr
                key={claim.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <DocumentTextIcon className="h-5 w-5 text-gray-500" />
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {claim.user.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {claim.user.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {claim.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {claim.amount.toLocaleString()} SPHR
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {new Date(claim.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {getClaimStatusIcon(claim.status)}
                    <span className="ml-2 capitalize">{claim.status}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }, [activeTab, users, allClaims, getRoleIcon, getStatusColor, getClaimStatusIcon, handleEditUser, handleDeleteUser])

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex space-x-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'users'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('claims')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'claims'
                  ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
            >
              Claims
            </button>
          </div>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      {tabContent}
    </div>
  )
} 