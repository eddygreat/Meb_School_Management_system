import { useEffect, useState } from 'react'
import client from '../api/client'

export default function AdminInvoices() {
  const [studentId, setStudentId] = useState('')
  const [title, setTitle] = useState('Tuition Fee')
  const [amount, setAmount] = useState('100000')
  const [currency, setCurrency] = useState('NGN')
  const [invoices, setInvoices] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    setMessage(''); setError('')
    try {
      const { data } = await client.get(`/fees/invoices/${studentId}`)
      setInvoices(data)
    } catch {
      setError('Failed to load')
    }
  }

  const createInvoice = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    try {
      const { data } = await client.post('/fees/invoices', { student_id: Number(studentId), title, amount: Number(amount), currency })
      setMessage(`Created invoice #${data.id}`)
      await load()
    } catch {
      setError('Failed to create invoice')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Invoices</h1>
      <form onSubmit={createInvoice} className="bg-white p-4 rounded shadow flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-sm">Student ID</label>
          <input className="border p-2 rounded w-40" value={studentId} onChange={(e) => setStudentId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <div>
          <label className="block text-sm">Title</label>
          <input className="border p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Amount</label>
          <input className="border p-2 rounded w-40" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm">Currency</label>
          <input className="border p-2 rounded w-28" value={currency} onChange={(e) => setCurrency(e.target.value)} />
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Create</button>
        <button type="button" onClick={load} className="bg-gray-800 text-white px-4 py-2 rounded">Load Student Invoices</button>
        {message && <span className="text-green-700 text-sm">{message}</span>}
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </form>
      <div className="space-y-2">
        {invoices.map(inv => (
          <div key={inv.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{inv.title}</div>
              <div className="text-sm text-gray-500">{inv.currency} {inv.amount} • {inv.status}</div>
            </div>
          </div>
        ))}
        {!invoices.length && <div className="text-sm text-gray-500">No invoices loaded.</div>}
      </div>
    </div>
  )
}
