'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  PauseIcon,
  PlayIcon,
  ArrowUpCircleIcon,
  ShieldExclamationIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
const API_BASE = 'https://rewardsvault-production.up.railway.app/api/'

type ContractAction = 'pause' | 'unpause' | 'upgrade'

interface ContractFormState {
  upgraderPrivateKey: string
  newImplementation: string
  data: string
}

export default function ContractLifecycle() {
  const { user } = useAuth()
  const [contractAddress, setContractAddress] = useState('')
  const [action, setAction] = useState<ContractAction>('pause')
  const [processing, setProcessing] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState<ContractFormState>({
    upgraderPrivateKey: user?.address || '',
    newImplementation: '0x7731218c5d48fbE9A48d99DfECAea35a9F5D7F11',
    data: '0x'
  })

  useEffect(() => {
    if (action === 'upgrade' && user?.address) {
      setFormData(prev => ({
        ...prev,
        upgraderPrivateKey: user.address
      }))
    }
  }, [action, user?.address])

  const validateEthereumAddress = (address: string): boolean => 
    /^0x[a-fA-F0-9]{40}$/.test(address)

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!validateEthereumAddress(contractAddress)) {
      newErrors.contract = 'Invalid contract address'
    }

    if (action === 'upgrade') {
      if (!validateEthereumAddress(formData.upgraderPrivateKey)) {
        newErrors.upgrader = 'Invalid upgrader address'
      }
      if (!validateEthereumAddress(formData.newImplementation)) {
        newErrors.implementation = 'Invalid implementation address'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setProcessing(true)

    try {
      const endpoint = `${API_BASE}/contracts/${contractAddress}/exchange/admin/${action === 'upgrade' ? 'upgrade' : action}`
      const body = action === 'upgrade' ? formData : undefined

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(body)
      })

      const data = await response.json().catch(() => ({ message: response.statusText }))
      if (!response.ok) throw new Error(data.message || `HTTP ${response.status}`)
      
      toast.success(`Contract ${action}d successfully!`)
      resetForm()
    } catch (error) {
      toast.error(`Failed to ${action} contract: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setProcessing(false)
    }
  }

  const resetForm = () => {
    setContractAddress('')
    setFormData({
      upgraderPrivateKey: user?.address || '',
      newImplementation: '0x7731218c5d48fbE9A48d99DfECAea35a9F5D7F11',
      data: '0x'
    })
    setErrors({})
  }
  

  const ActionButton = ({
    actionType,
    icon: Icon,
    label
  }: {
    actionType: ContractAction
    icon: React.ComponentType<{ className?: string }>
    label: string
  }) => (
    <button
      type="button"
      onClick={() => setAction(actionType)}
      className={`p-3 rounded-lg border flex items-center justify-between transition-all
        ${action === actionType 
          ? 'border-blue-500 bg-blue-500/5 shadow-inner' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'}
      `}
    >
      <div className="flex items-center gap-2">
        <Icon className={`w-5 h-5 ${
          action === actionType ? 'text-blue-600' : 'text-gray-500'
        }`} />
        <span className={`text-sm ${
          action === actionType ? 'text-blue-700 font-medium' : 'text-gray-600'
        }`}>
          {label}
        </span>
      </div>
      {action === actionType && (
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
      )}
    </button>
  )

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contract Address Field */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Contract Address
            </label>
            <input
              type="text"
              value={contractAddress}
              onChange={(e) => setContractAddress(e.target.value)}
              placeholder="0x2786d0e4f95FED4f00DBce9F4C9A226FB5f31e71"
              className={`w-full px-4 py-2.5 rounded-md border text-sm
                ${errors.contract 
                  ? 'border-red-400 focus:ring-1 focus:ring-red-300' 
                  : 'border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-400'}
                bg-white dark:bg-gray-800 placeholder-gray-400
              `}
            />
            {errors.contract && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-xs flex items-center gap-1.5 mt-1"
              >
                <ShieldExclamationIcon className="w-3.5 h-3.5" />
                {errors.contract}
              </motion.div>
            )}
          </div>

          {/* Action Selector */}
          <div className="grid grid-cols-3 gap-2">
            <ActionButton actionType="pause" icon={PauseIcon} label="Pause" />
            <ActionButton actionType="unpause" icon={PlayIcon} label="Unpause" />
            <ActionButton actionType="upgrade" icon={ArrowUpCircleIcon} label="Upgrade" />
          </div>

          {/* Upgrade Form Section */}
          <AnimatePresence>
            {action === 'upgrade' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg border"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Upgrader Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Upgrader Address
                      <span className="ml-1 text-xs text-blue-500">(auto-filled)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.upgraderPrivateKey}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        upgraderPrivateKey: e.target.value
                      }))}
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${errors.upgrader 
                          ? 'border-red-400 focus:ring-1 focus:ring-red-300' 
                          : 'border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-400'}
                        bg-white dark:bg-gray-800
                      `}
                    />
                    {errors.upgrader && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs flex items-center gap-1.5"
                      >
                        <UserCircleIcon className="w-3.5 h-3.5" />
                        {errors.upgrader}
                      </motion.div>
                    )}
                  </div>

                  {/* Implementation Address */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      New Implementation
                    </label>
                    <input
                      type="text"
                      value={formData.newImplementation}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        newImplementation: e.target.value
                      }))}
                      className={`w-full px-3 py-2 rounded-md border text-sm
                        ${errors.implementation 
                          ? 'border-red-400 focus:ring-1 focus:ring-red-300' 
                          : 'border-gray-200 dark:border-gray-700 focus:ring-1 focus:ring-blue-400'}
                        bg-white dark:bg-gray-800
                      `}
                    />
                    {errors.implementation && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-500 text-xs flex items-center gap-1.5"
                      >
                        <ShieldExclamationIcon className="w-3.5 h-3.5" />
                        {errors.implementation}
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Data Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Initialization Data
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={formData.data}
                      readOnly
                      className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700
                               bg-gray-100 dark:bg-gray-700/30 text-gray-500 text-sm cursor-not-allowed"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className={`w-full py-2.5 px-6 bg-blue-500 hover:bg-blue-600 rounded-md text-sm font-medium text-white
              transition-all flex items-center justify-center gap-2
              disabled:opacity-70 disabled:cursor-not-allowed
            `}
          >
            {processing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Processing...
              </>
            ) : (
              `Execute ${action.charAt(0).toUpperCase() + action.slice(1)}`
            )}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}