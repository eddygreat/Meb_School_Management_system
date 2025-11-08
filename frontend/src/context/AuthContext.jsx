import { createContext, useContext, useState } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  const decodeJwt = (token) => {
    try {
      const [, payload] = token.split('.')
      const json = JSON.parse(atob(payload))
      return json
    } catch {
      return null
    }
  }

  const loginWithToken = (token) => {
    localStorage.setItem('token', token)
    const payload = decodeJwt(token)
    const role = payload?.role || 'student'
    setUser({ email: payload?.email || 'face@login', role })
    navigate(`/${role}`)
  }

  const login = async (email, password) => {
    const { data } = await client.post('/api/auth/login', { email, password })
    loginWithToken(data.access_token);
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loginWithToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
