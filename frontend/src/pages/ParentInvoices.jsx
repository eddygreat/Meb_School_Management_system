import { useEffect, useState } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function ParentInvoices(){
  const { user } = useAuth()
  const [invoices, setInvoices] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchInvoices = async () => {
    if (!user?.student_id) return
    setLoading(true)
    setError('')
    try {
      const { data } = await client.get(`/api/fees/invoices/${user.student_id}`)
      setInvoices(data)
    } catch (e) {
      setError('Failed to load invoices')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchInvoices() }, [user])

  const pay = async (invoiceId, provider='paystack') => {
    try {
      const { data } = await client.post('/api/fees/initiate', { invoice_id: invoiceId, provider })
      window.location.href = data.checkout_url
    } catch (e) {
      alert('Failed to initiate payment')
    }
  }

  const viewReceipt = async (invoiceId) => {
    try {
      const { data } = await client.get(`/api/fees/receipt/${invoiceId}`)
      alert(JSON.stringify(data, null, 2))
    } catch (e) {
      alert('Failed to fetch receipt')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Invoices</h1>
      <div className="bg-white p-4 rounded shadow flex gap-2 items-end mb-4">
        {loading && <span className="text-sm text-gray-600">Loading...</span>}
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      <div className="space-y-2">
        {invoices.map(inv => (
          <div key={inv.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
            <div>
              <div className="font-semibold">{inv.title}</div>
              <div className="text-sm text-gray-500">{inv.currency} {inv.amount} • {inv.status}</div>
            </div>
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-emerald-600 text-white rounded" disabled={inv.status==='paid'} onClick={()=>pay(inv.id,'paystack')}>Pay (Paystack)</button>
              <button className="px-3 py-1 bg-purple-600 text-white rounded" disabled={inv.status==='paid'} onClick={()=>pay(inv.id,'flutterwave')}>Pay (Flutterwave)</button>
              <button className="px-3 py-1 bg-gray-800 text-white rounded" onClick={()=>viewReceipt(inv.id)}>Receipt</button>
            </div>
          </div>
        ))}
        {!invoices.length && <div className="text-sm text-gray-500">No invoices loaded.</div>}
      </div>
    </div>
  )
}
