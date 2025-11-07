import { useEffect, useState } from 'react'
import client from '../api/client'

export default function AdminDiscipline(){
  const [studentId, setStudentId] = useState('')
  const [items, setItems] = useState([])
  const [form, setForm] = useState({ student_id:'', category:'', description:'' })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    setError(''); setStatus('')
    try {
      const { data } = await client.get('/api/discipline/incidents', { params: { student_id: studentId || undefined } })
      setItems(data)
    } catch {
      setError('Failed to load incidents')
    }
  }

  const create = async () => {
    setError(''); setStatus('')
    if (!form.student_id || !form.category || !form.description) { setError('All fields required'); return }
    try {
      await client.post('/api/discipline/incidents', { student_id: Number(form.student_id), category: form.category, description: form.description })
      setForm({ student_id:'', category:'', description:'' })
      setStatus('Created')
      await load()
    } catch {
      setError('Failed to create')
    }
  }

  const resolve = async (id) => {
    try { await client.post(`/api/discipline/incidents/${id}/status`, { status: 'resolved' }); await load() } catch {}
  }

  useEffect(() => { load() }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Discipline Incidents</h1>
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-5 gap-2 items-end">
        <input className="border p-2 rounded" placeholder="Filter by Student ID" value={studentId} onChange={e=>setStudentId(e.target.value)} />
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
        {status && <div className="text-green-700 text-sm">{status}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>

      <div className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-2 items-end">
        <input className="border p-2 rounded" placeholder="Student ID" value={form.student_id} onChange={e=>setForm(s=>({...s, student_id:e.target.value}))} />
        <input className="border p-2 rounded" placeholder="Category" value={form.category} onChange={e=>setForm(s=>({...s, category:e.target.value}))} />
        <input className="border p-2 rounded" placeholder="Description" value={form.description} onChange={e=>setForm(s=>({...s, description:e.target.value}))} />
        <button onClick={create} className="bg-emerald-600 text-white px-4 py-2 rounded">Create</button>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b">
              <th className="p-2">ID</th>
              <th className="p-2">Student</th>
              <th className="p-2">Category</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(i => (
              <tr key={i.id} className="border-b">
                <td className="p-2">{i.id}</td>
                <td className="p-2">{i.student_id}</td>
                <td className="p-2">{i.category}</td>
                <td className="p-2">{i.status}</td>
                <td className="p-2">
                  {i.status !== 'resolved' && (
                    <button className="text-blue-700" onClick={()=>resolve(i.id)}>Resolve</button>
                  )}
                </td>
              </tr>
            ))}
            {!items.length && <tr><td className="p-2 text-gray-500">No incidents</td><td></td><td></td><td></td><td></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
