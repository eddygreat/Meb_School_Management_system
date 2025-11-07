import { useState } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function FaceLogin(){
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { loginWithToken } = useAuth()

  const submit = async (e) => {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    try {
      const form = new FormData()
      form.append('image', file)
      const { data } = await client.post('/api/biometric/login', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      loginWithToken(data.access_token)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Face login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3 w-full max-w-lg">
        <h1 className="text-xl font-semibold">Face Login</h1>
        <input type="file" accept="image/*" capture="user" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!file || loading}>{loading? 'Signing in...' : 'Sign In with Face'}</button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  )
}
