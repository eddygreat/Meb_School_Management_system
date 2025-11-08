import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import AdminDashboard from './pages/AdminDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import Signup from './pages/Signup'
import ParentDashboard from './pages/ParentDashboard'
import StudentDashboard from './pages/StudentDashboard'
import TeacherAttendance from './pages/TeacherAttendance'
import StudentCheckin from './pages/StudentCheckin'
import FaceLogin from './pages/FaceLogin'
import FaceEnroll from './pages/FaceEnroll'
import AdminInvoices from './pages/AdminInvoices'
import ParentInvoices from './pages/ParentInvoices'
import AdminTimetable from './pages/AdminTimetable'
import TeacherTimetable from './pages/TeacherTimetable'
import StudentTimetable from './pages/StudentTimetable'
import TeacherGradesEntry from './pages/TeacherGradesEntry'
import StudentReport from './pages/StudentReport'
import TeacherMessages from './pages/TeacherMessages'
import ParentMessages from './pages/ParentMessages'
import TeacherCurriculum from './pages/TeacherCurriculum'
import StudentAssignments from './pages/StudentAssignments'
import AdminUsers from './pages/AdminUsers'
import PasswordResetRequest from './pages/PasswordResetRequest'
import PasswordResetConfirm from './pages/PasswordResetConfirm'
import AdminAnalytics from './pages/AdminAnalytics'
import AdminSettings from './pages/AdminSettings'
import AdminExports from './pages/AdminExports'
import AdminDiscipline from './pages/AdminDiscipline'
import TeacherDiscipline from './pages/TeacherDiscipline'
import ProtectedRoute from './routes/ProtectedRoute'
import { useAuth } from './context/AuthContext'

export default function App() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <div className="flex gap-4">
          <Link to="/">Home</Link>
          {!user && <Link to="/login">Login</Link>}
          {!user && <Link to="/signup">Sign Up</Link>}
        </div>
        {user && (
          <button onClick={logout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
            Logout
          </button>
        )}
      </nav>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/face/login" element={<FaceLogin />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/password-reset/request" element={<PasswordResetRequest />} />
        <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />
        <Route element={<ProtectedRoute roles={["admin"]} />}> 
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/attendance" element={<TeacherAttendance />} />
          <Route path="/admin/face/enroll" element={<FaceEnroll />} />
          <Route path="/admin/invoices" element={<AdminInvoices />} />
          <Route path="/admin/timetable" element={<AdminTimetable />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/analytics" element={<AdminAnalytics />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/exports" element={<AdminExports />} />
          <Route path="/admin/discipline" element={<AdminDiscipline />} />
        </Route>
        <Route element={<ProtectedRoute roles={["teacher"]} />}> 
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/attendance" element={<TeacherAttendance />} />
          <Route path="/teacher/face/enroll" element={<FaceEnroll />} />
          <Route path="/teacher/timetable" element={<TeacherTimetable />} />
          <Route path="/teacher/grades-entry" element={<TeacherGradesEntry />} />
          <Route path="/teacher/messages" element={<TeacherMessages />} />
          <Route path="/teacher/curriculum" element={<TeacherCurriculum />} />
          <Route path="/teacher/discipline" element={<TeacherDiscipline />} />
        </Route>
        <Route element={<ProtectedRoute roles={["parent"]} />}> 
          <Route path="/parent" element={<ParentDashboard />} />
          <Route path="/parent/face/enroll" element={<FaceEnroll />} />
          <Route path="/parent/invoices" element={<ParentInvoices />} />
          <Route path="/parent/report" element={<StudentReport />} />
          <Route path="/parent/messages" element={<ParentMessages />} />
        </Route>
        <Route element={<ProtectedRoute roles={["student"]} />}> 
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/checkin" element={<StudentCheckin />} />
          <Route path="/student/face/enroll" element={<FaceEnroll />} />
          <Route path="/student/timetable" element={<StudentTimetable />} />
          <Route path="/student/report" element={<StudentReport />} />
          <Route path="/student/assignments" element={<StudentAssignments />} />
        </Route>
      </Routes>
    </div>
  )
}
