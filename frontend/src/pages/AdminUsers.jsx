import { useEffect, useState } from 'react'
import client from '../api/client'

export default function AdminUsers(){
  const [users, setUsers] = useState([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ email:'', full_name:'', role:'teacher', password:'' })
  const [edit, setEdit] = useState(null)
  const [resetPw, setResetPw] = useState({ id:'', password:'' })

  const load = async () => {
    setError('')
    try { const { data } = await client.get('/api/admin/users'); setUsers(data) } catch { setError('Failed to load users') }
  }
  useEffect(()=>{ load() }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Users</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div className="bg-white p-4 rounded shadow mb-4 grid md:grid-cols-5 gap-2 items-end">
        <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e=>setForm(s=>({...s,email:e.target.value}))} />
        <input className="border p-2 rounded" placeholder="Full name" value={form.full_name} onChange={e=>setForm(s=>({...s,full_name:e.target.value}))} />
        <select className="border p-2 rounded" value={form.role} onChange={e=>setForm(s=>({...s,role:e.target.value}))}>
          {['admin','teacher','parent','student'].map(r=> <option key={r} value={r}>{r}</option>)}
        </select>
        <input className="border p-2 rounded" placeholder="Password" value={form.password} onChange={e=>setForm(s=>({...s,password:e.target.value}))} />
        <button className="bg-emerald-600 text-white px-4 py-2 rounded" onClick={async()=>{ await client.post('/api/admin/users', form); setForm({ email:'', full_name:'', role:'teacher', password:'' }); load() }}>Create</button>
      </div>
      <table className="w-full text-sm bg-white rounded shadow">
        <thead>
          <tr className="text-left border-b">
            <th className="p-2">ID</th>
            <th className="p-2">Email</th>
            <th className="p-2">Name</th>
            <th className="p-2">Role</th>
            <th className="p-2">Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id} className="border-b">
              <td className="p-2">{u.id}</td>
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.id===edit?.id ? <input className="border p-1 rounded" value={edit.full_name} onChange={e=>setEdit(s=>({...s,full_name:e.target.value}))} /> : u.full_name}</td>
              <td className="p-2">{u.id===edit?.id ? (
                <select className="border p-1 rounded" value={edit.role} onChange={e=>setEdit(s=>({...s,role:e.target.value}))}>
                  {['admin','teacher','parent','student'].map(r=> <option key={r} value={r}>{r}</option>)}
                </select>
              ) : u.role}</td>
              <td className="p-2">{u.id===edit?.id ? (
                <select className="border p-1 rounded" value={String(edit.is_active)} onChange={e=>setEdit(s=>({...s,is_active:e.target.value==='true'}))}>
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              ) : String(u.is_active)}</td>
              <td className="p-2 space-x-2">
                {u.id===edit?.id ? (
                  <>
                    <button className="text-emerald-700" onClick={async()=>{ await client.put(`/api/admin/users/${u.id}`, { full_name: edit.full_name, role: edit.role, is_active: edit.is_active }); setEdit(null); load() }}>Save</button>
                    <button className="text-gray-600" onClick={()=>setEdit(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button className="text-blue-700" onClick={()=>setEdit({ id:u.id, full_name:u.full_name, role:u.role, is_active:u.is_active })}>Edit</button>
                    <button className="text-red-700" onClick={async()=>{ if(confirm('Delete user?')) { await client.delete(`/api/admin/users/${u.id}`); load() } }}>Delete</button>
                  </>
                )}
                <button className="text-purple-700" onClick={async()=>{ const pw = prompt('New password'); if (pw) { await client.post(`/api/admin/users/${u.id}/reset-password`, { password: pw }); alert('Password reset') } }}>Reset PW</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
