import React from 'react';
import { useAuth } from '../context/AuthContext';
import { UserCircleIcon, ArrowRightOnRectangleIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/solid';

const ROLES = ['admin', 'teacher', 'student', 'parent'];

const Header = () => {
  const { user, role, switchRole, logout } = useAuth();
  const currentRole = role || user?.role;

  return (
    <header className="bg-white shadow-sm p-4 flex justify-end items-center">
      <div className="flex items-center space-x-4">
        {/* Role Switcher for Demo */}
        <div className="flex items-center space-x-2">
          <AdjustmentsHorizontalIcon className="h-6 w-6 text-gray-500" />
          <select
            value={currentRole}
            onChange={(e) => switchRole(e.target.value)}
            className="bg-gray-100 border-gray-300 rounded-md p-1.5 text-sm font-medium focus:ring-blue-500 focus:border-blue-500"
          >
            {ROLES.map(r => (
              <option key={r} value={r} className="capitalize">
                {r.charAt(0).toUpperCase() + r.slice(1)} View
              </option>
            ))}
          </select>
        </div>

        <div className="h-8 border-l border-gray-300"></div>

        {/* User Info and Logout */}
        <div className="flex items-center">
          <UserCircleIcon className="h-8 w-8 text-gray-500" />
          <span className="ml-2 font-medium text-gray-700 capitalize">{user?.name || currentRole}</span>
        </div>
        <button onClick={logout} className="flex items-center text-gray-500 hover:text-blue-600">
          <ArrowRightOnRectangleIcon className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

export default Header;