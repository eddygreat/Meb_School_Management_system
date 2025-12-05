import { useState } from 'react'
import client from '../api/client'

export default function AdminExports() {
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [exportLinks, setExportLinks] = useState(null)

  const getExport = async () => {
    setStatus(''); setError('')
    try { const { data } = await client.get('/admin/export'); setExportLinks(data) } catch { setError('Failed to export') }
  }
  const backup = async () => {
    setStatus(''); setError('')
    try { await client.post('/admin/backup'); setStatus('Backup started (stub)') } catch { setError('Backup failed') }
  }
  const restore = async () => {
    setStatus(''); setError('')
    try { await client.post('/admin/restore'); setStatus('Restore started (stub)') } catch { setError('Restore failed') }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Exports & Backup</h1>
      <div className="bg-white p-4 rounded shadow flex gap-2 items-center">
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={getExport}>Generate Export</button>
        <button className="bg-gray-800 text-white px-4 py-2 rounded" onClick={backup}>Backup</button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded" onClick={restore}>Restore</button>
        {status && <span className="text-green-700 text-sm">{status}</span>}
        {error && <span className="text-red-600 text-sm">{error}</span>}
      </div>
      {exportLinks && (
        <div className="bg-white p-4 rounded shadow">
          <div className="font-semibold mb-2">Download Links</div>
          <div className="text-sm">PDF: {exportLinks.pdf_url || 'not available'}</div>
          <div className="text-sm">Excel: {exportLinks.excel_url || 'not available'}</div>
        </div>
      )}
    </div>
  )
}
