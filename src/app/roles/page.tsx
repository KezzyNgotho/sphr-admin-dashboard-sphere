'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  ShieldCheckIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  ArrowPathIcon,
  NoSymbolIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'react-hot-toast'

const API_BASE = 'https://rewardsvault-production.up.railway.app'

interface RoleResponse {
  roles: Record<string, string[]>
  auditLogs: Array<{
    id: string
    timestamp: string
    action: string
    role: string
    address: string
    by: string
  }>
}

const roleDefinitions = [
  { key: 'DEFAULT_ADMIN', name: 'Default Admin' },
  { key: 'OPERATOR', name: 'Operator' },
  { key: 'UPGRADER', name: 'Upgrader' },
  { key: 'MINTER', name: 'Minter' },
  { key: 'BURNER', name: 'Burner' },
  { key: 'PAUSER', name: 'Pauser' }
]

const fetchRoleData = async (): Promise<RoleResponse> => {
  const handleResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type')
    if (!response.ok) {
      const error = contentType?.includes('application/json')
        ? await response.json()
        : await response.text()
      throw new Error(error.message || error || 'Request failed')
    }
    return contentType?.includes('application/json') 
      ? response.json()
      : null
  }

  const responses = await Promise.allSettled(
    roleDefinitions.map(roleDef => 
      fetch(`${API_BASE}/api/exchange/role/${roleDef.key.toLowerCase()}`)
        .then(handleResponse)
        .catch(() => ({ data: [] }))
    )
  )

  const rolesMap = responses.reduce((acc, response, index) => ({
    ...acc,
    [roleDefinitions[index].key]: response.status === 'fulfilled' 
      ? response.value.data?.addresses || []
      : []
  }), {})

  const auditLogs = await fetch(`${API_BASE}/api/roles/audit-logs`)
    .then(res => res.ok ? res.json() : { data: [] })
    .then(data => data.data || [])

  return { roles: rolesMap, auditLogs }
}

export default function RolesPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchAddress, setSearchAddress] = useState('')
  const [searchResults, setSearchResults] = useState<Record<string, boolean>>({})
  const [selectedRole, setSelectedRole] = useState('')
  const [addressToModify, setAddressToModify] = useState('')
  const [isAddressValid, setIsAddressValid] = useState(false)
  const [usesDecayingRewards, setUsesDecayingRewards] = useState(false)

  const { data, isLoading } = useQuery<RoleResponse>({
    queryKey: ['roleData'],
    queryFn: fetchRoleData,
    initialData: { roles: {}, auditLogs: [] }
  })

  useEffect(() => setIsAddressValid(/^0x[a-fA-F0-9]{40}$/.test(addressToModify.trim())), [addressToModify])

  useEffect(() => {
    const fetchDecayState = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/exchange/uses-decay`)
        if (!response.ok) throw new Error('Failed to fetch decay state')
        const data = await response.json()
        setUsesDecayingRewards(data.usesDecayingRewards)
      } catch (error) {
        console.error('Error fetching decay state:', error)
        toast.error('Failed to load decay state')
      }
    }
    fetchDecayState()
  }, [])

  const checkRoles = async (address: string) => {
    if (!address) return
    setSearchResults({})
    
    const results = await Promise.all(
      roleDefinitions.map(async ({ key }) => {
        const hasRole = data.roles[key]?.includes(address.toLowerCase()) || false
        return { [key]: hasRole }
      })
    )

    setSearchResults(Object.assign({}, ...results))
  }

  const mutationHandler = (action: 'grant' | 'revoke' | 'renounce') => 
    async ({ role, address }: { role: string; address: string }) => {
      const endpoint = {
        grant: '/api/sphr/admin/grant-role',
        revoke: '/api/sphr/admin/revoke-role',
        renounce: '/api/sphr/roles/renounce'
      }[action]

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, address })
      })

      if (!response.ok) throw new Error(await response.text())
      return response.json()
    }

  const grant = useMutation({
    mutationFn: mutationHandler('grant'),
    onSuccess: () => updateUI('Role granted')
  })

  const revoke = useMutation({
    mutationFn: mutationHandler('revoke'),
    onSuccess: () => updateUI('Role revoked')
  })

  const renounce = useMutation({
    mutationFn: mutationHandler('renounce'),
    onSuccess: () => updateUI('Role renounced')
  })

  const toggleDecay = useMutation({
    mutationFn: async (enable: boolean) => {
      const response = await fetch(`${API_BASE}/api/exchange/admin/toggle-decay`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ enable }),
      })
      
      const contentType = response.headers.get('content-type')
      if (!response.ok) {
        const error = contentType?.includes('application/json')
          ? await response.json()
          : await response.text()
        throw new Error(error.message || error)
      }
  
      return contentType?.includes('application/json') 
        ? response.json()
        : null
    },
    onMutate: async (enable) => {
      setUsesDecayingRewards(enable)
      return { previousState: !enable }
    },
    onError: (error, variables, context) => {
      setUsesDecayingRewards(context?.previousState ?? false)
      toast.error(error.message)
    },
    onSuccess: (data, variables) => {
      toast.success(`Decaying rewards ${variables ? 'enabled' : 'disabled'}`)
    },
  })

  const DecayToggle = () => (
    <div className="flex items-center gap-3">
      <button
        onClick={() => toggleDecay.mutate(!usesDecayingRewards)}
        disabled={toggleDecay.isPending}
        className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-200 
          ${usesDecayingRewards ? 'bg-violet-600' : 'bg-gray-700'}
          hover:opacity-90`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-lg transition
            ${usesDecayingRewards ? 'translate-x-7' : 'translate-x-1'}
            ${toggleDecay.isPending ? 'opacity-50' : ''}`}
        >
          {toggleDecay.isPending && (
            <ArrowPathIcon className="w-full h-full animate-spin text-gray-400" />
          )}
        </span>
      </button>
      {toggleDecay.isError && (
        <span className="text-xs text-red-400">{toggleDecay.error.message}</span>
      )}
    </div>
  )

  const updateUI = (message: string) => {
    toast.success(message)
    queryClient.invalidateQueries({ queryKey: ['roleData'] })
    setAddressToModify('')
    setSelectedRole('')
  }

  const formatAddress = (addr: string) => 
    `${addr.slice(0, 6)}...${addr.slice(-4)}`

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <motion.div 
          className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border border-gray-700/30 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        >
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-white">Rewards Mechanism</h3>
              <p className="text-sm text-gray-300">
                {usesDecayingRewards ? (
                  <span className="text-violet-400">Dynamic Decaying APR Active</span>
                ) : (
                  <span className="text-gray-400">Fixed Static APR Active</span>
                )}
              </p>
              <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                <ShieldCheckIcon className="w-4 h-4 text-violet-400" />
                Automatically adjusts based on pool utilization
              </p>
            </div>
            <DecayToggle />
          </div>
        </motion.div>

        {/* Existing Role Management Cards */}
        <motion.div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
          <div className="flex items-center gap-4 mb-6">
            <input
              type="text"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="Enter Ethereum address"
              className="flex-1 bg-gray-800/50 border border-gray-700/30 rounded-lg px-4 py-2 text-white"
            />
            <button
              onClick={() => checkRoles(searchAddress.toLowerCase())}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg disabled:opacity-50"
            >
              Check Roles
            </button>
          </div>

          {Object.keys(searchResults).length > 0 && (
            <div className="space-y-4">
              {roleDefinitions.map(({ key, name }) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                  <span className="text-gray-300">{name}</span>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      searchResults[key] 
                        ? 'bg-green-900/50 text-green-300'
                        : 'bg-red-900/50 text-red-300'
                    }`}>
                      {searchResults[key] ? 'Assigned' : 'Not Assigned'}
                    </span>
                    {searchResults[key] ? (
                      <>
                        <button
                          onClick={() => revoke.mutate({ role: key, address: searchAddress })}
                          className="text-red-400 hover:text-red-300"
                        >
                          <MinusCircleIcon className="w-5 h-5" />
                        </button>
                        {user?.address?.toLowerCase() === searchAddress.toLowerCase() && (
                          <button
                            onClick={() => renounce.mutate({ role: key, address: searchAddress })}
                            className="text-yellow-400 hover:text-yellow-300"
                          >
                            <NoSymbolIcon className="w-5 h-5" />
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedRole(key)
                          setAddressToModify(searchAddress)
                        }}
                        className="text-green-400 hover:text-green-300"
                      >
                        <PlusCircleIcon className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
          <h3 className="text-lg font-medium text-white mb-4">Manage Roles</h3>
          <div className="space-y-4">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700/30 rounded-lg p-2 text-white"
            >
              <option value="">Select Role</option>
              {roleDefinitions.map(({ key, name }) => (
                <option key={key} value={key}>{name}</option>
              ))}
            </select>
            
            <input
              type="text"
              value={addressToModify}
              onChange={(e) => setAddressToModify(e.target.value)}
              placeholder="Enter address to modify"
              className="w-full bg-gray-800/50 border border-gray-700/30 rounded-lg p-2 text-white"
            />
            
            <div className="flex gap-2">
              <button
                onClick={() => grant.mutate({ role: selectedRole, address: addressToModify })}
                disabled={!selectedRole || !isAddressValid}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Grant Role
              </button>
              <button
                onClick={() => revoke.mutate({ role: selectedRole, address: addressToModify })}
                disabled={!selectedRole || !isAddressValid}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg disabled:opacity-50"
              >
                Revoke Role
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800/30">
          <h3 className="text-lg font-medium text-white mb-4">Audit Logs</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data.auditLogs.map(log => (
              <div key={log.id} className="p-3 bg-gray-800/30 rounded-lg">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-400">{log.action}</span>
                  <span className="text-gray-400">{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div className="text-sm text-gray-300 mt-1">
                  {roleDefinitions.find(r => r.key === log.role)?.name} - {formatAddress(log.address)}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}