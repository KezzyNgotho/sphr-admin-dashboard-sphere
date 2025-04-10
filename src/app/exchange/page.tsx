'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { TableRow, TableCell } from '@/components/ui/Table'
import {
  ArrowsRightLeftIcon,
  ArrowTrendingUpIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowPathIcon,
  BanknotesIcon
} from '@heroicons/react/24/outline'

// Dummy data
const exchangeStats = {
  totalVolume: '$1.2M',
  totalTrades: '4,231',
  averagePrice: '$25.40',
  priceChange: '+2.5%',
  liquidity: '$500K',
  activeTraders: '892'
}

const recentTrades = [
  {
    id: 1,
    type: 'Buy',
    amount: '1,000 SPHR',
    price: '$25.40',
    total: '$25,400',
    time: '2 hours ago',
    status: 'Completed'
  },
  {
    id: 2,
    type: 'Sell',
    amount: '500 SPHR',
    price: '$25.45',
    total: '$12,725',
    time: '4 hours ago',
    status: 'Completed'
  },
  {
    id: 3,
    type: 'Buy',
    amount: '200 SPHR',
    price: '$25.35',
    total: '$5,070',
    time: '6 hours ago',
    status: 'Completed'
  }
]

export default function ExchangePage() {
  const [tokenAmount, setTokenAmount] = useState('')
  const [usdAmount, setUsdAmount] = useState('')

  const handleTokenAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTokenAmount(e.target.value)
    // Update USD amount based on current price
    setUsdAmount((parseFloat(e.target.value) * 1.5).toString())
  }

  const handleUsdAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsdAmount(e.target.value)
    // Update token amount based on current price
    setTokenAmount((parseFloat(e.target.value) / 1.5).toString())
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Exchange</h1>
            <p className="mt-1 text-sm text-gray-400">
              Trade SPHR tokens
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
              <span className="text-sm text-gray-400">Live</span>
            </div>
            <div className="text-sm text-gray-400">
              Last updated: 2 minutes ago
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card title="Total Volume" icon={ChartBarIcon} color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{exchangeStats.totalVolume}</p>
                <p className="text-xs text-blue-400 mt-1">Total Trades: {exchangeStats.totalTrades}</p>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card title="Current Price" icon={CurrencyDollarIcon} color="indigo">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{exchangeStats.averagePrice}</p>
                <p className="text-xs text-indigo-400 mt-1">24h Change: {exchangeStats.priceChange}</p>
              </div>
              <div className="p-3 bg-indigo-900/20 rounded-lg">
                <CurrencyDollarIcon className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </Card>

          <Card title="Liquidity" icon={BanknotesIcon} color="emerald">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{exchangeStats.liquidity}</p>
                <p className="text-xs text-emerald-400 mt-1">Active Traders: {exchangeStats.activeTraders}</p>
              </div>
              <div className="p-3 bg-emerald-900/20 rounded-lg">
                <BanknotesIcon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Exchange Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800/30">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 rounded-full bg-blue-500/10">
                <ArrowsRightLeftIcon className="h-5 w-5 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-white">Swap Tokens</h3>
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
                  />
                  <div className="absolute right-3 top-2 text-sm text-gray-400">USD</div>
                </div>
              </div>
              <button className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Swap
              </button>
            </div>
          </div>

          <Card title="Recent Trades" icon={ArrowTrendingUpIcon} color="blue">
            <div className="mt-4">
              <Table headers={['Type', 'Amount', 'Price', 'Total', 'Time', 'Status']}>
                {recentTrades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        trade.type === 'Buy' 
                          ? 'bg-emerald-900/20 text-emerald-400 border border-emerald-800/30'
                          : 'bg-rose-900/20 text-rose-400 border border-rose-800/30'
                      }`}>
                        {trade.type}
                      </span>
                    </TableCell>
                    <TableCell>{trade.amount}</TableCell>
                    <TableCell>{trade.price}</TableCell>
                    <TableCell>{trade.total}</TableCell>
                    <TableCell>{trade.time}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-900/20 text-emerald-400 border border-emerald-800/30">
                        {trade.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </Table>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 