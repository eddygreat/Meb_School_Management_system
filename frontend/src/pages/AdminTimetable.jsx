import { useEffect, useState } from 'react'
import client from '../api/client'

export default function AdminTimetable(){
  const [classes, setClasses] = useState([])
  const [rooms, setRooms] = useState([])
  const [subjects, setSubjects] = useState([])
  const [timeslots, setTimeslots] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [newClass, setNewClass] = useState('')
  const [newRoom, setNewRoom] = useState({ name: '', capacity: 40 })
  const [newSubject, setNewSubject] = useState('')
  const [newTimeSlot, setNewTimeSlot] = useState({ day_of_week: 0, start_time: '08:00', end_time: '09:00' })

  const [sched, setSched] = useState({ class_id: '', room_id: '', subject_id: '', teacher_id: '', time_slot_id: '' })

  const load = async () => {
    try {
      const [c, r, s, t] = await Promise.all([
        client.get('/api/timetable/classes'),
        client.get('/api/timetable/rooms'),
        client.get('/api/timetable/subjects'),
        client.get('/api/timetable/timeslots')
      ])
      setClasses(c.data); setRooms(r.data); setSubjects(s.data); setTimeslots(t.data)
    } catch {
      setError('Failed to load master data')
    }
  }
  useEffect(() => { load() }, [])

  const createClass = async () => {
    setMessage(''); setError('')
    try { await client.post('/api/timetable/classes', { name: newClass }); setNewClass(''); await load(); setMessage('Class created') } catch { setError('Failed') }
  }
  const createRoom = async () => {
    setMessage(''); setError('')
    try { await client.post('/api/timetable/rooms', newRoom); setNewRoom({ name:'', capacity:40 }); await load(); setMessage('Room created') } catch { setError('Failed') }
  }
  const createSubject = async () => {
    setMessage(''); setError('')
    try { await client.post('/api/timetable/subjects', { name: newSubject }); setNewSubject(''); await load(); setMessage('Subject created') } catch { setError('Failed') }
  }
  const createTimeSlot = async () => {
    setMessage(''); setError('')
    try { await client.post('/api/timetable/timeslots', newTimeSlot); setNewTimeSlot({ day_of_week:0, start_time:'08:00', end_time:'09:00' }); await load(); setMessage('Time slot created') } catch { setError('Failed') }
  }
  const createSchedule = async () => {
    setMessage(''); setError('')
    try {
      const payload = {
        class_id: Number(sched.class_id),
        room_id: sched.room_id ? Number(sched.room_id) : null,
        subject_id: Number(sched.subject_id),
        teacher_id: Number(sched.teacher_id),
        time_slot_id: Number(sched.time_slot_id),
      }
      await client.post('/api/timetable/schedule', payload)
      setMessage('Scheduled successfully')
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to schedule')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Timetable</h1>
      {(message || error) && (
        <div className={"text-sm " + (message? 'text-green-700':'text-red-600')}>{message || error}</div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Masters</h2>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-sm">Class name</label>
              <input className="border p-2 rounded" value={newClass} onChange={e=>setNewClass(e.target.value)} />
            </div>
            <button onClick={createClass} className="bg-blue-600 text-white px-3 py-2 rounded">Add Class</button>
          </div>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-sm">Room</label>
              <input className="border p-2 rounded" placeholder="Name" value={newRoom.name} onChange={e=>setNewRoom(v=>({...v, name:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm">Capacity</label>
              <input className="border p-2 rounded w-24" value={newRoom.capacity} onChange={e=>setNewRoom(v=>({...v, capacity:e.target.value}))} />
            </div>
            <button onClick={createRoom} className="bg-blue-600 text-white px-3 py-2 rounded">Add Room</button>
          </div>
          <div className="flex gap-2 items-end">
            <div>
              <label className="block text-sm">Subject name</label>
              <input className="border p-2 rounded" value={newSubject} onChange={e=>setNewSubject(e.target.value)} />
            </div>
            <button onClick={createSubject} className="bg-blue-600 text-white px-3 py-2 rounded">Add Subject</button>
          </div>
          <div className="flex gap-2 items-end flex-wrap">
            <div>
              <label className="block text-sm">Day</label>
              <select className="border p-2 rounded" value={newTimeSlot.day_of_week} onChange={e=>setNewTimeSlot(v=>({...v, day_of_week:Number(e.target.value)}))}>
                {[0,1,2,3,4,5,6].map(d=> <option key={d} value={d}>{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][d]}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm">Start</label>
              <input type="time" className="border p-2 rounded" value={newTimeSlot.start_time} onChange={e=>setNewTimeSlot(v=>({...v, start_time:e.target.value}))} />
            </div>
            <div>
              <label className="block text-sm">End</label>
              <input type="time" className="border p-2 rounded" value={newTimeSlot.end_time} onChange={e=>setNewTimeSlot(v=>({...v, end_time:e.target.value}))} />
            </div>
            <button onClick={createTimeSlot} className="bg-blue-600 text-white px-3 py-2 rounded">Add Time Slot</button>
          </div>
        </div>
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Create Schedule</h2>
          <div className="grid grid-cols-2 gap-2">
            <Select label="Class" value={sched.class_id} onChange={v=>setSched(s=>({...s, class_id:v}))} options={classes} getLabel={o=>o.name} />
            <Select label="Room (optional)" value={sched.room_id} onChange={v=>setSched(s=>({...s, room_id:v}))} options={rooms} getLabel={o=>o.name} allowEmpty />
            <Select label="Subject" value={sched.subject_id} onChange={v=>setSched(s=>({...s, subject_id:v}))} options={subjects} getLabel={o=>o.name} />
            <div>
              <label className="block text-sm">Teacher ID</label>
              <input className="border p-2 rounded w-full" value={sched.teacher_id} onChange={e=>setSched(s=>({...s, teacher_id:e.target.value}))} placeholder="e.g. 1" />
            </div>
            <Select label="Time Slot" value={sched.time_slot_id} onChange={v=>setSched(s=>({...s, time_slot_id:v}))} options={timeslots} getLabel={o=>`${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][o.day_of_week]} ${o.start_time}-${o.end_time}`} />
          </div>
          <button onClick={createSchedule} className="bg-emerald-600 text-white px-4 py-2 rounded">Schedule</button>
        </div>
      </div>
    </div>
  )
}

function Select({ label, value, onChange, options, getLabel, allowEmpty }){
  return (
    <div>
      <label className="block text-sm">{label}</label>
      <select className="border p-2 rounded w-full" value={value} onChange={e=>onChange(e.target.value)}>
        {allowEmpty && <option value="">--</option>}
        {options.map(o => <option key={o.id} value={o.id}>{getLabel(o)}</option>)}
      </select>
    </div>
  )
}
