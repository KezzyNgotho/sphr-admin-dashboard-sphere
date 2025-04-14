'use client'
import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import {
  ArrowsRightLeftIcon,
  CurrencyDollarIcon,
  ClockIcon,
  ScaleIcon,
  UserIcon,
  LockClosedIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'

interface ExchangeMetrics {
  exchangeRate: number
  minExchangeRate: number
  claimInfo: {
    lastClaim: string
    nextAvailable: string
  }
  cooldownPeriod: number
  isSphrTransferable: boolean
}

export default function ExchangePage() {
  const [metrics, setMetrics] = useState<ExchangeMetrics>({
    exchangeRate: 0,
    minExchangeRate: 0,
    claimInfo: { lastClaim: '', nextAvailable: '' },
    cooldownPeriod: 0,
    isSphrTransferable: false
  })
  const [tokenAmount, setTokenAmount] = useState('')
  const [usdAmount, setUsdAmount] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSwapping, setIsSwapping] = useState(false)
  const [userAddress, setUserAddress] = useState<string | null>(null)

  // Get user address - in a real app, this would come from your auth system
  useEffect(() => {
    // This is a simplified example - in a real app, you'd get this from your auth context
    // or wallet connection
    const getUserAddress = async () => {
      try {
        // Mock fetching the user's address from a session or localStorage
        // In a real app, you might use something like:
        // const address = await walletProvider.getAddress() or from your auth context
        const address = localStorage.getItem('userWalletAddress') || "0x1234567890abcdef1234567890abcdef12345678";
        setUserAddress(address);
      } catch (error) {
        console.error("Failed to get user address:", error);
        setError("Failed to authenticate user. Please reconnect your wallet.");
      }
    };
    
    getUserAddress();
  }, []);

  useEffect(() => {
    const fetchExchangeData = async () => {
      if (!userAddress) return;
      
      setError(null)
      try {
        // Define API endpoints
        const endpoints = [
          { name: 'rate', url: 'https://rewardsvault-production.up.railway.app/api/exchange/rate-info' },
          { name: 'minRate', url: 'https://rewardsvault-production.up.railway.app/api/exchange/min-rate' },
          { name: 'claim', url: `https://rewardsvault-production.up.railway.app/api/exchange/claim-info/${userAddress}` },
          { name: 'cooldown', url: 'https://rewardsvault-production.up.railway.app/api/exchange/cooldown-period' },
          { name: 'transfer', url: 'https://rewardsvault-production.up.railway.app/api/sphr/transferable' }
        ];

        // Create an object to store the results
        const results: Record<string, any> = {};

        // Fetch each endpoint individually with proper error handling
        for (const endpoint of endpoints) {
          try {
            console.log(`Fetching ${endpoint.name} from ${endpoint.url}`);
            const response = await fetch(endpoint.url);
            
            // Check if response is OK
            if (!response.ok) {
              console.error(`Error fetching ${endpoint.name}: HTTP ${response.status}`);
              continue;
            }
            
            // Check content type to ensure it's JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              // If not JSON, log the first part of the response to see what's coming back
              const text = await response.text();
              console.error(`Non-JSON response for ${endpoint.name}:`, text.substring(0, 100) + '...');
              continue;
            }
            
            // Parse JSON response
            const data = await response.json();
            console.log(`${endpoint.name} data:`, data);
            results[endpoint.name] = data;
          } catch (error) {
            console.error(`Error processing ${endpoint.name}:`, error);
          }
        }

        // Process the results to build the metrics object
        const metricsData: ExchangeMetrics = {
          exchangeRate: 0,
          minExchangeRate: 0,
          claimInfo: { lastClaim: '', nextAvailable: '' },
          cooldownPeriod: 0,
          isSphrTransferable: false
        };

        // Extract exchange rate
        if (results.rate?.data?.currentRate) {
          metricsData.exchangeRate = parseFloat(results.rate.data.currentRate) || 0;
        }

        // Extract min exchange rate
        if (results.minRate?.data?.minExchangeRate) {
          metricsData.minExchangeRate = parseFloat(results.minRate.data.minExchangeRate) || 0;
        }

        // Extract claim info
        if (results.claim?.data) {
          metricsData.claimInfo = {
            lastClaim: results.claim.data.lastBurnTimestamp
              ? new Date(parseInt(results.claim.data.lastBurnTimestamp) * 1000).toISOString()
              : '',
            nextAvailable: results.claim.data.timeUntilClaim && parseInt(results.claim.data.timeUntilClaim) > 0
              ? new Date(Date.now() + parseInt(results.claim.data.timeUntilClaim) * 1000).toISOString()
              : ''
          };
        }

        // Extract cooldown period
        if (results.cooldown?.data?.cooldownPeriodSeconds) {
          metricsData.cooldownPeriod = Math.round(parseInt(results.cooldown.data.cooldownPeriodSeconds) / 3600);
        }

        // Extract transferable status
        if (results.transfer?.data?.transferable !== undefined) {
          metricsData.isSphrTransferable = results.transfer.data.transferable === true;
        }

        console.log("Final metrics data:", metricsData);
        setMetrics(metricsData);
      } catch (error) {
        console.error('Error fetching exchange data:', error);
        setError('Failed to load exchange data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (userAddress) {
      fetchExchangeData();
    }
  }, [userAddress]);

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTokenAmount(value)
    // Ensure exchangeRate is a number before using toFixed
    const rate = typeof metrics.exchangeRate === 'number' ? metrics.exchangeRate : 0;
    setUsdAmount(value ? (parseFloat(value) * rate).toFixed(2) : '')
  }

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsdAmount(value)
    // Ensure exchangeRate is a number and not zero before division
    const rate = typeof metrics.exchangeRate === 'number' && metrics.exchangeRate !== 0 
      ? metrics.exchangeRate 
      : 1; // Default to 1 to avoid division by zero
    setTokenAmount(value ? (parseFloat(value) / rate).toFixed(4) : '')
  }

  const formatTime = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  }

  const executeSwap = async () => {
    if (!userAddress) {
      setError('Please connect your wallet to execute a swap');
      return;
    }
    
    if (!tokenAmount || parseFloat(tokenAmount) <= 0) {
      setError('Please enter a valid amount to swap');
      return;
    }
    setIsSwapping(true);
    setError(null);
    
    try {
      // This would be your actual swap API endpoint
      const response = await fetch('https://rewardsvault-production.up.railway.app/api/exchange/swap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: userAddress,
          amount: parseFloat(tokenAmount),
          tokenType: 'SPHR'
        }),
      });

      // Check if response is OK
      if (!response.ok) {
        // Check content type to handle HTML error pages
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Swap failed');
        } else {
          // If not JSON, handle as generic error
          throw new Error(`Swap failed with status: ${response.status}`);
        }
      }

      // Try to parse JSON response
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        await response.json(); // Process the response if needed
      }

      // Reset form after successful swap
      setTokenAmount('');
      setUsdAmount('');
      
      // Refresh exchange data
      window.location.reload();
    } catch (error) {
      console.error('Swap error:', error);
      setError(error instanceof Error ? error.message : 'Failed to execute swap');
    } finally {
      setIsSwapping(false);
    }
  };

  // Safe number formatting function
  const formatNumber = (value: any, decimals = 4) => {
    if (typeof value !== 'number' || isNaN(value)) return '0';
    return value.toFixed(decimals);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SPHR Exchange
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Real-time token exchange management
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            <ArrowPathIcon className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {!userAddress && (
          <div className="bg-amber-900/30 border border-amber-800 text-amber-200 px-4 py-3 rounded-lg">
            Please connect your wallet to view exchange information
          </div>
        )}

        {error && (
          <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Exchange Rate" icon={ArrowsRightLeftIcon} color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  1 SPHR = ${isLoading ? '...' : formatNumber(metrics.exchangeRate, 2)}
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  Min Rate: ${isLoading ? '...' : formatNumber(metrics.minExchangeRate, 10)}
                </p>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-lg backdrop-blur-sm">
                <ScaleIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card title="Claim Status" icon={UserIcon} color="emerald">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-300">
                  Last: {isLoading ? '...' : formatTime(metrics.claimInfo.lastClaim)}
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  Next: {isLoading ? '...' : formatTime(metrics.claimInfo.nextAvailable)}
                </p>
              </div>
              <div className="p-3 bg-emerald-900/20 rounded-lg backdrop-blur-sm">
                <ClockIcon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card title="Cooldown Period" icon={ClockIcon} color="purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {isLoading ? '...' : `${metrics.cooldownPeriod}h`}
                </p>
                <p className="text-xs text-purple-400 mt-1">
                  Between transactions
                </p>
              </div>
              <div className="p-3 bg-purple-900/20 rounded-lg backdrop-blur-sm">
                <LockClosedIcon className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>

          <Card title="Transfer Status" icon={ArrowsRightLeftIcon} color="amber">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-white">
                  {isLoading ? '...' : metrics.isSphrTransferable ? 'Active' : 'Locked'}
                </p>
                <p className="text-xs text-amber-400 mt-1">
                  Token transfers
                </p>
              </div>
              <div className="p-3 bg-amber-900/20 rounded-lg backdrop-blur-sm">
                <LockClosedIcon className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Exchange Form */}
        <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800/30">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 rounded-full bg-blue-500/10">
              <ArrowsRightLeftIcon className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">Swap SPHR</h3>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">From</label>
              <div className="relative">
                <input
                  type="number"
                  value={tokenAmount}
                  onChange={handleTokenAmountChange}
                  placeholder="0.0"
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  disabled={!userAddress || !metrics.isSphrTransferable || isSwapping}
                />
                
                <div className="absolute right-3 top-2 text-sm text-gray-400">SPHR</div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">To</label>
              <div className="relative">
                <input
                  type="number"
                  value={usdAmount}
                  onChange={handleUsdAmountChange}
                  placeholder="0.0" 
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  disabled={!userAddress || !metrics.isSphrTransferable || isSwapping}
                />
                <div className="absolute right-3 top-2 text-sm text-gray-400">USD</div>
              </div>
            </div>
            <button 
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!userAddress || !metrics.isSphrTransferable || isLoading || isSwapping || !tokenAmount}
              onClick={executeSwap}
            >
              {!userAddress 
                ? 'Connect Wallet'
                : isSwapping
                  ? 'Processing...'
                  : metrics.isSphrTransferable
                    ? 'Execute Swap'
                    : 'Transfers Locked'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

