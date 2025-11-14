import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navigation = {
  admin: [
    { name: 'Dashboard', to: '/admin/dashboard', icon: 'dashboard' },
    { name: 'Users', to: '/admin/users', icon: 'people' },
    { name: 'Timetable', to: '/admin/timetable', icon: 'schedule' },
    { name: 'Invoices', to: '/admin/invoices', icon: 'receipt' },
    { name: 'Discipline', to: '/admin/discipline', icon: 'gavel' },
    { name: 'Analytics', to: '/admin/analytics', icon: 'analytics' },
    { name: 'Exports', to: '/admin/exports', icon: 'file_download' },
    { name: 'Settings', to: '/admin/settings', icon: 'settings' },
  ],
  teacher: [
    { name: 'Dashboard', to: '/teacher/dashboard', icon: 'dashboard' },
    { name: 'Curriculum', to: '/teacher/curriculum', icon: 'menu_book' },
    { name: 'Grades', to: '/teacher/grades', icon: 'grading' },
    { name: 'Attendance', to: '/teacher/attendance', icon: 'event_available' },
    { name: 'Messages', to: '/teacher/messages', icon: 'message' },
    { name: 'Timetable', to: '/teacher/timetable', icon: 'schedule' },
    { name: 'Discipline', to: '/teacher/discipline', icon: 'gavel' },
  ],
  student: [
    { name: 'Dashboard', to: '/student/dashboard', icon: 'dashboard' },
    { name: 'Assignments', to: '/student/assignments', icon: 'assignment' },
    { name: 'Check-in', to: '/student/checkin', icon: 'qr_code_scanner' },
    { name: 'Report', to: '/student/report', icon: 'assessment' },
    { name: 'Timetable', to: '/student/timetable', icon: 'schedule' },
  ],
  parent: [
    { name: 'Dashboard', to: '/parent/dashboard', icon: 'dashboard' },
    { name: 'Invoices', to: '/parent/invoices', icon: 'receipt' },
    { name: 'Messages', to: '/parent/messages', icon: 'message' },
  ],
};

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const userNav = navigation[user.role] || [];

  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
          <div className="px-4">
            <h2 className="text-lg font-medium text-gray-900">
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)} Panel
            </h2>
          </div>
          <div className="mt-5 flex-1">
            <nav className="flex-1 px-2 space-y-1">
              {userNav.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`
                  }
                >
                  <span className="material-icons-outlined mr-3">
                    {item.icon}
                  </span>
                  {item.name}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
