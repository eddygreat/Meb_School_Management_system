import React from 'react';
import { NavLink } from 'react-router-dom';
import { HomeIcon, CurrencyDollarIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/parent/dashboard', icon: HomeIcon },
  { name: 'Invoices', href: '/parent/invoices', icon: CurrencyDollarIcon },
  { name: 'Messages', href: '/parent/messages', icon: ChatBubbleLeftRightIcon },
];

const ParentSidebar = () => {
  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Parent Portal</h2>
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

export default ParentSidebar;