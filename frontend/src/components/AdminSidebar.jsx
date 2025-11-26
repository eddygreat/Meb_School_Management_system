import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  ChartBarIcon, Cog6ToothIcon, DocumentDuplicateIcon, HomeIcon,
  ScaleIcon, TableCellsIcon, UserGroupIcon, FaceSmileIcon
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: HomeIcon },
  { name: 'User Management', href: '/admin/users', icon: UserGroupIcon },
  { name: 'Timetable', href: '/admin/timetable', icon: TableCellsIcon },
  { name: 'Invoices', href: '/admin/invoices', icon: DocumentDuplicateIcon },
  { name: 'Discipline', href: '/admin/discipline', icon: ScaleIcon },
  { name: 'Analytics', href: '/admin/analytics', icon: ChartBarIcon },
  { name: 'Face Enrollment', href: '/admin/face/enroll', icon: FaceSmileIcon },
  { name: 'Exports', href: '/admin/exports', icon: DocumentDuplicateIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

const AdminSidebar = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Admin Panel</h2>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white'
              }`
            }
          >
            <item.icon className="h-6 w-6 mr-3" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default AdminSidebar;