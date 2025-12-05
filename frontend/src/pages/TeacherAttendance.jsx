import { useEffect, useState } from 'react'
import client from '../api/client'
import QRCode from 'react-qr-code'

export default function TeacherAttendance() {
  const [className, setClassName] = useState('Grade 10A')
  const [duration, setDuration] = useState(15)
  const [session, setSession] = useState(null)
  const [records, setRecords] = useState([])
  const [error, setError] = useState('')

  const createSession = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await client.post('/attendance/session', { class_name: className, duration_minutes: Number(duration) })
      setSession(data)
      setRecords([])
    } catch (e) {
      setError('Failed to create session')
    }
  }

  useEffect(() => {
    if (!session) return
    const id = setInterval(async () => {
      try {
        const { data } = await client.get(`/attendance/session/${session.id}/records`)
        setRecords(data)
      } catch { }
    }, 3000)
    return () => clearInterval(id)
  }, [session])

  const closeSession = async () => {
    if (!session) return
    try { await client.post(`/attendance/session/${session.id}/close`); setSession({ ...session, is_active: false }) } catch { }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">QR Attendance</h1>
      <form onSubmit={createSession} className="bg-white p-4 rounded shadow flex gap-2 items-end">
        <div>
          <label className="block text-sm">Class</label>
          <input className="border p-2 rounded" value={className} onChange={e => setClassName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Duration (mins)</label>
          <input type="number" className="border p-2 rounded w-28" value={duration} onChange={e => setDuration(e.target.value)} />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Start Session</button>
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </form>

      {session && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Scan to Check-in</h2>
            <p className="text-sm text-gray-500 mb-2">Class: {session.class_name} • Ends: {new Date(session.ends_at).toLocaleTimeString()}</p>
            <div className="bg-white p-4 inline-block">
              <QRCode value={session.token} size={180} />
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={closeSession} className="bg-gray-800 text-white px-3 py-1 rounded" disabled={!session.is_active}>Close Session</button>
              <span className={`text-sm ${session.is_active ? 'text-green-700' : 'text-gray-500'}`}>{session.is_active ? 'Active' : 'Closed'}</span>
            </div>
            <div className="mt-2 text-xs text-gray-500">Token: {session.token}</div>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-semibold mb-2">Check-ins ({records.length})</h2>
            <ul className="space-y-2 max-h-80 overflow-auto">
              {records.map(r => (
                <li key={r.id} className="border p-2 rounded flex justify-between text-sm">
                  <span>Student ID: {r.student_id}</span>
                  <span className="text-gray-500">{new Date(r.timestamp).toLocaleTimeString()} • {r.method}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
