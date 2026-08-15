import { createContext } from 'react'

export interface AuthState {
  token: string | null
  userId: number | null
  role: string | null
  isAuthenticated: boolean
  login: (token: string, userId: number) => void
  logout: () => void
}

export const AuthContext = createContext<AuthState | undefined>(undefined)
