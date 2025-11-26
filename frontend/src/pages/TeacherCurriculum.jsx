import React, { useEffect, useState } from 'react';
import apiClient from '../services/api';
import { useAuth } from '../context/AuthContext';
import Input from '../components/ui/Input';
export default function TeacherCurriculum(){
  const { user } = useAuth()
  const [subjectId, setSubjectId] = useState('')
  const [classId, setClassId] = useState('')

  const [lessonPlans, setLessonPlans] = useState([])
  const [resources, setResources] = useState([])
  const [assignments, setAssignments] = useState([])
  const [submissions, setSubmissions] = useState([])

  const [lpForm, setLpForm] = useState({ title:'', content:'', week_no:1 })
  const [resForm, setResForm] = useState({ title:'', url:'' })
  const [asgForm, setAsgForm] = useState({ title:'', description:'', due_date:'' })
  const [gradeForm, setGradeForm] = useState({ submission_id:'', score:'', feedback:'' })

  const load = async () => {
    if (user?.teacher_id) {
      const { data } = await apiClient.get('/curriculum/lesson-plans', { params: { teacher_id: user.teacher_id } })
      setLessonPlans(data)
    }
    if (subjectId) {
      const { data } = await apiClient.get('/curriculum/resources', { params: { subject_id: subjectId } })
      setResources(data)
    }
    if (classId) {
      const { data } = await apiClient.get('/curriculum/assignments', { params: { class_id: classId } })
      setAssignments(data)
    }
  }

  const createLessonPlan = async () => {
    if (!user?.teacher_id || !subjectId || !lpForm.title) return
    await apiClient.post('/curriculum/lesson-plans', { teacher_id: Number(user.teacher_id), subject_id: Number(subjectId), ...lpForm, week_no: Number(lpForm.week_no) })
    setLpForm({ title:'', content:'', week_no:1 })
    await load()
  }

  const createResource = async () => {
    if (!subjectId || !resForm.title || !resForm.url) return
    await apiClient.post('/curriculum/resources', { subject_id: Number(subjectId), ...resForm })
    setResForm({ title:'', url:'' })
    await load()
  }

  const createAssignment = async () => {
    if (!classId || !subjectId || !user?.teacher_id || !asgForm.title || !asgForm.due_date) return
    await apiClient.post('/curriculum/assignments', { class_id: Number(classId), subject_id: Number(subjectId), teacher_id: Number(user.teacher_id), ...asgForm })
    setAsgForm({ title:'', description:'', due_date:'' })
    await load()
  }

  const loadSubmissions = async (assignmentId) => {
    const { data } = await apiClient.get('/curriculum/submissions', { params: { assignment_id: assignmentId } })
    setSubmissions(data)
  }

  const gradeSubmission = async () => {
    if (!gradeForm.submission_id) return
    await apiClient.post('/curriculum/submissions/grade', { submission_id: Number(gradeForm.submission_id), score: Number(gradeForm.score || 0), feedback: gradeForm.feedback })
    setGradeForm({ submission_id:'', score:'', feedback:'' })
    // refresh current list
    if (assignments[0]) await loadSubmissions(assignments[0].id)
  }

  useEffect(() => { load() }, [user, subjectId, classId])

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Teacher Curriculum</h1>
      <div className="bg-white p-4 rounded shadow grid md:grid-cols-4 gap-3 items-end">
        <Input label="Subject ID" value={subjectId} onChange={setSubjectId} />
        <Input label="Class ID" value={classId} onChange={setClassId} />
        <button onClick={load} className="bg-blue-600 text-white px-4 py-2 rounded">Load</button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Lesson Plans</h2>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Title" value={lpForm.title} onChange={v=>setLpForm(s=>({...s,title:v}))} />
            <Input label="Week #" value={lpForm.week_no} onChange={v=>setLpForm(s=>({...s,week_no:v}))} />
            <div className="col-span-2">
              <label className="block text-sm">Content</label>
              <textarea className="border p-2 rounded w-full" rows={3} value={lpForm.content} onChange={e=>setLpForm(s=>({...s,content:e.target.value}))} />
            </div>
          </div>
          <button onClick={createLessonPlan} className="bg-emerald-600 text-white px-3 py-2 rounded">Add Lesson Plan</button>
          <ul className="text-sm space-y-2 max-h-64 overflow-auto">
            {lessonPlans.map(lp => (
              <li key={lp.id} className="border p-2 rounded">
                <div className="font-medium">{lp.title} • Week {lp.week_no}</div>
                <div className="text-xs text-gray-600">Subject #{lp.subject_id}</div>
                <div className="text-gray-700 mt-1">{lp.content}</div>
              </li>
            ))}
            {!lessonPlans.length && <div className="text-sm text-gray-500">No lesson plans</div>}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow space-y-3">
          <h2 className="font-semibold">Resources</h2>
          <div className="grid grid-cols-2 gap-2">
            <Input label="Title" value={resForm.title} onChange={v=>setResForm(s=>({...s,title:v}))} />
            <Input label="URL" value={resForm.url} onChange={v=>setResForm(s=>({...s,url:v}))} />
          </div>
          <button onClick={createResource} className="bg-emerald-600 text-white px-3 py-2 rounded">Add Resource</button>
          <ul className="text-sm space-y-2 max-h-64 overflow-auto">
            {resources.map(r => (
              <li key={r.id} className="border p-2 rounded flex justify-between">
                <span>{r.title}</span>
                <a className="text-blue-600 text-sm" href={r.url} target="_blank" rel="noreferrer">Open</a>
              </li>
            ))}
            {!resources.length && <div className="text-sm text-gray-500">No resources</div>}
          </ul>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow space-y-3">
        <h2 className="font-semibold">Assignments</h2>
        <div className="grid md:grid-cols-4 gap-2">
          <Input label="Title" value={asgForm.title} onChange={v=>setAsgForm(s=>({...s,title:v}))} />
          <Input label="Due Date" value={asgForm.due_date} onChange={v=>setAsgForm(s=>({...s,due_date:v}))} type="date" />
          <div className="md:col-span-2">
            <label className="block text-sm">Description</label>
            <textarea className="border p-2 rounded w-full" rows={2} value={asgForm.description} onChange={e=>setAsgForm(s=>({...s,description:e.target.value}))} />
          </div>
        </div>
        <button onClick={createAssignment} className="bg-emerald-600 text-white px-3 py-2 rounded">Create Assignment</button>
        <div className="grid md:grid-cols-2 gap-3 mt-3">
          <ul className="text-sm space-y-2 max-h-64 overflow-auto">
            {assignments.map(a => (
              <li key={a.id} className="border p-2 rounded flex justify-between items-center">
                <div>
                  <div className="font-medium">{a.title}</div>
                  <div className="text-xs text-gray-500">#{a.id} • Due {a.due_date}</div>
                </div>
                <button className="text-blue-700 text-sm" onClick={()=>loadSubmissions(a.id)}>View Submissions</button>
              </li>
            ))}
            {!assignments.length && <div className="text-sm text-gray-500">No assignments</div>}
          </ul>
          <div>
            <div className="font-semibold mb-2">Submissions</div>
            <ul className="text-sm space-y-2 max-h-64 overflow-auto">
              {submissions.map(s => (
                <li key={s.id} className="border p-2 rounded">
                  <div>Student #{s.student_id} • <a className="text-blue-600" href={s.content_url} target="_blank" rel="noreferrer">Open</a></div>
                  <div className="text-xs text-gray-500">Score: {s.score} • {s.feedback}</div>
                </li>
              ))}
              {!submissions.length && <div className="text-sm text-gray-500">No submissions</div>}
            </ul>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Input label="Submission ID" value={gradeForm.submission_id} onChange={v=>setGradeForm(s=>({...s,submission_id:v}))} />
              <Input label="Score" value={gradeForm.score} onChange={v=>setGradeForm(s=>({...s,score:v}))} />
              <Input label="Feedback" value={gradeForm.feedback} onChange={v=>setGradeForm(s=>({...s,feedback:v}))} />
            </div>
            <button onClick={gradeSubmission} className="bg-blue-600 text-white px-3 py-2 rounded mt-2">Grade</button>
          </div>
        </div>
      </div>
    </div>
  )
}
