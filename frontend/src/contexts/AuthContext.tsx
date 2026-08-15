import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext } from './auth-context'

const TOKEN_KEY = 'token'
const USER_KEY = 'userId'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  )
  const [userId, setUserId] = useState<number | null>(() => {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? Number(raw) : null
  })

  const login = (newToken: string, newUserId: number) => {
    localStorage.setItem(TOKEN_KEY, newToken)
    localStorage.setItem(USER_KEY, String(newUserId))
    setToken(newToken)
    setUserId(newUserId)
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUserId(null)
  }

  return (
    <AuthContext.Provider
      value={{ token, userId, isAuthenticated: Boolean(token), login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}
