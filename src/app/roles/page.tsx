'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  UserGroupIcon,
  ShieldCheckIcon,
  ClockIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline'
import DashboardLayout from '@/components/layout/DashboardLayout'
import { useAuth } from '@/contexts/AuthContext'
import { Tab } from '@headlessui/react'
import { toast } from 'react-hot-toast'

const SkeletonLoader = ({ className }: { className: string }) => (
  <div className={`animate-pulse bg-gray-700/30 rounded-md ${className}`} />
)

const API_BASE = 'https://rewardsvault-production.up.railway.app'

interface RoleData {
  role: string
  description: string
  addresses: string[]
  lastModified: string
}

interface AuditLog {
  id: string
  timestamp: string
  action: string
  role: string
  address: string
  by: string
}

interface RoleResponse {
  roles: Record<string, RoleData>
  auditLogs: AuditLog[]
}

const roleDefinitions = [
  {
    key: 'DEFAULT_ADMIN',
    name: 'Default Admin',
    path: '/api/exchange/role/default-admin',
    description: 'Default administrative role with full access to all contract functions and role management'
  },
  {
    key: 'OPERATOR',
    name: 'Operator',
    path: '/api/exchange/role/operator',
    description: 'Exchange operations role with ability to manage exchange rates and transaction parameters'
  },
  {
    key: 'UPGRADER',
    name: 'Upgrader',
    path: '/api/exchange/role/upgrader',
    description: 'Contract upgrade management role with authority to upgrade contract implementations'
  },
  {
    key: 'MINTER',
    name: 'Minter',
    path: '/api/sphr/role/minter',
    description: 'Token minting authority with permission to create new tokens'
  },
  {
    key: 'BURNER',
    name: 'Burner',
    path: '/api/sphr/role/burner',
    description: 'Token burning authority with permission to destroy tokens'
  },
  {
    key: 'PAUSER',
    name: 'Pauser',
    path: '/api/sphr/role/pauser',
    description: 'Contract pause/unpause authority to halt or resume contract operations in emergencies'
  }
]

const fetchRoleData = async (): Promise<RoleResponse> => {
  try {
    console.log('Starting to fetch role data...');
    
    const responses = await Promise.allSettled(
      roleDefinitions.map(roleDef => 
        fetch(`${API_BASE}${roleDef.path}`)
          .then(res => {
            console.log(`Response for ${roleDef.key}:`, res.status);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
            return res.json()
          })
          .then(data => {
            console.log(`Data for ${roleDef.key}:`, data);
            return { roleDef, data };
          })
      )
    )
    
    console.log('All role API responses:', responses);
    
    const rolesMap: Record<string, RoleData> = {};
    
    responses.forEach((response, index) => {
      const roleDef = roleDefinitions[index];
      
      if (response.status === 'fulfilled') {
        const { data } = response.value;
        
        // Extract addresses from the response
        let addresses: string[] = [];
        if (data && data.data) {
          addresses = Array.isArray(data.data) 
            ? data.data 
            : data.data.addresses || [];
          console.log(`Extracted addresses for ${roleDef.key}:`, addresses);
        }
        
        rolesMap[roleDef.key] = {
          role: roleDef.key,
          description: roleDef.description,
          addresses: addresses,
          lastModified: new Date().toISOString()
        };
      } else {
        console.error(`Failed to fetch ${roleDef.key}:`, response.reason);
        rolesMap[roleDef.key] = {
          role: roleDef.key,
          description: roleDef.description,
          addresses: [],
          lastModified: new Date().toISOString()
        };
      }
    });
    
    console.log('Processed roles data:', rolesMap);
    
    // Fetch audit logs
    console.log('Fetching audit logs...');
    const auditLogsResponse = await fetch(`${API_BASE}/api/roles/audit-logs`)
      .then(res => {
        console.log('Audit logs response status:', res.status);
        return res.ok ? res.json() : { data: [] }
      })
      .catch((error) => {
        console.error('Error fetching audit logs:', error);
        return { data: [] }
      })
    
    console.log('Audit logs response:', auditLogsResponse);
    
    const auditLogs: AuditLog[] = auditLogsResponse.data || []
    
    console.log('Final role data being returned:', { roles: rolesMap, auditLogs });
    return { roles: rolesMap, auditLogs }
  } catch (error) {
    console.error('Error in fetchRoleData:', error)
    return { roles: {}, auditLogs: [] }
  }
}

export default function RolesPage() {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [searchAddress, setSearchAddress] = useState('')
  const [searchResults, setSearchResults] = useState<{ role: string; name: string; hasRole: boolean }[]>([])
  const [searchError, setSearchError] = useState<string | null>(null)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedRole, setSelectedRole] = useState<string | null>(null)
  const [addressToModify, setAddressToModify] = useState('')
  const [isAddressValid, setIsAddressValid] = useState(false)
  
  // Validate Ethereum address
  useEffect(() => {
    const isValid = /^0x[a-fA-F0-9]{40}$/.test(addressToModify.trim())
    setIsAddressValid(isValid)
  }, [addressToModify])
  
  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchAddress.trim()), 500)
    return () => clearTimeout(handler)
  }, [searchAddress])
  
  const { data: roleData, isLoading, error } = useQuery<RoleResponse>({
    queryKey: ['roleData'],
    queryFn: fetchRoleData,
    refetchInterval: 30000,
    initialData: { roles: {}, auditLogs: [] }
  })
  
  // Grant role mutation
  const grantRoleMutation = useMutation({
    mutationFn: async ({ role, address }: { role: string, address: string }) => {
      console.log('Granting role:', { role, address });
      
      const response = await fetch(`${API_BASE}/staking/grant-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, address })
      })
      
      console.log('Grant role response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json()
        console.error('Grant role error:', error);
        throw new Error(error.message || 'Failed to grant role')
      }
      
      const result = await response.json()
      console.log('Grant role success:', result);
      return result
    },
    onSuccess: () => {
      toast.success('Role granted successfully')
      queryClient.invalidateQueries({ queryKey: ['roleData'] })
      setAddressToModify('')
    },
    onError: (error) => {
      toast.error(`Failed to grant role: ${error.message}`)
    }
  })
  
  // Revoke role mutation
  const revokeRoleMutation = useMutation({
    mutationFn: async ({ role, address }: { role: string, address: string }) => {
      console.log('Revoking role:', { role, address });
      
      const response = await fetch(`${API_BASE}/staking/revoke-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, address })
      })
      
      console.log('Revoke role response status:', response.status);
      
      if (!response.ok) {
        const error = await response.json()
        console.error('Revoke role error:', error);
        throw new Error(error.message || 'Failed to revoke role')
      }
      
      const result = await response.json()
      console.log('Revoke role success:', result);
      return result
    },
    onSuccess: () => {
      toast.success('Role revoked successfully')
      queryClient.invalidateQueries({ queryKey: ['roleData'] })
    },
    onError: (error) => {
      toast.error(`Failed to revoke role: ${error.message}`)
    }
  })
  
  const handleSearch = async (address: string) => {
    if (!address) return
    setSearchError(null)
    setSearchResults([])
    
    console.log('Searching for address:', address);
    
    try {
      const checks = await Promise.allSettled(
        roleDefinitions.map(async (roleDef) => {
          try {
            console.log(`Checking ${roleDef.key} for address ${address}...`);
            const res = await fetch(`${API_BASE}/api/roles/has-role`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ role: roleDef.key, address })
            })
            
            console.log(`${roleDef.key} check response status:`, res.status);
            
            if (!res.ok) throw new Error(`Role check failed: ${res.status}`)
            const data = await res.json()
            console.log(`${roleDef.key} check result:`, data);
            
            return { 
              role: roleDef.key, 
              name: roleDef.name,
              hasRole: data.hasRole 
            }
          } catch (error) {
            console.error(`Error checking ${roleDef.key}:`, error)
            return { 
              role: roleDef.key, 
              name: roleDef.name,
              hasRole: false 
            }
          }
        })
      )
      
      console.log('All role checks results:', checks);
      
      setSearchResults(checks.map(result => 
        result.status === 'fulfilled' ? result.value : { role: 'Error', name: 'Error', hasRole: false }
      ))
    } catch (error) {
      console.error('Search failed:', error)
      setSearchError('Failed to verify roles. Please check the address and try again.')
    }
  }
  
  const handleGrantRole = () => {
    if (selectedRole && isAddressValid) {
      grantRoleMutation.mutate({ 
        role: selectedRole, 
        address: addressToModify 
      })
    }
  }
  
  const handleRevokeRole = (role: string, address: string) => {
    revokeRoleMutation.mutate({ role, address })
  }
  
  const formatAddress = (addr: string) => {
    return addr ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : 'Invalid Address'
  }
  
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString()
    } catch (e) {
      return 'Invalid date'
    }
  }
  
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <motion.div 
          className="flex items-center justify-between"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-semibold text-white">Role Management</h1>
            <p className="mt-1 text-sm text-gray-400">
              Manage smart contract roles and permissions
            </p>
          </div>
        </motion.div>
        
        {/* Role Verification Card */}
        <motion.div
          className="bg-gray-900/50 rounded-xl shadow-sm border border-gray-800/30 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="px-6 py-4 border-b border-gray-800/30 flex items-center">
            <ShieldCheckIcon className="h-6 w-6 text-blue-400 mr-2" />
            <h3 className="text-lg font-medium text-white">Role Verification</h3>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Ethereum Address
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    value={searchAddress}
                    onChange={(e) => setSearchAddress(e.target.value)}
                    className="block w-full pr-10 sm:text-sm rounded-md bg-gray-800/50 border border-gray-700/30 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    placeholder="0x..."
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => handleSearch(debouncedSearch)}
                  disabled={isLoading || !debouncedSearch}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking...
                      </span>
                    ) : 'Verify Roles'}
                  </button>
                </div>
              </div>
              
              {searchError && (
                <div className="p-3 bg-red-900/30 border border-red-800/50 text-red-200 rounded-lg flex items-center gap-2">
                  <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                  <span>{searchError}</span>
                </div>
              )}
              
              {searchResults.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium text-gray-300">Role Assignments</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {searchResults.map(({ role, name, hasRole }) => (
                      <div 
                        key={role}
                        className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-700/30"
                      >
                        <span className="text-sm text-gray-300">{name}</span>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            hasRole 
                              ? 'bg-green-900/50 text-green-300 border border-green-700/50'
                              : 'bg-red-900/50 text-red-300 border border-red-700/50'
                          }`}>
                            {hasRole ? 'Authorized' : 'Unauthorized'}
                          </span>
                          
                          {hasRole && (
                            <button
                              onClick={() => handleRevokeRole(role, debouncedSearch)}
                              className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                              title="Revoke role"
                            >
                              <MinusCircleIcon className="h-5 w-5" />
                            </button>
                          )}
                          
                          {!hasRole && (
                            <button
                              onClick={() => {
                                setSelectedRole(role)
                                setAddressToModify(debouncedSearch)
                              }}
                              className="ml-2 text-green-400 hover:text-green-300 transition-colors"
                              title="Grant role"
                            >
                              <PlusCircleIcon className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Role Management Tabs */}
          <motion.div
            className="bg-gray-900/50 rounded-xl shadow-sm border border-gray-800/30 backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Tab.Group>
              <div className="px-6 py-4 border-b border-gray-800/30 flex items-center justify-between">
                <div className="flex items-center">
                  <UserGroupIcon className="h-6 w-6 text-blue-400 mr-2" />
                  <h3 className="text-lg font-medium text-white">Role Management</h3>
                </div>
                
                <Tab.List className="flex space-x-1 rounded-xl bg-gray-800/50 p-1">
                  {['Role Definitions', 'Grant Role', 'Audit Logs'].map((category) => (
                    <Tab
                      key={category}
                      className={({ selected }) =>
                        `px-3 py-1.5 text-sm font-medium leading-5 rounded-lg transition-all duration-200 ${
                          selected
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                        }`
                      }
                    >
                      {category}
                    </Tab>
                  ))}
                </Tab.List>
              </div>
              
              <Tab.Panels className="p-6">
                {/* Role Definitions Panel */}
                <Tab.Panel className="space-y-6">
                  {isLoading ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="space-y-3">
                          <SkeletonLoader className="h-6 w-48" />
                          <SkeletonLoader className="h-4 w-64" />
                          <SkeletonLoader className="h-4 w-56" />
                          <div className="space-y-2">
                            <SkeletonLoader className="h-4 w-32" />
                            {Array.from({ length: 2 }).map((_, j) => (
                              <SkeletonLoader key={j} className="h-10 w-full" />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : error ? (
                    <div className="p-4 bg-red-900/30 border border-red-800/50 text-red-200 rounded-lg flex items-center gap-2">
                      <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
                      <span>Failed to load role definitions. Please try again later.</span>
                    </div>
                  ) : Object.values(roleData.roles).length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {roleDefinitions.map((roleDef) => {
                        const roleInfo = roleData.roles[roleDef.key];
                        return (
                          <div key={roleDef.key} className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                            <div className="flex items-center justify-between">
                              <h4 className="text-lg font-medium text-white">{roleDef.name}</h4>
                              <span className="px-2 py-1 bg-blue-900/30 text-blue-300 rounded-full text-xs">
                                {roleInfo?.addresses?.length || 0} addresses
                              </span>
                            </div>
                            
                            <p className="mt-2 text-sm text-gray-400">
                              {roleDef.description}
                            </p>
                            
                            <div className="mt-4 space-y-2">
                              <h5 className="text-sm font-medium text-gray-300">Authorized Addresses</h5>
                              {roleInfo?.addresses?.length > 0 ? (
                                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                  {roleInfo.addresses.map((address) => (
                                    <div 
                                      key={address}
                                      className="flex items-center justify-between p-2 bg-gray-700/30 rounded-lg"
                                    >
                                      <span className="text-sm text-gray-300 font-mono">
                                        {address}
                                      </span>
                                      <button
                                        onClick={() => handleRevokeRole(roleDef.key, address)}
                                        className="text-red-400 hover:text-red-300 transition-colors"
                                        title="Revoke role"
                                      >
                                        <MinusCircleIcon className="h-5 w-5" />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <div className="p-3 text-center text-gray-500 bg-gray-800/30 rounded-lg">
                                  No addresses assigned
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500">
                      No role definitions available
                    </div>
                  )}
                </Tab.Panel>
                
                {/* Grant Role Panel */}
                <Tab.Panel className="space-y-6">
                  <div className="max-w-2xl mx-auto bg-gray-800/50 rounded-lg p-6 border border-gray-700/30">
                    <h4 className="text-lg font-medium text-white mb-4">Grant New Role</h4>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Select Role
                        </label>
                        <select
                          value={selectedRole || ''}
                          onChange={(e) => setSelectedRole(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select a role...</option>
                          {roleDefinitions.map((role) => (
                            <option key={role.key} value={role.key}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">
                          Ethereum Address
                        </label>
                        <input
                          type="text"
                          value={addressToModify}
                          onChange={(e) => setAddressToModify(e.target.value)}
                          placeholder="0x..."
                          className="w-full px-3 py-2 bg-gray-700/50 border border-gray-600/30 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {addressToModify && !isAddressValid && (
                          <p className="mt-1 text-sm text-red-400">
                            Please enter a valid Ethereum address (0x followed by 40 hex characters)
                          </p>
                        )}
                      </div>
                      
                      <button
                        onClick={handleGrantRole}
                        disabled={!selectedRole || !isAddressValid || grantRoleMutation.isPending}
                        className="w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {grantRoleMutation.isPending ? (
                          <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                          </span>
                        ) : 'Grant Role'}
                      </button>
                    </div>
                  </div>
                </Tab.Panel>
                
                {/* Audit Logs Panel */}
                <Tab.Panel className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-white">Recent Role Changes</h4>
                    <button 
                      onClick={() => queryClient.invalidateQueries({ queryKey: ['roleData'] })}
                      className="text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ArrowPathIcon className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {roleData.auditLogs.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                      {roleData.auditLogs.map((log) => (
                        <div 
                          key={log.id}
                          className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700/30"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center">
                              {log.action === 'GRANT' ? (
                                <CheckCircleIcon className="h-5 w-5 text-green-400 mr-2" />
                              ) : (
                                <XCircleIcon className="h-5 w-5 text-red-400 mr-2" />
                              )}
                              <p className="text-sm font-medium text-white">
                                {log.action === 'GRANT' ? 'Granted' : 'Revoked'} - {log.role}
                              </p>
                            </div>
                            <p className="text-sm text-gray-400 font-mono pl-7">
                              {log.address}
                            </p>
                          </div>
                          <div className="text-right">
                          <p className="text-sm text-gray-400">
                            {formatTimestamp(log.timestamp)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            By {formatAddress(log.by)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 bg-gray-800/30 rounded-lg border border-gray-700/30">
                    <ClockIcon className="h-12 w-12 mx-auto text-gray-600 mb-3" />
                    <p>No audit logs available</p>
                    <p className="text-sm mt-1">Role changes will appear here</p>
                  </div>
                )}
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </motion.div>
      </div>
    </DashboardLayout>
  )
}

  