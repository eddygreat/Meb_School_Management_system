import React from 'react';
import { UserGroupIcon, CurrencyDollarIcon, BookOpenIcon, ClockIcon } from '@heroicons/react/24/outline';

// A reusable card component for dashboard stats
const StatCard = ({ title, value, icon, color }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center">
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-8 w-8 text-${color}-600`} />
      </div>
      <div className="ml-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Students" value="1,250" icon={UserGroupIcon} color="blue" />
        <StatCard title="Total Teachers" value="85" icon={UserGroupIcon} color="green" />
        <StatCard title="Courses Offered" value="48" icon={BookOpenIcon} color="purple" />
        <StatCard title="Pending Invoices" value="$15,230" icon={CurrencyDollarIcon} color="red" />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            <li className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span>New student <span className="font-semibold">John Doe</span> was enrolled.</span>
            </li>
            <li className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span>Invoice #1234 was paid.</span>
            </li>
            <li className="flex items-center text-gray-600">
              <ClockIcon className="h-5 w-5 mr-3 text-gray-400" />
              <span>Teacher <span className="font-semibold">Jane Smith</span> updated grades for Class 5B.</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col space-y-3">
            <button className="w-full text-left px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Add New Student</button>
            <button className="w-full text-left px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Generate Report</button>
            <button className="w-full text-left px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Send Announcement</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;