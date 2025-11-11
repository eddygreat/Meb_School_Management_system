import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Card from './Card'

export default function StudentDashboard(){
  const { logout } = useAuth()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Student Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card title="My Timetable" extra={<Link to="/student/timetable" className="text-blue-600 text-sm">View</Link>} />
        <Card title="Assignments" extra={<Link to="/student/assignments" className="text-blue-600 text-sm">Open</Link>} />
        <Card title="Attendance" extra={<Link to="/student/checkin" className="text-blue-600 text-sm">QR Check-in</Link>} />
        <Card title="Report" extra={<Link to="/student/report" className="text-blue-600 text-sm">View</Link>} />
      </div>
      <button onClick={logout} className="mt-6 bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}
