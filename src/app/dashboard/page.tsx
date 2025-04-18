'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  CurrencyDollarIcon,
  ArrowsRightLeftIcon,
  TagIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'

const API_BASE = 'https://rewardsvault-production.up.railway.app'

const fadeIn = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

interface TokenInfo {
  totalSupply: string
  isTransferable: boolean
  symbol: string
  name: string
}

const parseResponse = async (res: Response, key?: string) => {
  console.log(`%c[API] Parsing ${res.url}`, 'color: #4CAF50; font-weight: bold;');
  console.log('Response status:', res.status);
  
  if (!res.ok) {
    console.error(`%c[API Error] ${res.status} ${res.statusText}`, 'color: #FF5722;');
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  
  const data = await res.json();
  console.log('Raw API response:', data);

  const result = key ? (data.data?.[key] ?? data[key]) : (data.data ?? data);
  console.log(`%c[API Parsed] ${key || 'Full Data'}:`, 'color: #2196F3;', result);
  
  return result;
};

export default function Dashboard() {
  const [tokenInfo, setTokenInfo] = useState<TokenInfo>({
    totalSupply: 'Loading...',
    isTransferable: true,
    symbol: 'Loading ...',
    name: 'Loading...'
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { user } = useAuth()
  const router = useRouter()

  // Authentication check
  useEffect(() => {
    if (!user?.isAuthenticated) {
      router.push('/')
    }
  }, [user, router])

  // Data fetching
  useEffect(() => {
    const fetchTokenData = async () => {
      try {
        console.groupCollapsed('%c[Data Fetch] Starting request batch', 'color: #9C27B0;');
        setLoading(true);
        
        const endpoints = [
          `${API_BASE}/api/sphr/totalSupply`,
          `${API_BASE}/api/sphr/transferable`,
          `${API_BASE}/api/sphr/symbol`,
          `${API_BASE}/api/sphr/name`
        ];

        const responses = await Promise.all(endpoints.map(url => fetch(url)));
        
        const mockData = {
          totalSupply: '1000000000',
          isTransferable: true,
          symbol: 'SPHR',
          name: 'Sphere Token'
        };

        try {
          const [totalSupply, isTransferable, symbol, name] = await Promise.all([
            parseResponse(responses[0], 'totalSupply'),
            parseResponse(responses[1], 'transferable'),
            parseResponse(responses[2], 'symbol'),
            parseResponse(responses[3], 'name')
          ]);

          setTokenInfo({
            totalSupply: totalSupply || mockData.totalSupply,
            isTransferable: Boolean(isTransferable ?? mockData.isTransferable),
            symbol: symbol || mockData.symbol,
            name: name || mockData.name
          });
        } catch (parseError) {
          console.error('Parse error:', parseError);
          setTokenInfo(mockData);
          setError('API response format error. Using mock data.');
        }
      } catch (error) {
        console.error('Fetch error:', error);
        setError('Network error. Using mock data.');
      } finally {
        setLoading(false);
        console.groupEnd();
      }
    };

    if (user?.isAuthenticated) {
      fetchTokenData();
    }
  }, [user?.isAuthenticated]);

  const formatSupply = (supply: string) => {
    const numericValue = parseFloat(supply);
    return isNaN(numericValue) ? supply : 
      numericValue.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' SPHR';
  };

  if (!user?.isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A0A0A] via-[#111827] to-[#0A0A0A] relative overflow-hidden">
      <DashboardLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div 
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8"
            variants={fadeIn}
            initial="initial"
            animate="animate"
          >
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-clip-text text-transparent tracking-tight">
                {tokenInfo.name} Dashboard
              </h1>
              <p className="mt-2 text-sm text-blue-200">
                {user?.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'No address available'}
              </p>
            </div>
          </motion.div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-800/30 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Supply Card */}
            <div className="bg-blue-900/20 rounded-xl border border-blue-800/30 shadow-lg backdrop-blur-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-500/30 rounded-xl">
                  <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm text-blue-200">Total Supply</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? 'Loading...' : formatSupply(tokenInfo.totalSupply)}
                  </p>
                </div>
              </div>
            </div>

            {/* Transfer Status Card */}
            <div className="bg-emerald-900/20 rounded-xl border border-emerald-800/30 shadow-lg backdrop-blur-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-emerald-500/30 rounded-xl">
                  <ArrowsRightLeftIcon className="h-6 w-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-sm text-emerald-200">Transfers</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? 'Loading...' : tokenInfo.isTransferable ? 'True' : 'False'}
                  </p>
                </div>
              </div>
            </div>

            {/* Symbol Card */}
            <div className="bg-purple-900/20 rounded-xl border border-purple-800/30 shadow-lg backdrop-blur-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-purple-500/30 rounded-xl">
                  <TagIcon className="h-6 w-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-sm text-purple-200">Symbol</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? 'Loading...' : tokenInfo.symbol}
                  </p>
                </div>
              </div>
            </div>

            {/* Name Card */}
            <div className="bg-indigo-900/20 rounded-xl border border-indigo-800/30 shadow-lg backdrop-blur-xl p-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-500/30 rounded-xl">
                  <DocumentTextIcon className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-indigo-200">Token Name</p>
                  <p className="text-2xl font-bold text-white mt-1">
                    {loading ? 'Loading...' : tokenInfo.name}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  )
}