import { useEffect, useState } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function StudentTimetable() {
  const { user } = useAuth()
  const [entries, setEntries] = useState([])
  const [master, setMaster] = useState({ subjects: [], rooms: [], timeslots: [] })
  const [error, setError] = useState('')

  const load = async () => {
    if (!user?.class_id) return
    setError('')
    try {
      const [scheduleRes, subjectsRes, roomsRes, timeslotsRes] = await Promise.all([
        client.get(`/timetable/schedule/by-class/${user.class_id}`),
        client.get('/timetable/subjects'),
        client.get('/timetable/rooms'),
        client.get('/timetable/timeslots')
      ]);
      setEntries(scheduleRes.data);
      setMaster({
        subjects: subjectsRes.data,
        rooms: roomsRes.data,
        timeslots: timeslotsRes.data
      });
    } catch {
      setError('Failed to load timetable')
    }
  }

  useEffect(() => { load() }, [user])

  const find = (collection, id) => collection.find(item => item.id === id);
  const formatSlot = (slot) => {
    if (!slot) return '';
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return `${days[slot.day_of_week]} ${slot.start_time}-${slot.end_time}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Class Timetable</h1>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="space-y-2">
        {entries.map(e => (
          <div key={e.id} className="bg-white p-3 rounded shadow text-sm flex justify-between">
            <span>
              <span className="font-semibold">{find(master.subjects, e.subject_id)?.name || `Subject #${e.subject_id}`}</span>
              <span className="text-gray-600"> in {find(master.rooms, e.room_id)?.name || 'N/A'}</span>
            </span>
            <span>{formatSlot(find(master.timeslots, e.time_slot_id))}</span>
          </div>
        ))}
        {!entries.length && <div className="text-sm text-gray-500">No entries.</div>}
      </div>
    </div>
  )
}
