import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // On initial load, try to rehydrate the user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('role');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setRole(storedRole || JSON.parse(storedUser).role);
    }
  }, []);

  const login = (userData) => {
    // In a real app, you'd get the user and token from an API response
    const mockUser = { name: userData.email, ...userData };
    localStorage.setItem('user', JSON.stringify(mockUser));
    localStorage.setItem('role', mockUser.role);
    setUser(mockUser);
    setRole(mockUser.role);
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    setUser(null);
    setRole(null);
    navigate('/login'); // Redirect to login on logout
  };

  const switchRole = (newRole) => {
    localStorage.setItem('role', newRole);
    setRole(newRole);
    // Navigate to the dashboard of the new role
    navigate(`/${newRole}/dashboard`);
  };

  return (
    <AuthContext.Provider value={{ user, role, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);