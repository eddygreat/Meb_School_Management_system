import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AcademicCapIcon, CheckBadgeIcon, DocumentTextIcon, SparklesIcon } from '@heroicons/react/24/outline';
import MebBot from '../components/Chatbot/MebBot';
import { FaCommentDots, FaTimes } from 'react-icons/fa';

// Reusable StatCard, consistent with other dashboards
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

export default function StudentDashboard(){
  const { user } = useAuth();
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, {user?.name || 'Student'}!</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Overall GPA" value="3.8" icon={AcademicCapIcon} color="blue" link="/student/report" />
        <StatCard title="Attendance Rate" value="98%" icon={CheckBadgeIcon} color="green" />
        <StatCard title="Assignments Due" value="3" icon={DocumentTextIcon} color="red" link="/student/assignments" />
        <StatCard title="Achievements" value="5" icon={SparklesIcon} color="purple" />
      </div>

      {/* Upcoming Deadlines & Recent Grades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Upcoming Deadlines</h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between text-gray-700">
              <div>
                <p className="font-semibold text-gray-800">Physics Lab Report</p>
                <p className="text-sm text-gray-500">Due: Tomorrow, 11:59 PM</p>
              </div>
              <Link to="/student/assignments" className="text-sm font-medium text-blue-600 hover:underline">View</Link>
            </li>
            <li className="flex items-center justify-between text-gray-700">
              <div>
                <p className="font-semibold text-gray-800">History Essay</p>
                <p className="text-sm text-gray-500">Due: In 3 days</p>
              </div>
              <Link to="/student/assignments" className="text-sm font-medium text-blue-600 hover:underline">View</Link>
            </li>
          </ul>
        </div>

        {/* Recent Grades */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Recent Grades</h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between text-gray-700">
              <p>Mathematics Mid-term</p>
              <p className="font-bold text-lg text-green-600">A-</p>
            </li>
            <li className="flex items-center justify-between text-gray-700">
              <p>Chemistry Quiz 3</p>
              <p className="font-bold text-lg text-blue-600">B+</p>
            </li>
          </ul>
        </div>
      </div>

      {/* Chatbot Container */}
      <div style={chatbotContainerStyle}>
        {showChatbot && <MebBot />}
      </div>

      {/* Chatbot Toggle Button */}
      <button onClick={() => setShowChatbot((prev) => !prev)} style={chatbotButtonStyle}>
        {showChatbot ? <FaTimes /> : <FaCommentDots />}
      </button>
    </div>
  );
}

const chatbotContainerStyle = {
  position: 'fixed',
  bottom: '100px',
  right: '30px',
  zIndex: 1000,
};

const chatbotButtonStyle = {
  position: 'fixed',
  bottom: '30px',
  right: '30px',
  backgroundColor: '#007bff',
  color: 'white',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '24px',
  border: 'none',
  cursor: 'pointer',
  boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
  zIndex: 1001,
};
