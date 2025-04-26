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
  roles: Record<string, string>
}

// Updated role definitions without hasRoleEndpoint
const roleDefinitions = [
  {
    key: 'DEFAULT_ADMIN',
    name: 'Default Admin',
    endpoint: `${API_BASE}/api/sphr/role/default-admin`,
    responseField: 'defaultAdminRole',
  },
  {
    key: 'OPERATOR',
    name: 'Operator',
    endpoint: `${API_BASE}/api/exchange/role/operator`,
    responseField: 'operatorRole',
  },
  {
    key: 'UPGRADER',
    name: 'Upgrader',
    endpoint: `${API_BASE}/api/exchange/role/upgrader`,
    responseField: 'upgraderRole',
  },
  {
    key: 'MINTER',
    name: 'Minter',
    endpoint: `${API_BASE}/api/sphr/role/minter`,
    responseField: 'minterRole',
  },
  {
    key: 'BURNER',
    name: 'Burner',
    endpoint: `${API_BASE}/api/sphr/role/burner`,
    responseField: 'burnerRole',
  },
  {
    key: 'PAUSER',
    name: 'Pauser',
    endpoint: `${API_BASE}/api/sphr/role/pauser`,
    responseField: 'pauserRole',
  }
]

const fetchRoleData = async (): Promise<RoleResponse> => {
  console.log('[Roles] Fetching all role data')
  try {
    const rolesResponses = await Promise.all(
      roleDefinitions.map(async (roleDef) => {
        try {
          console.log(`[Roles] Fetching ${roleDef.key} from ${roleDef.endpoint}`)
          const response = await fetch(roleDef.endpoint)
          
          if (!response.ok) {
            const errorText = await response.text()
            console.error(`[Roles] Error ${response.status} for ${roleDef.key}:`, errorText)
            return { key: roleDef.key, address: '' }
          }

          const contentType = response.headers.get('content-type')
          if (!contentType?.includes('application/json')) {
            const text = await response.text()
            console.error(`[Roles] Non-JSON response for ${roleDef.key}:`, text)
            return { key: roleDef.key, address: '' }
          }

          const data = await response.json()
          const address = data?.data?.[roleDef.responseField] || ''
          
          if (!address || typeof address !== 'string') {
            console.warn(`[Roles] Invalid address format for ${roleDef.key}:`, data)
            return { key: roleDef.key, address: '' }
          }

          return { key: roleDef.key, address }
        } catch (error) {
          console.error(`[Roles] Error fetching ${roleDef.key}:`, error)
          return { key: roleDef.key, address: '' }
        }
      })
    )

    const rolesMap = rolesResponses.reduce((acc, { key, address }) => {
      acc[key] = address
      return acc
    }, {} as Record<string, string>)

    console.log('[Roles] Fetched roles:', rolesMap)
    return { roles: rolesMap }
  } catch (error) {
    console.error('[Roles] Error fetching all roles:', error)
    throw new Error('Failed to fetch role data')
  }
}

const checkRole = async (role: string, address: string, currentRoles: Record<string, string>): Promise<boolean> => {
  if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
    console.error('[RoleCheck] Invalid address format')
    return false
  }

  try {
    const roleDef = roleDefinitions.find(r => r.key === role)
    if (!roleDef) {
      console.error('[RoleCheck] Role definition not found')
      return false
    }

    // Get role address from fetched data
    const roleAddress = currentRoles[role]
    if (!roleAddress) {
      console.error('[RoleCheck] Role address not available')
      return false
    }

    // Construct endpoint using role address
    const endpoint = `${API_BASE}/api/exchange/has-role/${roleAddress}/${address}`
    console.log(`[RoleCheck] Checking ${role} for ${address} via API: ${endpoint}`)
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[RoleCheck] Error ${response.status}:`, errorText)
      return false
    }

    const responseData = await response.json()
    // Properly access the nested data structure
    return responseData?.data?.hasRole || false


    const data = await response.json()
    return data?.hasRole || false
  } catch (error) {
    console.error(`[RoleCheck] Error checking ${role}:`, error)
    return false
  }
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

  const { data, isLoading, isError, refetch } = useQuery<RoleResponse>({
    queryKey: ['roleData'],
    queryFn: fetchRoleData,
    initialData: { roles: {} },
   
  })

  useEffect(() => {
    setIsAddressValid(/^0x[a-fA-F0-9]{40}$/.test(addressToModify.trim()))
  }, [addressToModify])

 // In the useEffect for fetching decay state
useEffect(() => {
  const fetchDecayState = async () => {
    try {
      const response = await fetch(`${API_BASE}/api/exchange/uses-decay`)
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`API Error: ${errorText}`)
      }
      
      const contentType = response.headers.get('content-type')
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format from server')
      }

      const data = await response.json()
      // Ensure boolean value
      const decayState = Boolean(data?.usesDecayingRewards)
      console.log('Fetched decay state:', decayState)
      setUsesDecayingRewards(decayState)
      
    } catch (error) {
      console.error('Error fetching decay state:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to load decay state')
      // Fallback to default state
      setUsesDecayingRewards(false)
    }
  }
  fetchDecayState()
}, [])

  const handleRefresh = async () => {
    try {
      await refetch()
      toast.success('Role data refreshed')
    } catch (error) {
      console.error('[Roles] Refresh failed:', error)
      toast.error('Failed to refresh data')
    }
  }

  const checkRoles = async (address: string) => {
    if (!address) return
    setSearchResults({})
  
    try {
      const currentRoles = data.roles || {}
      const results = await Promise.all(
        roleDefinitions.map(async ({ key }) => {
          const hasRole = await checkRole(key, address, currentRoles)
          return { [key]: hasRole }
        })
      )
  
      setSearchResults(Object.assign({}, ...results))
    } catch (error) {
      console.error('Failed to check roles:', error)
      toast.error('Error checking role access')
    }
  }
  const modifyRole = async (action: 'grant' | 'revoke' | 'renounce', role: string, address: string) => {
    if (!user?.address && action !== 'renounce') {
      throw new Error('Authentication required')
    }
  
    const roleDef = roleDefinitions.find(r => r.key === role)
    if (!roleDef) {
      throw new Error('Invalid role specified')
    }
  
    try {
      // Get the actual role contract address from fetched data
      const roleAddress = data.roles[role]
      if (!roleAddress) {
        throw new Error('Role address not available')
      }
  
      // Determine the correct endpoint based on action
      let endpoint = '';
      switch(action) {
        case 'grant':
          endpoint = `${API_BASE}/api/exchange/admin/grant-role`;
          break;
        case 'revoke':
          endpoint = `${API_BASE}/api/exchange/admin/revoke-role`;
          break;
        case 'renounce':
          endpoint = `${API_BASE}/api/exchange/roles/renounce`;
          break;
        default:
          throw new Error('Invalid action');
      }
  
      console.log('[API] Modifying role endpoint:', endpoint)
      
      const payload = {
        role: roleAddress,
        account: address,
        ...(action !== 'renounce' && { adminPrivateKey: user?.address })
      }
  
      console.log('[API] Request payload:', payload)
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(payload)
      })
  
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText)
      }
  
      return await response.json()
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : 'Request failed')
    }
  }

  const grant = useMutation({
    mutationFn: ({ role, address }: { role: string; address: string }) => 
      modifyRole('grant', role, address),
    onSuccess: () => updateUI('Role granted successfully')
  })

  const revoke = useMutation({
    mutationFn: ({ role, address }: { role: string; address: string }) => 
      modifyRole('revoke', role, address),
    onSuccess: () => updateUI('Role revoked successfully')
  })

  const renounce = useMutation({
    mutationFn: ({ role, address }: { role: string; address: string }) => 
      modifyRole('renounce', role, address),
    onSuccess: () => updateUI('Role renounced successfully')
  })
  useEffect(() => {
    const fetchDecayState = async () => {
      try {
        const response = await fetch(`${API_BASE}/api/exchange/uses-decay`)
        if (!response.ok) throw new Error(await response.text())
        const data = await response.json()
        // Use nullish coalescing with true as default
        setUsesDecayingRewards(data?.usesDecayingRewards ?? true)
      } catch (error) {
        console.error('Error fetching decay state:', error)
        setUsesDecayingRewards(true) // Fallback to true
        toast.error('Failed to load decay state')
      }
    }
    fetchDecayState()
  }, [])
  const toggleDecay = useMutation({
    mutationFn: async (enabled: boolean) => {
      if (!user?.address) {
        throw new Error('Authentication required');
      }
  
      try {
        const securePayload = {
          enabled,
          adminPrivateKey: user.address
        };
  
        console.log('[Toggle] Sending state:', securePayload);
  
        const response = await fetch(`${API_BASE}/api/exchange/admin/toggle-decay`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          },
          body: JSON.stringify(securePayload),
        });
  
        // Handle HTML error responses
        const text = await response.text();
        let responseData;
        
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          console.error('[Toggle] Non-JSON response:', text);
          throw new Error(`Server error: ${response.statusText}`);
        }
  
        console.log('[Toggle] Received response:', responseData);
  
        if (!response.ok) {
          throw new Error(responseData.message || `HTTP ${response.status} Error`);
        }
  
        return responseData.enabled;
      } catch (error) {
        console.error('[Toggle] Error:', error);
        throw new Error(
          error instanceof Error 
            ? error.message 
            : 'Failed to process server response'
        );
      }
    },
    onMutate: (enabled) => {
      console.log('[Toggle] Optimistic update to:', enabled);
      setUsesDecayingRewards(enabled);
      return { previousState: usesDecayingRewards };
    },
    onError: (error, _, context) => {
      console.error('[Toggle] Rollback to:', context?.previousState);
      setUsesDecayingRewards(context?.previousState ?? true);
      toast.error(`Operation failed: ${error.message}`);
    },
    onSuccess: (confirmedEnabled) => {
      console.log('[Toggle] Confirmed state:', confirmedEnabled);
      setUsesDecayingRewards(confirmedEnabled);
      toast.success(`Decaying rewards ${confirmedEnabled ? 'enabled' : 'disabled'}`);
    }
  });
  // Toggle component
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
      <span className="text-sm text-gray-400">
        {usesDecayingRewards ? 'Active' : 'Inactive'}
      </span>
    </div>
  )
  const updateUI = (message: string) => {
    console.log('[UI] Updating after mutation:', message)
    toast.success(message)
    queryClient.invalidateQueries({ queryKey: ['roleData'] })
    setAddressToModify('')
    setSelectedRole('')
    setSearchResults({})
  }

  const formatAddress = (addr: string) => {
    if (!addr || addr.length < 10) return 'Invalid Address'
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`
  }

  const renderRoleStatus = (roleKey: string) => {
    const address = data.roles[roleKey]
    const roleDef = roleDefinitions.find(r => r.key === roleKey)
    
    return (
      <div className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
        <span className="text-gray-300">{roleDef?.name || roleKey}</span>
        <div className="flex items-center gap-2">
          {address ? (
            <>
              <span className="text-xs font-mono text-green-400">
                {formatAddress(address)}
              </span>
              <button 
                onClick={() => {
                  setSelectedRole(roleKey)
                  setAddressToModify(address)
                }}
                className="text-yellow-400 hover:text-yellow-300"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
            </>
          ) : (
            <span className="text-xs text-red-400">Not assigned</span>
          )}
        </div>
      </div>
    )
  }

 

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

        <div className="flex justify-end">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg disabled:opacity-50"
          >
            <ArrowPathIcon className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Roles
          </button>
        </div>

        <div className="space-y-4">
          {roleDefinitions.map(({ key }) => renderRoleStatus(key))}
        </div>

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
              onClick={() => checkRoles(searchAddress.trim().toLowerCase())}
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
                     {searchResults[key] ? 'true' : 'false'}
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
      </div>
    </DashboardLayout>
  )
}