'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'

type Role = 'DEFAULT_ADMIN' | 'PAUSER' | 'UPGRADER' | 'MINTER' | 'BURNER' | 'OPERATOR'

interface User {
  address: string
  roles: Role[]
  isAuthenticated: boolean
}

interface AuthContextType {
  user: User | null
  connectWallet: () => Promise<void>
  disconnect: () => void
  hasRole: (role: Role) => boolean
  isConnecting: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window.ethereum === 'undefined') {
        toast.error('Please install MetaMask to use this application')
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await provider.listAccounts()

      if (accounts.length > 0) {
        const address = accounts[0]
        // TODO: Fetch user roles from the smart contract
        const roles: Role[] = ['DEFAULT_ADMIN'] // This should be fetched from the contract

        setUser({
          address,
          roles,
          isAuthenticated: true,
        })
        toast.success('Wallet connected successfully')
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
      toast.error('Failed to check wallet connection')
    }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      if (typeof window.ethereum === 'undefined') {
        toast.error('Please install MetaMask to use this application')
        return
      }

      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      const address = accounts[0]

      // TODO: Fetch user roles from the smart contract
      const roles: Role[] = ['DEFAULT_ADMIN'] // This should be fetched from the contract

      setUser({
        address,
        roles,
        isAuthenticated: true,
      })
      toast.success('Wallet connected successfully')
    } catch (error) {
      console.error('Failed to connect wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setUser(null)
    toast.success('Wallet disconnected')
  }

  const hasRole = (role: Role) => {
    return user?.roles.includes(role) ?? false
  }

  // Auto-connect on page load
  useEffect(() => {
    checkIfWalletIsConnected()

    // Listen for account changes
    if (typeof window.ethereum !== 'undefined') {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          // User disconnected their wallet
          setUser(null)
          toast('Wallet disconnected')
        } else {
          // User switched accounts
          const address = accounts[0]
          setUser(prev => prev ? { ...prev, address } : null)
          toast('Account changed')
        }
      }

      const handleChainChanged = () => {
        window.location.reload()
      }

      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)

      return () => {
        if (typeof window.ethereum !== 'undefined') {
          window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
          window.ethereum.removeListener('chainChanged', handleChainChanged)
        }
      }
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, connectWallet, disconnect, hasRole, isConnecting }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 