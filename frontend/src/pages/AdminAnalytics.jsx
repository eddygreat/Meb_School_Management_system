import { useEffect, useState } from 'react'
import client from '../api/client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

export default function AdminAnalytics() {
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    (async () => {
      try { const { data } = await client.get('/analytics/dashboard'); setData(data) } catch { setError('Failed to load analytics') }
    })()
  }, [])

  if (error) return <div className="p-6 text-red-600 text-sm">{error}</div>
  if (!data) return <div className="p-6 text-sm text-gray-600">Loading analytics…</div>

  const kpis = [
    { name: 'Attendance %', value: Math.round((data.attendance_rate || 0) * 100) },
    { name: 'Payments (mo)', value: (data.payments_by_month || []).slice(-1)[0]?.count || 0 },
    { name: 'Classes tracked', value: (data.attendance_by_class || []).length },
  ]

  const paymentsData = (data.payments_by_month || []).map(d => ({ name: d.month, total: d.total, count: d.count }))
  const attendanceData = (data.attendance_by_class || []).map(d => ({ name: d.class_name || String(d.class_id || ''), checkins: d.checkins }))
  const gradeDistData = Object.entries(data.grade_distribution || {}).map(([k, v]) => ({ name: k, value: v }))
  const colors = ['#16a34a', '#dc2626', '#2563eb', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6']

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Admin Analytics</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {kpis.map(k => (
          <div key={k.name} className="bg-white p-4 rounded shadow">
            <div className="text-sm text-gray-500">{k.name}</div>
            <div className="text-2xl font-semibold">{k.value}</div>
          </div>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="font-semibold mb-2">Payments by Month</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={paymentsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#2563eb" name="Total (NGN)" />
              <Bar dataKey="count" fill="#10b981" name="Count" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="font-semibold mb-2">Attendance by Class</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={attendanceData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="checkins" fill="#f59e0b" name="Check-ins" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="font-semibold mb-2">Grade Distribution</div>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={gradeDistData} dataKey="value" nameKey="name" outerRadius={90} label>
              {gradeDistData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
