import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, BookOpenIcon, PencilSquareIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, TableCellsIcon, ScaleIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/teacher/dashboard', icon: HomeIcon },
  { name: 'Curriculum', href: '/teacher/curriculum', icon: BookOpenIcon },
  { name: 'Grades Entry', href: '/teacher/grades-entry', icon: PencilSquareIcon },
  { name: 'Attendance', href: '/teacher/attendance', icon: CheckCircleIcon },
  { name: 'Messages', href: '/teacher/messages', icon: ChatBubbleLeftRightIcon },
  { name: 'Timetable', href: '/teacher/timetable', icon: TableCellsIcon },
  { name: 'Discipline', href: '/teacher/discipline', icon: ScaleIcon },
];

const TeacherSidebar = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Teacher Panel</h2>
      <nav className="space-y-2">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
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

export default TeacherSidebar;