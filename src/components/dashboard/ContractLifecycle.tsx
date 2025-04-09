import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  DocumentTextIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface Contract {
  id: string
  name: string
  status: 'draft' | 'pending' | 'active' | 'expired' | 'terminated'
  startDate: string
  endDate: string
  type: string
  version: string
}

const dummyContracts: Contract[] = [
  {
    id: '1',
    name: 'Token Sale Agreement',
    status: 'active',
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    type: 'Token Sale',
    version: '1.0.0'
  },
  {
    id: '2',
    name: 'Staking Contract',
    status: 'pending',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    type: 'Staking',
    version: '2.1.0'
  },
  {
    id: '3',
    name: 'Governance Contract',
    status: 'draft',
    startDate: '2024-04-01',
    endDate: '2025-04-01',
    type: 'Governance',
    version: '1.2.0'
  }
]

export default function ContractLifecycle() {
  const [contracts, setContracts] = useState<Contract[]>(dummyContracts)
  const [isLoading, setIsLoading] = useState(false)

  const handleRefresh = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      // In a real app, you would fetch data here
      // const response = await fetch('/api/contracts')
      // const data = await response.json()
      // setContracts(data)
    } catch (error) {
      console.error('Error refreshing contracts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />
      case 'draft':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />
      case 'expired':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
      case 'terminated':
        return <ExclamationCircleIcon className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'draft':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'terminated':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Contract Lifecycle</h3>
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Contract Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Version
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Period
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {contracts.map((contract) => (
              <motion.tr
                key={contract.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {contract.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {contract.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {contract.version}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {new Date(contract.startDate).toLocaleDateString()} - {new Date(contract.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex items-center">
                    {getStatusIcon(contract.status)}
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(contract.status)}`}>
                      {contract.status}
                    </span>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 