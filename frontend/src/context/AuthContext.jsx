import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // On initial load, check if a user session exists in localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // The login function now simulates a login and saves to localStorage
  const login = (email) => {
    const mockUser = {
      email: email,
      name: 'Demo User',
      // Default role upon login
      role: 'student', 
    };
    localStorage.setItem('user', JSON.stringify(mockUser));
    setUser(mockUser);
  };

  // The logout function clears the user from state and localStorage
  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };

  // This new function allows changing the role
  const changeRole = (newRole) => {
    if (user) {
      const updatedUser = { ...user, role: newRole };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const value = {
    user,
    login,
    logout,
    changeRole,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to easily access the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};