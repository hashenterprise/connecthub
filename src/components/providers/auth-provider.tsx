'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { Session } from 'next-auth'
import { signIn, signOut } from 'next-auth/react'

interface AuthContextType {
  session: Session | null
  loading: boolean
  signIn: (provider?: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {}
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize session
    fetch('/api/auth/session')
      .then(res => res.json())
      .then(data => {
        setSession(data)
        setLoading(false)
      })
  }, [])

  const value = {
    session,
    loading,
    signIn: async (provider?: string) => {
      await signIn(provider)
    },
    signOut: async () => {
      await signOut()
    }
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)