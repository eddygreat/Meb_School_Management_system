import React from 'react';
import { useAuth } from '../context/AuthContext';

const RoleSwitcher = () => {
  const { user, changeRole } = useAuth();
  const roles = ['admin', 'student', 'teacher', 'parent'];

  if (!user) {
    return null; // Don't show if user is not logged in
  }

  const handleRoleChange = (e) => {
    changeRole(e.target.value);
  };

  return (
    <div style={{ margin: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
      <h4>Role Switcher (For Demo)</h4>
      <p>Current Role: <strong>{user.role}</strong></p>
      <select value={user.role} onChange={handleRoleChange}>
        {roles.map(role => <option key={role} value={role}>{role.charAt(0).toUpperCase() + role.slice(1)}</option>)}
      </select>
    </div>
  );
};

export default RoleSwitcher;