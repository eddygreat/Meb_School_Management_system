import { useEffect, useState } from 'react'
import client from '../api/client'

export default function AdminSettings() {
  const [items, setItems] = useState([])
  const [keyVal, setKeyVal] = useState({ key: '', value: '' })
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    setError(''); setStatus('')
    try { const { data } = await client.get('/settings/'); setItems(data) } catch { setError('Failed to load settings') }
  }
  useEffect(() => { load() }, [])

  const save = async () => {
    if (!keyVal.key) return
    try { await client.post('/settings/', null, { params: { key: keyVal.key, value: keyVal.value } }); setStatus('Saved'); setKeyVal({ key: '', value: '' }); load() } catch { setError('Failed to save') }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Settings</h1>
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-3 gap-2 items-end">
        <input className="border p-2 rounded" placeholder="Key (e.g. SCHOOL_NAME)" value={keyVal.key} onChange={e => setKeyVal(s => ({ ...s, key: e.target.value }))} />
        <input className="border p-2 rounded" placeholder="Value" value={keyVal.value} onChange={e => setKeyVal(s => ({ ...s, value: e.target.value }))} />
        <button onClick={save} className="bg-emerald-600 text-white px-4 py-2 rounded">Save</button>
        {status && <div className="text-green-700 text-sm">{status}</div>}
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-2">All Settings</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b"><th className="p-2">Key</th><th className="p-2">Value</th></tr>
          </thead>
          <tbody>
            {items.map(it => (
              <tr key={it.key} className="border-b"><td className="p-2">{it.key}</td><td className="p-2">{it.value}</td></tr>
            ))}
            {!items.length && <tr><td className="p-2 text-sm text-gray-500">No settings</td><td></td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
