import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Login from './pages/Login';
import Signup from './pages/Signup';
import PasswordResetRequest from './pages/PasswordResetRequest';
import PasswordResetConfirm from './pages/PasswordResetConfirm';
import FaceLogin from './pages/FaceLogin';

import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminTimetable from './pages/AdminTimetable';
import AdminInvoices from './pages/AdminInvoices';
import AdminDiscipline from './pages/AdminDiscipline';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminSettings from './pages/AdminSettings';
import AdminExports from './pages/AdminExports';
import FaceEnroll from './pages/FaceEnroll';

import TeacherDashboard from './pages/TeacherDashboard';
import TeacherCurriculum from './pages/TeacherCurriculum';
import TeacherGradesEntry from './pages/TeacherGradesEntry';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherMessages from './pages/TeacherMessages';
import TeacherTimetable from './pages/TeacherTimetable';
import TeacherDiscipline from './pages/TeacherDiscipline';

import StudentDashboard from './pages/StudentDashboard';
import StudentAssignments from './pages/StudentAssignments';
import StudentCheckin from './pages/StudentCheckin';
import StudentReport from './pages/StudentReport';
import StudentTimetable from './pages/StudentTimetable';

import ParentDashboard from './pages/ParentDashboard';
import ParentInvoices from './pages/ParentInvoices';
import ParentMessages from './pages/ParentMessages';

function ProtectedRoute({ children, role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    // Optional: redirect to a 'not authorized' page or back to their dashboard
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/face-login" element={<FaceLogin />} />
      <Route path="/password-reset/request" element={<PasswordResetRequest />} />
      <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />

      {/* Redirect root to role-specific dashboard or login */}
      <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} /> : <Navigate to="/login" />} />

      {/* Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute role="admin"><AdminUsers /></ProtectedRoute>} />
      <Route path="/admin/timetable" element={<ProtectedRoute role="admin"><AdminTimetable /></ProtectedRoute>} />
      <Route path="/admin/invoices" element={<ProtectedRoute role="admin"><AdminInvoices /></ProtectedRoute>} />
      <Route path="/admin/discipline" element={<ProtectedRoute role="admin"><AdminDiscipline /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute role="admin"><AdminAnalytics /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute role="admin"><AdminSettings /></ProtectedRoute>} />
      <Route path="/admin/exports" element={<ProtectedRoute role="admin"><AdminExports /></ProtectedRoute>} />
      <Route path="/admin/face/enroll" element={<ProtectedRoute role="admin"><FaceEnroll /></ProtectedRoute>} />

      {/* Teacher Routes */}
      <Route path="/teacher/dashboard" element={<ProtectedRoute role="teacher"><TeacherDashboard /></ProtectedRoute>} />
      <Route path="/teacher/curriculum" element={<ProtectedRoute role="teacher"><TeacherCurriculum /></ProtectedRoute>} />
      <Route path="/teacher/grades-entry" element={<ProtectedRoute role="teacher"><TeacherGradesEntry /></ProtectedRoute>} />
      <Route path="/teacher/attendance" element={<ProtectedRoute role="teacher"><TeacherAttendance /></ProtectedRoute>} />
      <Route path="/teacher/messages" element={<ProtectedRoute role="teacher"><TeacherMessages /></ProtectedRoute>} />
      <Route path="/teacher/timetable" element={<ProtectedRoute role="teacher"><TeacherTimetable /></ProtectedRoute>} />
      <Route path="/teacher/discipline" element={<ProtectedRoute role="teacher"><TeacherDiscipline /></ProtectedRoute>} />

      {/* Student Routes */}
      <Route path="/student/dashboard" element={<ProtectedRoute role="student"><StudentDashboard /></ProtectedRoute>} />
      <Route path="/student/assignments" element={<ProtectedRoute role="student"><StudentAssignments /></ProtectedRoute>} />
      <Route path="/student/checkin" element={<ProtectedRoute role="student"><StudentCheckin /></ProtectedRoute>} />
      <Route path="/student/report" element={<ProtectedRoute role="student"><StudentReport /></ProtectedRoute>} />
      <Route path="/student/timetable" element={<ProtectedRoute role="student"><StudentTimetable /></ProtectedRoute>} />

      {/* Parent Routes */}
      <Route path="/parent/dashboard" element={<ProtectedRoute role="parent"><ParentDashboard /></ProtectedRoute>} />
      <Route path="/parent/invoices" element={<ProtectedRoute role="parent"><ParentInvoices /></ProtectedRoute>} />
      <Route path="/parent/messages" element={<ProtectedRoute role="parent"><ParentMessages /></ProtectedRoute>} />

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}