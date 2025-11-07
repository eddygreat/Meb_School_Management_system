import { useState } from 'react'
import client from '../api/client'

export default function StudentTimetable(){
  const [classId, setClassId] = useState('')
  const [entries, setEntries] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    if (!classId) return
    setError('')
    try {
      const { data } = await client.get(`/api/timetable/schedule/by-class/${classId}`)
      setEntries(data)
    } catch {
      setError('Failed to load timetable')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class Timetable</h1>
      <div className="bg-white p-4 rounded shadow flex gap-2 items-end mb-4">
        <div>
          <label className="block text-sm">Class ID</label>
          <input className="border p-2 rounded" value={classId} onChange={(e)=>setClassId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      <List entries={entries} />
    </div>
  )
}

function List({ entries }){
  if (!entries?.length) return <div className="text-sm text-gray-500">No entries.</div>
  return (
    <div className="space-y-2">
      {entries.map(e => (
        <div key={e.id} className="bg-white p-3 rounded shadow text-sm flex justify-between">
          <span>Subject #{e.subject_id} • Room #{e.room_id || '-'} </span>
          <span>Slot #{e.time_slot_id}</span>
        </div>
      ))}
    </div>
  )
}
