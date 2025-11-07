import { useState } from 'react'
import client from '../api/client'

export default function TeacherGradesEntry(){
  const [form, setForm] = useState({ student_id: '', subject_id: '', term_id: '', year_id: '', ca1: '', ca2: '', exam: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setMessage(''); setError('')
    try {
      const payload = {
        student_id: Number(form.student_id),
        subject_id: Number(form.subject_id),
        term_id: Number(form.term_id),
        year_id: Number(form.year_id),
        ca1: Number(form.ca1 || 0),
        ca2: Number(form.ca2 || 0),
        exam: Number(form.exam || 0),
      }
      const { data } = await client.post('/api/grades/entry', payload)
      setMessage(`Saved total ${data.total} (${data.grade})`)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to save')
    }
  }

  const setVal = (k, v) => setForm(s => ({ ...s, [k]: v }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enter Grades</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-2 gap-3 max-w-3xl">
        <Input label="Student ID" value={form.student_id} onChange={v=>setVal('student_id', v)} />
        <Input label="Subject ID" value={form.subject_id} onChange={v=>setVal('subject_id', v)} />
        <Input label="Term ID" value={form.term_id} onChange={v=>setVal('term_id', v)} />
        <Input label="Year ID" value={form.year_id} onChange={v=>setVal('year_id', v)} />
        <Input label="CA1" value={form.ca1} onChange={v=>setVal('ca1', v)} />
        <Input label="CA2" value={form.ca2} onChange={v=>setVal('ca2', v)} />
        <Input label="Exam" value={form.exam} onChange={v=>setVal('exam', v)} />
        <div className="col-span-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
          {message && <span className="ml-3 text-green-700 text-sm">{message}</span>}
          {error && <span className="ml-3 text-red-600 text-sm">{error}</span>}
        </div>
      </form>
    </div>
  )
}

function Input({ label, value, onChange }){
  return (
    <div>
      <label className="block text-sm">{label}</label>
      <input className="border p-2 rounded w-full" value={value} onChange={(e)=>onChange(e.target.value)} />
    </div>
  )
}
