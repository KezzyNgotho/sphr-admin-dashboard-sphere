'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { TableRow, TableCell } from '@/components/ui/Table'

import {
  CurrencyDollarIcon,
  TagIcon,
  CalculatorIcon,
  ScaleIcon,
  ArrowPathIcon,
  ChartBarIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  ArrowDownTrayIcon, 
  BanknotesIcon, 
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface TokenMetrics {
  sphrTokenAddress: string
  usdcTokenAddress: string
  reserveDecayFactor: number
  precision: number
  sphrReserve: string
  usdcReserve: string
  usesDecayingRewards: boolean
}

const API_BASE = 'https://rewardsvault-production.up.railway.app'

// Add this near the top of your component
console.log("[Auth] Initializing TokenPage component");

export default function TokenPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Authentication check with logging
  useEffect(() => {
    console.log("[Auth] Checking authentication status");
    if (!user?.isAuthenticated) {
      console.log("[Auth] User not authenticated, redirecting to home");
      router.push('/')
    } else {
      console.log("[Auth] User authenticated:", user.address);
      setIsAuthenticated(true)
    }
  }, [user, router])

  
  const [metrics, setMetrics] = useState<TokenMetrics>({
    sphrTokenAddress: '0x000...0000',
    usdcTokenAddress: '0x000...0000',
    reserveDecayFactor: 0,
    precision: 18,
    sphrReserve: '0',
    usdcReserve: '0',
    usesDecayingRewards: true
  })
  
  const [decayingRewardsResult, setDecayingRewardsResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [calculationLoading, setCalculationLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)
  // Inside your component

const [newSphrReserve, setNewSphrReserve] = useState('');
const [newUsdcReserve, setNewUsdcReserve] = useState('');

  
  // Add new state variables
  const [withdrawTo, setWithdrawTo] = useState('')
  const [adminPrivateKey, setAdminPrivateKey] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [withdrawToken, setWithdrawToken] = useState('')
  const [newMinRate, setNewMinRate] = useState('')
  const [newRewardPool, setNewRewardPool] = useState('')
  const [txStatus, setTxStatus] = useState<{ [key: string]: string }>({})
  const [isProcessing, setIsProcessing] = useState({
    withdraw: false,
    updatePool: false
  })

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Define API endpoints
        const endpoints = [
          { name: 'sphrAddress', url: `${API_BASE}/api/exchange/token-address/sphr` },
          { name: 'usdcAddress', url: `${API_BASE}/api/exchange/token-address/usdc` },
          { name: 'decay', url: `${API_BASE}/api/exchange/decay-factor` },
          { name: 'precision', url: `${API_BASE}/api/exchange/precision` },
          { name: 'sphrReserve', url: `${API_BASE}/api/exchange/reserve/sphr` },
          { name: 'usdcReserve', url: `${API_BASE}/api/exchange/reserve/usdc` },
          { name: 'decayingRewards', url: `${API_BASE}/api/exchange/uses-decay` }
        ];

        // Create an object to store the results
        const results: Record<string, any> = {};
        let hasErrors = false;

        // Fetch each endpoint individually with proper error handling
        for (const endpoint of endpoints) {
          try {
            console.log(`Fetching ${endpoint.name} from ${endpoint.url}`);
            const response = await fetch(endpoint.url);
            
            // Check if response is OK
            if (!response.ok) {
              console.error(`Error fetching ${endpoint.name}: HTTP ${response.status}`);
              hasErrors = true;
              continue;
            }
            
            // Check content type to ensure it's JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
              // If not JSON, log the first part of the response to see what's coming back
              const text = await response.text();
              console.error(`Non-JSON response for ${endpoint.name}:`, text.substring(0, 100) + '...');
              hasErrors = true;
              continue;
            }
            
            // Parse JSON response
            const data = await response.json();
            console.log(`${endpoint.name} data:`, data);
            results[endpoint.name] = data;
          } catch (error) {
            console.error(`Error processing ${endpoint.name}:`, error);
            hasErrors = true;
          }
        }

        // Process the results to build the metrics object
        const metricsData: TokenMetrics = {
          sphrTokenAddress: '0x000...0000',
          usdcTokenAddress: '0x000...0000',
          reserveDecayFactor: 0,
          precision: 18,
          sphrReserve: '0',
          usdcReserve: '0',
          usesDecayingRewards: false
        };

        // Extract SPHR token address
        if (results.sphrAddress?.status === 'success' && results.sphrAddress?.data?.sphrTokenAddress) {
          metricsData.sphrTokenAddress = results.sphrAddress.data.sphrTokenAddress;
        }

        // Extract USDC token address
        if (results.usdcAddress?.status === 'success' && results.usdcAddress?.data?.usdcTokenAddress) {
          metricsData.usdcTokenAddress = results.usdcAddress.data.usdcTokenAddress;
        }

        // Extract decay factor
        if (results.decay?.status === 'success' && results.decay?.data?.decayFactor) {
          metricsData.reserveDecayFactor = parseFloat(results.decay.data.decayFactor); // Convert to decimal
        }

        // Extract precision
        if (results.precision?.status === 'success' && results.precision?.data?.precision) {
          // The API returns the actual precision value (e.g., 1000000000000000000)
          // We need to convert it to the exponent (e.g., 18)
          const precisionValue = results.precision.data.precision;
          const precision = Math.log10(parseFloat(precisionValue));
          if (!isNaN(precision)) {
            metricsData.precision = precision;
          }
        }

        // Extract SPHR reserve
        if (results.sphrReserve?.status === 'success' && results.sphrReserve?.data?.sphrReserve) {
          metricsData.sphrReserve = results.sphrReserve.data.sphrReserve;
        }

        // Extract USDC reserve
        if (results.usdcReserve?.status === 'success' && results.usdcReserve?.data?.usdcReserve) {
          metricsData.usdcReserve = results.usdcReserve.data.usdcReserve;
        }

        // Extract decaying rewards status
        if (results.decayingRewards?.status === 'success' && results.decayingRewards?.data?.usesDecayingRewards !== undefined) {
          metricsData.usesDecayingRewards = Boolean(results.decayingRewards.data.usesDecayingRewards);
        }

        // Update state with the extracted values
        setMetrics(metricsData);
        
        // Check if we're using any default values
        const usingDefaults = 
          metricsData.sphrTokenAddress === '0x000...0000' ||
          metricsData.usdcTokenAddress === '0x000...0000' ||
          metricsData.reserveDecayFactor === 0 ||
          metricsData.sphrReserve === '0' ||
          metricsData.usdcReserve === '0';
        
        setUsingMockData(usingDefaults || hasErrors);
        
        if (usingDefaults || hasErrors) {
          setError('Some data could not be retrieved from API. Showing partial default values.');
        }
      
      } catch (error) {
        console.error('Error fetching token data:', error);
        setError('Failed to fetch token metrics. Using default values.');
        setUsingMockData(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTokenData();
  }, []);

  const handleCalculateDecayingRewards = async () => {
    setCalculationLoading(true);
    
    try {
      const response = await fetch(
        `${API_BASE}/api/exchange/calculate-reward?sphrAmount=1`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Check if response is OK
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      // Check content type to ensure it's JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        // If not JSON, throw an error
        const text = await response.text();
        console.error('Non-JSON response for calculation:', text.substring(0, 100) + '...');
        throw new Error('Invalid response format');
      }
      
      const data = await response.json();
      
      // Based on the actual API response structure
      if (data?.status === 'success' && data?.data?.calculatedUsdcReward) {
        setDecayingRewardsResult(data.data.calculatedUsdcReward);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Calculation Error:', error);
      // Generate a realistic fallback value based on current metrics
      const sphrValue = parseFloat(metrics.sphrReserve) || 1000000;
      const usdcValue = parseFloat(metrics.usdcReserve) || 100000;
      const ratio = sphrValue / usdcValue;
      
      // Simple calculation: 100 SPHR / current ratio
      const mockReward = (100 / ratio).toFixed(2);
      
      setDecayingRewardsResult(mockReward);
      setUsingMockData(true);
    } finally {
      setCalculationLoading(false);
    }
  };

  const formatReserve = (value: string) => {
    try {
      // For this API, the reserve values are already in token units (not wei)
      const numValue = typeof value === 'string' ? parseFloat(value) : Number(value);
      
      if (isNaN(numValue)) {
        return '0.00';
      }
      
      return numValue.toLocaleString('en-US', {
        maximumFractionDigits: 2
      });
    } catch (e) {
      return '0.00';
    }
  };

  const formatAddress = (address: string) => {
    if (!address || address === '[object Object]' || address.length < 10) {
      return '0x0000...0000';
    }
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateReserveRatio = () => {
    try {
      const sphrValue = parseFloat(metrics.sphrReserve);
      const usdcValue = parseFloat(metrics.usdcReserve);
      
      if (isNaN(sphrValue) || isNaN(usdcValue) || usdcValue === 0) {
        return 'N/A';
      }
      
      return (sphrValue / usdcValue).toFixed(2);
    } catch (e) {
      return 'N/A';
    }
  };

  const calculateEstimatedAPY = () => {
    try {
      const decayFactor = metrics.reserveDecayFactor;
      
      if (isNaN(decayFactor) || decayFactor === 0) {
        return '0.00%';
      }
      
      return `${(decayFactor * 100).toFixed(2)}%`;
    } catch (e) {
      return '0.00%';
    }
  };

 // Authentication check with logging
 useEffect(() => {
  console.log("[Auth] Checking authentication status");
  if (!user?.isAuthenticated) {
    console.log("[Auth] User not authenticated, redirecting to home");
    router.push('/')
  } else {
    console.log("[Auth] User authenticated:", user.address);
    setIsAuthenticated(true)
  }
}, [user, router])

// Update the handleWithdraw function
const handleWithdraw = async () => {
  console.log("[Withdraw] Initiated withdrawal process");
  
  if (!isAuthenticated || !user?.address) {
    console.error("[Auth] Withdrawal blocked - no authenticated user");
    setTxStatus({ withdraw: 'Please connect your wallet first' });
    return;
  }

  console.log("[Withdraw] Using adminPrivateKey:", user.address);
  
  setIsProcessing(prev => ({ ...prev, withdraw: true }));
  setTxStatus({});
  
  // Validate inputs
  if (!withdrawTo || !withdrawTo.trim().startsWith('0x')) {
    console.error("[Validation] Invalid recipient address");
    setTxStatus({ withdraw: 'Please enter a valid recipient address (starting with 0x)' });
    setIsProcessing(prev => ({ ...prev, withdraw: false }));
    return;
  }

  try {
    console.log("[API] Sending withdrawal request with:", {
      adminPrivateKey: user.address,
      tokenAddress: withdrawToken,
      to: withdrawTo,
      amount: withdrawAmount
    });

    const response = await fetch(`${API_BASE}/api/exchange/admin/withdraw-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminPrivateKey: user.address, // Explicitly using user's address
        tokenAddress: withdrawToken.trim(),
        to: withdrawTo.trim(),
        amount: parseFloat(withdrawAmount)
      })
    });

    console.log("[API] Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("[API] Error response:", errorData);
      throw new Error(errorData.message || 'Withdrawal failed');
    }

    console.log("[Withdraw] Successfully processed");
    setTxStatus({ withdraw: 'Withdrawal successful!' });
    
  } catch (error) {
    console.error("[Withdraw] Error:", error);
    setTxStatus({ withdraw: error instanceof Error ? error.message : 'Withdrawal failed' });
  } finally {
    setIsProcessing(prev => ({ ...prev, withdraw: false }));
  }
};

// Update the handleUpdateRewardPool function
const handleUpdateRewardPool = async () => {
  console.log("[PoolUpdate] Initiated reward pool update");
  
  if (!isAuthenticated || !user?.address) {
    console.error("[Auth] Update blocked - no authenticated user");
    setTxStatus({ rewardPool: 'Please connect your wallet first' });
    return;
  }

  console.log("[PoolUpdate] Using adminPrivateKey:", user.address);
  
  setIsProcessing(prev => ({ ...prev, updatePool: true }));
  setTxStatus({});

  try {
    console.log("[API] Sending pool update request with:", {
      adminPrivateKey: user.address,
      
      newSphrReserve,
      newUsdcReserve
    });

    const response = await fetch(`${API_BASE}/api/exchange/admin/update-reward-pool`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        adminPrivateKey: user.address, // Explicitly using user's address
       
        newSphrReserve: newSphrReserve.trim(),
        newUsdcReserve: newUsdcReserve.trim()
      })
    });

    console.log("[API] Response status:", response.status);
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("[API] Error response:", errorData);
      throw new Error(errorData.message || 'Update failed');
    }

    console.log("[PoolUpdate] Successfully processed");
    setTxStatus({ rewardPool: 'Reward pool updated successfully!' });
    
  } catch (error) {
    console.error("[PoolUpdate] Error:", error);
    setTxStatus({ rewardPool: error instanceof Error ? error.message : 'Update failed' });
  } finally {
    setIsProcessing(prev => ({ ...prev, updatePool: false }));
  }
};
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-8 w-64 bg-gray-700 rounded mb-4"></div>
            <div className="h-4 w-48 bg-gray-700 rounded"></div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              SPHR Reserves Metrics
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Real-time token reserve analytics and parameters
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className={`h-2 w-2 rounded-full ${usingMockData ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
              <span className="text-sm text-gray-400">{usingMockData ? 'Demo Mode' : 'Mainnet'}</span>
            </div>
          </div>
        </div>
        {error && (
          <div className="bg-amber-900/20 border border-amber-800/30 rounded-lg p-4 flex items-start space-x-3">
            <ExclamationCircleIcon className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-200 text-sm">{error}</p>
              <p className="text-amber-400/70 text-xs mt-1">Some data shown may be simulated for demonstration purposes.</p>
            </div>
          </div>
        )}
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="SPHR Token Address" icon={TagIcon} color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-gray-300 truncate w-48">
                  {formatAddress(String(metrics.sphrTokenAddress))}
                </p>
                <p className="text-xs text-blue-400 mt-1">SPHR ERC-20 Token</p>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-lg backdrop-blur-sm">
                <TagIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
          
          <Card title="USDC Token Address" icon={TagIcon} color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-gray-300 truncate w-48">
                  {formatAddress(String(metrics.usdcTokenAddress))}
                </p>
                <p className="text-xs text-green-400 mt-1">USDC ERC-20 Token</p>
              </div>
               
              <div className="p-3 bg-green-900/20 rounded-lg backdrop-blur-sm">
                <TagIcon className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </Card>
          
          <Card title="Reserve Decay Factor" icon={ChartBarIcon} color="purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {isNaN(metrics.reserveDecayFactor) ? '0.10' : metrics.reserveDecayFactor.toFixed(2)}
                </p>
                <p className="text-xs text-purple-400 mt-1">Per epoch decay rate</p>
              </div>
              <div className="p-3 bg-purple-900/20 rounded-lg backdrop-blur-sm">
                <ScaleIcon className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>
          
          <Card title="Precision" icon={CalculatorIcon} color="indigo">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  1e{isNaN(metrics.precision) ? '18' : metrics.precision}
                </p>
                <p className="text-xs text-indigo-400 mt-1">Decimal precision</p>
              </div>
              <div className="p-3 bg-indigo-900/20 rounded-lg backdrop-blur-sm">
                <CalculatorIcon className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </Card>
          <Card title="SPHR Reserve" icon={CurrencyDollarIcon} color="emerald">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-l font-bold text-white">
                  {formatReserve(metrics.sphrReserve)}
                </p>
                <p className="text-xs text-emerald-400 mt-1">Current reserve balance</p>
              </div>
              <div className="p-3 bg-emerald-900/20 rounded-lg backdrop-blur-sm">
                <CurrencyDollarIcon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </Card>
          
          <Card title="USDC Reserve" icon={CurrencyDollarIcon} color="amber">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-l font-bold text-white">
                  {formatReserve(metrics.usdcReserve)}
                </p>
                <p className="text-xs text-amber-400 mt-1">Stablecoin reserve</p>
              </div>
              <div className="p-3 bg-amber-900/20 rounded-lg backdrop-blur-sm">
                <CurrencyDollarIcon className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </Card>
          
         
        </div>
        
        {/* Admin Controls Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Admin Controls Grid */}

  <Card title="Withdraw Tokens" icon={ArrowDownTrayIcon} color="rose">
    <div className="space-y-4 mt-4">
      <input
        type="number"
        placeholder="Amount"
        value={withdrawAmount}
        onChange={(e) => setWithdrawAmount(e.target.value)}
        className="w-full bg-gray-800/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Token Address"
        value={withdrawToken}
        onChange={(e) => setWithdrawToken(e.target.value)}
        className="w-full bg-gray-800/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
      />
      <input
        type="text"
        placeholder="Withdraw To Address"
        value={withdrawTo} // Ensure you have this state defined
        onChange={(e) => setWithdrawTo(e.target.value)} // Ensure you have this state defined
        className="w-full bg-gray-800/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
      />
      <button
        onClick={handleWithdraw}
        disabled={isProcessing.withdraw}
        className={`w-full py-2 px-4 rounded-lg transition-colors 
          ${isProcessing.withdraw ? 'bg-rose-700' : 'bg-rose-600 hover:bg-rose-700'} 
          text-white disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {isProcessing.withdraw ? 'Processing...' : 'Withdraw'}
      </button>
      {txStatus.withdraw && (
        <p className={`text-sm ${txStatus.withdraw.includes('success') ? 'text-green-400' : 'text-rose-400'}`}>
          {txStatus.withdraw}
        </p>
      )}
    </div>
  </Card>

  
{/* Update Reward Pool Card */}
 {/* Update Reward Pool Card */}
 <Card title="Update Reward Pool" icon={BanknotesIcon} color="emerald">
            <div className="space-y-4 mt-4">
             {/*  <input
              type='text'
              placeholder='AdminPrivateKey'
              value={adminPrivateKey}
              onChange={(e) => setAdminPrivateKey(e.target.value)}
               className="w-full bg-gray-800/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
             */}
              <input
                type="text"
                placeholder="New SPHR Reserve "
                value={newSphrReserve}
                onChange={(e) => setNewSphrReserve(e.target.value)}
                className="w-full bg-gray-800/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <input
                type="text"
                placeholder="New USDC Reserve "
                value={newUsdcReserve}
                onChange={(e) => setNewUsdcReserve(e.target.value)}
                className="w-full bg-gray-800/50 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <button
                onClick={handleUpdateRewardPool}
                disabled={isProcessing.updatePool}
                className={`w-full py-2 px-4 rounded-lg transition-colors 
                  ${isProcessing.updatePool ? 'bg-emerald-700' : 'bg-emerald-600 hover:bg-emerald-700'} 
                  text-white disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isProcessing.updatePool ? 'Updating...' : 'Update Pool'}
              </button>
              {txStatus.rewardPool && (
                <p className={`text-sm ${txStatus.rewardPool.includes('success') ? 'text-green-400' : 'text-rose-  400'}`}>
                  {txStatus.rewardPool}
                </p>
              )}
            </div>
          </Card>
       
          <Card title="Rewards System" icon={ArrowPathIcon} color="rose">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {metrics.usesDecayingRewards ? 'True' : 'False'}
                </p>
                <p className="text-xs text-rose-400 mt-1">
                  {metrics.usesDecayingRewards ? 'Decaying rewards enabled' : 'Fixed rewards'}
                </p>
              </div>
              <div className="p-3 bg-rose-900/20 rounded-lg backdrop-blur-sm">
                <ArrowPathIcon className="h-6 w-6 text-rose-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Decaying Rewards Calculation */}
        <Card title="Exchange Rate Calculator" icon={CalculatorIcon} color="cyan">
          <div className="mt-4 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={handleCalculateDecayingRewards}
                disabled={calculationLoading}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg hover:from-cyan-600 hover:to-blue-600 disabled:opacity-50 transition-all"
              >
                {calculationLoading ? 'Calculating...' : 'Calculate Rewards'}
              </button>
              
              {decayingRewardsResult && (
                <div className="p-4 bg-gray-800/50 rounded-lg flex items-center">
                  <span className="text-cyan-400 font-mono">
                    {decayingRewardsResult} USDC
                  </span>
                  {usingMockData && (
                    <span className="ml-2 text-xs text-amber-400">(simulated)</span>
                  )}
                </div>
              )}
            </div>
            
            <div className="text-sm text-gray-400 flex items-center space-x-2">
              <InformationCircleIcon className="h-5 w-5 text-cyan-400" />
              <span>Calculation based on current reserves for 100 SPHR</span>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
