import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AcademicCapIcon, BellAlertIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';

// Reusable StatCard, similar to the one in AdminDashboard
const StatCard = ({ title, value, icon, color, link }) => {
  const Icon = icon;
  const content = (
    <div className={`bg-white p-6 rounded-lg shadow-md flex items-center transition hover:shadow-xl`}>
      <div className={`p-3 rounded-full bg-${color}-100`}>
        <Icon className={`h-8 w-8 text-${color}-600`} />
      </div>
      <div className="ml-4">
        <p className="text-gray-500 text-sm font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );

  return link ? <Link to={link}>{content}</Link> : content;
};

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.name || 'Teacher'}!</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Classes" value="4" icon={AcademicCapIcon} color="blue" link="/teacher/timetable" />
        <StatCard title="Assignments to Grade" value="12" icon={BellAlertIcon} color="red" link="/teacher/grades-entry" />
        <StatCard title="Today's Schedule" value="3 Lessons" icon={CalendarDaysIcon} color="green" link="/teacher/timetable" />
        <StatCard title="Pending Messages" value="5" icon={ClockIcon} color="purple" link="/teacher/messages" />
      </div>

      {/* Upcoming Classes & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Classes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Classes</h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between text-gray-600">
              <span><span className="font-semibold text-gray-800">Mathematics</span> - Grade 10A</span>
              <span className="text-sm font-medium text-gray-500">10:00 AM - 11:00 AM</span>
            </li>
            <li className="flex items-center justify-between text-gray-600">
              <span><span className="font-semibold text-gray-800">Physics</span> - Grade 11B</span>
              <span className="text-sm font-medium text-gray-500">11:30 AM - 12:30 PM</span>
            </li>
          </ul>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col space-y-3">
            <Link to="/teacher/attendance" className="w-full text-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">Take Attendance</Link>
            <Link to="/teacher/grades-entry" className="w-full text-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">Enter Grades</Link>
            <Link to="/teacher/messages" className="w-full text-center px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600">Send Message</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
