'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { ethers } from 'ethers'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const checkIfWalletIsConnected = async () => {
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.listAccounts()
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setUser({
            address,
            roles: ['DEFAULT_ADMIN'],
            isAuthenticated: true,
          })
          setIsAuthenticated(true)
        }
      }
    } catch (error) {
      console.error('Error checking wallet connection:', error)
    }
  }

  const connectWallet = async () => {
    try {
      setIsConnecting(true)
      
      if (typeof window !== 'undefined' && window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const accounts = await provider.send('eth_requestAccounts', [])
        
        if (accounts.length > 0) {
          const signer = await provider.getSigner()
          const address = await signer.getAddress()
          setUser({
            address,
            roles: ['DEFAULT_ADMIN'],
            isAuthenticated: true,
          })
          setIsAuthenticated(true)
          toast.success('Wallet connected successfully')
        }
      } else {
        toast.error('Please install MetaMask!')
      }
    } catch (error) {
      console.error('Error connecting wallet:', error)
      toast.error('Failed to connect wallet')
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnect = () => {
    setUser(null)
    setIsAuthenticated(false)
    toast('Wallet disconnected')
  }

  const hasRole = (role: Role) => {
    return user?.roles.includes(role) ?? false
  }

  useEffect(() => {
    checkIfWalletIsConnected()

    // Listen for account changes
    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected their wallet
        setUser(null)
        setIsAuthenticated(false)
        toast('Wallet disconnected')
      } else if (accounts[0] !== user?.address) {
        // User switched accounts
        const newAddress = accounts[0]
        // TODO: Fetch new user roles from the smart contract
        const roles: Role[] = ['DEFAULT_ADMIN'] // This should be fetched from the contract
        setUser({
          address: newAddress,
          roles,
          isAuthenticated: true,
        })
        setIsAuthenticated(true)
        toast('Account changed')
      }
    }

    // Listen for chain changes
    const handleChainChanged = () => {
      window.location.reload()
    }

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged)
      window.ethereum.on('chainChanged', handleChainChanged)
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged)
        window.ethereum.removeListener('chainChanged', handleChainChanged)
      }
    }
  }, [user?.address])

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