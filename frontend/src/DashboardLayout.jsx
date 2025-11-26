import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import AdminSidebar from '../components/sidebars/AdminSidebar';
import TeacherSidebar from '../components/sidebars/TeacherSidebar';
import StudentSidebar from '../components/sidebars/StudentSidebar';
import ParentSidebar from '../components/sidebars/ParentSidebar';
import Header from '../components/Header';

const sidebars = {
  admin: <AdminSidebar />,
  teacher: <TeacherSidebar />,
  student: <StudentSidebar />,
  parent: <ParentSidebar />,
};

const DashboardLayout = () => {
  const { user, role } = useAuth();

  // In a real app, user would not be null here due to ProtectedRoute
  if (!user) {
    return null; 
  }

  const currentRole = role || user.role;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-800 text-white">
        {sidebars[currentRole]}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;