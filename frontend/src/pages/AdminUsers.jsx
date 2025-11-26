import React, { useState, useMemo, useEffect } from 'react';
import { PencilIcon, TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import EmptyState from '../EmptyState';
import LoadingSpinner from '../LoadingSpinner';
import apiClient from '../components/api';

// Mock data that our simulated API will return
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com', role: 'Student', status: 'Active' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Teacher', status: 'Active' },
  { id: 3, name: 'Peter Jones', email: 'peter.jones@example.com', role: 'Student', status: 'Inactive' },
  { id: 4, name: 'Mary Williams', email: 'mary.w@example.com', role: 'Parent', status: 'Active' },
  { id: 5, name: 'David Brown', email: 'david.b@example.com', role: 'Admin', status: 'Active' },
  { id: 6, name: 'Emily Davis', email: 'emily.d@example.com', role: 'Teacher', status: 'Active' },
];

const getStatusColor = (status) => {
  return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
};

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        // In a real app, this would be: const response = await apiClient.get('/users');
        // Here, we simulate the API call with a delay.
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate a potential error
        // if (Math.random() > 0.8) {
        //   throw new Error('Failed to fetch users. Please try again.');
        // }

        setUsers(mockUsers);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => 
    users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
    ), [users, searchTerm]);

  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }

    if (error) {
      return <EmptyState title="An Error Occurred" message={error} />;
    }

    return filteredUsers.length > 0 ? renderTable(filteredUsers) : renderEmptyState();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
        <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          <UserPlusIcon className="h-5 w-5 mr-2" />
          Add User
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          className="w-full p-3 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}
      <div className="bg-white shadow-md rounded-lg overflow-hidden">{renderContent()}</div>
    </div>
  );
};

const renderTable = (filteredUsers) => (
  <table className="min-w-full divide-y divide-gray-200">
    <thead className="bg-gray-50">
      <tr>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
      </tr>
    </thead>
    <tbody className="bg-white divide-y divide-gray-200">
      {filteredUsers.map((user) => (
        <tr key={user.id} className="hover:bg-gray-50">
          <td className="px-6 py-4 whitespace-nowrap">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-sm text-gray-500">{user.email}</div>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
          <td className="px-6 py-4 whitespace-nowrap">
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(user.status)}`}>
              {user.status}
            </span>
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <button className="text-blue-600 hover:text-blue-900 mr-4">
              <PencilIcon className="h-5 w-5" />
            </button>
            <button className="text-red-600 hover:text-red-900">
              <TrashIcon className="h-5 w-5" />
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
);

const renderEmptyState = () => (
  <EmptyState 
    title="No Users Found"
    message="Your search did not match any users. Try a different query."
  />
);

export default AdminUsers;