import { useState, useEffect } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'
import AIMarkdown from '../components/AIMarkdown'

export default function StudentReport() {
  const { user } = useAuth()
  const [termId, setTermId] = useState('')
  const [yearId, setYearId] = useState('')
  const [report, setReport] = useState(null)
  const [master, setMaster] = useState({ subjects: [], terms: [], years: [] });
  const [error, setError] = useState('')

  // AI State
  const [aiLoading, setAiLoading] = useState(false)
  const [studyGuide, setStudyGuide] = useState(null)
  const [prediction, setPrediction] = useState(null)

  const load = async () => {
    if (!user?.student_id || !termId || !yearId) { return }
    try {
      const { data } = await client.get(`/grades/report/${user.student_id}`, { params: { term_id: termId, year_id: yearId } })
      setReport(data)
    } catch (e) {
      setError('Failed to load report')
    }
  }

  const loadMaster = async () => {
    try {
      const [subjectsRes, termsRes, yearsRes] = await Promise.all([
        client.get('/timetable/subjects'),
        client.get('/grades/terms'),
        client.get('/grades/years')
      ]);
      setMaster({ subjects: subjectsRes.data, terms: termsRes.data, years: yearsRes.data });
    } catch (e) { setError('Failed to load master data'); }
  }

  const handleStudyGuide = async () => {
    if (!report) return
    setAiLoading(true)
    try {
      // Create a summary of the report for the AI
      const studentData = `
        Student ID: ${report.student_id}
        Term: ${master.terms.find(t => t.id == report.term_id)?.name}
        Year: ${master.years.find(y => y.id == report.year_id)?.name}
        Subjects:
        ${report.subjects.map(s => `- ${master.subjects.find(sub => sub.id == s.subject_id)?.name}: ${s.grade} (${s.total}%)`).join('\n')}
      `
      const { data } = await client.post('/ai/study-guide', { student_data: studentData })
      setStudyGuide(data.study_guide)
    } catch (e) { setError('Failed to generate study guide') }
    finally { setAiLoading(false) }
  }

  const handlePredict = async () => {
    if (!report) return
    setAiLoading(true)
    try {
      // Create a history string (mocking history with current report for now)
      const history = `
        Current Report Average: ${report.average}
        Grades: ${report.subjects.map(s => s.total).join(', ')}
        Attendance: 95% (Mocked)
      `
      const { data } = await client.post('/ai/predict', { student_history: history })
      setPrediction(data.prediction)
    } catch (e) { setError('Failed to predict performance') }
    finally { setAiLoading(false) }
  }

  useEffect(() => { loadMaster(); load(); }, [user, termId, yearId])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Report</h1>
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-sm">Term ID</label>
          <select className="border p-2 rounded" value={termId} onChange={e => setTermId(e.target.value)}>
            <option value="">Select Term</option>
            {master.terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">Year ID</label>
          <select className="border p-2 rounded" value={yearId} onChange={e => setYearId(e.target.value)}>
            <option value="">Select Year</option>
            {master.years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
          </select>
        </div>
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      {report ? (
        <div className="space-y-6">
          <ReportView report={report} master={master} />

          {/* AI Features Section */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Study Guide */}
            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">📚 AI Study Guide</h2>
                <button
                  onClick={handleStudyGuide}
                  disabled={aiLoading}
                  className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded hover:bg-blue-200 disabled:opacity-50"
                >
                  {aiLoading ? 'Generating...' : 'Generate'}
                </button>
              </div>
              {studyGuide ? (
                <div className="bg-blue-50 p-4 rounded max-h-64 overflow-y-auto">
                  <AIMarkdown content={studyGuide} />
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Click generate to get a personalized study plan based on your grades.</p>
              )}
            </div>

            {/* Prediction */}
            <div className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold flex items-center gap-2">🔮 Performance Prediction</h2>
                <button
                  onClick={handlePredict}
                  disabled={aiLoading}
                  className="text-sm bg-purple-100 text-purple-700 px-3 py-1 rounded hover:bg-purple-200 disabled:opacity-50"
                >
                  {aiLoading ? 'Predicting...' : 'Predict'}
                </button>
              </div>
              {prediction ? (
                <div className="bg-purple-50 p-4 rounded max-h-64 overflow-y-auto">
                  <AIMarkdown content={prediction} />
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">Get AI insights on your future performance based on current trends.</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-sm text-gray-500">Select a term and year to load a report.</div>
      )}
    </div>
  )
}

function ReportView({ report, master }) {
  const find = (collection, id) => collection.find(item => item.id === id);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="font-semibold mb-2">Student #{report.student_id} • {find(master.terms, report.term_id)?.name} • {find(master.years, report.year_id)?.name}</div>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2">Subject ID</th>
            <th>CA1</th>
            <th>CA2</th>
            <th>Exam</th>
            <th>Total</th>
            <th>Grade</th>
            <th>Remark</th>
          </tr>
        </thead>
        <tbody>
          {report.subjects.map((s, idx) => (
            <tr key={idx} className="border-b">
              <td className="py-2 font-medium">{find(master.subjects, s.subject_id)?.name}</td>
              <td>{s.ca1}</td>
              <td>{s.ca2}</td>
              <td>{s.exam}</td>
              <td>{s.total}</td>
              <td>{s.grade}</td>
              <td>{s.remark}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td className="py-2 font-semibold">Average</td>
            <td colSpan="6">{report.average}</td>
          </tr>
        </tfoot>
      </table>
    </div>
  )
}
