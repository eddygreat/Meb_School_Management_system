import { useState } from 'react'
import client from '../api/client'
import { Scanner as QrScanner } from '@yudiel/react-qr-scanner'
import { useAuth } from '../context/AuthContext'

export default function StudentCheckin() {
  const [token, setToken] = useState('')
  const { user } = useAuth()
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [scanning, setScanning] = useState(true)

  const submit = async (e) => {
    e?.preventDefault?.()
    setStatus('')
    setError('')
    try {
      const { data } = await client.post('/attendance/checkin/qr', { token, student_id: Number(user.student_id) })
      setStatus(`Checked in: record #${data.id}`)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Check-in failed')
    }
  }

  const onDecode = (result) => {
    if (!result) return
    setToken(result)
    setScanning(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student QR Check-in</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Scan QR</h2>
          {scanning ? (
            <QrScanner
              onDecode={onDecode}
              onError={() => { }}
              constraints={{ facingMode: 'environment' }}
              containerStyle={{ width: '100%' }}
            />
          ) : (
            <div className="text-sm text-gray-600">QR captured. Token filled below.</div>
          )}
          <button className="mt-2 text-blue-600 text-sm" onClick={() => setScanning(true)}>Rescan</button>
        </div>
        <form onSubmit={submit} className="bg-white p-4 rounded shadow space-y-3 w-full">
          <div>
            <label className="block text-sm">Token</label>
            <input className="border p-2 rounded w-full" value={token} onChange={(e) => setToken(e.target.value)} placeholder="Token from QR" />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Check In</button>
          {status && <div className="text-green-700 text-sm">{status}</div>}
          {error && <div className="text-red-600 text-sm">{error}</div>}
        </form>
      </div>
    </div>
  )
}
