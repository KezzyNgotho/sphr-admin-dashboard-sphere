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

  useEffect(() => {
    const fetchExchangeData = async () => {
      try {
        const [
          rateRes,
          minRateRes,
          claimRes,
          cooldownRes,
          transferRes
        ] = await Promise.all([
          fetch('https://rewardsvault-production.up.railway.app/api/exchange/rate-info'),
          fetch('https://rewardsvault-production.up.railway.app/api/exchange/min-rate'),
          fetch('https://rewardsvault-production.up.railway.app/api/exchange/claim-info/:address'),
          fetch('https://rewardsvault-production.up.railway.app/api/exchange/cooldown-period'),
          fetch('https://rewardsvault-production.up.railway.app/api/sphr/transferable')
        ])

        const metricsData = {
          exchangeRate: await rateRes.json(),
          minExchangeRate: await minRateRes.json(),
          claimInfo: await claimRes.json(),
          cooldownPeriod: await cooldownRes.json(),
          isSphrTransferable: await transferRes.json()
        }

        setMetrics(metricsData)
      } catch (error) {
        console.error('Error fetching exchange data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExchangeData()
  }, [])

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setTokenAmount(value)
    setUsdAmount(value ? (parseFloat(value) * metrics.exchangeRate).toFixed(2) : '')
  }

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUsdAmount(value)
    setTokenAmount(value ? (parseFloat(value) / metrics.exchangeRate).toFixed(4) : '')
  }

  const formatTime = (dateString: string) => 
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })

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

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Exchange Rate" icon={ArrowsRightLeftIcon} color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">
                  1 SPHR = ${metrics.exchangeRate.toFixed(4)}
                </p>
                <p className="text-xs text-blue-400 mt-1">
                  Min Rate: ${metrics.minExchangeRate.toFixed(4)}
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
                  Last: {formatTime(metrics.claimInfo.lastClaim)}
                </p>
                <p className="text-xs text-emerald-400 mt-1">
                  Next: {formatTime(metrics.claimInfo.nextAvailable)}
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
                  {metrics.cooldownPeriod}h
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
                  {metrics.isSphrTransferable ? 'Active' : 'Locked'}
                </p>
                <p className="text-xs text-amber-400 mt-1">
                  Token transfers
                </p>
              </div>
              <div className="p-3 bg-amber-900/20 rounded-lg backdrop-blur-sm">
                {metrics.isSphrTransferable ? (
                  <LockClosedIcon className="h-6 w-6 text-amber-400" />
                ) : (
                  <LockClosedIcon className="h-6 w-6 text-amber-400" />
                )}
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
                  disabled={!metrics.isSphrTransferable}
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
                  disabled={!metrics.isSphrTransferable}
                />
                <div className="absolute right-3 top-2 text-sm text-gray-400">USD</div>
              </div>
            </div>

            <button 
              className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50"
              disabled={!metrics.isSphrTransferable || isLoading}
            >
              {metrics.isSphrTransferable ? 'Execute Swap' : 'Transfers Locked'}
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}