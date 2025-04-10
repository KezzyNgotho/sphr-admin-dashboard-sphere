'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import DashboardLayout from '@/components/layout/DashboardLayout'
import {
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function Settings() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: true
  })
  const [language, setLanguage] = useState('en')
  const [currency, setCurrency] = useState('USD')
  const [security, setSecurity] = useState({
    twoFactor: false,
    biometric: false,
    autoLock: true
  })

  const handleNotificationChange = (type: keyof typeof notifications) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  const handleSecurityChange = (type: keyof typeof security) => {
    setSecurity(prev => ({
      ...prev,
      [type]: !prev[type]
    }))
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Settings</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800/30">
            <h2 className="text-lg font-semibold text-white mb-4">Profile Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                <input
                  type="email"
                  value={user?.user_metadata?.email || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Wallet Address</label>
                <input
                  type="text"
                  value={user?.address || ''}
                  disabled
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Notification Settings */}
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800/30">
            <h2 className="text-lg font-semibold text-white mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BellIcon className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Email Notifications</h3>
                    <p className="text-xs text-gray-400">Receive updates via email</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('email')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.email ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notifications.email ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BellIcon className="h-5 w-5 text-blue-400" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Push Notifications</h3>
                    <p className="text-xs text-gray-400">Receive push notifications</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNotificationChange('push')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications.push ? 'bg-blue-500' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      notifications.push ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800/30">
            <h2 className="text-lg font-semibold text-white mb-4">Security Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-400">Add an extra layer of security</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSecurityChange('twoFactor')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.twoFactor ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      security.twoFactor ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <ShieldCheckIcon className="h-5 w-5 text-emerald-400" />
                  <div>
                    <h3 className="text-sm font-medium text-white">Biometric Authentication</h3>
                    <p className="text-xs text-gray-400">Use fingerprint or face ID</p>
                  </div>
                </div>
                <button
                  onClick={() => handleSecurityChange('biometric')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    security.biometric ? 'bg-emerald-500' : 'bg-gray-700'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      security.biometric ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Preferences */}
          <div className="bg-gray-900/50 rounded-lg p-6 backdrop-blur-sm border border-gray-800/30">
            <h2 className="text-lg font-semibold text-white mb-4">Preferences</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-800/50 border border-gray-700/30 rounded-lg text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
} 