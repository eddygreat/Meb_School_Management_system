import { useAuth } from '../context/AuthContext'

export default function ParentDashboard(){
  const { logout } = useAuth()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Parent Dashboard</h1>
      <div className="grid grid-cols-2 gap-4">
        <Card title="Child Profile & Reports"/>
        <Card title="Fees & Payments"/>
        <Card title="Messages"/>
        <Card title="Announcements"/>
      </div>
      <button onClick={logout} className="mt-6 bg-gray-800 text-white px-4 py-2 rounded">Logout</button>
    </div>
  )
}

function Card({ title }){
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="font-semibold">{title}</h2>
      <p className="text-sm text-gray-500">Stub module</p>
    </div>
  )
}
