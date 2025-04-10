'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { DocumentTextIcon } from '@heroicons/react/24/outline'

export default function ContractsPage() {
  const [contracts, setContracts] = useState([
    {
      id: '1',
      name: 'Token Contract',
      address: '0x1234...5678',
      status: 'active',
      lastUpdated: '2024-03-15'
    },
    {
      id: '2',
      name: 'Exchange Contract',
      address: '0x8765...4321',
      status: 'pending',
      lastUpdated: '2024-03-14'
    }
  ])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Contracts</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your smart contracts
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contracts.map((contract) => (
            <div key={contract.id} className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800/30">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-blue-500/10">
                  <DocumentTextIcon className="h-5 w-5 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{contract.name}</h3>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Address</span>
                  <span className="text-sm text-white">{contract.address}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Status</span>
                  <span className={`text-sm ${
                    contract.status === 'active' ? 'text-green-400' : 'text-yellow-400'
                  }`}>
                    {contract.status}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-400">Last Updated</span>
                  <span className="text-sm text-white">{contract.lastUpdated}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
} 