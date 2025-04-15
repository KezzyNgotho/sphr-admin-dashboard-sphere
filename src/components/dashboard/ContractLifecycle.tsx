import { useState } from 'react'
import {
  PauseIcon,
  PlayIcon,
  ArrowUpCircleIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'react-hot-toast'

const API_BASE = 'https://rewardsvault-production.up.railway.app/api/exchange/admin'

// Define action type
type ContractAction = 'pause' | 'unpause' | 'upgrade'

export default function ContractLifecycle() {
  const [contractAddress, setContractAddress] = useState<string>('')
  const [implementationAddress, setImplementationAddress] = useState<string>('')
  const [processing, setProcessing] = useState<boolean>(false)
  const [action, setAction] = useState<ContractAction>('pause')

  const isValidEthereumAddress = (address: string): boolean => {
    return /^0x[a-fA-F0-9]{40}$/.test(address)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    
    if (!isValidEthereumAddress(contractAddress)) {
      toast.error('Please enter a valid Ethereum contract address')
      return
    }
    
    if (action === 'upgrade' && !isValidEthereumAddress(implementationAddress)) {
      toast.error('Please enter a valid implementation address for upgrade')
      return
    }
    
    setProcessing(true)
    
    try {
      const endpoint = `${API_BASE}/contracts/${contractAddress}/${action}`
      
      const options: RequestInit = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
      
      if (action === 'upgrade') {
        options.body = JSON.stringify({ implementationAddress })
      }
      
      const response = await fetch(endpoint, options)
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Failed to ${action} contract: ${errorText}`)
      }
      
      toast.success(`Contract ${action}d successfully`)
      
      // Clear form if successful
      if (action === 'upgrade') {
        setImplementationAddress('')
      }
    } catch (error: unknown) {
      // Properly type the error
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      toast.error(`Failed to ${action} contract: ${errorMessage}`)
    } finally {
      setProcessing(false)
    }
  }

  const handleActionSelect = (selectedAction: ContractAction): void => {
    setAction(selectedAction)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="py-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Smart Contract Management</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label htmlFor="contractAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contract Address
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="contractAddress"
                    placeholder="0x..."
                    value={contractAddress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setContractAddress(e.target.value)}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                    required
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Enter the Ethereum address of the contract to manage
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Action
                </label>
                <div className="mt-2 grid grid-cols-3 gap-3">
                  <div 
                    className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                      action === 'pause' 
                        ? 'bg-indigo-50 border-indigo-500 dark:bg-indigo-900 dark:border-indigo-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => handleActionSelect('pause')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleActionSelect('pause')
                      }
                    }}
                  >
                    <PauseIcon className="h-5 w-5 mr-2 text-indigo-500 dark:text-indigo-400" />
                    <span className="font-medium text-indigo-500 dark:text-indigo-400">Pause</span>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                      action === 'unpause' 
                        ? 'bg-green-50 border-green-500 dark:bg-green-900 dark:border-green-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => handleActionSelect('unpause')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleActionSelect('unpause')
                      }
                    }}
                  >
                    <PlayIcon className="h-5 w-5 mr-2 text-green-500 dark:text-green-400" />
                    <span className="font-medium text-green-500 dark:text-green-400">Unpause</span>
                  </div>
                  
                  <div 
                    className={`flex items-center justify-center px-4 py-3 border rounded-md cursor-pointer ${
                      action === 'upgrade' 
                        ? 'bg-blue-50 border-blue-500 dark:bg-blue-900 dark:border-blue-400' 
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                    onClick={() => handleActionSelect('upgrade')}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e: React.KeyboardEvent) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        handleActionSelect('upgrade')
                      }
                    }}
                  >
                    <ArrowUpCircleIcon className="h-5 w-5 mr-2 text-blue-500 dark:text-blue-400" />
                    <span className="font-medium text-blue-500 dark:text-blue-400">Upgrade</span>
                  </div>
                </div>
              </div>
              
              {action === 'upgrade' && (
                <div>
                  <label htmlFor="implementationAddress" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    New Implementation Address
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      id="implementationAddress"
                      placeholder="0x..."
                      value={implementationAddress}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImplementationAddress(e.target.value)}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                      required={action === 'upgrade'}
                    />
                  </div>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Enter the address of the new implementation contract
                  </p>
                </div>
              )}
              
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={processing}
                  className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    action === 'pause' ? 'bg-indigo-600 hover:bg-indigo-700' :
                    action === 'unpause' ? 'bg-green-600 hover:bg-green-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    action === 'pause' ? 'focus:ring-indigo-500' :
                    action === 'unpause' ? 'focus:ring-green-500' :
                    'focus:ring-blue-500'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
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
        
        <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Instructions</h2>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ul className="space-y-2">
              <li><strong>Pause:</strong> Temporarily halts all contract operations. Use this for maintenance or when issues are detected.</li>
              <li><strong>Unpause:</strong> Resumes contract operations after being paused.</li>
              <li><strong>Upgrade:</strong> Updates the contract implementation while preserving its state and address. Requires a new implementation address.</li>
            </ul>
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              All actions require administrative privileges and will be recorded on the blockchain.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
