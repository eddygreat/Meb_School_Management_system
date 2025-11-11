import { useAuth } from '../context/AuthContext'
import Card from './Card'
import { Link } from 'react-router-dom'

export default function ParentDashboard(){
  const { logout } = useAuth()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Child Profile & Reports">View your child's academic performance and reports.</Card>
        <Card title="Fees & Payments" extra={<Link to="/parent/invoices" className="text-blue-600 text-sm">View Invoices</Link>}>Check and pay outstanding school fees.</Card>
        <Card title="Messages" extra={<Link to="/parent/messages" className="text-blue-600 text-sm">Open Messages</Link>}>Communicate with your child's teachers.</Card>
        <Card title="Announcements">View important announcements from the school.</Card>
      </div>
      <button onClick={logout} className="mt-6 bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}
