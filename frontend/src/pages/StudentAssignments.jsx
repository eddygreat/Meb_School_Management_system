import { useState, useEffect } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import Input from './Input'

export default function StudentAssignments(){
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [submitForm, setSubmitForm] = useState({ assignment_id:'', content_url:'' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    setMessage(''); setError('')
    try {
      const { data } = await client.get('/api/curriculum/assignments', { params: { class_id: classId || undefined, subject_id: subjectId || undefined } })
      setAssignments(data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load assignments')
      console.error(err)
    }
  }

  const submit = async () => {
    setMessage(''); setError('')
    if (!submitForm.assignment_id || !user?.student_id || !submitForm.content_url) { setError('All fields required'); return }
    try {
      const { data } = await client.post('/api/curriculum/submissions', { assignment_id: Number(submitForm.assignment_id), student_id: Number(user.student_id), content_url: submitForm.content_url })
      setMessage(`Submitted #${data.id}`)
      setSubmitForm({ assignment_id:'', content_url:'' })
    } catch {
      setError('Failed to submit')
    }
  }

  // Automatically load assignments if class/subject changes
  useEffect(() => { if (classId || subjectId) load() }, [classId, subjectId])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Assignments</h1>
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-5 gap-2 items-end">
        <Input label="Class ID" value={classId} onChange={setClassId} />
        <Input label="Subject ID" value={subjectId} onChange={setSubjectId} />
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Available Assignments</h2>
          <ul className="space-y-2 max-h-80 overflow-auto text-sm">
            {assignments.map(a => (
              <li key={a.id} className="border p-2 rounded">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">#{a.id} • Due {a.due_date}</div>
                <div className="text-gray-700">{a.description}</div>
              </li>
            ))}
            {!assignments.length && <div className="text-sm text-gray-500">No assignments</div>}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">Submit Assignment</h2>
          <Input label="Assignment ID" value={submitForm.assignment_id} onChange={v=>setSubmitForm(s=>({...s,assignment_id:v}))} />
          <Input label="Content URL" value={submitForm.content_url} onChange={v=>setSubmitForm(s=>({...s,content_url:v}))} />
          <button onClick={submit} className="bg-emerald-600 text-white px-4 py-2 rounded">Submit</button>
          {message && <div className="text-green-700 text-sm">{message}</div>}
        </div>
      </div>
    </div>
  )
}
