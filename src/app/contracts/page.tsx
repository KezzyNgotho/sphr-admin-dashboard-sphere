"use client"

import { useState, useEffect } from 'react'
import {
  PauseIcon,
  PlayIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'
import DashboardLayout from '@/components/layout/DashboardLayout'

const API_BASE = 'https://rewardsvault-production.up.railway.app/api/'

type ContractAction = 'pause' | 'unpause' | 'upgrade'

export default function ContractLifecycle() {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [implementationAddress, setImplementationAddress] = useState<string>('')
  const [processing, setProcessing] = useState<boolean>(false)
  const [action, setAction] = useState<ContractAction>('pause')
  const [touched, setTouched] = useState({ contract: false, implementation: false })

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  // Derived validation states
  const isValidContract = isValidEthereumAddress(contractAddress)
  const isValidImplementation = isValidEthereumAddress(implementationAddress)

  useEffect(() => {
    if (action !== 'upgrade') {
      setImplementationAddress('')
    }
  }, [action])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    if (!isValidContract) {
      toast.error('Please enter a valid Ethereum contract address')
      return
    }
    
    if (action === 'upgrade' && !isValidImplementation) {
      toast.error('Please enter a valid implementation address for upgrade')
      return
    }
    
    setProcessing(true)
    
    try {
      let endpoint = '';
      let options: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      };
      
      // Different endpoint handling for each action
      if (action === 'upgrade') {
        endpoint = `${API_BASE}/contracts/${contractAddress}/exchange/admin/upgrade`;
        options.body = JSON.stringify({ implementationAddress });
      } else if (action === 'pause') {
        endpoint = `${API_BASE}/contracts/${contractAddress}/exchange/admin/pause`;
      } else if (action === 'unpause') {
        endpoint = `${API_BASE}/contracts/${contractAddress}/exchange/admin/unpause`;
      }
      
      const response = await fetch(endpoint, options);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to ${action} contract: ${errorText}`);
      }
      
      toast.success(`Contract ${action}d successfully`);
      setContractAddress('');
      setImplementationAddress('');
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      toast.error(`Failed to ${action} contract: ${errorMessage}`);
    } finally {
      setProcessing(false);
      setTouched({ contract: false, implementation: false });
    }
  }

  const handleActionSelect = (selectedAction: ContractAction): void => {
    setAction(selectedAction)
  }

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Smart Contract Management
            <span className="block mt-2 text-lg font-normal text-gray-500 dark:text-gray-400">
              Manage contract lifecycle operations securely
            </span>
          </h1>
        </header>
        <div className="bg-white dark:bg-gray-850 shadow-xl rounded-xl border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-8">
            <div className="space-y-8">
              {/* Contract Address Input */}
              <div>
                <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Contract Address
                </label>
                <div className="mt-1 relative">
                  <input
                    type="text"
                    id="contractAddress"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e) => {
                      setContractAddress(e.target.value)
                      setTouched(t => ({ ...t, contract: true }))
                    }}
                    onBlur={() => setTouched(t => ({ ...t, contract: true }))}
                    className={`w-full px-4 py-3 rounded-lg border transition-all
                      ${touched.contract && !isValidContract
                         ? 'border-red-500 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500'
                         : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-500'}
                      dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                    required
                  />
                  {touched.contract && !isValidContract && (
                    <p className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-md">
                      Invalid Ethereum address format
                    </p>
                  )}
                </div>
              </div>
              {/* Action Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Select Action
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['pause', 'unpause', 'upgrade'].map((actionType) => {
                    const isActive = action === actionType
                    const colors = {
                      pause: { light: 'indigo', dark: 'indigo' },
                      unpause: { light: 'green', dark: 'green' },
                      upgrade: { light: 'blue', dark: 'blue' }
                    }[actionType as ContractAction]
                    return (
                      <div
                        key={actionType}
                        className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all
                          ${isActive
                             ? `border-${colors.light}-500 bg-${colors.light}-50 dark:bg-${colors.dark}-900/30 dark:border-${colors.dark}-500`
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'}
                          ${isActive ? 'ring-2 ring-opacity-30' : ''}`}
                        onClick={() => handleActionSelect(actionType as ContractAction)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleActionSelect(actionType as ContractAction)}
                      >
                        <div className="flex items-center">
                          {actionType === 'pause' && (
                            <PauseIcon className={`h-6 w-6 mr-3 ${isActive ? 'text-indigo-600 dark:text-indigo-300' : 'text-gray-600 dark:text-gray-300'}`} />
                          )}
                          {actionType === 'unpause' && (
                            <PlayIcon className={`h-6 w-6 mr-3 ${isActive ? 'text-green-600 dark:text-green-300' : 'text-gray-600 dark:text-gray-300'}`} />
                          )}
                          {actionType === 'upgrade' && (
                            <ArrowUpCircleIcon className={`h-6 w-6 mr-3 ${isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-600 dark:text-gray-300'}`} />
                          )}
                          <span className={`font-medium ${isActive ? `text-${colors.light}-700 dark:text-${colors.dark}-200` : 'text-gray-700 dark:text-gray-300'}`}>
                            {actionType.charAt(0).toUpperCase() + actionType.slice(1)}
                          </span>
                        </div>
                        {isActive && (
                          <div className={`h-2 w-2 rounded-full bg-${colors.light}-500 dark:bg-${colors.dark}-400 animate-pulse`} />
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
              {/* Implementation Address Input */}
              {action === 'upgrade' && (
                <div>
                  <label htmlFor="implementationAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    New Implementation Address
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="implementationAddress"
                      placeholder="0x..."
                      value={implementationAddress}
                      onChange={(e) => {
                        setImplementationAddress(e.target.value)
                        setTouched(t => ({ ...t, implementation: true }))
                      }}
                      onBlur={() => setTouched(t => ({ ...t, implementation: true }))}
                      className={`w-full px-4 py-3 rounded-lg border transition-all
                        ${touched.implementation && !isValidImplementation
                           ? 'border-red-500 focus:ring-2 focus:ring-red-300 dark:focus:ring-red-500'
                           : 'border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-500'}
                        dark:bg-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500`}
                      required
                    />
                    {touched.implementation && !isValidImplementation && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-md">
                        Invalid implementation address
                      </p>
                    )}
                  </div>
                </div>
              )}
              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full flex justify-center items-center py-3 px-6 rounded-xl font-medium text-white transition-all
                    ${processing ? 'bg-gray-500' : 
                      action === 'pause' ? 'bg-indigo-600 hover:bg-indigo-700' :
                      action === 'unpause' ? 'bg-green-600 hover:bg-green-700' :
                      'bg-blue-600 hover:bg-blue-700'}
                    ${processing ? 'cursor-not-allowed' : 'hover:shadow-lg'}`}
                >
                  {processing ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    `${action.charAt(0).toUpperCase() + action.slice(1)} Contract`
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
