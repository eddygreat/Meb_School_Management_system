import { useState } from 'react'
import client from '../api/client'

export default function PasswordResetConfirm(){
  const [token, setToken] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus(''); setError('')
    try {
      await client.post('/api/security/password-reset/confirm', null, { params: { token, new_password: password } })
      setStatus('Password updated. You may now log in.')
    } catch {
      setError('Failed to reset password')
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3 w-full max-w-lg">
        <h1 className="text-xl font-semibold">Reset Password</h1>
        <input className="border p-2 rounded w-full" placeholder="Reset token" value={token} onChange={e=>setToken(e.target.value)} />
        <input type="password" className="border p-2 rounded w-full" placeholder="New password" value={password} onChange={e=>setPassword(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Reset Password</button>
        {status && <div className="text-green-700 text-sm">{status}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  )
}
