import { useState, useEffect } from 'react'
import api from '../services/api'
import { useAuth } from '../context/AuthContext'
import Input from './Input'

export default function StudentAssignments() {
  const [classId, setClassId] = useState('')
  const [subjectId, setSubjectId] = useState('')
  const { user } = useAuth()
  const [assignments, setAssignments] = useState([])
  const [submitForm, setSubmitForm] = useState({ assignment_id: '', content_url: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const load = async () => {
    setMessage(''); setError(''); setLoading(true)
    try {
      const { data } = await api.curriculum.getAssignments({
        class_id: classId || undefined,
        subject_id: subjectId || undefined
      })
      setAssignments(data)
    } catch (err) {
      setError('Failed to load assignments')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const submit = async () => {
    setMessage(''); setError('')
    if (!submitForm.assignment_id || !user?.student_id || !submitForm.content_url) { setError('All fields required'); return }

    try {
      setLoading(true)
      const { data } = await api.curriculum.submitAssignment({
        assignment_id: Number(submitForm.assignment_id),
        student_id: Number(user.student_id),
        content_url: submitForm.content_url
      })
      setMessage(`Submitted #${data.id}`)
      setSubmitForm({ assignment_id: '', content_url: '' })
    } catch {
      setError('Failed to submit')
    } finally {
      setLoading(false)
    }
  }

  // Automatically load assignments if class/subject changes
  useEffect(() => { if (classId || subjectId) load() }, [classId, subjectId])

  // Initial load
  useEffect(() => { load() }, [])

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Assignments</h1>
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-5 gap-2 items-end">
        <Input label="Class ID" value={classId} onChange={setClassId} />
        <Input label="Subject ID" value={subjectId} onChange={setSubjectId} />
        <button onClick={load} disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50">
          {loading ? 'Loading...' : 'Load'}
        </button>
        {error && <div className="text-red-600 text-sm">{error}</div>}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">Available Assignments</h2>
          <ul className="space-y-2 max-h-80 overflow-auto text-sm">
            {assignments.map(a => (
              <li key={a.id} className="border p-2 rounded hover:bg-gray-50">
                <div className="font-medium">{a.title}</div>
                <div className="text-xs text-gray-500">#{a.id} • Due {a.due_date}</div>
                <div className="text-gray-700 mt-1">{a.description}</div>
                <div className="mt-2 text-xs">
                  <span className={`px-2 py-1 rounded-full ${a.status === 'Submitted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {a.status}
                  </span>
                </div>
              </li>
            ))}
            {!assignments.length && !loading && <div className="text-sm text-gray-500">No assignments found</div>}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow space-y-2">
          <h2 className="font-semibold">Submit Assignment</h2>
          <Input label="Assignment ID" value={submitForm.assignment_id} onChange={v => setSubmitForm(s => ({ ...s, assignment_id: v }))} />
          <Input label="Content URL" value={submitForm.content_url} onChange={v => setSubmitForm(s => ({ ...s, content_url: v }))} />
          <button onClick={submit} disabled={loading} className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-50">
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          {message && <div className="text-green-700 text-sm">{message}</div>}
        </div>
      </div>
    </div>
  )
}
