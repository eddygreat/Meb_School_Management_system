import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Login() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
    } catch (e) {
      setError('Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center h-[80vh]">
      <form onSubmit={onSubmit} className="bg-white p-6 rounded shadow w-96 space-y-3">
        <h1 className="text-xl font-semibold">Login</h1>
        {error && <div className="text-red-600 text-sm">{error}</div>}
        <input className="w-full border p-2 rounded" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border p-2 rounded" placeholder="Password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} />
        <button className="w-full bg-blue-600 text-white py-2 rounded" disabled={loading}>{loading? 'Signing in...' : 'Sign In'}</button>
        <div className="text-sm text-blue-700">
          <Link to="/face/login">Sign in with Face</Link>
        </div>
        <div className="text-xs text-gray-500">Need to enroll your face? After login, go to your role dashboard and open Face Enroll from the menu.</div>
      </form>
    </div>
  )
}
