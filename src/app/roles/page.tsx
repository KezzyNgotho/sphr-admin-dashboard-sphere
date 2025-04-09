'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'

// Dummy data for development
const dummyRoleData = {
  roles: {
    DEFAULT_ADMIN: {
      description: 'Full administrative access to all functions',
      addresses: ['0x1234...5678'],
      lastModified: '2024-04-09 10:30:00'
    },
    OPERATOR: {
      description: 'Can perform exchange operations',
      addresses: ['0x1234...5678', '0x8765...4321'],
      lastModified: '2024-04-09 09:15:00'
    },
    MINTER: {
      description: 'Can mint new tokens',
      addresses: ['0x1234...5678'],
      lastModified: '2024-04-08 14:20:00'
    },
    BURNER: {
      description: 'Can burn tokens',
      addresses: ['0x1234...5678'],
      lastModified: '2024-04-08 14:20:00'
    },
    PAUSER: {
      description: 'Can pause contract operations',
      addresses: ['0x1234...5678'],
      lastModified: '2024-04-08 14:20:00'
    }
  },
  auditLogs: [
    {
      id: 1,
      timestamp: '2024-04-09 10:30:00',
      action: 'Role Granted',
      role: 'OPERATOR',
      address: '0x8765...4321',
      by: '0x1234...5678'
    },
    {
      id: 2,
      timestamp: '2024-04-09 09:15:00',
      action: 'Role Revoked',
      role: 'OPERATOR',
      address: '0xabcd...efgh',
      by: '0x1234...5678'
    },
    {
      id: 3,
      timestamp: '2024-04-08 14:20:00',
      action: 'Role Granted',
      role: 'MINTER',
      address: '0x1234...5678',
      by: '0x1234...5678'
    }
  ]
}

const fetchRoleData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return dummyRoleData
}

export default function RolesPage() {
  const { user } = useAuth()
  const [searchAddress, setSearchAddress] = useState('')
  const [searchResults, setSearchResults] = useState<{
    role: string
    hasRole: boolean
  }[]>([])

  const { data: roleData, isLoading } = useQuery({
    queryKey: ['roleData'],
    queryFn: fetchRoleData,
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const handleSearch = async (address: string) => {
    // TODO: Implement role search functionality
    console.log('Searching roles for:', address)
    // Simulate search results
    setSearchResults([
      { role: 'OPERATOR', hasRole: true },
      { role: 'MINTER', hasRole: false }
    ])
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
            <h1 className="text-xl font-medium text-gray-800">Role Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              View and manage role assignments
            </p>
          </div>
        </motion.div>

        {/* Role Search */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.2 }}
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800">Role Checker</h3>
          </div>
          <div className="p-5">
            <div className="flex space-x-4">
              <div className="flex-1">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                  Ethereum Address
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="address"
                    id="address"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pr-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="0x..."
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={() => handleSearch(searchAddress)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Check Roles
                </button>
              </div>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Role Status</h4>
                <div className="mt-2 space-y-2">
                  {searchResults.map((result) => (
                    <div key={result.role} className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">{result.role}</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        result.hasRole ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {result.hasRole ? 'Has Role' : 'No Role'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Role Explorer */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800">Role Explorer</h3>
          </div>
          <div className="p-5 space-y-6">
            {Object.entries(roleData?.roles || {}).map(([role, data]) => (
              <div key={role} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700">{role}</h4>
                    <p className="text-sm text-gray-500">{data.description}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last modified: {data.lastModified}
                  </div>
                </div>
                <div className="space-y-2">
                  {data.addresses.map((addr: string) => (
                    <div key={addr} className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{addr}</span>
                      <div className="flex space-x-2">
                        <button
                          className="text-indigo-600 hover:text-indigo-700"
                          onClick={() => {
                            // TODO: Implement role management
                            console.log('Manage role:', role, 'for', addr)
                          }}
                        >
                          <ShieldCheckIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Audit Logs */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.2 }}
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800">Audit Logs</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {roleData?.auditLogs.map((log) => (
              <div key={log.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.action} - {log.role}
                      </p>
                      <p className="text-sm text-gray-500">
                        Address: {log.address}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {log.timestamp}
                    </div>
                    <div className="text-xs mt-1">
                      By: {log.by}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
} 