import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import Card from './Card'

export default function AdminDashboard(){
  const { logout } = useAuth()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Users" extra={<Link to="/admin/users" className="text-blue-600 text-sm">Manage Users</Link>} />
        <Card title="Fees & Payments" extra={<Link to="/admin/invoices" className="text-blue-600 text-sm">Open Invoices</Link>} />
        <Card title="Timetable" extra={<Link to="/admin/timetable" className="text-blue-600 text-sm">Manage Timetable</Link>} />
        <Card title="Face Enroll" extra={<Link to="/admin/face/enroll" className="text-blue-600 text-sm">Open Enroll</Link>} />
      </div>
      <button onClick={logout} className="mt-6 bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}
