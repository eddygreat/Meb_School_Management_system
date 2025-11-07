import { useState } from 'react'
import client from '../api/client'

export default function PasswordResetRequest(){
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus(''); setError('')
    try {
      await client.post('/api/security/password-reset/request', null, { params: { email } })
      setStatus('If the email exists, a reset link has been sent.')
    } catch {
      setError('Failed to request reset')
    }
  }

  return (
    <div className="p-6 flex justify-center">
      <form onSubmit={submit} className="bg-white p-6 rounded shadow space-y-3 w-full max-w-lg">
        <h1 className="text-xl font-semibold">Password Reset</h1>
        <input className="border p-2 rounded w-full" placeholder="Your email" value={email} onChange={e=>setEmail(e.target.value)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Send Reset Link</button>
        {status && <div className="text-green-700 text-sm">{status}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
    </div>
  )
}
