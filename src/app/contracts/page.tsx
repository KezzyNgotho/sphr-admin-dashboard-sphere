'use client'


import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  PauseIcon,
  PlayIcon,
  ArrowUpCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout'

interface SmartContract {
  contractAddress: string
  name: string
  status: 'active' | 'paused' | 'draft' | 'upgrading'
  network: string
  deployedAt: string
  version: string
  implementationAddress?: string
}

const API_BASE = 'https://rewardsvault-production.up.railway.app/api/exchange/admin'

export default function ContractLifecycle() {
  const [contracts, setContracts] = useState<SmartContract[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [newContractAddress, setNewContractAddress] = useState('')

  // Fetch initial contracts
  useEffect(() => {
    const loadContracts = async () => {
      try {
        const response = await fetch(`${API_BASE}/contracts`)
        const data = await response.json()
        setContracts(data)
      } catch (error) {
        console.error('Failed to load contracts:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadContracts()
  }, [])

  const handleContractAction = async (contractAddress: string, action: 'pause' | 'unpause' | 'upgrade') => {
    setProcessingId(contractAddress)
    try {
      const endpoint = `${API_BASE}/${action}`
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ contractAddress })
      })

      if (!response.ok) throw new Error(`Failed to ${action} contract`)

      // Optimistic update
      setContracts(prev => prev.map(contract => {
        if (contract.contractAddress === contractAddress) {
          return {
            ...contract,
            status: action === 'pause' ? 'paused' :
                    action === 'unpause' ? 'active' :
                    'upgrading'
          }
        }
        return contract
      }))

      // Refresh after delay to get actual state
      setTimeout(() => handleRefresh(), 3000)
    } catch (error) {
      console.error(`Error ${action}ing contract:`, error)
      // Handle error state
      setContracts(prev => prev.map(contract => 
        contract.contractAddress === contractAddress ? 
        { ...contract, status: 'active' } : contract
      ))
    } finally {
      setProcessingId(null)
    }
  }

  const handleInitialize = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContractAddress) return

    try {
      const response = await fetch(`${API_BASE}/initialize`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ contractAddress: newContractAddress })
      })

      if (!response.ok) throw new Error('Initialization failed')

      const newContract = await response.json()
      setContracts(prev => [...prev, newContract])
      setNewContractAddress('')
    } catch (error) {
      console.error('Initialization error:', error)
    }
  }

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE}/contracts`)
      const data = await response.json()
      setContracts(data)
    } catch (error) {
      console.error('Refresh failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: SmartContract['status']) => {
    switch (status) {
      case 'active': return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'paused': return <PauseIcon className="h-5 w-5 text-yellow-500" />
      case 'draft': return <DocumentTextIcon className="h-5 w-5 text-blue-500" />
      case 'upgrading': return <ArrowPathIcon className="h-5 w-5 animate-spin text-purple-500" />
      default: return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Smart Contract Management</h3>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        
        <form onSubmit={handleInitialize} className="flex gap-2">
          <input
            type="text"
            value={newContractAddress}
            onChange={(e) => setNewContractAddress(e.target.value)}
            placeholder="Enter contract address (0x...)"
            className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600"
          />
          <button
            type="submit"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <PlusIcon className="h-4 w-4" />
            Initialize Contract
          </button>
        </form>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Contract Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Network</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Version</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {contracts.map((contract) => (
              <motion.tr
                key={contract.contractAddress}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 font-mono text-sm text-gray-900 dark:text-white">
                  {contract.contractAddress.slice(0, 6)}...{contract.contractAddress.slice(-4)}
                </td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">{contract.network}</td>
                <td className="px-6 py-4 text-sm text-gray-900 dark:text-white">
                  v{contract.version}
                  {contract.implementationAddress && (
                    <span className="ml-2 text-gray-500 text-xs">
                      (impl: {contract.implementationAddress.slice(0, 6)}...)
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  <div className="flex items-center">
                    {getStatusIcon(contract.status)}
                    <span className="ml-2 capitalize">{contract.status}</span>
                  </div>
                </td>
                <td className="px-6 py-4 space-x-2">
                  <button
                    onClick={() => handleContractAction(contract.contractAddress, 'pause')}
                    disabled={contract.status !== 'active' || processingId === contract.contractAddress}
                    className="p-2 text-red-500 hover:text-red-700 disabled:opacity-50"
                  >
                    <PauseIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleContractAction(contract.contractAddress, 'unpause')}
                    disabled={contract.status !== 'paused' || processingId === contract.contractAddress}
                    className="p-2 text-green-500 hover:text-green-700 disabled:opacity-50"
                  >
                    <PlayIcon className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleContractAction(contract.contractAddress, 'upgrade')}
                    disabled={processingId === contract.contractAddress}
                    className="p-2 text-blue-500 hover:text-blue-700 disabled:opacity-50"
                  >
                    <ArrowUpCircleIcon className="h-5 w-5" />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
    </div>
  
    </DashboardLayout>
  )
}