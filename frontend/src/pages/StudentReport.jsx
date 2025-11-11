import { useState, useEffect } from 'react'
import client from '../api/client'
import { useAuth } from '../context/AuthContext'

export default function StudentReport(){
  const { user } = useAuth()
  const [termId, setTermId] = useState('')
  const [yearId, setYearId] = useState('')
  const [report, setReport] = useState(null)
  const [master, setMaster] = useState({ subjects: [], terms: [], years: [] });
  const [error, setError] = useState('')

  const load = async () => {
    if (!user?.student_id || !termId || !yearId) { return }
    try {
      const { data } = await client.get(`/api/grades/report/${user.student_id}`, { params: { term_id: termId, year_id: yearId } })
      setReport(data)
    } catch (e) {
      setError('Failed to load report')
    }
  }

  const loadMaster = async () => {
    try {
      const [subjectsRes, termsRes, yearsRes] = await Promise.all([
        client.get('/api/timetable/subjects'),
        client.get('/api/grades/terms'),
        client.get('/api/grades/years')
      ]);
      setMaster({ subjects: subjectsRes.data, terms: termsRes.data, years: yearsRes.data });
    } catch (e) { setError('Failed to load master data'); }
  }

  useEffect(() => { loadMaster(); load(); }, [user, termId, yearId])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Report</h1>
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-sm">Term ID</label>
          <select className="border p-2 rounded" value={termId} onChange={e=>setTermId(e.target.value)}>
            <option value="">Select Term</option>
            {master.terms.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm">Year ID</label>
          <select className="border p-2 rounded" value={yearId} onChange={e=>setYearId(e.target.value)}>
            <option value="">Select Year</option>
            {master.years.map(y => <option key={y.id} value={y.id}>{y.name}</option>)}
          </select>
        </div>
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      {report ? <ReportView report={report} master={master} /> : <div className="text-sm text-gray-500">Select a term and year to load a report.</div>}
    </div>
  )
}

function ReportView({ report, master }){
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
