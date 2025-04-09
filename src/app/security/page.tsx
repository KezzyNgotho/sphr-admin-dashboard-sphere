'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import {
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowPathIcon,
  PauseCircleIcon,
  PlayCircleIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'

// Dummy data for development
const dummySecurityData = {
  tokenStatus: {
    isPaused: false,
    lastPaused: '2024-04-08 14:20:00',
    pausedBy: '0x1234...5678'
  },
  exchangeStatus: {
    isPaused: false,
    lastPaused: '2024-04-08 14:20:00',
    pausedBy: '0x1234...5678'
  },
  contractVersions: {
    token: '1.2.0',
    exchange: '1.1.0'
  },
  auditLogs: [
    {
      id: 1,
      timestamp: '2024-04-09 10:30:00',
      action: 'Contract Upgrade',
      contract: 'Token',
      version: '1.2.0',
      by: '0x1234...5678'
    },
    {
      id: 2,
      timestamp: '2024-04-09 09:15:00',
      action: 'Emergency Pause',
      contract: 'Exchange',
      by: '0x1234...5678'
    },
    {
      id: 3,
      timestamp: '2024-04-08 14:20:00',
      action: 'Contract Upgrade',
      contract: 'Exchange',
      version: '1.1.0',
      by: '0x1234...5678'
    }
  ]
}

const fetchSecurityData = async () => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  return dummySecurityData
}

export default function SecurityPage() {
  const { user } = useAuth()
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [selectedContract, setSelectedContract] = useState<'token' | 'exchange'>('token')

  const { data: securityData, isLoading } = useQuery({
    queryKey: ['securityData'],
    queryFn: fetchSecurityData,
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  const handlePause = async (contract: 'token' | 'exchange') => {
    // TODO: Implement pause functionality
    console.log('Pausing', contract)
  }

  const handleUnpause = async (contract: 'token' | 'exchange') => {
    // TODO: Implement unpause functionality
    console.log('Unpausing', contract)
  }

  const handleUpgrade = async (contract: 'token' | 'exchange', newVersion: string) => {
    // TODO: Implement upgrade functionality
    console.log('Upgrading', contract, 'to', newVersion)
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
            <h1 className="text-xl font-medium text-gray-800">Security Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Monitor and control contract security settings
            </p>
          </div>
        </motion.div>

        {/* Contract Status */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {[
            {
              title: 'Token Contract',
              status: securityData?.tokenStatus,
              version: securityData?.contractVersions.token,
              type: 'token' as const
            },
            {
              title: 'Exchange Contract',
              status: securityData?.exchangeStatus,
              version: securityData?.contractVersions.exchange,
              type: 'exchange' as const
            }
          ].map((contract, index) => (
            <motion.div
              key={contract.title}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.2 }}
            >
              <div className="px-5 py-4 border-b border-gray-200">
                <h3 className="text-base font-medium text-gray-800">{contract.title}</h3>
              </div>
              <div className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Status</p>
                    <p className="mt-1 text-sm text-gray-500">
                      {contract.status?.isPaused ? 'Paused' : 'Active'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Version</p>
                    <p className="mt-1 text-sm text-gray-500">{contract.version}</p>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handlePause(contract.type)}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                  >
                    <PauseCircleIcon className="h-5 w-5 mr-2" />
                    Pause
                  </button>
                  <button
                    onClick={() => handleUnpause(contract.type)}
                    className="flex-1 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                  >
                    <PlayCircleIcon className="h-5 w-5 mr-2" />
                    Unpause
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedContract(contract.type)
                    setShowUpgradeModal(true)
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <ArrowPathIcon className="h-5 w-5 mr-2" />
                  Upgrade Contract
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* High-Risk Operations */}
        <motion.div
          className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.2 }}
        >
          <div className="px-5 py-4 border-b border-gray-200">
            <h3 className="text-base font-medium text-gray-800">High-Risk Operations</h3>
          </div>
          <div className="p-5">
            <div className="rounded-md bg-yellow-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Warning</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>
                      These operations can have significant impact on the protocol. Please ensure you understand the consequences before proceeding.
                    </p>
                  </div>
                </div>
              </div>
            </div>
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
            <h3 className="text-base font-medium text-gray-800">Security Audit Logs</h3>
          </div>
          <div className="divide-y divide-gray-200">
            {securityData?.auditLogs.map((log) => (
              <div key={log.id} className="px-5 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {log.action} - {log.contract}
                      </p>
                      {log.version && (
                        <p className="text-sm text-gray-500">
                          Version: {log.version}
                        </p>
                      )}
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

      {/* Modals will be implemented here */}
    </DashboardLayout>
  )
} 