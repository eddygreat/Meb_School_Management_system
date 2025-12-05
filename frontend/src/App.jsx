import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LandingPage from '/src/pages/LandingPage.jsx';

import Login from './pages/Login';
import DashboardLayout from './DashboardLayout';
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

function ProtectedRoute({ role }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.role !== role) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return <DashboardLayout />;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public-facing Routes */}
      <Route path="/" element={!user ? <LandingPage /> : <Navigate to={`/${user.role}/dashboard`} />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/face-login" element={<FaceLogin />} />
      <Route path="/password-reset/request" element={<PasswordResetRequest />} />
      <Route path="/password-reset/confirm" element={<PasswordResetConfirm />} />

      {/* Protected Routes with Dashboard Layout */}
      <Route element={<ProtectedRoute />}>
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/timetable" element={<AdminTimetable />} />
        <Route path="/admin/invoices" element={<AdminInvoices />} />
        <Route path="/admin/discipline" element={<AdminDiscipline />} />
        <Route path="/admin/analytics" element={<AdminAnalytics />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/exports" element={<AdminExports />} />
        <Route path="/admin/face/enroll" element={<FaceEnroll />} />

        {/* Teacher Routes */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/curriculum" element={<TeacherCurriculum />} />
        <Route path="/teacher/grades-entry" element={<TeacherGradesEntry />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/messages" element={<TeacherMessages />} />
        <Route path="/teacher/timetable" element={<TeacherTimetable />} />
        <Route path="/teacher/discipline" element={<TeacherDiscipline />} />

        {/* Student Routes */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/checkin" element={<StudentCheckin />} />
        <Route path="/student/report" element={<StudentReport />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />

        {/* Parent Routes */}
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/invoices" element={<ParentInvoices />} />
        <Route path="/parent/messages" element={<ParentMessages />} />

        {/* Shared Routes - Accessible to all authenticated users */}
        <Route path="/face-enroll" element={<FaceEnroll />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router future={{ v7_relativeSplatPath: true }}>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <AppRoutes />
        </div>
      </AuthProvider>
    </Router>
  );
}