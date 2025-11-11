import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Card from './Card'

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
        <Card title="Discipline" extra={<Link to="/teacher/discipline" className="text-blue-600 text-sm">Report Incident</Link>}>
          Report and view student discipline incidents.
        </Card>
        <Card title="Performance Insights">Analytics on student performance and attendance.</Card>
      </div>
      <button onClick={logout} className="mt-6 bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}
