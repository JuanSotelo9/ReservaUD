import { useContext } from 'react'
import { AuthContext } from '../contexts/auth-context'
import type { AuthState } from '../contexts/auth-context'

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
