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
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface TokenMetrics {
  tokenAddress: string
  reserveDecayFactor: number
  precision: number
  sphrReserve: string
  wberaReserve: string
  usesDecayingRewards: boolean
}

const API_BASE = 'https://rewardsvault-production.up.railway.app'

export default function TokenPage() {
  const [metrics, setMetrics] = useState<TokenMetrics>({
    tokenAddress: '0x000...0000',
    reserveDecayFactor: 0,
    precision: 18,
    sphrReserve: '0',
    wberaReserve: '0',
    usesDecayingRewards: true
  })
  
  const [decayingRewardsResult, setDecayingRewardsResult] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [calculationLoading, setCalculationLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [usingMockData, setUsingMockData] = useState(false)

  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        // Fetch token address
        const addressRes = await fetch(`${API_BASE}/api/exchange/token-address/sphr`);
        let addressData;
        if (addressRes.ok) {
          addressData = await addressRes.json();
        }
        
        // Fetch decay factor
        const decayRes = await fetch(`${API_BASE}/api/exchange/decay-factor`);
        let decayData;
        if (decayRes.ok) {
          decayData = await decayRes.json();
        }
        
        // Fetch precision
        const precisionRes = await fetch(`${API_BASE}/api/exchange/precision`);
        let precisionData;
        if (precisionRes.ok) {
          precisionData = await precisionRes.json();
        }
        
        // Fetch SPHR reserve
        const sphrRes = await fetch(`${API_BASE}/api/exchange/reserve/sphr`);
        let sphrData;
        if (sphrRes.ok) {
          sphrData = await sphrRes.json();
        }
        
        // Fetch WBERA reserve
        const wberaRes = await fetch(`${API_BASE}/api/exchange/reserve/wbera`);
        let wberaData;
        if (wberaRes.ok) {
          wberaData = await wberaRes.json();
        }
        
        // Fetch decaying rewards status
        const decayingRes = await fetch(`${API_BASE}/api/exchange/uses-decay`);
        let decayingData;
        if (decayingRes.ok) {
          decayingData = await decayingRes.json();
        }

        // Extract token address - based on actual API response structure
        let tokenAddress = '0x000...0000';
        if (addressData?.status === 'success' && addressData?.data?.sphrTokenAddress) {
          tokenAddress = addressData.data.sphrTokenAddress;
        }
        
        // Extract decay factor - based on actual API response structure
        let reserveDecayFactor = 0;
        if (decayData?.status === 'success' && decayData?.data?.decayFactor) {
          reserveDecayFactor = parseFloat(decayData.data.decayFactor) / 100; // Convert to decimal
        }
        
        // Extract precision - based on actual API response structure
        let precision = 18;
        if (precisionData?.status === 'success' && precisionData?.data?.precision) {
          // The API returns the actual precision value (e.g., 1000000000000000000)
          // We need to convert it to the exponent (e.g., 18)
          const precisionValue = precisionData.data.precision;
          precision = Math.log10(parseFloat(precisionValue));
          if (isNaN(precision)) {
            precision = 18; // Default to 18 if conversion fails
          }
        }
        
        // Extract SPHR reserve - based on actual API response structure
        let sphrReserve = '0';
        if (sphrData?.status === 'success' && sphrData?.data?.sphrReserve) {
          sphrReserve = sphrData.data.sphrReserve;
        }
        
        // Extract WBERA reserve - based on actual API response structure
        let wberaReserve = '0';
        if (wberaData?.status === 'success' && wberaData?.data?.wberaReserve) {
          wberaReserve = wberaData.data.wberaReserve;
        }
        
        // Extract decaying rewards status - based on actual API response structure
        let usesDecayingRewards = true;
        if (decayingData?.status === 'success' && decayingData?.data?.usesDecayingRewards !== undefined) {
          usesDecayingRewards = Boolean(decayingData.data.usesDecayingRewards);
        }

        // Update state with the extracted values
        setMetrics({
          tokenAddress,
          reserveDecayFactor,
          precision,
          sphrReserve,
          wberaReserve,
          usesDecayingRewards
        });
        
        // Check if we're using any default values
        const usingDefaults = 
          tokenAddress === '0x000...0000' || 
          reserveDecayFactor === 0 || 
          sphrReserve === '0' || 
          wberaReserve === '0';
          
        setUsingMockData(usingDefaults);
        
        if (usingDefaults) {
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
        `${API_BASE}/api/exchange/calculate-reward?sphrAmount=100`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      // Based on the actual API response structure
      if (data?.status === 'success' && data?.data?.calculatedWberaReward) {
        setDecayingRewardsResult(data.data.calculatedWberaReward);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Calculation Error:', error);
      // Generate a realistic fallback value based on current metrics
      const sphrValue = parseFloat(metrics.sphrReserve) || 1000000;
      const wberaValue = parseFloat(metrics.wberaReserve) || 100000;
      const ratio = sphrValue / wberaValue;
      
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
      const wberaValue = parseFloat(metrics.wberaReserve);
      
      if (isNaN(sphrValue) || isNaN(wberaValue) || wberaValue === 0) {
        return 'N/A';
      }
      
      return (sphrValue / wberaValue).toFixed(2);
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
              SPHR Token Metrics
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
          <Card title="Token Address" icon={TagIcon} color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-gray-300 truncate w-48">
                  {formatAddress(String(metrics.tokenAddress))}
                </p>
                <p className="text-xs text-blue-400 mt-1">ERC-20 Token</p>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-lg backdrop-blur-sm">
                <InformationCircleIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>
          
          <Card title="Reserve Decay Factor" icon={ChartBarIcon} color="purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {isNaN(metrics.reserveDecayFactor) ? '0.10' : metrics.reserveDecayFactor.toFixed(2)}x
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
                <p className="text-2xl font-bold text-white">
                  {formatReserve(metrics.sphrReserve)}
                </p>
                <p className="text-xs text-emerald-400 mt-1">Current reserve balance</p>
              </div>
              <div className="p-3 bg-emerald-900/20 rounded-lg backdrop-blur-sm">
                <CurrencyDollarIcon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </Card>
          
          <Card title="WBERA Reserve" icon={CurrencyDollarIcon} color="amber">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {formatReserve(metrics.wberaReserve)}
                </p>
                <p className="text-xs text-amber-400 mt-1">Wrapped token reserve</p>
              </div>
              <div className="p-3 bg-amber-900/20 rounded-lg backdrop-blur-sm">
                <CurrencyDollarIcon className="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </Card>
          
          <Card title="Rewards System" icon={ArrowPathIcon} color="rose">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  {metrics.usesDecayingRewards ? 'Active' : 'Inactive'}
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
        <Card title="Decaying Rewards Calculator" icon={CalculatorIcon} color="cyan">
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
                    {decayingRewardsResult} WBERA
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

        {/* Additional Information */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <h3 className="text-lg font-medium text-white mb-2">About SPHR Token Metrics</h3>
          <p className="text-sm text-gray-400">
            The SPHR token uses a decaying rewards mechanism to incentivize long-term holding.
            The reserve decay factor determines how quickly rewards decrease over time, while
            the precision value defines the decimal places used in calculations.
          </p>
          
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-white">Reserve Ratio</h4>
              <p className="text-xs text-gray-400 mt-1">
                SPHR to WBERA: {calculateReserveRatio()}
              </p>
            </div>
            
            <div className="bg-gray-800/50 p-3 rounded-lg">
              <h4 className="text-sm font-medium text-white">Estimated APY</h4>
              <p className="text-xs text-gray-400 mt-1">
                {calculateEstimatedAPY()} (based on current decay factor)
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
