import { createContext, useContext, useState, useEffect } from 'react'
import client from '../api/client'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const decodeJwt = (token) => {
    try {
      const [, payload] = token.split('.')
      const json = JSON.parse(atob(payload))
      return json
    } catch (e) {
      console.error('Error decoding token:', e)
      return null
    }
  }

  const loginWithToken = (token) => {
    try {
      if (!token) return false
      
      localStorage.setItem('token', token)
      const payload = decodeJwt(token)
      
      if (!payload) {
        localStorage.removeItem('token')
        return false
      }
      
      const userData = { 
        email: payload?.email || 'user@example.com', 
        role: payload?.role || 'student',
        name: payload?.name || 'User',
        id: payload?.sub || ''
      }
      
      // Store user data in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(userData))
      setUser(userData)
      
      // Set default token for all requests
      client.defaults.headers.common['Authorization'] = `Bearer ${token}`
      
      return true
    } catch (e) {
      console.error('Login error:', e)
      setError('Failed to process login. Please try again.')
      return false
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)
      setError(null)
      
      const { data } = await client.post('/api/auth/login', { email, password })
      
      if (data?.access_token) {
        const success = loginWithToken(data.access_token)
        if (success) {
          // Get the updated user state after loginWithToken updates it
          const currentUser = JSON.parse(localStorage.getItem('user'))
          const role = currentUser?.role || 'student'
          navigate(`/${role}/dashboard`)
          return { success: true }
        }
      }
      
      const errorMessage = data?.detail || 'Invalid email or password'
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } catch (error) {
      const message = error.response?.data?.detail || 'Login failed. Please try again.'
      setError(message)
      return { success: false, error: message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    try {
      localStorage.removeItem('token')
      delete client.defaults.headers.common['Authorization']
      setUser(null)
      navigate('/login')
    } catch (e) {
      console.error('Logout error:', e)
    }
  }

  // Initialize auth state on app load
  useEffect(() => {
    const token = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    
    if (token && savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`
      } catch (e) {
        console.error('Failed to parse user data:', e)
        logout()
      }
    }
  }, [])

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        error,
        loading,
        login, 
        logout, 
        loginWithToken 
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
