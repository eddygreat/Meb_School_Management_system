import { useState } from 'react'
import apiClient from '../services/api';

export default function FaceEnroll(){
  const [file, setFile] = useState(null)
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setStatus('')
    setError('')
    try {
      const form = new FormData()
      form.append('image', file)
      const { data } = await apiClient.post('/api/biometric/enroll', form, { headers: { 'Content-Type': 'multipart/form-data' } })
      setStatus(`Enrolled for user #${data.user_id}`)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Enroll failed')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enroll Face</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3 w-full max-w-lg">
        <input type="file" accept="image/*" capture="user" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" disabled={!file}>Upload</button>
        {status && <div className="text-green-700 text-sm">{status}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </form>
      <p className="text-xs text-gray-500 mt-2">Tip: Use the front camera on mobile to capture your face.</p>
    </div>
  )
}
