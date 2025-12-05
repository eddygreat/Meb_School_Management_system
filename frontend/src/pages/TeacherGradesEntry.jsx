import { useEffect, useState } from 'react'
import client from '../api/client'
import AIMarkdown from '../components/AIMarkdown'

export default function TeacherGradesEntry() {
  const [form, setForm] = useState({ student_id: '', subject_id: '', term_id: '', year_id: '', ca1: '', ca2: '', exam: '' })
  const [master, setMaster] = useState({ students: [], subjects: [], terms: [], years: [] });
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // AI Grading State
  const [showAI, setShowAI] = useState(false)
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiAnswer, setAiAnswer] = useState('')
  const [aiRubric, setAiRubric] = useState('')
  const [aiResult, setAiResult] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)

  const loadMaster = async () => {
    try {
      const [studentsRes, subjectsRes, termsRes, yearsRes] = await Promise.all([
        client.get('/admin/users?role=student'), // Assuming an endpoint to get students
        client.get('/timetable/subjects'),
        client.get('/grades/terms'),
        client.get('/grades/years')
      ]);
      setMaster({
        students: studentsRes.data,
        subjects: subjectsRes.data,
        terms: termsRes.data,
        years: yearsRes.data
      });
    } catch (e) { setError('Failed to load master data'); }
  }
  useEffect(() => { loadMaster() }, [])

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
      const { data } = await client.post('/grades/entry', payload)
      setMessage(`Saved total ${data.total} (${data.grade})`)
    } catch (e) {
      setError(e?.response?.data?.detail || 'Failed to save')
    }
  }

  const handleAIGrade = async () => {
    if (!aiQuestion || !aiAnswer) return
    setAiLoading(true)
    setAiResult(null)
    try {
      const { data } = await client.post('/ai/grade', {
        question: aiQuestion,
        answer: aiAnswer,
        rubric: aiRubric
      })
      // Try to parse if it's a string JSON
      let res = data.grading_result
      try {
        if (typeof res === 'string') res = JSON.parse(res)
      } catch (e) { /* ignore */ }
      setAiResult(res)
    } catch (e) {
      setAiResult({ error: 'Failed to grade' })
    } finally {
      setAiLoading(false)
    }
  }

  const setVal = (k, v) => setForm(s => ({ ...s, [k]: v }))

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enter Grades</h1>
      <form onSubmit={submit} className="bg-white p-4 rounded shadow grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl">
        <Select label="Student" value={form.student_id} onChange={v => setVal('student_id', v)} options={master.students} getLabel={o => `${o.full_name} (ID: ${o.id})`} />
        <Select label="Subject" value={form.subject_id} onChange={v => setVal('subject_id', v)} options={master.subjects} getLabel={o => o.name} />
        <Select label="Term" value={form.term_id} onChange={v => setVal('term_id', v)} options={master.terms} getLabel={o => o.name} />
        <Select label="Year" value={form.year_id} onChange={v => setVal('year_id', v)} options={master.years} getLabel={o => o.name} />

        <div className="col-span-2 md:col-span-4 grid grid-cols-3 gap-3 mt-4">
          <Input label="CA1" value={form.ca1} onChange={v => setVal('ca1', v)} />
          <Input label="CA2" value={form.ca2} onChange={v => setVal('ca2', v)} />
          <Input label="Exam" value={form.exam} onChange={v => setVal('exam', v)} />
        </div>

      </form>

      {/* AI Auto-Grade Button */}
      <div className="mt-6">
        <button onClick={() => setShowAI(!showAI)} className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2">
          ✨ AI Auto-Grade Assistant
        </button>
      </div>

      {/* AI Modal */}
      {
        showAI && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">AI Auto-Grader</h2>
                <button onClick={() => setShowAI(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Question</label>
                  <textarea className="w-full border rounded p-2" rows="2" value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} placeholder="Enter the question..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Student Answer</label>
                  <textarea className="w-full border rounded p-2" rows="3" value={aiAnswer} onChange={e => setAiAnswer(e.target.value)} placeholder="Enter student's answer..." />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rubric (Optional)</label>
                  <textarea className="w-full border rounded p-2" rows="2" value={aiRubric} onChange={e => setAiRubric(e.target.value)} placeholder="Grading criteria..." />
                </div>

                <button
                  onClick={handleAIGrade}
                  disabled={aiLoading || !aiQuestion || !aiAnswer}
                  className="w-full bg-purple-600 text-white py-2 rounded disabled:bg-purple-300"
                >
                  {aiLoading ? 'Grading...' : 'Grade with AI'}
                </button>

                {aiResult && (
                  <div className="mt-4 p-4 bg-gray-50 rounded border">
                    <h3 className="font-bold mb-2">Grading Result</h3>
                    {typeof aiResult === 'object' && !aiResult.error ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-lg">Score:</span>
                          <span className="text-2xl text-purple-700 font-bold">{aiResult.score}/10</span>
                        </div>
                        <div>
                          <span className="font-bold">Feedback:</span>
                          <p className="text-gray-700">{aiResult.feedback}</p>
                        </div>
                        <div>
                          <span className="font-bold">Tip:</span>
                          <p className="text-gray-600 italic">{aiResult.tip}</p>
                        </div>
                        <button
                          onClick={() => {
                            // Auto-fill the exam score if valid
                            if (aiResult.score) setVal('exam', aiResult.score * 10) // Scale to 100 if needed, assuming 10 is max
                            setShowAI(false)
                          }}
                          className="mt-2 text-sm text-blue-600 hover:underline"
                        >
                          Use this score for Exam
                        </button>
                      </div>
                    ) : (
                      <AIMarkdown content={typeof aiResult === 'string' ? aiResult : JSON.stringify(aiResult)} />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}

function Input({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-sm">{label}</label>
      <input className="border p-2 rounded w-full" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

function Select({ label, value, onChange, options, getLabel }) {
  return (
    <div>
      <label className="block text-sm">{label}</label>
      <select className="border p-2 rounded w-full" value={value} onChange={e => onChange(e.target.value)}>
        <option value="">Select {label}</option>
        {options.map(o => <option key={o.id} value={o.id}>{getLabel(o)}</option>)}
      </select>
    </div>
  )
}
