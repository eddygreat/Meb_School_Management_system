import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function TeacherDashboard(){
  const { logout } = useAuth()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Teacher Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Classes & Timetable" extra={<Link to="/teacher/timetable" className="text-blue-600 text-sm">View</Link>} />
        <Card title="Assignments & Grading" extra={<Link to="/teacher/curriculum" className="text-blue-600 text-sm">Open</Link>} />
        <Card title="Attendance" extra={<Link to="/teacher/attendance" className="text-blue-600 text-sm">Open QR</Link>} />
        <Card title="Grades Entry" extra={<Link to="/teacher/grades-entry" className="text-blue-600 text-sm">Enter</Link>} />
        <Card title="Messages" extra={<Link to="/teacher/messages" className="text-blue-600 text-sm">Open</Link>} />
        <Card title="Discipline" extra={<Link to="/teacher/discipline" className="text-blue-600 text-sm">Open</Link>} />
        <Card title="Performance Insights"/>
      </div>
      <button onClick={logout} className="mt-6 bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}

function Card({ title, extra }){
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">Stub module</p>
      {extra && <div className="mt-2">{extra}</div>}
    </div>
  )
}
