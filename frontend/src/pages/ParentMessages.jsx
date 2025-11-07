import { useState } from 'react'
import client from '../api/client'

export default function ParentMessages(){
  const [parentUserId, setParentUserId] = useState('')
  const [threads, setThreads] = useState([])
  const [selectedThread, setSelectedThread] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMsg, setNewMsg] = useState('')
  const [create, setCreate] = useState({ teacher_id: '', subject: '' })

  const loadThreads = async () => {
    if (!parentUserId) return
    const { data } = await client.get('/api/comms/threads', { params: { parent_user_id: parentUserId } })
    setThreads(data)
  }

  const openThread = async (t) => {
    setSelectedThread(t)
    const { data } = await client.get(`/api/comms/threads/${t.id}/messages`)
    setMessages(data)
  }

  const send = async () => {
    if (!selectedThread || !newMsg) return
    const { data } = await client.post('/api/comms/messages', { thread_id: selectedThread.id, body: newMsg })
    setMessages(m => [...m, data])
    setNewMsg('')
  }

  const createThread = async () => {
    if (!parentUserId || !create.teacher_id || !create.subject) return
    await client.post('/api/comms/threads', { teacher_id: Number(create.teacher_id), parent_user_id: Number(parentUserId), subject: create.subject })
    setCreate({ teacher_id: '', subject: '' })
    await loadThreads()
  }

  return (
    <div className="p-6 grid md:grid-cols-3 gap-4">
      <div className="space-y-3">
        <div className="bg-white p-3 rounded shadow space-y-2">
          <div>
            <label className="block text-sm">My Parent User ID</label>
            <input className="border p-2 rounded w-full" value={parentUserId} onChange={e=>setParentUserId(e.target.value)} />
          </div>
          <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={loadThreads}>Load Threads</button>
        </div>
        <div className="bg-white p-3 rounded shadow space-y-2">
          <div className="font-semibold">Start New Thread</div>
          <input className="border p-2 rounded w-full" placeholder="Teacher ID" value={create.teacher_id} onChange={e=>setCreate(v=>({...v, teacher_id:e.target.value}))} />
          <input className="border p-2 rounded w-full" placeholder="Subject" value={create.subject} onChange={e=>setCreate(v=>({...v, subject:e.target.value}))} />
          <button className="bg-emerald-600 text-white px-3 py-2 rounded" onClick={createThread}>Create</button>
        </div>
        <div className="bg-white p-3 rounded shadow">
          <div className="font-semibold mb-2">Threads</div>
          <ul className="space-y-2 max-h-80 overflow-auto">
            {threads.map(t => (
              <li key={t.id} className={`p-2 border rounded cursor-pointer ${selectedThread?.id===t.id?'bg-blue-50':''}`} onClick={()=>openThread(t)}>
                <div className="text-sm font-medium">{t.subject}</div>
                <div className="text-xs text-gray-500">Thread #{t.id}</div>
              </li>
            ))}
            {!threads.length && <div className="text-sm text-gray-500">No threads</div>}
          </ul>
        </div>
      </div>
      <div className="md:col-span-2 bg-white p-4 rounded shadow flex flex-col">
        <div className="font-semibold mb-2">Messages {selectedThread? `in #${selectedThread.id}`:''}</div>
        <div className="flex-1 overflow-auto space-y-2">
          {messages.map(m => (
            <div key={m.id} className="text-sm border rounded p-2">
              <div className="text-gray-500 text-xs">From User #{m.sender_user_id}</div>
              <div>{m.body}</div>
            </div>
          ))}
          {!messages.length && <div className="text-sm text-gray-500">Select a thread</div>}
        </div>
        <div className="mt-3 flex gap-2">
          <input className="border p-2 rounded flex-1" placeholder="Type a message" value={newMsg} onChange={e=>setNewMsg(e.target.value)} />
          <button className="bg-blue-600 text-white px-3 py-2 rounded" onClick={send}>Send</button>
        </div>
      </div>
    </div>
  )
}
