'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/layout/DashboardLayout'
import Card from '@/components/ui/Card'
import Table from '@/components/ui/Table'
import { TableRow, TableCell } from '@/components/ui/Table'
import {
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  UserGroupIcon,
  ArrowPathIcon,
  BanknotesIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

// Dummy data
const tokenStats = {
  totalSupply: '1,000,000 SPHR',
  marketCap: '$25.4M',
  price: '$25.40',
  priceChange: '+2.5%',
  holders: '1,892',
  volume24h: '$1.2M',
  transactions: '4,231'
}

const recentTransactions = [
  {
    id: 1,
    type: 'Transfer',
    amount: '+1,000 SPHR',
    from: '0x1234...5678',
    to: '0x8765...4321',
    time: '2 hours ago',
    status: 'Completed'
  },
  {
    id: 2,
    type: 'Mint',
    amount: '+500 SPHR',
    from: 'System',
    to: '0x8765...4321',
    time: '4 hours ago',
    status: 'Completed'
  },
  {
    id: 3,
    type: 'Burn',
    amount: '-200 SPHR',
    from: '0x1234...5678',
    to: 'System',
    time: '6 hours ago',
    status: 'Completed'
  }
]

export default function TokenPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [tokenAmount, setTokenAmount] = useState('')

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Token Management</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your SPHR tokens
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card title="Total Supply" icon={CurrencyDollarIcon} color="blue">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{tokenStats.totalSupply}</p>
                <p className="text-xs text-blue-400 mt-1">Market Cap: {tokenStats.marketCap}</p>
              </div>
              <div className="p-3 bg-blue-900/20 rounded-lg backdrop-blur-sm">
                <CurrencyDollarIcon className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </Card>

          <Card title="Price" icon={ArrowTrendingUpIcon} color="indigo">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{tokenStats.price}</p>
                <p className="text-xs text-indigo-400 mt-1">24h Change: {tokenStats.priceChange}</p>
              </div>
              <div className="p-3 bg-indigo-900/20 rounded-lg backdrop-blur-sm">
                <ArrowTrendingUpIcon className="h-6 w-6 text-indigo-400" />
              </div>
            </div>
          </Card>

          <Card title="Holders" icon={UserGroupIcon} color="emerald">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{tokenStats.holders}</p>
                <p className="text-xs text-emerald-400 mt-1">24h Transactions: {tokenStats.transactions}</p>
              </div>
              <div className="p-3 bg-emerald-900/20 rounded-lg backdrop-blur-sm">
                <UserGroupIcon className="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </Card>

          <Card title="Volume" icon={ChartBarIcon} color="purple">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-white">{tokenStats.volume24h}</p>
                <p className="text-xs text-purple-400 mt-1">Last Updated: 2 minutes ago</p>
              </div>
              <div className="p-3 bg-purple-900/20 rounded-lg backdrop-blur-sm">
                <ChartBarIcon className="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Transactions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Recent Transactions</h2>
          <Table headers={['Type', 'Amount', 'From', 'To', 'Time', 'Status']}>
            {recentTransactions.map((tx) => (
              <TableRow key={tx.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-900/20 rounded-lg backdrop-blur-sm">
                      <BanknotesIcon className="h-5 w-5 text-blue-400" />
                    </div>
                    <span className="ml-2 text-gray-300">{tx.type}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{tx.amount}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{tx.from}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{tx.to}</span>
                </TableCell>
                <TableCell>
                  <span className="text-gray-300">{tx.time}</span>
                </TableCell>
                <TableCell>
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-emerald-900/20 text-emerald-400 border border-emerald-800/30 backdrop-blur-sm">
                    {tx.status}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </Table>
        </div>

        {/* Token Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card title="Mint Tokens" icon={ArrowTrendingUpIcon} color="blue">
            <div className="mt-4">
              <input
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Mint Tokens
              </button>
            </div>
          </Card>

          <Card title="Burn Tokens" icon={ArrowPathIcon} color="purple">
            <div className="mt-4">
              <input
                type="number"
                value={tokenAmount}
                onChange={(e) => setTokenAmount(e.target.value)}
                placeholder="0.0"
                className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
              />
              <button className="w-full mt-4 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg hover:from-red-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Burn Tokens
              </button>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
} 