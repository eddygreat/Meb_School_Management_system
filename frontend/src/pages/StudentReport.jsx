import { useState } from 'react'
import client from '../api/client'

export default function StudentReport(){
  const [studentId, setStudentId] = useState('')
  const [termId, setTermId] = useState('')
  const [yearId, setYearId] = useState('')
  const [report, setReport] = useState(null)
  const [error, setError] = useState('')

  const load = async () => {
    setError(''); setReport(null)
    try {
      const { data } = await client.get(`/api/grades/report/${studentId}`, { params: { term_id: termId, year_id: yearId } })
      setReport(data)
    } catch (e) {
      setError('Failed to load report')
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Report</h1>
      <div className="bg-white p-4 rounded shadow flex flex-wrap gap-3 items-end mb-4">
        <div>
          <label className="block text-sm">Student ID</label>
          <input className="border p-2 rounded" value={studentId} onChange={e=>setStudentId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <div>
          <label className="block text-sm">Term ID</label>
          <input className="border p-2 rounded" value={termId} onChange={e=>setTermId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <div>
          <label className="block text-sm">Year ID</label>
          <input className="border p-2 rounded" value={yearId} onChange={e=>setYearId(e.target.value)} placeholder="e.g. 1" />
        </div>
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
        {error && <span className="text-sm text-red-600">{error}</span>}
      </div>
      {report ? <ReportView report={report} /> : <div className="text-sm text-gray-500">No report loaded.</div>}
    </div>
  )
}

function ReportView({ report }){
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="font-semibold mb-2">Student #{report.student_id} • Term #{report.term_id} • Year #{report.year_id}</div>
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
              <td className="py-2">{s.subject_id}</td>
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
